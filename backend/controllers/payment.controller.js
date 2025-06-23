const Payment = require('../models/payment.model');
const PaymentMethod = require('../models/paymentMethod.model');
const axios = require('axios');
const crypto = require('crypto');
const db = require('../config/database');
const { BOOKING_STATUS, PAYMENT_STATUS } = require('../utils/constants');
const { v4: uuidv4 } = require("uuid");

const getPaymentMethods = async (req, res) => {
  try {
    const methods = await PaymentMethod.getAllMethods();
    res.status(200).json({
      status: "success",
      data: methods
    });
  } catch (error) {
    console.error("Get payment methods error:", error);
    res.status(500).json({ error: error.message });
  }
};

const processOfflinePayment = async (req, res) => {
  try {
    const { bookingId, amount, reference } = req.body;
    const userId = req.user.UserId;

    if (!userId) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const cashMethod = await PaymentMethod.findByName('CASH');

    if (!cashMethod) {
      return res.status(404).json({ error: "Payment method not found" });
    }

    const paymentId = await Payment.createPayment({
      Amount: amount,
      Provider: 'CASH',
      PaymentReference: reference || 'Cash payment',
      Status: PAYMENT_STATUS.PENDING,
      BookingId: bookingId,
      ProductId: null,
      MethodId: cashMethod.MethodId,
      CreatedBy: userId
    });

    const Booking = require('../models/booking.model');
    const bookingCheck = await Booking.updateStatus(bookingId, BOOKING_STATUS.PAID, amount);

    if (bookingCheck.success && bookingCheck.updated === false) {
      await Payment.updatePaymentStatus(
        paymentId,
        PAYMENT_STATUS.CANCELLED,
        userId,
        { PaymentReference: "Booking already paid" }
      );

      return res.status(400).json({
        status: "error",
        message: "This booking has already been paid",
        code: "BOOKING_ALREADY_PAID"
      });
    }

    if (!bookingCheck.success) {
      await Payment.updatePaymentStatus(
        paymentId,
        PAYMENT_STATUS.FAILED,
        userId,
        { failReason: bookingCheck.message }
      );

      return res.status(400).json({ error: bookingCheck.message });
    }

    await Payment.updatePaymentStatus(paymentId, PAYMENT_STATUS.COMPLETED, userId);

    const payment = await Payment.getPaymentById(paymentId);

    res.status(201).json({
      status: "success",
      message: "Offline payment processed successfully",
      data: {
        payment: payment,
        booking: { id: bookingId, status: BOOKING_STATUS.PAID },
      }
    });
  } catch (error) {
    console.error("Process offline payment error:", error);
    res.status(500).json({ error: error.message });
  }
};

