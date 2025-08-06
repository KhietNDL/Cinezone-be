import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// Các hàm API cho từng loại
import {
  createCashPayment,
  createMomoPayment,
  // confirmBooking,
  createCashPaymentForProduct,
  createMomoPaymentForProducts,
  createZaloPayPayment,
  createZaloPayPaymentForProducts,
  createVisaPayment,
  createVisaPaymentForProducts
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
  cardType
}) {
  try {
    switch (paymentMethod) {
      case "Cash":
        {
          setIsRedirecting?.(true);
          let cashRes;
          if (type === "ticket") {
            cashRes = await createCashPayment(orderId, amount, `CASH-${Date.now()}`);
            // await confirmBooking(orderId);
            toast.success("Cash payment successful!");
            navigate(successUrl);
          } else if (type === "combo") {
            cashRes = await createCashPaymentForProduct(orderId, amount, `Payment for combo CASH-${Date.now()}`);
            // toast.success("Cash payment successful!");
            navigate(successUrl);
          }
          return cashRes;
        }
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
        return momoRes;

      }
      case "VNPay":
        throw new Error("VNPay payment method not yet supported");

      case "Stripe":
        {
          setIsRedirecting?.(true);
          let visaRes;
          if (type === "ticket") {
            visaRes = await createVisaPayment(orderId, amount, cardType);
            // await confirmBooking(orderId);
            // toast.success("Visa payment successful!");
            navigate(successUrl);
          } else if (type === "combo") {
            visaRes = await createVisaPaymentForProducts(orderId, amount, cardType);
            // toast.success("Payment successful!");
            navigate(successUrl);
          }
          return visaRes;
        }

      case "ZaloPay":
        {
          setIsRedirecting?.(true);
          let zaloPayRes;
          if (type === "ticket") {
            zaloPayRes = await createZaloPayPayment(orderId, amount, successUrl);
          } else if (type === "combo") {
            zaloPayRes = await createZaloPayPaymentForProducts(orderId, amount, successUrl);
          }
          const order_url = zaloPayRes?.order_url || zaloPayRes?.data?.order_url;
          if (!order_url) {
            setIsRedirecting?.(false);
            throw new Error("Did not receive payment URL from ZaloPay");
          }
          window.location.href = order_url;
          return zaloPayRes;
        }
      default:
        throw new Error("Invalid payment method");
    }
  } catch (error) {
    setIsRedirecting?.(false);
    throw error;
  }
}