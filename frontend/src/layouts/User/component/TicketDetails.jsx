import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

const TicketDetails = () => {
  const [searchParams] = useSearchParams();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  let bookingId = null;

  try {
    const extraDataRaw = searchParams.get("extraData");
    const decoded = decodeURIComponent(extraDataRaw);
    const extraData = JSON.parse(decoded);
    bookingId = extraData.bookingId;
    console.log("Booking ID:", bookingId);
  } catch (err) {
    console.error("Lỗi khi giải mã extraData:", err);
    setError("Không thể đọc thông tin vé từ extraData");
    setLoading(false);
  }

  useEffect(() => {
    if (!bookingId) return;

    const fetchTicket = async () => {
      try {
        const res = await fetch(`http://cinezone.info:4458/api/bookings/${bookingId}`);
        const data = await res.json();
        setTicket(data);
      } catch (err) {
        setError("Lỗi khi lấy thông tin vé.");
      } finally {
        setLoading(false);
      }
    };

    fetchTicket();
  }, [bookingId]);

  if (loading) return <div className="text-white p-6">Đang tải vé...</div>;
  if (error) return <div className="text-red-400 p-6">{error}</div>;
  if (!ticket) return <div className="text-gray-400 p-6">Không tìm thấy vé.</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a005f] via-[#3f2b96] to-[#000c2d] text-white p-6 pt-[80px]">
      <div className="max-w-2xl mx-auto bg-white/5 rounded-xl shadow-lg p-6 space-y-4">
        <h1 className="text-2xl font-bold text-center">🎟️ Vé của bạn</h1>

        <div className="grid grid-cols-2 gap-4 text-sm sm:text-base">
          <div><strong>Tên phim:</strong> {ticket.movieName}</div>
          <div><strong>Ngày chiếu:</strong> {new Date(ticket.showDate).toLocaleDateString("vi-VN")}</div>
          <div><strong>Giờ chiếu:</strong> {ticket.showTime}</div>
          <div><strong>Phòng:</strong> {ticket.roomName}</div>
          <div className="col-span-2"><strong>Ghế:</strong> {ticket.seats?.join(", ")}</div>
          <div><strong>Giá:</strong> {ticket.totalPrice?.toLocaleString()} đ</div>
          <div><strong>Trạng thái:</strong> 
            <span className={`ml-2 font-semibold ${ticket.status === "PAID" ? "text-green-400" : "text-yellow-400"}`}>
              {ticket.status}
            </span>
          </div>
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={() => window.print()}
            className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-lg"
          >
            In vé
          </button>
        </div>
      </div>
    </div>
  );
};

export default TicketDetails;
