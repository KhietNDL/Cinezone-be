import React, { useCallback, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button, Image, Table } from "antd";
import { FaPlus, FaRedo, FaTimes } from "react-icons/fa";
import { CheckCircleTwoTone, CloseCircleTwoTone } from "@ant-design/icons";
import { PiPopcornDuotone } from "react-icons/pi";
import { useSelector, useDispatch } from "react-redux";
import {
  clearComboCart,
  clearOrderInfo,
  resetCart,
} from "../../../redux/features/comboSlice";
import "./ComboPage.css";
import {
  cancelProductsById,
  confirmPayment,
} from "../../../services/APIForStaff/API";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import BackButton from "../component/BackButton";

export default function ComboInformation() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { search } = useLocation();
  const comboVisaResponse = useSelector(
    (state) => state.combo.comboVisaResponse
  );
  const comboData = useSelector((state) => state.combo);

  const params = new URLSearchParams(search);
  const momoResult = params.get("resultCode");
  const zaloStatus = params.get("status");
  let status = "success";

  if (momoResult !== null) {
    status = momoResult === "0" ? "success" : "error";
  } else if (zaloStatus !== null) {
    status = zaloStatus === "1" ? "success" : "error";
  } else if (comboVisaResponse) {
    status = comboVisaResponse.status === "succeeded" ? "success" : "error";
  }

  useEffect(() => {
    if (status === "success") {
      toast.success("Payment successful!");
    } else if (status === "error") {
      toast.error("Payment failed. Please try again.");
    }
  }, [status]);

  const paymentId = params.get("paymentId") || comboData?.paymentId;

  const cart = useSelector((state) => state.combo.cart) || [];
  const orderProductId = useSelector((state) => state.combo.orderProductId);
  const formatPrice = (price) => price?.toLocaleString("vi-VN");
  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  useEffect(() => {
    const confirm = async () => {
      try {
        if (status === "success" && paymentId) {
          await confirmPayment(paymentId);
          window.history.replaceState(
            {},
            document.title,
            window.location.pathname
          );
        }
      } catch (error) {
        window.history.replaceState(
          {},
          document.title,
          window.location.pathname
        );
        console.error(error);
      }
    };
    confirm();
  }, [status, paymentId]);

  const statusMap = {
    success: {
      icon: (
        <CheckCircleTwoTone twoToneColor="#52c41a" className="text-6xl mb-4" />
      ),
      title: "Payment Successful",
      subtitle: "Your combo order has been processed successfully",
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
    },
    error: {
      icon: (
        <CloseCircleTwoTone twoToneColor="#ff4d4f" className="text-6xl mb-4" />
      ),
      title: "Payment Failed",
      subtitle: "There was an issue processing your payment",
      color: "text-red-600",
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
    },
  };

  const statusInfo = statusMap[status];

  const handleNewCombo = () => {
    dispatch(clearComboCart());
    dispatch(clearOrderInfo());
    dispatch(resetCart());
    navigate("/staff/combo-selling");
  };

  const handleClose = () => {
    dispatch(clearComboCart());
    dispatch(clearOrderInfo());
    dispatch(resetCart());
    navigate("/staff/combo-selling");
  };

  const handleCancel = async () => {
    dispatch(clearComboCart());
    dispatch(clearOrderInfo());
    dispatch(resetCart());
    try {
      await cancelProductsById(orderProductId);
      toast.success("Booking cancelled.");
    } catch (err) {
      toast.error("Failed to cancel booking");
      console.error(err);
    } finally {
      navigate("/staff/combo-selling");
    }
  };

  const handleTryAgain = useCallback(async () => {
    try {
      await cancelProductsById(orderProductId);
      toast.info("Previous booking cancelled. Please try again.");
    } catch (err) {
      toast.error("Failed to cancel previous booking");
      console.error(err);
    } finally {
      navigate("/staff/combo-selling/checkout");
    }
  }, [orderProductId, navigate]);

  const columns = [
    {
      title: "Image",
      dataIndex: "image",
      width: 120,
      render: (img) => <Image src={img} width={80} height={100} />,
    },
    {
      title: "Name",
      dataIndex: "name",
      width: 220,
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      width: 100,
      render: (qty) => <span>{qty}</span>,
    },
    {
      title: "Unit Price",
      dataIndex: "price",
      width: 120,
      render: (price) => <span>{formatPrice(price)} VNĐ</span>,
    },
    {
      title: "Total",
      width: 120,
      render: (_, record) => (
        <span>{formatPrice(record.price * record.quantity)} VNĐ</span>
      ),
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
                Order Summary
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 hidden sm:block">
                Your combo order details
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Status Section */}
        <div
          className={`bg-white rounded-xl shadow-lg border-0 overflow-hidden mb-6 ${statusInfo.borderColor} border-2`}
        >
          <div className={`p-6 ${statusInfo.bgColor}`}>
            <div className="text-center py-8">
              {statusInfo.icon}
              <h2 className={`text-3xl font-bold mb-2 ${statusInfo.color}`}>
                {statusInfo.title}
              </h2>
              <p className="text-gray-600 text-lg">{statusInfo.subtitle}</p>
            </div>
          </div>
        </div>

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
                  Your purchased combo items
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
              locale={{
                emptyText: (
                  <div className="text-center py-12">
                    <PiPopcornDuotone className="text-4xl text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No combo items found</p>
                  </div>
                ),
              }}
            />

            {/* Total Amount */}
            <div className="flex justify-center mt-6 p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg">
              <div className="text-center">
                <p className="text-lg font-semibold text-purple-700 mb-1">
                  Total Amount
                </p>
                <p className="text-2xl font-bold text-purple-800">
                  {formatPrice(totalPrice)} VNĐ
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="bg-white rounded-xl shadow-lg border-0 overflow-hidden mb-6">
          <div className="p-6">
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              {status === "error" ? (
                <>
                  <Button
                    color="orange"
                    variant="solid"
                    icon={<FaRedo />}
                    onClick={handleTryAgain}
                    className="h-12 px-8 bg-gradient-to-r from-orange-600 to-orange-700 border-0 hover:from-orange-700 hover:to-orange-800 font-semibold text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
                    size="large"
                  >
                    Try Again
                  </Button>

                  <Button
                    color="danger"
                    variant="outlined"
                    icon={<FaTimes />}
                    onClick={handleCancel}
                    className="h-12 px-8 font-semibold rounded-lg border-2 border-gray-300 text-gray-600 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
                    size="large"
                  >
                    Cancel
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    type="primary"
                    icon={<FaPlus />}
                    onClick={handleNewCombo}
                    className="h-12 px-8 bg-gradient-to-r from-purple-600 to-purple-700 border-0 hover:from-purple-700 hover:to-purple-800 font-semibold text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
                    size="large"
                  >
                    New Combo Order
                  </Button>
                  <Button
                    color="danger"
                    variant="outlined"
                    icon={<FaTimes />}
                    onClick={handleClose}
                    className="h-12 px-8 font-semibold rounded-lg border-2 border-gray-300 text-gray-600 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
                    size="large"
                  >
                    Close
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
