const BookingDetailsCard = ({ selectedRoom, selectedDate, selectedTime, selectedSeats }) => {
  return (
    <div className="mb-6">
      <h3 className="text-lg md:text-xl font-bold text-white mb-4">Booking Details</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
          <p className="text-gray-300 text-sm mb-1">Room</p>
          <p className="text-white font-semibold">{selectedRoom}</p>
        </div>
        <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
          <p className="text-gray-300 text-sm mb-1">Date</p>
          <p className="text-white font-semibold">
            {selectedDate ? new Date(selectedDate).toLocaleDateString("vi-VN").replace(/\//g, "-") : "N/A"}
          </p>
        </div>
        <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
          <p className="text-gray-300 text-sm mb-1">Time</p>
          <p className="text-white font-semibold">{selectedTime}</p>
        </div>
        <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
          <p className="text-gray-300 text-sm mb-1">Seats</p>
          <p className="text-white font-semibold">
            {selectedSeats.length > 0 ? selectedSeats.join(", ") : "None selected"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default BookingDetailsCard;