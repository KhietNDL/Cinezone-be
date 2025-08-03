import React, { useEffect, useState, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import {
  cancelBooking,
  cancelProduct,
  ConfirmPayment,
  getBookingById,
  getProductByOderProductId
} from "../../../services/API";
import { useDispatch, useSelector } from "react-redux";
import { setProductDetail } from "../../../redux/features/bookingSlice";
import { DNALoader } from "../../../component/Loader";
import AnimatedWrapper from "../../../component/MagicBentoAnimation";

const TicketDetails = () => {
  const [searchParams] = useSearchParams();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isCancelled, setIsCancelled] = useState(false);
  const dispatch = useDispatch();

  // Flag đảm bảo chỉ chạy confirm/cancel 1 lần
  const hasHandled = useRef(false);

  // Momo params
  const resultCode = searchParams.get("resultCode");
  const extraDataRaw = searchParams.get("extraData");

  // ZaloPay params
  const zaloStatus = searchParams.get("status");

  // Lấy từ Redux
  const { productDetail, bookingId: reduxBookingId, orderProductsId: reduxOrderProductId, paymentId: reduxPaymentId } =
    useSelector((state) => state.booking);

  let bookingId = null;
  let orderProductId = null;
  let paymentId = null;
  let paymentMethod = null;

  try {
    const isMomo = resultCode !== null;
    const isZaloPay = zaloStatus !== null;

    if (isMomo) {
      paymentMethod = "momo";
      if (!extraDataRaw) throw new Error("Thiếu extraData từ Momo");
      const decoded = decodeURIComponent(extraDataRaw);
      const extraData = JSON.parse(decoded);
      bookingId = extraData.bookingId;
      paymentId = extraData.paymentId;
      orderProductId = extraData.orderProductId;
    } else if (isZaloPay) {
      paymentMethod = "zalopay";
      bookingId = reduxBookingId;
      orderProductId = reduxOrderProductId;
      paymentId = reduxPaymentId;
    } else {
      paymentMethod = "other";
      bookingId = reduxBookingId;
      orderProductId = reduxOrderProductId;
      paymentId = reduxPaymentId;
    }
  } catch (err) {
    console.error("Failed to parse payment data:", err);
    setError("Không thể lấy thông tin vé.");
    setLoading(false);
  }

  useEffect(() => {
    if (hasHandled.current) return; // chỉ chạy 1 lần
    hasHandled.current = true;

    const runPaymentFlow = async () => {
      let isSuccess = false;

      switch (paymentMethod) {
        case "momo":
          isSuccess = resultCode === "0";
          break;
        case "zalopay":
          isSuccess = zaloStatus === "1";
          break;
        case "other":
          isSuccess = true;
          break;
        default:
          isSuccess = false;
      }

      // Nếu thất bại → cancel booking/product
      if (!isSuccess) {
        setIsCancelled(true);
        try {
          if (bookingId) await cancelBooking(bookingId);
          if (orderProductId) await cancelProduct(orderProductId);
        } catch (err) {
          console.error("Lỗi khi hủy:", err);
        } finally {
          setLoading(false);
        }
        return;
      }

      // Nếu không có bookingId → báo lỗi
      if (!bookingId) {
        setError("Không có thông tin booking.");
        setLoading(false);
        return;
      }

      // Confirm payment + fetch ticket
      try {
        if (paymentMethod === "momo") {
          await ConfirmPayment(paymentId);
        } else {
          await ConfirmPayment(reduxPaymentId);
        }

        const ticketResponse = await getBookingById(bookingId);
        setTicket(ticketResponse);

        if (orderProductId) {
          const productResponse = await getProductByOderProductId(orderProductId);
          dispatch(setProductDetail(productResponse));
        }
      } catch (err) {
        console.error("Lỗi khi tải thông tin:", err);
        setError("Không thể tải thông tin vé.");
      } finally {
        setLoading(false);
      }
    };

    runPaymentFlow();
  }, []); // chạy duy nhất 1 lần khi vào trang

  // ===== Render UI =====
  if (loading)
    return (
      <div className="text-center h-full w-full py-8 md:py-12 bg-white/5 rounded-2xl text-gray-400">
        <DNALoader className="mt-40" />
        <p className="font-semibold mt-2 text-sm md:text-base">
          Loading Ticket ! Please wait...
        </p>
      </div>
    );

  if (error) return <div className="text-red-400 p-6">{error}</div>;

  if (isCancelled) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 via-50% via-purple-950/50 to-slate-900 flex flex-col items-center justify-center text-center text-white p-10">
        <div className="w-1/2 bg-transparent p-8 flex flex-col justify-between border-1 border-white/20 shadow-2xl rounded-2xl">
          <h1 className="text-4xl font-bold text-red-500/80 mb-4">
            Ticket Cancelled
          </h1>
          <p className="text-white/70 text-lg mb-6">
            The transaction was cancelled or failed. Your booking has been cancelled.
          </p>
          <div className="flex justify-center mt-6">
            <button
              onClick={() => (window.location.href = "/")}
              className="bg-gradient-to-r from-purple-600/10 via-purple-500/80 to-purple-600/10 hover:from-purple-600/30 hover:via-purple-600 hover:to-purple-800/30 shadow-xl hover:shadow-2xl hover:shadow-purple-500/20 transform hover:scale-[1.02] transition-all duration-300 ease-out border border-purple-400/20 px-6 py-3 rounded-full text-white font-semibold w-50 flex justify-center"
            >
              Back Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!ticket) return <div className="text-gray-400 p-6">Không tìm thấy vé.</div>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 via-50% via-purple-950/50 to-slate-900 flex items-center justify-center py-10 px-4">
      <div className="flex w-full max-w-4xl rounded-2xl overflow-hidden border-2 border-white/60 shadow-2xl">
        {/* Left: Ticket */}
        <div className="w-1/2 bg-gradient-to-br from-[#1a005f] via-[#3f2b96] to-[#000c2d] p-8 flex flex-col justify-between">
          <AnimatedWrapper
            enableStars
            enableTilt={false}
            enableMagnetism={false}
            clickEffect
            enableBorderGlow={false}
            particleCount={6}
            glowColor="132, 0, 255"
          >
            <div>
              <h2 className="text-white text-2xl font-bold mb-2">🎟️Your Ticket</h2>
              <p className="text-sm text-white/70 mb-6">Enjoy your movie experience!</p>

              <div className="text-white space-y-3">
                <div>
                  <span className="text-white/60">Movie: </span>
                  <span className="font-bold">{ticket.movieNameEnglish}</span>
                </div>
                <div>
                  <span className="text-white/60">Time: </span>
                  <span className="font-bold">{ticket.showTime}</span>
                </div>
                <div>
                  <span className="text-white/60">Date: </span>
                  <span className="font-bold">
                    {new Date(ticket.showDate).toLocaleDateString("en-GB")}
                  </span>
                </div>
                <div>
                  <span className="text-white/60">Room: </span>
                  <span className="font-bold">{ticket.room}</span>
                </div>
                <div>
                  <span className="text-white/60">Seats: </span>
                  <span className="font-bold">
                    {Array.isArray(ticket.seats) ? ticket.seats.join(", ") : ticket.seats}
                  </span>
                </div>
                {productDetail && (
                  <div>
                    <span className="text-white/60">Product: </span>
                    <span className="font-bold">
                      {productDetail.map((p) => p.productName).join(", ")}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </AnimatedWrapper>
        </div>

        {/* Right: Customer Info */}
        <div className="w-1/2 bg-[#0e012a] p-8 text-white">
          <AnimatedWrapper
            enableStars
            enableTilt={false}
            enableMagnetism={false}
            clickEffect
            enableBorderGlow={false}
            particleCount={6}
            glowColor="132, 0, 255"
          >
            <h3 className="text-xl font-semibold mb-4">Customer Information</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-center justify-between">
                <span className="text-white/60">Name:</span>
                <span className="font-bold">{ticket.buyerName}</span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-white/60">Phone number:</span>
                <span className="font-bold">{ticket.buyerPhone}</span>
              </li>
            </ul>
            <div className="mt-10 border-t border-dashed border-white/30 pt-6 text-sm text-white/60">
              * Please arrive 15 minutes before showtime.
            </div>
          </AnimatedWrapper>
        </div>
      </div>
    </div>
  );
};

export default TicketDetails;