// Khởi tạo thanh toán Momo
const initMomoPayment = async (req, res) => {
  try {
    // Bước 1: Lấy thông tin từ request body
    const {
      bookingId,
      amount,
      returnUrl, // URL để redirect sau khi thanh toán
      userId
    } = req.body;

    // Bước 2: Kiểm tra và lấy PaymentMethod cho MoMo
    const momoMethod = await PaymentMethod.findByName('Momo');
    if (!momoMethod) {
      return res.status(404).json({ error: "Payment method not found" });
    }

    // Bước 3: Tạo các thông tin cần thiết cho giao dịch
    const requestId = process.env.MOMO_PARTNER_CODE + new Date().getTime();
    const orderId = `ORDER_${bookingId}_${Date.now()}`;
    const orderInfo = `Payment for Booking #${bookingId}`;
    const requestType = "captureWallet";
    
    // Bước 4: Tạo payment trong database TRƯỚC để có paymentId
    const paymentId = await Payment.createPayment({
      Amount: amount,
      Provider: 'MOMO',
      PaymentReference: orderId,
      Status: PAYMENT_STATUS.PENDING,
      BookingId: bookingId,
      ProductId: null,
      MethodId: momoMethod.MethodId,
      CreatedBy: userId
    });

    // Bước 5: Tạo extraData bao gồm cả paymentId
    const extraData = JSON.stringify({
      bookingId: bookingId,
      paymentId: paymentId  // Thêm paymentId vào extraData
    });

    // Bước 6: Chuẩn bị dữ liệu để tạo chữ ký
    const rawSignature = "accessKey=" + process.env.MOMO_ACCESS_KEY + 
                        "&amount=" + amount + 
                        "&extraData=" + extraData + 
                        "&ipnUrl=" + process.env.IPN_URL + 
                        "&orderId=" + orderId + 
                        "&orderInfo=" + orderInfo + 
                        "&partnerCode=" + process.env.MOMO_PARTNER_CODE + 
                        "&redirectUrl=" + (returnUrl || process.env.REDIRECT_URL) + 
                        "&requestId=" + requestId + 
                        "&requestType=" + requestType;
    
    console.log("--------------------RAW SIGNATURE----------------");
    console.log(rawSignature);
    
    // Bước 7: Tạo chữ ký
    const signature = crypto
      .createHmac('sha256', process.env.MOMO_SECRET_KEY)
      .update(rawSignature)
      .digest('hex');
    
    console.log("--------------------SIGNATURE----------------");
    console.log(signature);

    // Bước 8: Chuẩn bị dữ liệu gửi đến MoMo API
    const requestData = {
      partnerCode: process.env.MOMO_PARTNER_CODE,
      accessKey: process.env.MOMO_ACCESS_KEY,
      requestId: requestId,
      amount: amount,
      orderId: orderId,
      orderInfo: orderInfo,
      redirectUrl: returnUrl || process.env.REDIRECT_URL,
      ipnUrl: process.env.IPN_URL,
      extraData: extraData,
      requestType: requestType,
      signature: signature,
      lang: 'en'
    };

    // Bước 9: Gửi request đến MoMo API
    const response = await axios.post(process.env.MOMO_API_ENDPOINT, requestData);

    // Bước 10: Trả về kết quả cho client
    res.status(200).json({
      status: "success",
      message: "Momo payment initialized",
      data: {
        paymentId: paymentId,
        payUrl: response.data.payUrl,
        orderId: orderId
      }
    });
  } catch (error) {
    console.error("Init Momo payment error:", error);
    if (error.response && error.response.data) {
      console.error("MoMo API response:", error.response.data);
      res.status(500).json({ error: error.message, details: error.response.data });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
};

// Xử lý callback từ MoMo
const handleMomoCallback = async (req, res) => {
  try {
    const {
      amount,
      orderId,
      requestId,
      orderInfo,
      orderType,
      transId,
      resultCode,
      message,
      payType,
      responseTime,
      extraData,
      signature
    } = req.body;

    const rawSignature = `accessKey=${process.env.MOMO_ACCESS_KEY}&amount=${amount}&extraData=${extraData}&message=${message}&orderId=${orderId}&orderInfo=${orderInfo}&orderType=${orderType}&partnerCode=${process.env.MOMO_PARTNER_CODE}&payType=${payType}&requestId=${requestId}&responseTime=${responseTime}&resultCode=${resultCode}&transId=${transId}`;

    const checkSignature = crypto
      .createHmac('sha256', process.env.MOMO_SECRET_KEY)
      .update(rawSignature)
      .digest('hex');

    let extraDataObj;
    try {
      const decodedExtraData = Buffer.from(extraData, 'base64').toString();
      extraDataObj = JSON.parse(decodedExtraData);
    } catch (parseError) {
      try {
        extraDataObj = JSON.parse(extraData);
      } catch (directParseError) {
        console.error("Failed to parse extraData:", extraData);
        console.error("Parse error:", directParseError);
        return res.status(400).json({
          error: "Invalid extraData format"
        });
      }
    }
    console.log("Raw extraData:", extraData);
    try {
      const directParse = JSON.parse(extraData);
      console.log("Direct parse result:", directParse);
    } catch (e1) {
      console.log("Direct parse failed, trying base64 decode");
      try {
        const decoded = Buffer.from(extraData, 'base64').toString();
        console.log("Decoded extraData:", decoded);
        const parsedDecoded = JSON.parse(decoded);
        console.log("Parsed decoded result:", parsedDecoded);
      } catch (e2) {
        console.log("Base64 decode failed too");
      }
    }

    const paymentId = extraDataObj.paymentId;
    const bookingId = extraDataObj.bookingId;

    const payment = await Payment.getPaymentById(paymentId);
    if (!payment) {
      return res.status(404).json({
        error: "Payment not found"
      });
    }

    if (resultCode === '0') {

      await Payment.updatePaymentStatus(
        paymentId,
        PAYMENT_STATUS.COMPLETED
      );

      const Booking = require('../models/booking.model');
      const bookingCheck = await Booking.updateStatus(
        bookingId,
        BOOKING_STATUS.PAID,
        payment.Amount
      );

      if (!bookingCheck.success) {
        console.error("Failed to update booking status:", bookingCheck.message);
      }

      res.status(200).json({
        status: "success",
        message: "Payment completed successfully"
      });
    } else {
      await Payment.updatePaymentStatus(
        paymentId,
        PAYMENT_STATUS.FAILED
      );

      const Booking = require('../models/booking.model');
      await Booking.updateStatus(bookingId, BOOKING_STATUS.PAYMENT_FAILED);

      res.status(200).json({
        status: "failed",
        message: message || "Payment failed"
      });
    }
  } catch (error) {
    console.error("Handle Momo callback error:", error);
    res.status(500).json({ error: error.message });
  }
};

const verifyMomoPayment = async (req, res) => {
  try {
    const {
      orderId,
      resultCode,
      transId
    } = req.body;

    // Tìm payment theo orderId
    const payment = await Payment.findByReference(orderId);

    if (!payment) {
      return res.status(404).json({
        status: "error",
        message: "Payment not found"
      });
    }

    // Kiểm tra xem payment đã cập nhật status chưa
    // Nếu IPN đã xử lý, payment status sẽ là COMPLETED
    if (payment.Status === PAYMENT_STATUS.COMPLETED) {
      return res.status(200).json({
        status: "success",
        message: "Payment already verified",
        data: {
          payment: {
            paymentId: payment.PaymentId,
            status: payment.Status,
            amount: payment.Amount
          },
          bookingId: payment.BookingId
        }
      });
    }

    // Nếu IPN chưa xử lý, cập nhật status dựa trên resultCode
    // Thực tế, status nên được cập nhật qua IPN callback, đây chỉ là phương án dự phòng
    if (resultCode === '0') {
      await Payment.updatePaymentStatus(payment.PaymentId, PAYMENT_STATUS.COMPLETED, null, {
        momotransId: transId
      });

      // Cập nhật booking status
      if (payment.BookingId) {
        const Booking = require('../models/booking.model');
        await Booking.updateStatus(payment.BookingId, BOOKING_STATUS.PAID, payment.Amount);
      }
    } else {
      await Payment.updatePaymentStatus(payment.PaymentId, PAYMENT_STATUS.FAILED);
    }

    // Lấy payment đã cập nhật
    const updatedPayment = await Payment.getPaymentById(payment.PaymentId);

    res.status(200).json({
      status: "success",
      message: "Payment verified",
      data: {
        payment: {
          paymentId: updatedPayment.PaymentId,
          status: updatedPayment.Status,
          amount: updatedPayment.Amount
        },
        bookingId: updatedPayment.BookingId
      }
    });
  } catch (error) {
    console.error("Verify MoMo payment error:", error);
    res.status(500).json({ error: error.message });
  }
};

const getPaymentStatus = async (req, res) => {
  try {
    const { paymentId } = req.params;
    const payment = await Payment.getPaymentById(paymentId);

    if (!payment) {
      return res.status(404).json({ error: "Payment not found" });
    }

    res.status(200).json({
      status: "success",
      data: {
        paymentId: payment.PaymentId,
        amount: payment.Amount,
        status: payment.Status,
        provider: payment.Provider,
        reference: payment.PaymentReference,
        createdAt: payment.CreatedAt,
        createdBy: payment.CreatedBy
      }
    });
  } catch (error) {
    console.error("Get payment status error:", error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getPaymentMethods,
  processOfflinePayment,
  initMomoPayment,
  handleMomoCallback,
  getPaymentStatus
};