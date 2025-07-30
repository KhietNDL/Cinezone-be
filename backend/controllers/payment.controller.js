const Payment = require('../models/payment.model');
const PaymentMethod = require('../models/paymentMethod.model');
const axios = require('axios');
const crypto = require('crypto');
const CryptoJS = require('crypto-js');
const { BOOKING_STATUS, PAYMENT_STATUS } = require('../utils/constants');
const Booking = require('../models/booking.model');
const OrderProduct = require('../models/orderProduct.model');
const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

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

const confirmPayment = async (req, res) => {
  try {
    const { paymentId } = req.params;

    if (!paymentId) {
      return res.status(400).json({ error: "paymentId is required" });
    }

    const payment = await Payment.getPaymentById(paymentId);
    if (!payment) {
      return res.status(404).json({ error: "Payment not found" });
    }

    await Payment.updatePaymentStatus(paymentId, PAYMENT_STATUS.COMPLETED, req.user ? req.user.UserId : null);

    // Cập nhật trạng thái booking nếu có
    let bookingDetail = null;
    if (payment.BookingId) {
      await Booking.updateStatus(payment.BookingId, BOOKING_STATUS.PAID, payment.Amount);
      await Booking.confirmBooking(payment.BookingId);
      bookingDetail = await Booking.getBookingDetail(payment.BookingId);
    }

    // Cập nhật trạng thái orderProduct nếu có
    let orderProductDetail = null;
    if (payment.OrderProductId) {
      await OrderProduct.confirmOrder(payment.OrderProductId);
      orderProductDetail = await OrderProduct.getOrderProductDetail(payment.OrderProductId);
    }

    // Gửi notification realtime (chỉ 1 lần, gồm cả booking và orderProduct nếu có)
    const io = global._io;
    // Sử dụng MemberId từ bookingDetail nếu có, fallback về payment.CreatedBy
    const notifyUserId = bookingDetail?.MemberId || payment.CreatedBy;
    if (io && notifyUserId) {
      io.to(notifyUserId).emit('notification', {
        type: bookingDetail && orderProductDetail ? 'combo'
          : bookingDetail ? 'booking'
          : orderProductDetail ? 'order'
          : 'payment',
        paymentId: payment.PaymentId,
        movieNameEnglish: bookingDetail?.movieNameEnglish || bookingDetail?.movieNameVN || undefined,
        orderProductId: orderProductDetail?.orderProductId,
        productName: orderProductDetail?.products?.[0]?.productName,
        status: PAYMENT_STATUS.COMPLETED,
        message: bookingDetail && orderProductDetail
          ? `${getBookingMessage(bookingDetail.status)} & ${getOrderMessage(orderProductDetail.status)}`
          : bookingDetail
            ? getBookingMessage(bookingDetail.status)
            : orderProductDetail
              ? getOrderMessage(orderProductDetail.status)
              : getPaymentMessage(PAYMENT_STATUS.COMPLETED),
        createdAt: payment.CreatedAt,
        scoreValue: bookingDetail?.pointUse ? -bookingDetail.pointUse : 0,
        bookingStatus: bookingDetail?.status,
        orderStatus: orderProductDetail?.status,
      });
    }

    res.status(200).json({
      status: "success",
      message: "Payment confirmed",
      data: {
        paymentId,
        status: PAYMENT_STATUS.COMPLETED
      }
    });
  } catch (error) {
    console.error("Confirm payment error:", error);
    res.status(500).json({ error: error.message });
  }
};

