import { toast } from "react-toastify";

// Các hàm API cho từng loại
import {
  createCashPayment,
  createMomoPayment,
  confirmBooking,
  createCashPaymentForProduct,
  createMomoPaymentForProducts,
} from "../services/APIForStaff/API";

// type: "ticket" hoặc "combo"
export async function processPayment({
  paymentMethod,
  orderId,
  amount,
  type,
  navigate,
  setIsRedirecting,
  successUrl,
}) {
  try {
    switch (paymentMethod) {
      case "Cash":
        if (type === "ticket") {
          await createCashPayment(orderId, amount, `CASH-${Date.now()}`);
          await confirmBooking(orderId);
          toast.success("Cash payment successful!");
          navigate(successUrl);
        } else if (type === "combo") {
          await createCashPaymentForProduct(orderId, amount, "Payment for combo");
          toast.success("Payment successful!");
          navigate(successUrl);
        }
        break;
      case "Momo": {
        setIsRedirecting?.(true);
        let momoRes;
        if (type === "ticket") {
          momoRes = await createMomoPayment(orderId, amount, successUrl);
        } else if (type === "combo") {
          momoRes = await createMomoPaymentForProducts(orderId, amount, successUrl);
        }
        const payUrl = momoRes?.payUrl || momoRes?.data?.payUrl;
        if (!payUrl) {
          setIsRedirecting?.(false);
          throw new Error("Did not receive payment URL from Momo");
        }
        window.location.href = payUrl;
        break;
      }
      case "VNPay":
        throw new Error("VNPay payment method not yet supported");
      case "ZaloPay":
        throw new Error("ZaloPay payment method not yet supported");
      default:
        throw new Error("Invalid payment method");
    }
  } catch (error) {
    setIsRedirecting?.(false);
    throw error;
  }
}