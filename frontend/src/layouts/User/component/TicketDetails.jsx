import { useLocation, useNavigate } from "react-router-dom";
import { Download, Share2, QrCode, MapPin, Calendar, Clock, Users, CreditCard, CheckCircle } from "lucide-react";

const TicketDetails = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  // Lấy thông tin từ state hoặc sử dụng giá trị mặc định
  const {
    movieTitle = "Unknown Movie",
    screen = "Screen 1",
    showtimeDate = "2024-06-12",
    showtimeTime = "14:00",
    timeRange = "14:00 - 16:30",
    room = "Room A",
    seats = ["A5", "A6"],
    pricePerTicket = 120000,
    numberOfTickets = 2,
    discount = 0,
    ticketId = "TK" + Date.now(),
    cardHolder = "John Doe",
    email = "john@example.com",
    identity = "123456789",
    phone = "0123456789",
    description = "An amazing movie experience",
    selectedSeats = ["A5", "A6"],
    cinema = "CGV Crescent Mall",
    date = "2024-06-12",
    time = "14:00",
    total = 240000,
    comboPrice = 0
  } = state || {};

  const handleDownloadTicket = () => {
    alert("Downloading ticket...");
  };

  const handleShareTicket = () => {
    if (navigator.share) {
      navigator.share({
        title: `Movie Ticket - ${movieTitle}`,
        text: `I'm watching ${movieTitle} at ${cinema} on ${date} at ${time}`,
      });
    } else {
      navigator.clipboard.writeText(`Movie: ${movieTitle}\nCinema: ${cinema}\nDate: ${date}\nTime: ${time}\nSeats: ${selectedSeats.join(", ")}`);
      alert("Ticket details copied to clipboard!");
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a005f] via-[#3f2b96] to-[#000c2d] py-8 px-4">
      <div className="max-w-4xl mx-auto">
        
       

       

        {/* Main Ticket Card */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border mt-[70px]">
          
          {/* Ticket Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 text-center">
            <div className="flex items-center justify-center mb-3">
              <QrCode className="w-6 h-6 mr-2" />
              <h1 className="text-xl font-bold">ELECTRONIC TICKET</h1>
            </div>
            <p className="text-indigo-100">Booking ID: {ticketId}</p>
          </div>

          {/* Movie Title */}
          <div className="text-center py-6 border-b">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">{movieTitle}</h2>
            <p className="text-gray-600">{description}</p>
          </div>

          {/* Ticket Details */}
          <div className="p-6">
            <div className="grid md:grid-cols-2 gap-8">
              
              {/* Left Column - Show Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Show Information</h3>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-indigo-600 mt-0.5" />
                    <div>
                      <p className="font-semibold text-gray-800">Cinema</p>
                      <p className="text-gray-600">{cinema}</p>
                      <p className="text-sm text-gray-500">{screen} • {room}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-indigo-600 mt-0.5" />
                    <div>
                      <p className="font-semibold text-gray-800">Date</p>
                      <p className="text-gray-600">{formatDate(date)}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-indigo-600 mt-0.5" />
                    <div>
                      <p className="font-semibold text-gray-800">Show Time</p>
                      <p className="text-gray-600">{timeRange || time}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Users className="w-5 h-5 text-indigo-600 mt-0.5" />
                    <div>
                      <p className="font-semibold text-gray-800">Seats</p>
                      <p className="text-gray-600">{selectedSeats.join(", ")}</p>
                      <p className="text-sm text-gray-500">{numberOfTickets} ticket(s)</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Customer & Payment */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Booking Details</h3>
                
                {/* Customer Info */}
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-700 mb-3">Customer Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Name:</span>
                      <span className="font-medium">{cardHolder}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Email:</span>
                      <span className="font-medium">{email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Phone:</span>
                      <span className="font-medium">{phone}</span>
                    </div>
                    {identity && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">ID Card:</span>
                        <span className="font-medium">{identity}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Payment Summary */}
                <div>
                  <h4 className="font-semibold text-gray-700 mb-3">Payment Summary</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Tickets ({numberOfTickets})</span>
                      <span>{(pricePerTicket * numberOfTickets).toLocaleString("vi-VN")}₫</span>
                    </div>
                    {comboPrice > 0 && (
                      <div className="flex justify-between">
                        <span>Combo</span>
                        <span>{comboPrice.toLocaleString("vi-VN")}₫</span>
                      </div>
                    )}
                    {discount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Discount</span>
                        <span>-{discount.toLocaleString("vi-VN")}₫</span>
                      </div>
                    )}
                    <div className="border-t pt-2 mt-3">
                      <div className="flex justify-between font-semibold text-base">
                        <span>Total Paid</span>
                        <span className="text-indigo-600">{total.toLocaleString("vi-VN")}₫</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* QR Code Section */}
          <div className="border-t bg-gray-50 p-6 text-center">
            <div className="inline-block bg-white p-4 rounded-lg shadow-sm border">
              <div className="w-40 h-40 bg-gray-100 flex items-center justify-center rounded-lg">
                <QrCode className="w-24 h-24 text-gray-400" />
              </div>
            </div>
            <p className="text-gray-600 mt-3 text-sm">
              Present this QR code at the cinema entrance
            </p>
          </div>

          {/* Important Information */}
          <div className="bg-amber-50 border-t border-amber-200 p-4">
            <h4 className="font-semibold text-amber-800 mb-2">Important Information:</h4>
            <ul className="text-sm text-amber-700 space-y-1">
              <li>• Please arrive at least 15 minutes before showtime</li>
              <li>• Bring a valid photo ID for verification</li>
              <li>• This ticket is non-refundable and non-transferable</li>
              <li>• Outside food and beverages are not permitted</li>
            </ul>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="flex justify-center gap-4 mt-8">
          <button
            onClick={() => navigate("/")}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition"
          >
            Book Another Movie
          </button>
          <button
            onClick={() => navigate("/bookings")}
            className="px-6 py-3 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg font-medium transition"
          >
            View All Bookings
          </button>
        </div>
      </div>
    </div>
  );
};

export default TicketDetails;