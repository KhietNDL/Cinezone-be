import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  cancelBooking,
  cancelProduct,
  ConfirmBooking,
  ConfirmPayment,
  confirmProduct,
  getBookingById,
  getProductByOderProductId
} from "../../../services/API";
import { useDispatch, useSelector } from "react-redux";
import { setProductDetail } from "../../../redux/features/bookingSlice";
import { DNALoader } from "../../../component/Loader";

const TicketDetails = () => {
  const [searchParams] = useSearchParams();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isCancelled, setIsCancelled] = useState(false);
  const dispatch = useDispatch();

  // Momo parameters
  const resultCode = searchParams.get("resultCode");
  const extraDataRaw = searchParams.get("extraData");
  
  // ZaloPay parameters
  const zaloStatus = searchParams.get("status");
  
  const { productDetail, bookingId: reduxBookingId, orderProductsId: reduxOrderProductId, paymentId: reduxPaymentId } = useSelector(
    (state) => state.booking
  );

  let bookingId = null;
  let orderProductId = null;
  let paymentId = null;
  let paymentMethod = null; // Để xác định phương thức thanh toán

  try {
    const isMomo = resultCode !== null;
    const isZaloPay = zaloStatus !== null;
    
    if (isMomo) {
      paymentMethod = 'momo';
      if (!extraDataRaw) throw new Error("Thiếu extraData từ Momo");
      const decoded = decodeURIComponent(extraDataRaw);
      const extraData = JSON.parse(decoded);
      bookingId = extraData.bookingId;
      paymentId = extraData.paymentId;
      orderProductId = extraData.orderProductId;
    } else if (isZaloPay) {
      paymentMethod = 'zalopay';
      // ZaloPay lấy thông tin từ Redux
      bookingId = reduxBookingId;
      orderProductId = reduxOrderProductId;
      paymentId = reduxPaymentId;
    } else {
      paymentMethod = 'other'; // Visa, etc.
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
    let isSuccess = false;
    
    // Xác định trạng thái thành công dựa trên phương thức thanh toán
    switch (paymentMethod) {
      case 'momo':
        isSuccess = resultCode === "0";
        break;
      case 'zalopay':
        isSuccess = zaloStatus === "1"; // ZaloPay: status=0 là thành công
        break;
      case 'other':
        isSuccess = true; // Các phương thức khác mặc định là thành công
        break;
      default:
        isSuccess = false;
    }

    // Nếu thất bại thì hủy booking
    if (!isSuccess) {
      setIsCancelled(true);
      const handleCancellation = async () => {
        try {
          if (bookingId) await cancelBooking(bookingId);
          if (orderProductId) await cancelProduct(orderProductId);
        } catch (err) {
          console.error("Lỗi khi hủy:", err);
        } finally {
          setLoading(false);
        }
      };
      handleCancellation();
      return;
    }

    if (!bookingId) {
      setError("Không có thông tin booking.");
      setLoading(false);
      return;
    }

    const fetchPayment = async () => {
      try {
        if (paymentMethod === 'momo') {
          // Thanh toán qua Momo -> confirm bằng paymentId từ extraData
          await ConfirmPayment(paymentId);
        } else {
          // Thanh toán ZaloPay hoặc khác -> confirm bằng paymentId từ Redux
          console.log("Order Product ID:", orderProductId);
          await ConfirmPayment(reduxPaymentId);
          console.log("PAYMENTID", reduxPaymentId);
        }

        // Lấy thông tin vé
        const ticketResponse = await getBookingById(bookingId);
        setTicket(ticketResponse);

        // Nếu có sản phẩm thì load thông tin
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

    fetchPayment();
  }, [bookingId, paymentId, orderProductId, resultCode, zaloStatus, paymentMethod, dispatch, reduxPaymentId]);

  if (loading)
    return <div className="text-center h-full w-full py-8 md:py-12 bg-white/5 rounded-2xl text-gray-400 ">
            <DNALoader className="mt-40" />
            <p className="font-semibold mt-2 text-sm md:text-base">
              Loading Ticket ! Please wait...
            </p>
          </div>;
  if (error) return <div className="text-red-400 p-6">{error}</div>;

  if (isCancelled) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1a005f] via-[#3f2b96] to-[#000c2d] flex flex-col items-center justify-center text-center text-white p-10">
        <h1 className="text-4xl font-bold text-red-500 mb-4">
          Ticket Cancelled
        </h1>
        <p className="text-white/70 text-lg mb-6">
          The transaction was cancelled or failed. Your booking has been
          cancelled.
        </p>
        <a
          href="/"
          className="bg-gradient-to-r from-purple-600 via-purple-500 to-pink-500 hover:from-purple-700 hover:via-purple-600 hover:to-pink-600 shadow-xl hover:shadow-2xl hover:shadow-purple-500/20 
                           transform hover:scale-[1.02] transition-all duration-300 ease-out
                           border border-purple-400/20 px-6 py-3 rounded-full text-white font-semibold"
        >
          Back Home
        </a>
      </div>
    );
  }

  if (!ticket) return <div className="text-gray-400 p-6">Không tìm thấy vé.</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a005f] via-[#3f2b96] to-[#000c2d] flex items-center justify-center py-10 px-4">
      <div className="flex w-full max-w-4xl rounded-2xl overflow-hidden border-2 border-white/60 shadow-2xl">
        <div className="w-1/2 bg-gradient-to-br from-[#1a005f] via-[#3f2b96] to-[#000c2d] p-8 flex flex-col justify-between">
          <div>
            <h2 className="text-white text-2xl font-bold mb-2">
              🎟️Your Ticket
            </h2>
            <p className="text-sm text-white/70 mb-6">
              Enjoy your movie experience!
            </p>

            <div className="text-white space-y-3">
              <div><span className="text-white/60">Movie: </span><span className="font-bold">{ticket.movieNameEnglish}</span></div>
              <div><span className="text-white/60">Time: </span><span className="font-bold">{ticket.showTime}</span></div>
              <div><span className="text-white/60">Date: </span><span className="font-bold">{new Date(ticket.showDate).toLocaleDateString("en-GB")}</span></div>
              <div><span className="text-white/60">Room: </span><span className="font-bold">{ticket.room}</span></div>
              <div><span className="text-white/60">Seats: </span><span className="font-bold">{Array.isArray(ticket.seats) ? ticket.seats.join(", ") : ticket.seats}</span></div>
              {productDetail && (
                <div><span className="text-white/60">Product: </span><span className="font-bold">{productDetail.map(p => p.productName).join(", ")}</span></div>
              )}
            </div>
          </div>
        </div>

        <div className="w-1/2 bg-[#0e012a] p-8 text-white">
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
        </div>
      </div>
    </div>
  );
};

export default TicketDetails;