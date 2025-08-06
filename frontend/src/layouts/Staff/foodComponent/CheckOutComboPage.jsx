import React, { useState, useMemo } from "react";
import { Button, Table, Input, Select, Image } from "antd";
import { useNavigate } from "react-router-dom";
import { createProductHold } from "../../../services/APIForStaff/API";
import { useAuth } from "../../../context/AuthContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaCheck, FaTimes } from "react-icons/fa";
import { FaArrowLeft, FaMoneyBillWave } from "react-icons/fa6";
import { PiPopcornDuotone } from "react-icons/pi";
import "./ComboPage.css";
import { useSelector, useDispatch } from "react-redux";
import {
  clearComboCart,
  clearOrderInfo,
  setOrderInfo,
  setStripeClientSecret,
  setPaymentId,
} from "../../../redux/features/comboSlice";
import PaymentMethod from "../component/PaymentMethod";
import { processPayment } from "../../../hooks/useProcessPayment";
import BackButton from "../component/BackButton";

const { Option } = Select;

export default function CheckOutComboPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const cart = useSelector((state) => state.combo.cart);
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [cardType, setCardType] = useState("");
  const dispatch = useDispatch();

  const formatPrice = (price) => price?.toLocaleString("vi-VN");

  const totalPrice = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [cart]);

  const [customerPay, setCustomerPay] = useState(0);
  const [changeAmount, setChangeAmount] = useState(0);

  const handleCustomerPayChange = (value) => {
    const pay = value;
    setCustomerPay(pay);

    const change = pay - totalPrice;
    setChangeAmount(change > 0 ? change : 0);
  };

  const handlePayment = async () => {
    try {
      setLoading(true);
      if (!Array.isArray(cart) || cart.length === 0) {
        toast.warning("Cart is empty or missing order number.");
        return;
      }

      // if (paymentMethod === "Cash" && parseInt(customerPay) || 0 < totalPrice) {
      //   toast.error("The amount of money the customer gave is not enough to pay.");
      //   return;
      // }

      if (paymentMethod === "Cash") {
        if (customerPay < totalPrice) {
          toast.error(
            "The amount of money the customer gave is not enough to pay."
          );
          return;
        }
      }

      if (paymentMethod === "Stripe" && !cardType) {
        toast.error("Please select a card type for Stripe payment.");
        return;
      }

      const userId = user?.userId || user?.id;
      if (!userId) {
        toast.error("User information not found.");
        return;
      }

      const productsForApi = cart.map((item) => ({
        ProductId: item.id,
        Quantity: item.quantity,
      }));

      const holdResponse = await createProductHold(
        userId,
        productsForApi,
        "Payment for combo"
      );
      dispatch(
        setOrderInfo({
          orderProductId: holdResponse.OrderProductId,
          totalAmount: totalPrice,
        })
      );

      let successUrl;

      if (paymentMethod === "Cash") {
        successUrl = "/staff/combo-selling/combo-information";
      } else if (paymentMethod === "Stripe") {
        successUrl = "/staff/combo-selling/waiting-payment";
      } else {
        successUrl = `${window.location.origin}/staff/combo-selling/combo-information`;
      }

      const paymentResult = await processPayment({
        paymentMethod,
        orderId: holdResponse.OrderProductId,
        amount: totalPrice,
        type: "combo",
        navigate,
        setIsRedirecting: null,
        successUrl,
        cardType: paymentMethod === "Stripe" ? cardType : undefined,
      });

      if (
        paymentMethod === "Stripe" &&
        (paymentResult?.data?.clientSecret || paymentResult?.clientSecret)
      ) {
        dispatch(setStripeClientSecret(paymentResult.data || paymentResult));
      }

      if (
        (paymentMethod && paymentResult?.data?.paymentId) ||
        paymentResult?.data?.payment?.PaymentId
      ) {
        dispatch(
          setPaymentId(
            paymentResult.data.paymentId || paymentResult.data.payment.PaymentId
          )
        );
      }
    } catch (error) {
      toast.error("Payment failed.");
      console.error("Checkout error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    dispatch(clearComboCart());
    dispatch(clearOrderInfo());
    toast.success("Order cancelled.");
    navigate("/staff/combo-selling");
  };

  const columns = [
    {
      title: "Image",
      dataIndex: "image",
      width: 200,
      render: (img) => <Image src={img} width={100} height={130} />,
    },
    {
      title: "Product",
      dataIndex: "name",
      width: 200,
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      width: 100,
    },
    {
      title: "Unit Price",
      dataIndex: "price",
      render: (price) => `${formatPrice(price)} VNĐ`,
      width: 150,
    },
    {
      title: "Total",
      render: (_, record) =>
        `${formatPrice(record.price * record.quantity)} VNĐ`,
      width: 150,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-3 sm:py-4 bg-white shadow-md rounded-lg mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <BackButton />
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-purple-600 to-purple-700 rounded-lg flex items-center justify-center">
              <PiPopcornDuotone className="text-white text-lg sm:text-xl" />
            </div>
            <div>
              <h1 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-purple-600 to-purple-700 bg-clip-text text-transparent">
                Combo Checkout
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 hidden sm:block">
                Confirm your order details
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Order Details Section */}
        <div className="bg-white rounded-xl shadow-lg border-0 overflow-hidden mb-6">
          <div className="p-6">
            {/* Section Header */}
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-purple-700 rounded-lg flex items-center justify-center">
                <PiPopcornDuotone className="text-white text-lg" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-gray-800">
                  Order Details
                </h2>
                <p className="text-sm text-gray-500">
                  Review your selected combo items
                </p>
              </div>
              <div className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium">
                {cart.length} {cart.length === 1 ? "item" : "items"}
              </div>
            </div>

            <Table
              className="table-cart-staff"
              dataSource={cart}
              columns={columns}
              rowKey="id"
              pagination={false}
              scroll={{ x: true }}
            />
          </div>
        </div>

        {/* Payment Section */}
        <div className="bg-white rounded-xl shadow-lg border-0 overflow-hidden mb-6">
          <div className="p-6">
            {/* Section Header */}
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-purple-700 rounded-lg flex items-center justify-center">
                <FaMoneyBillWave className="text-white text-sm" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-gray-800">
                  Payment Information
                </h2>
                <p className="text-sm text-gray-500">
                  Choose your payment method
                </p>
              </div>
            </div>

            {/* Customer Pay & Change */}
            <div className="grid sm:grid-cols-2 gap-4 mt-4 py-3">
              <div>
                <label className="block mb-1 font-medium text-gray-700">
                  Customer Pays (VNĐ)
                </label>
                <Input
                  placeholder="Enter cash given by customer"
                  type="number"
                  value={customerPay}
                  onChange={(e) => handleCustomerPayChange(e.target.value)}
                  disabled={paymentMethod !== "Cash"}
                  status={
                    paymentMethod === "Cash" &&
                    customerPay &&
                    parseInt(customerPay) < totalPrice
                      ? "error"
                      : ""
                  }
                />
                {paymentMethod === "Cash" &&
                  customerPay &&
                  parseInt(customerPay) < totalPrice && (
                    <div className="text-red-500 mt-1 text-sm">
                      The amount is not enough to make the payment.
                    </div>
                  )}
              </div>
              <div>
                <label className="block mb-1 font-medium text-gray-700">
                  Change back
                </label>
                <div className="h-[38px] flex items-center px-3 bg-gray-100 rounded-md text-gray-800 font-semibold">
                  {formatPrice(changeAmount)} VNĐ
                </div>
              </div>
            </div>

            {/* Total Amount */}
            <div className="flex justify-center mb-6 p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg">
              <div className="text-center">
                <p className="text-lg font-semibold text-purple-700 mb-1">
                  Total Amount
                </p>
                <p
                  className="text-2xl font-bold text-purple-800"
                  data-testid="total-amount"
                >
                  {formatPrice(totalPrice)} VNĐ
                </p>
              </div>
            </div>

            {/* Payment Method */}
            <PaymentMethod
              value={paymentMethod}
              onChange={(val) => {
                setPaymentMethod(val);
                if (val !== "Stripe") setCardType("");
              }}
              showCardType={paymentMethod === "Stripe"}
              cardType={cardType}
              onCardTypeChange={setCardType}
              cardTypeError={
                paymentMethod === "Stripe" && !cardType
                  ? "Please select a card type"
                  : ""
              }
            />

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8 pt-4 border-t border-gray-100">
              <Button
                type="primary"
                icon={<FaCheck />}
                loading={loading}
                onClick={handlePayment}
                disabled={cart.length === 0}
                className="h-12 px-8 bg-gradient-to-r from-purple-600 to-purple-700 border-0 hover:from-purple-700 hover:to-purple-800 focus:from-purple-700 focus:to-purple-800 font-semibold text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
                size="large"
              >
                {loading ? "Processing..." : "Confirm Payment"}
              </Button>
              <Button
                color="danger"
                variant="outlined"
                icon={<FaTimes />}
                onClick={handleCancel}
                className="h-12 px-8 font-semibold rounded-lg border-2 border-red-300 text-red-600 hover:bg-red-50 hover:border-red-400 focus:bg-red-50 focus:border-red-400 transition-all duration-200"
                size="large"
              >
                Cancel Order
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
