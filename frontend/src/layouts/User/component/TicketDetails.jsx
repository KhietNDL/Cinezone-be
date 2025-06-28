import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { cancelBooking, ConfirmBooking, getBookingById } from "../../../services/API";

const TicketDetails = () => {
  const [searchParams] = useSearchParams();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isCancelled, setIsCancelled] = useState(false);

  const resultCode = searchParams.get("resultCode");
  const extraDataRaw = searchParams.get("extraData");

  let bookingId = null;
  try {
    if (!extraDataRaw) throw new Error("Missing extraData");
    const decoded = decodeURIComponent(extraDataRaw);
    const extraData = JSON.parse(decoded);
    bookingId = extraData.bookingId;
  } catch (err) {
    console.error("❌ Failed to parse extraData:", err);
    setError("Không thể lấy thông tin vé.");
    setLoading(false);
  }

  useEffect(() => {
    //cancel hoac thanh toan that bai
    if (resultCode !== "0") {
      setIsCancelled(true);

      const fetchCancelBooking = async () => {
        try {
          if (bookingId) {
            console.log("⛔ Gọi CancelBooking vì huỷ hoặc thất bại...");
            await cancelBooking(bookingId);
            console.log("✅ Booking đã bị huỷ.");
          }
        } catch (err) {
          console.error("❌ Lỗi khi huỷ booking:", err);
        }
        finally {
          setLoading(false);
        }
      };

      fetchCancelBooking();
      return;

    }


    if (!bookingId) return;

    const fetchTicketInfo = async () => {
      try {
        await ConfirmBooking(bookingId);
        const ticketResponse = await getBookingById(bookingId);
        setTicket(ticketResponse);
      } catch (err) {
        setError("Không thể tải thông tin vé.");
      } finally {
        setLoading(false);
      }
    };

    fetchTicketInfo();
  }, [bookingId, resultCode]);

  if (loading) return <div className="text-white p-6">Đang tải thông tin vé...</div>;
  if (error) return <div className="text-red-400 p-6">{error}</div>;

  //cancelled booking
  if (isCancelled) {
    return (
      <div className="min-h-screen bg-[#000c2d] flex flex-col items-center justify-center text-center text-white p-10">
        <h1 className="text-4xl font-bold text-red-500 mb-4">❌ Ticket Cancelled</h1>
        <p className="text-white/70 text-lg mb-6">
          Giao dịch đã bị huỷ hoặc thanh toán không thành công.
        </p>
        <a
          href="/"
          className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-full text-white font-semibold"
        >
          Quay về Trang Chủ
        </a>
      </div>
    );
  }

  // When successfully payment
  if (!ticket) return <div className="text-gray-400 p-6">Không tìm thấy vé.</div>;

  return (
    <div className="min-h-screen bg-[#000c2d] flex items-center justify-center py-10 px-4">
      <div className="flex w-full max-w-4xl rounded-2xl overflow-hidden border border-purple-500 shadow-xl">
        {/* Left */}
        <div className="w-1/2 bg-gradient-to-br from-[#1a005f] via-[#3f2b96] to-[#000c2d] p-8 flex flex-col justify-between">
          <div>
            <h2 className="text-white text-2xl font-bold mb-2">🎟️ Your Ticket</h2>
            <p className="text-sm text-white/70 mb-6">Enjoy your movie experience!</p>

            <div className="text-white space-y-3">
              <div><span className="text-white/60">Movie: </span><span className="font-semibold">{ticket.movieNameEnglish}</span></div>
              <div><span className="text-white/60">Time: </span><span className="font-semibold">{ticket.showTime}</span></div>
              <div><span className="text-white/60">Date: </span><span className="font-semibold">{new Date(ticket.showDate).toLocaleDateString("en-GB")}</span></div>
              <div><span className="text-white/60">Room: </span><span className="font-semibold">{ticket.room}</span></div>
              <div><span className="text-white/60">Seats: </span>
                <span className="font-semibold">
                  {Array.isArray(ticket.seats) ? ticket.seats.join(", ") : ticket.seats}
                </span>
              </div>
              <div><span className="text-white/60">Price: </span><span className="font-semibold">{ticket.totalAmount?.toLocaleString()} đ</span></div>
            </div>
          </div>

          <button
            onClick={() => window.print()}
            className="mt-8 bg-pink-500 hover:bg-pink-400 text-white text-sm font-semibold py-2 rounded-lg w-full"
          >
            In vé
          </button>
        </div>

        {/* Right */}
        <div className="w-1/2 bg-[#0e012a] p-8 text-white">
          <h3 className="text-xl font-semibold mb-4">Thông tin khách hàng</h3>
          <ul className="space-y-4 text-sm">
            <li className="flex items-center justify-between">
              <span className="text-white/60">Tên:</span>
              <span className="font-semibold">{ticket.buyerName}</span>
            </li>
            <li className="flex items-center justify-between">
              <span className="text-white/60">SĐT:</span>
              <span className="font-semibold">{ticket.buyerPhone}</span>
            </li>
            <li className="flex items-center justify-between">
              <span className="text-white/60">Mã đặt vé:</span>
              <span className="font-semibold truncate w-1/2 text-right">{bookingId}</span>
            </li>
          </ul>
          <div className="mt-10 border-t border-dashed border-white/30 pt-6 text-sm text-white/60">
            *Vui lòng đến trước 15 phút để nhận chỗ.
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketDetails;
