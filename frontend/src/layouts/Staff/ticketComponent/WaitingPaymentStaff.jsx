import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import StripeCheckoutForm from "../../User/component/StripeCheckoutForm";
import { setVisaResponse } from "../../../redux/features/sellingSlice";
import { setComboVisaResponse } from "../../../redux/features/comboSlice";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import logo from "../../../assets/logoWeb.svg";
import BackButton from "../component/BackButton";
import {
  cancelBookingById,
  cancelProductsById,
} from "../../../services/APIForStaff/API";
import { FaCreditCard, FaShieldAlt, FaLock } from "react-icons/fa";
import { IoCardOutline } from "react-icons/io5";

export default function WaitingPaymentStaff() {
  const location = useLocation();
  const isCombo = location.pathname.includes("combo-selling");
  const stripeClientSecret = useSelector((state) =>
    isCombo ? state.combo.stripeClientSecret : state.selling.stripeClientSecret
  );

  const cancelId = useSelector((state) =>
    isCombo ? state.combo.orderProductId : state.selling.bookingId
  );

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleCancel = async () => {
    try {
      if (isCombo) {
        await cancelProductsById(cancelId);
        toast.success("Order cancelled successfully.");
      } else {
        await cancelBookingById(cancelId);
        toast.success("Booking cancelled successfully.");
      }

      navigate(-1);
    } catch (error) {
      toast.error("Failed to cancel the booking.");
      console.log("Error cancelling booking:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-3 sm:py-4 bg-white shadow-md rounded-lg mb-6">
        <div className="flex flex-row items-center gap-3 lg:gap-4">
          <BackButton />
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-purple-600 to-purple-700 rounded-lg flex items-center justify-center">
              <FaCreditCard className="text-white text-lg sm:text-xl" />
            </div>
            <div>
              <h1 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-purple-600 to-purple-700 bg-clip-text text-transparent">
                Payment Processing
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 hidden sm:block">
                Staff Portal - Stripe Payment
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl">
        {/* Payment Status Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-purple-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <IoCardOutline className="text-white text-2xl" />
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">
              Secure Payment
            </h2>
            <p className="text-gray-600">
              Complete your {isCombo ? "combo order" : "ticket booking"} payment
              securely
            </p>
          </div>

          {/* Security Features */}
          <div className="flex justify-center gap-6 mb-6">
            <div className="flex items-center gap-2 text-green-600">
              <FaShieldAlt className="text-lg" />
              <span className="text-sm font-medium">SSL Secured</span>
            </div>
            <div className="flex items-center gap-2 text-green-600">
              <FaLock className="text-lg" />
              <span className="text-sm font-medium">Encrypted</span>
            </div>
          </div>
        </div>

        {/* Payment Form Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-50 to-purple-100 px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-center">
              <img src={logo} alt="CineZone Logo" className="w-[150px]" />
              <h3 className="font-bold text-purple-600 text-2xl pt-4">
                CineZone Payment
              </h3>
            </div>
          </div>

          {/* Stripe Form Container */}
          <div className="p-6 ">
            {stripeClientSecret ? (
              <div className="max-w-md mx-auto bg-gray-900/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 shadow-2xl">
                <StripeCheckoutForm
                  clientSecret={stripeClientSecret.clientSecret}
                  onSuccess={(paymentIntent) => {
                    if (isCombo) {
                      dispatch(setComboVisaResponse(paymentIntent));
                      // toast.success("Payment successful!");
                      setTimeout(() => {
                        navigate("/staff/combo-selling/combo-information");
                      }, 1000);
                    } else {
                      dispatch(setVisaResponse(paymentIntent));
                      // toast.success("Payment successful!");
                      setTimeout(() => {
                        navigate("/staff/ticket-selling/ticket-information");
                      }, 1000);
                    }
                  }}
                />
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mx-auto mb-4"></div>
                <p className="text-gray-300">Loading payment form...</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">
                🔒 Your payment information is secure and encrypted
              </p>
              <p className="text-xs text-gray-500">
                Powered by Stripe • PCI DSS Compliant
              </p>
            </div>
          </div>
        </div>

        {/* Cancel Section */}
        <div className="mt-6 text-center">
          <button
            onClick={handleCancel}
            className="cursor-pointer inline-flex items-center gap-2 px-6 py-3 text-gray-600 hover:text-red-600 font-medium transition-colors duration-200"
          >
            <span>Cancel Payment</span>
          </button>
          <p className="text-xs text-gray-500 mt-2">
            Your {isCombo ? "order" : "booking"} will be cancelled if you leave
            this page
          </p>
        </div>
      </div>
    </div>
  );
}
