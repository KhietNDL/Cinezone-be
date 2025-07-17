import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { cancelBooking, cancelProduct, ConfirmBooking, confirmProduct, getBookingById, getProductByOderProductId } from "../../../services/API";
import { useDispatch, useSelector} from "react-redux"
import {  setProductDetail } from "../../../redux/features/bookingSlice";

const TicketDetails = () => {
  const [searchParams] = useSearchParams();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isCancelled, setIsCancelled] = useState(false);
  const dispatch = useDispatch();

  const resultCode = searchParams.get("resultCode");
  const extraDataRaw = searchParams.get("extraData");
  const { productDetail } = useSelector((state) => state.booking);

  let bookingId = null;
  let orderProductId = null;
  
  try {
    if (!extraDataRaw) throw new Error("Missing extraData");
    const decoded = decodeURIComponent(extraDataRaw);
    const extraData = JSON.parse(decoded);
    bookingId = extraData.bookingId;
    orderProductId = extraData.orderProductId;
  } catch (err) {
    console.error("❌ Failed to parse extraData:", err);
    setError("Không thể lấy thông tin vé.");
    setLoading(false);
  }

  useEffect(() => {
    // Nếu thanh toán thất bại hoặc bị hủy
    if (resultCode !== "0") {
      setIsCancelled(true);

      const handleCancellation = async () => {
        try {
          // Hủy booking nếu có
          if (bookingId) {
            console.log("Đang hủy booking...");
            await cancelBooking(bookingId);
            console.log("Booking đã bị hủy.");
          }

          // Hủy product nếu có
          if (orderProductId) {
            console.log("Đang hủy product...");
            await cancelProduct(orderProductId);
            console.log("Product đã bị hủy.");
          }
        } catch (err) {
          console.error("Lỗi khi hủy:", err);
        } finally {
          setLoading(false);
        }
      };

      handleCancellation();
      return;
    }

    // Nếu thanh toán thành công
    if (!bookingId) {
      setError("Không có thông tin booking.");
      setLoading(false);
      return;
    }

    const fetchSuccessfulPayment = async () => {
      try {
        // Xác nhận và lấy thông tin booking
        await ConfirmBooking(bookingId);
        const ticketResponse = await getBookingById(bookingId);
        setTicket(ticketResponse);
        console.log("Ticket details fetched successfully:", ticketResponse);
        console.log("ORDER PRODUCT ID", orderProductId)

        // Xác nhận và lấy thông tin product nếu có
        if (orderProductId) {
          
          // await confirmProduct(orderProductId);
          const productResponse = await getProductByOderProductId(orderProductId);
          dispatch(setProductDetail(productResponse));
          console.log("Product details fetched successfully:", productDetail);
        }
      } catch (err) {
        console.error("Lỗi khi tải thông tin:", err);
        setError("Không thể tải thông tin vé.");
      } finally {
        setLoading(false);
      }
    };

    fetchSuccessfulPayment();
  }, [bookingId, orderProductId, resultCode, dispatch]);

  if (loading) return <div className="text-white p-6">Đang tải thông tin vé...</div>;
  if (error) return <div className="text-red-400 p-6">{error}</div>;

  // Nếu thanh toán bị hủy
  if (isCancelled) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1a005f] via-[#3f2b96] to-[#000c2d] flex flex-col items-center justify-center text-center text-white p-10">
        <h1 className="text-4xl font-bold text-red-500 mb-4">Ticket Cancelled</h1>
        <p className="text-white/70 text-lg mb-6">
          The transaction was cancelled or failed. Your booking has been cancelled.
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

  // Nếu thanh toán thành công nhưng không có thông tin vé
  if (!ticket) return <div className="text-gray-400 p-6">Không tìm thấy vé.</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a005f] via-[#3f2b96] to-[#000c2d] flex items-center justify-center py-10 px-4">
      <div className="flex w-full max-w-4xl rounded-2xl overflow-hidden border-2 border-white/60 shadow-2xl">
        {/* Left Side - Ticket Info */}
        <div className="w-1/2 bg-gradient-to-br from-[#1a005f] via-[#3f2b96] to-[#000c2d] p-8 flex flex-col justify-between">
          <div>
            <h2 className="text-white text-2xl font-bold mb-2">🎟️Your Ticket</h2>
            <p className="text-sm text-white/70 mb-6">Enjoy your movie experience!</p>

            <div className="text-white space-y-3">
              <div><span className="text-white/60">Movie: </span><span className="font-bold">{ticket.movieNameEnglish}</span></div>
              <div><span className="text-white/60">Time: </span><span className="font-bold">{ticket.showTime}</span></div>
              <div><span className="text-white/60">Date: </span><span className="font-bold">{new Date(ticket.showDate).toLocaleDateString("en-GB")}</span></div>
              <div><span className="text-white/60">Room: </span><span className="font-bold">{ticket.room}</span></div>
              <div><span className="text-white/60">Seats: </span>
                <span className="font-bold">
                  {Array.isArray(ticket.seats) ? ticket.seats.join(", ") : ticket.seats}
                </span>
              </div>
              {/* <div><span className="text-white/60">Price: </span><span className="font-bold">{ticket.totalAmount?.toLocaleString()} đ</span></div> */}
              
              {/* Hiển thị thông tin product nếu có */}
              {productDetail && (
                <div><span className="text-white/60">Product: </span><span className="font-bold"> {productDetail.map(p => p.productName).join(", ")}</span></div>
              )}
            </div>
          </div>

         
        </div>

        {/* Right Side - Customer Info */}
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