const processOfflinePayment = async (req, res) => {
  try {
    const { bookingId, orderProductId, amount, reference } = req.body;
    const userId = req.user.UserId;

    if (!userId) {
      return res.status(401).json({ error: "Authentication required" });
    }

    if (!bookingId && !orderProductId) {
      return res.status(400).json({ error: "At least one of bookingId or orderProductId is required" });
    }

    const cashMethod = await PaymentMethod.findByName('CASH');
    if (!cashMethod) {
      return res.status(404).json({ error: "Payment method not found" });
    }

    // Lấy thông tin booking và orderProduct nếu có
    let booking, orderProduct;
    if (bookingId) {
      booking = await Booking.getBookingById(bookingId);
      if (!booking) {
        return res.status(404).json({ error: "Booking not found" });
      }
    }
    let orderTotal = 0;
    if (orderProductId) {
      orderProduct = await OrderProduct.getById(orderProductId);
      if (!orderProduct) {
        return res.status(404).json({ error: "Order product not found" });
      }
      orderTotal = Number(orderProduct.TotalAmount);
    }

    // Kiểm tra amount
    let expectedAmount = 0;
    if (booking && orderProduct) {
      expectedAmount = Number(booking.TotalAmount) + orderTotal;
    } else if (booking) {
      expectedAmount = Number(booking.TotalAmount);
    } else if (orderProduct) {
      expectedAmount = orderTotal;
    }
    if (Number(amount) !== expectedAmount) {
      return res.status(400).json({ error: "Amount does not match total of booking and/or order product" });
    }

    // Tạo payment
    const paymentId = await Payment.createPayment({
      Amount: amount,
      Provider: 'CASH',
      PaymentReference: reference || 'Cash payment',
      Status: PAYMENT_STATUS.PENDING,
      BookingId: bookingId || null,
      OrderProductId: orderProductId || null,
      MethodId: cashMethod.MethodId,
      CreatedBy: userId
    });

    let bookingCheck = { success: true, updated: true };
    let orderStatus = null;
    let bookingStatus = null;

    // Xử lý booking nếu có
    if (bookingId) {
      bookingCheck = await Booking.updateStatus(bookingId, BOOKING_STATUS.PAID, booking.TotalAmount);

      if (bookingCheck.success && bookingCheck.updated === false) {
        await Payment.updatePaymentStatus(
          paymentId,
          PAYMENT_STATUS.CANCELLED,
          userId,
          { PaymentReference: "Booking already paid" }
        );
        if (orderProductId) {
          await OrderProduct.cancelOrder(orderProductId);
        }
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
        if (orderProductId) {
          await OrderProduct.cancelOrder(orderProductId);
        }
        return res.status(400).json({ error: bookingCheck.message });
      }

      await Booking.confirmBooking(bookingId);
      bookingStatus = BOOKING_STATUS.PAID;
    }

    // Xử lý orderProduct nếu có
    if (orderProductId) {
      try {
        await OrderProduct.confirmOrder(orderProductId);
        orderStatus = "PAID";
      } catch (err) {
        await Payment.updatePaymentStatus(
          paymentId,
          PAYMENT_STATUS.FAILED,
          userId,
          { failReason: err.message }
        );
        return res.status(400).json({ error: err.message });
      }
    }

    await Payment.updatePaymentStatus(paymentId, PAYMENT_STATUS.COMPLETED, userId);

    const payment = await Payment.getPaymentById(paymentId);

    res.status(201).json({
      status: "success",
      message: "Offline payment processed successfully",
      data: {
        payment: payment,
        booking: bookingId ? { id: bookingId, status: bookingStatus } : undefined,
        orderProduct: orderProductId ? { id: orderProductId, status: orderStatus } : undefined,
      }
    });
  } catch (error) {
    console.error("Process offline payment error:", error);
    res.status(500).json({ error: error.message });
  }
};

const initMomoPayment = async (req, res) => {
  try {
    // Lấy thông tin từ request body
    const {
      bookingId,
      orderProductId,
      amount,
      returnUrl, // URL để redirect sau khi thanh toán
      userId
    } = req.body;

    if (!bookingId && !orderProductId) {
      return res.status(400).json({ error: "At least one of bookingId or orderProductId is required" });
    }

    const momoMethod = await PaymentMethod.findByName('Momo');
    if (!momoMethod) {
      return res.status(404).json({ error: "Payment method not found" });
    }

    let booking, orderProduct;
    let orderTotal = 0;
    if (bookingId) {
      booking = await Booking.getBookingById(bookingId);
      if (!booking) {
        return res.status(404).json({ error: "Booking not found" });
      }
    }
    if (orderProductId) {
      orderProduct = await OrderProduct.getById(orderProductId);
      if (!orderProduct) {
        return res.status(404).json({ error: "Order product not found" });
      }
      orderTotal = Number(orderProduct.TotalAmount);
    }

    let expectedAmount = 0;
    if (booking && orderProduct) {
      expectedAmount = Number(booking.TotalAmount) + orderTotal;
    } else if (booking) {
      expectedAmount = Number(booking.TotalAmount);
    } else if (orderProduct) {
      expectedAmount = orderTotal;
    }
    if (Number(amount) !== expectedAmount) {
      return res.status(400).json({ error: "Amount does not match total of booking and/or order product" });
    }

    const requestId = process.env.MOMO_PARTNER_CODE + new Date().getTime();
    const orderId = `ORDER_${bookingId || orderProductId}_${Date.now()}`;
    const orderInfo = bookingId
      ? `Payment for Booking #${bookingId}`
      : `Payment for OrderProduct #${orderProductId}`;
    const requestType = "captureWallet";

    const paymentId = await Payment.createPayment({
      Amount: amount,
      Provider: 'MOMO',
      PaymentReference: orderId,
      Status: PAYMENT_STATUS.PENDING,
      BookingId: bookingId || null,
      OrderProductId: orderProductId || null,
      MethodId: momoMethod.MethodId,
      CreatedBy: userId
    });

    const extraData = JSON.stringify({
      bookingId: bookingId,
      orderProductId: orderProductId,
      paymentId: paymentId
    });

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

    const signature = crypto
      .createHmac('sha256', process.env.MOMO_SECRET_KEY)
      .update(rawSignature)
      .digest('hex');

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

    const response = await axios.post(process.env.MOMO_API_ENDPOINT, requestData);

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

    const payment = await Payment.findByReference(orderId);

    if (!payment) {
      return res.status(404).json({
        status: "error",
        message: "Payment not found"
      });
    }

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

    if (resultCode === '0') {
      await Payment.updatePaymentStatus(payment.PaymentId, PAYMENT_STATUS.COMPLETED, null, {
        momotransId: transId
      });

      // Cập nhật booking status
      if (payment.BookingId) {
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

const getMemberHistory = async (req, res) => {
  try {
    const memberId = req.query.memberId || req.user?.UserId;
    if (!memberId) return res.status(400).json({ error: "memberId is required" });

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const sortBy = req.query.sortBy || "CreatedAt";
    const sortOrder = req.query.sortOrder || "desc";

    const result = await Payment.getMemberHistory(memberId, { page, limit, sortBy, sortOrder });

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

const initZaloPayPayment = async (req, res) => {
  try {
    // Lấy thông tin từ request body
    const {
      bookingId,
      orderProductId,
      amount,
      returnUrl,
      userId
    } = req.body;

    if (!bookingId && !orderProductId) {
      return res.status(400).json({ error: "At least one of bookingId or orderProductId is required" });
    }

    const zalopayMethod = await PaymentMethod.findByName('ZaloPay');
    if (!zalopayMethod) {
      return res.status(404).json({ error: "Payment method not found" });
    }

    let booking, orderProduct;
    let orderTotal = 0;
    if (bookingId) {
      const Booking = require('../models/booking.model');
      booking = await Booking.getBookingById(bookingId);
      if (!booking) {
        return res.status(404).json({ error: "Booking not found" });
      }
    }
    if (orderProductId) {
      const OrderProduct = require('../models/orderProduct.model');
      orderProduct = await OrderProduct.getById(orderProductId);
      if (!orderProduct) {
        return res.status(404).json({ error: "Order product not found" });
      }
      orderTotal = Number(orderProduct.TotalAmount);
    }

    let expectedAmount = 0;
    if (booking && orderProduct) {
      expectedAmount = Number(booking.TotalAmount) + orderTotal;
    } else if (booking) {
      expectedAmount = Number(booking.TotalAmount);
    } else if (orderProduct) {
      expectedAmount = orderTotal;
    }
    if (Number(amount) !== expectedAmount) {
      return res.status(400).json({ error: "Amount does not match total of booking and/or order product" });
    }

    // Tạo orderId cho payment reference
    const orderId = `ORDER_${bookingId || orderProductId}_${Date.now()}`;

    // Tạo payment record
    const paymentId = await Payment.createPayment({
      Amount: amount,
      Provider: 'ZaloPay',
      PaymentReference: orderId,
      Status: PAYMENT_STATUS.PENDING,
      BookingId: bookingId || null,
      OrderProductId: orderProductId || null,
      MethodId: zalopayMethod.MethodId,
      CreatedBy: userId
    });

    // Tạo thông tin giao dịch ZaloPay
    function getAppTransId() {
      const date = new Date();
      const yymmdd = date.toLocaleDateString('en-GB').split('/').reverse().join('').slice(2); // yymmdd
      const rand = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
      return `${yymmdd}_${rand}`;
    }
    const apptransid = getAppTransId();
    const appuser = "demo_user";
    const apptime = Date.now();

    const embeddata = JSON.stringify({
      redirecturl: returnUrl,
      preferred_payment_method: [],
      promotioninfo: "",
      merchantinfo: "embeddata123"
    });

    const item = JSON.stringify([]);

    const bank_code = "";

    const data = `${process.env.ZALOPAY_APP_ID}|${apptransid}|${appuser}|${amount}|${apptime}|${embeddata}|${item}`;
    const mac = crypto.createHmac('sha256', process.env.ZALOPAY_KEY1)
      .update(data)
      .digest('hex');

    const params = {
      app_id: Number(process.env.ZALOPAY_APP_ID),
      app_trans_id: apptransid,
      app_user: appuser,
      app_time: apptime,
      amount: Number(amount),
      item: item,
      embed_data: embeddata,
      description: `Thanh toán đơn hàng #${bookingId || orderProductId}`,
      bank_code: bank_code,
      mac: mac,
    };

    const response = await axios.post(
      process.env.ZALOPAY_ENDPOINT,
      new URLSearchParams(params).toString(),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );

    res.status(200).json({
      status: "success",
      message: "ZaloPay payment initialized",
      data: {
        paymentId: paymentId,
        orderId: orderId,
        ...response.data
      }
    });
  } catch (error) {
    console.error("Init ZaloPay payment error:", error);
    if (error.response && error.response.data) {
      res.status(500).json({ error: error.message, details: error.response.data });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
};

const zaloPayCallback = async (req, res) => {
  let result = {};
  try {
    const dataStr = req.body.data;
    const reqMac = req.body.mac;

    // Tính lại MAC để kiểm tra hợp lệ
    const mac = CryptoJS.HmacSHA256(dataStr, process.env.ZALOPAY_KEY2).toString();

    if (reqMac !== mac) {
      result.return_code = -1;
      result.return_message = "mac not equal";
      return res.json(result);
    }

    // Callback hợp lệ, parse data và cập nhật trạng thái đơn hàng
    const dataJson = JSON.parse(dataStr);

    // Tìm payment theo app_trans_id
    const payment = await Payment.findByAppTransId(dataJson.app_trans_id);
    if (payment) {
      await Payment.updatePaymentStatus(payment.PaymentId, PAYMENT_STATUS.COMPLETED);

      // Nếu có bookingId thì cập nhật trạng thái booking
      if (payment.BookingId) {
        const Booking = require('../models/booking.model');
        await Booking.updateStatus(payment.BookingId, BOOKING_STATUS.PAID, payment.Amount);
      }
      // Nếu có orderProductId thì cập nhật trạng thái orderProduct (nếu cần)
      // ...
    }

    console.log("ZaloPay callback success, app_trans_id =", dataJson.app_trans_id);

    result.return_code = 1;
    result.return_message = "success";
    return res.json(result);
  } catch (ex) {
    result.return_code = 0;
    result.return_message = ex.message;
    return res.json(result);
  }
};

const createStripeTestPaymentIntent = async (req, res) => {
  try {
    const { amount, currency = 'vnd', bookingId, orderProductId, cardType } = req.body;
    const userId = req.user.UserId; // <-- Lấy tự động từ token đăng nhập

    if (!amount || (!bookingId && !orderProductId)) {
      return res.status(400).json({ error: "Amount and bookingId or orderProductId are required" });
    }

    // cardType chỉ để FE biết test loại thẻ nào, Stripe không cần truyền vào backend

    // Tạo PaymentIntent trên Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(Number(amount)),
      currency,
      payment_method_types: ['card'],
      metadata: {
        bookingId: bookingId || '',
        orderProductId: orderProductId || '',
        userId: userId || '',
        cardType: cardType || 'visa'
      }
    });

    // Lưu payment vào DB (trạng thái PENDING)
    let methodName = 'VISA';
    if (cardType && typeof cardType === 'string') {
      if (cardType.toLowerCase() === 'mastercard') methodName = 'MASTERCARD';
      else if (cardType.toLowerCase() === 'jcb') methodName = 'JCB';
      else if (cardType.toLowerCase() === 'unionpay') methodName = 'UNIONPAY';
    }
    const cardMethod = await PaymentMethod.findByName(methodName);

    const paymentId = await Payment.createPayment({
      Amount: amount,
      Provider: 'STRIPE',
      PaymentReference: paymentIntent.id,
      Status: PAYMENT_STATUS.PENDING,
      BookingId: bookingId || null,
      OrderProductId: orderProductId || null,
      MethodId: cardMethod ? cardMethod.MethodId : null,
      CreatedBy: userId // <-- Lưu userId lấy từ token
    });

    res.status(200).json({
      status: "success",
      message: "Stripe test PaymentIntent created",
      data: {
        paymentId,
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
        cardType: methodName
      }
    });
  } catch (error) {
    console.error("Create Stripe test PaymentIntent error:", error);
    res.status(500).json({ error: error.message });
  }
};

const handleStripeWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error("Stripe webhook signature error:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Xử lý event thanh toán thành công
  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object;
    // Tìm payment trong DB theo paymentIntent.id
    const payment = await Payment.findByReference(paymentIntent.id);
    if (payment && payment.Status !== PAYMENT_STATUS.COMPLETED) {
      await Payment.updatePaymentStatus(payment.PaymentId, PAYMENT_STATUS.COMPLETED);

      // Nếu có bookingId thì cập nhật trạng thái booking
      if (payment.BookingId) {
        const Booking = require('../models/booking.model');
        await Booking.updateStatus(payment.BookingId, BOOKING_STATUS.PAID, payment.Amount);
      }
      // Nếu có orderProductId thì cập nhật trạng thái orderProduct (nếu cần)
      // ...
    }
  }

  res.json({ received: true });
};

module.exports = {
  getPaymentMethods,
  processOfflinePayment,
  initMomoPayment,
  handleMomoCallback,
  getPaymentStatus,
  getMemberHistory,
  initZaloPayPayment,
  zaloPayCallback,
  confirmPayment,
  createStripeTestPaymentIntent
};

// Helper functions (có thể đặt ở đầu file hoặc import từ utils)
function getBookingMessage(status) {
  switch (status) {
    case 2: return "Your ticket has been confirmed";
    case 3: return "Your ticket has been checked in";
    case 4: return "Your ticket has been cancelled";
    default: return "Your booking status has changed";
  }
}
function getOrderMessage(status) {
  switch (status) {
    case 2: return "Your order has been completed";
    case 3: return "Your order is being processed";
    case 4: return "Your order has been cancelled";
    default: return "Your order status has changed";
  }
}
function getPaymentMessage(status) {
  switch (status) {
    case "completed": return "Payment completed successfully";
    case "pending": return "Payment is being processed";
    case "failed": return "Payment failed";
    default: return "Payment status has changed";
  }
}
