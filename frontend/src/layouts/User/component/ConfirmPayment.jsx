import { useLocation, useNavigate } from "react-router-dom";
import { FaStar, FaRegClock, FaCalendarAlt, FaHeart } from "react-icons/fa";
import { RiMovie2AiLine } from "react-icons/ri";
import { useEffect, useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import { getPromotionByTitle, HoldingSeats } from "../../../services/API";

const ConfirmPayment = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState("");
  const { user } = useAuth();
  const [holdingSeats, setHoldingSeats] = useState({});
  const [promotion, setPromotion] = useState("");
  const [refreshTrigger, setRefreshTrigger] = useState(0);


  const [promoCode, setPromoCode] = useState('');
  const [isLoadingPromotion, setIsLoadingPromotion] = useState(false);
  const [appliedPromotion, setAppliedPromotion] = useState(null);
  const [promotionError, setPromotionError] = useState('');
  const [bookingId, setBookingId] = useState(null);
  const [finalPrice, setFinalPrice] = useState(0);

  const {
    selectedSeats = [],
    calculatedTotalPrice = 0,
    selectedRoom = "",
    selectedDate = null,
    selectedTime = "",
    movie = null,
    selectedShowtimeId = null,
    userId = null,
    seatIds = [],
  } = state || {};

  if (!movie) return <div>Không có dữ liệu phim.</div>;

  const handlePaymentMethod = (method) => {
    setPaymentMethod(method);
  };

  // Hàm xử lý khi người dùng nhập mã promotion
  const handleInputPromoCode = (event) => {
    setPromoCode(event.target.value);
    // Reset error khi user nhập lại
    if (promotionError) {
      setPromotionError('');
    }
  };

  // Hàm xử lý khi nhấn Add promotion
  const handleAddPromotion = async () => {
    if (promoCode.trim() === '') {
      alert('Vui lòng nhập mã khuyến mãi!');
      return;
    }

    setIsLoadingPromotion(true);
    setPromotionError('');

    try {
      console.log('Đang kiểm tra mã khuyến mãi:', promoCode);

      const response = await getPromotionByTitle(promoCode);
      console.log('Response từ API:', response);
      console.log('Type of promotions:', typeof response.promotions);
      console.log('Is Array:', Array.isArray(response.promotions));

      if (response && response.promotions) {
        let promotionData;

        // Xử lý cả trường hợp array và object
        if (Array.isArray(response.promotions) && response.promotions.length > 0) {
          promotionData = response.promotions[0];
        } else if (response.promotions.length > 0) {
          // Trường hợp array-like object
          promotionData = response.promotions[0];
        } else if (response.promotions.Title) {
          // Trường hợp object thông thường
          promotionData = response.promotions;
        }

        if (promotionData && promotionData.Title) {
          setAppliedPromotion(promotionData);
          setPromotion(promotionData);

          // Force re-render để gọi lại useEffect
          setRefreshTrigger(prev => prev + 1);

          console.log("Áp dụng promotion thành công:", promotionData);

          // Clear promo code input sau khi áp dụng thành công
          setPromoCode('');
          alert('Áp dụng mã khuyến mãi thành công!');
        } else {
          console.error("Promotion data không hợp lệ:", promotionData);
          setPromotionError('Dữ liệu promotion không hợp lệ');
          alert('Dữ liệu promotion không hợp lệ!');
        }
      } else {
        console.log("Không tìm thấy promotion:", response);
        setPromotionError('Mã khuyến mãi không hợp lệ');
        alert('Mã khuyến mãi không hợp lệ!');
      }
    } catch (error) {
      console.error("Lỗi khi kiểm tra promotion:", error);
      console.error("Chi tiết lỗi:", error.response?.data || error.message);
      setPromotionError('Có lỗi xảy ra khi kiểm tra mã khuyến mãi');
      alert('Có lỗi xảy ra khi kiểm tra mã khuyến mãi!');
    } finally {
      setIsLoadingPromotion(false);
    }
  };

  // Hàm để remove promotion
  const handleRemovePromotion = () => {
    setAppliedPromotion(null);
    setPromotion('');
    setPromotionError('');
    setPromoCode('');
    // Force re-render để gọi lại useEffect
    setRefreshTrigger(prev => prev + 1);
  };

  const handleConfirm = (e) => {
    e.preventDefault();
    if (!paymentMethod) {
      alert("Vui lòng chọn phương thức thanh toán!");
      return;
    }

    const promotionTitle = appliedPromotion ? appliedPromotion.Title : null;

    console.log("Navigating to /waiting with state:", {
      selectedSeats,
      calculatedTotalPrice,
      paymentMethod,
      selectedRoom,
      selectedDate,
      selectedTime,
      selectedShowtimeId,
      userId,
      seatIds,
      promotionTitle,
      finalPrice,
    });

    navigate("/waiting", {
      state: {
        selectedSeats,
        calculatedTotalPrice,
        paymentMethod,
        selectedRoom,
        selectedDate,
        selectedTime,
        selectedShowtimeId,
        userId,
        seatIds,
        promotionTitle,
        finalPrice,
        bookingId
      },
    });
  };

  const productIds = [];

  // useEffect để gọi HoldingSeats với promotion đã áp dụng
  useEffect(() => {
    console.log('=== USEEFFECT CHẠY ===');
    console.log('appliedPromotion thay đổi:', appliedPromotion);
    console.log('refreshTrigger:', refreshTrigger);

    const fetchHoldingSeats = async () => {
      try {
        const promotionCode = appliedPromotion ? appliedPromotion.Title : '';

        console.log('=== GỌI API HOLDING SEATS ===');
        console.log('Gọi HoldingSeats với params:');
        console.log('- userId:', userId);
        console.log('- selectedShowtimeId:', selectedShowtimeId);
        console.log('- seatIds:', seatIds);
        console.log('- productIds:', productIds);
        console.log('- promotionCode:', promotionCode);

        const result = await HoldingSeats(userId, selectedShowtimeId, seatIds, productIds, promotionCode);
        console.log('Kết quả từ HoldingSeats API:', result);
        setHoldingSeats(result);
        setBookingId(result.bookingId || null);
        setFinalPrice(result.totalAmount || calculatedTotalPrice);
        console.log("HoldingSeats thành công với promotion:", promotionCode);
      } catch (err) {
        console.error("Lỗi khi fetch HoldingSeats:", err);
        console.error("Chi tiết lỗi:", err.response?.data || err.message);
      }
    };

    // Gọi khi đủ dữ liệu
    if (userId && selectedShowtimeId && seatIds?.length > 0) {
      console.log('Điều kiện OK, gọi API...');
      fetchHoldingSeats();
    } else {
      console.log('Điều kiện chưa đủ để gọi API:');
      console.log('- userId:', userId);
      console.log('- selectedShowtimeId:', selectedShowtimeId);
      console.log('- seatIds:', seatIds);
    }
  }, [userId, selectedShowtimeId, seatIds, appliedPromotion, refreshTrigger]);

  console.log("==PRICE:", holdingSeats.totalAmount);
  



  return (
    <div className="min-h-screen overflow-x-hidden bg-gradient-to-br from-[#1a005f] via-[#3f2b96] to-[#000c2d] text-white p-3 sm:p-6 pt-[80px] sm:pt-[100px]">
      {/* container chinh responsive */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* left-side */}
        <div className="space-y-6">
          {/* movie info*/}
          <div className="bg-white/5 rounded-xl shadow-lg p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 h-[412px]">
              <div className="flex justify-center sm:justify-start">
                <img
                  src={movie.PosterImage}
                  alt={movie.NameOfEnglish}
                  className="w-40 h-56 sm:w-48 sm:h-72 object-cover rounded-lg flex-shrink-0"
                />
              </div>

              {/*info movie*/}
              <div className="flex flex-col justify-between flex-1">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold mb-1 text-center sm:text-left">
                    {movie.NameOfEnglish}
                  </h2>
                  <h3 className="text-md sm:text-xl font-semibod mb-4 text-center sm:text-left ">
                    {movie.NameOfVietnamese}
                  </h3>
                  <div className="flex flex-col items-start gap-2 text-xs sm:text-sm text-gray-400 mb-2">
                    <span className="flex items-center gap-1">
                      <FaRegClock className="text-green-400" /> {movie.RunningTime} min
                    </span>
                    <span className="flex items-center gap-1">
                      <FaCalendarAlt className="text-blue-300" /> {new Date(movie.FromDate).toLocaleDateString("vi-VN")}
                    </span>
                    <span className="flex items-center gap-1"><RiMovie2AiLine className="text-red-600" />{movie.Genres}</span>
                  </div>

                  <p className="text-gray-300 text-xs sm:text-sm text-center sm:text-left leading-relaxed">
                    {movie.ContentSynopsis}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* user info */}
          <div className="bg-white/5 rounded-xl shadow-lg p-4 sm:p-6">
            <h2 className="text-lg sm:text-2xl font-bold mb-4 text-center sm:text-left">
              Check your booking ticket information
            </h2>
            <div className="space-y-3 font-semibold">
              <p className="flex flex-col sm:flex-row">
                <span className="text-gray-400 text-sm sm:text-base min-w-[120px]">Full Name:</span>
                <span className="text-sm sm:text-base">{user?.fullName || 'N/A'}</span>
              </p>
              <p className="flex flex-col sm:flex-row">
                <span className="text-gray-400 text-sm sm:text-base min-w-[120px]">Email:</span>
                <span className="text-sm sm:text-base">{user?.email || 'N/A'}</span>
              </p>
              <p className="flex flex-col sm:flex-row">
                <span className="text-gray-400 text-sm sm:text-base min-w-[120px]">Phone:</span>
                <span className="text-sm sm:text-base">{user?.phoneNumber || 'N/A'}</span>
              </p>
              <p className="flex flex-col sm:flex-row">
                <span className="text-gray-400 text-sm sm:text-base min-w-[120px]">Identity Card:</span>
                <span className="text-sm sm:text-base">1112223336868</span>
              </p>
            </div>

            {/* Terms and Policy Section */}
            <div className="mt-6 pt-4 border-t border-gray-600/50">
              <div className="text-xs sm:text-sm text-gray-400 space-y-2">
                <p className="leading-relaxed">
                  By proceeding with this booking, you agree to our
                  <a href="/terms" className="text-blue-400 hover:text-blue-300 underline mx-1">
                    Terms of Service
                  </a>
                  and
                  <a href="/privacy" className="text-blue-400 hover:text-blue-300 underline ml-1">
                    Privacy Policy
                  </a>.
                </p>
                <div className="flex flex-wrap gap-4 text-xs">
                  <a href="/refund-policy" className="text-gray-500 hover:text-gray-300 transition-colors">
                    Refund Policy
                  </a>
                  <a href="/cinema-rules" className="text-gray-500 hover:text-gray-300 transition-colors">
                    Cinema Rules
                  </a>
                  <a href="/contact" className="text-gray-500 hover:text-gray-300 transition-colors">
                    Contact Support
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* right side - payment*/}
        <div className="bg-white/5 rounded-xl shadow-lg p-4 sm:p-6">
          <h2 className="text-lg sm:text-2xl font-bold mb-4 text-center sm:text-left">
            Confirm Booking Ticket
          </h2>

          {/* ticket info*/}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-6">
            <div>
              <p className="text-xs sm:text-sm text-gray-400">Room:</p>
              <p className="text-sm sm:text-base font-semibold">{selectedRoom}</p>
            </div>
            <div>
              <p className="text-xs sm:text-sm text-gray-400">Date:</p>
              <p className="text-sm sm:text-base font-semibold">{selectedDate ? new Date(selectedDate).toLocaleDateString("vi-VN") : "N/A"}</p>
            </div>
            <div>
              <p className="text-xs sm:text-sm text-gray-400">Time:</p>
              <p className="text-sm sm:text-base font-semibold">{selectedTime}</p>
            </div>
            <div>
              <p className="text-xs sm:text-sm text-gray-400">Seats:</p>
              <p className="text-sm sm:text-base font-semibold">
                {selectedSeats.length > 0 ? selectedSeats.join(", ") : "None selected"}
              </p>
            </div>
          </div>

          {/* total price*/}
          <div className="bg-[#2E3A4E]/40 mb-4 rounded-lg p-3 sm:p-4">
            <p className="text-xs sm:text-sm text-gray-400">Total price</p>
            <p className="text-xl sm:text-xl font-semibold">
              {
                finalPrice ? `${finalPrice} ` : '0 '



              }đ
            </p>
          </div>

          {/* promotion */}
          <div className="bg-[#2E3A4E]/40 p-3 sm:p-4 rounded-lg mb-3">
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <input
                type="text"
                className="flex-1 bg-[#474787]/26 text-white rounded-xl p-2 sm:p-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[#5B4CBD]"
                placeholder="Enter promotion code"
                value={promoCode}
                onChange={handleInputPromoCode}
                disabled={isLoadingPromotion || appliedPromotion}
              />
              <button
                className={`bg-[#5B4CBD] hover:bg-[#5B4CBD]/80 text-white font-bold rounded-xl p-2 sm:p-3 text-xs sm:text-sm whitespace-nowrap ${isLoadingPromotion || appliedPromotion ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                onClick={handleAddPromotion}
                disabled={isLoadingPromotion || appliedPromotion}
              >
                {isLoadingPromotion ? 'Checking...' : 'Add promotion'}
              </button>
            </div>

            {/* Hiển thị thông báo lỗi */}
            {promotionError && (
              <p className="text-red-400 text-xs mt-2">{promotionError}</p>
            )}

            {/* Hiển thị promotion đã áp dụng */}
            {appliedPromotion && (
              <div className="mt-2 p-2 bg-green-500/20 rounded-lg">
                <div className="flex justify-between items-center">
                  <div className="text-green-400 text-xs">
                    ✓ Đã áp dụng: {appliedPromotion.Title}
                    {appliedPromotion.DiscountPercent && ` (-${appliedPromotion.DiscountPercent}%)`}
                    {appliedPromotion.DiscountValue && ` (-${appliedPromotion.DiscountValue})`}
                  </div>
                  <button
                    onClick={handleRemovePromotion}
                    className="text-red-400 hover:text-red-300 text-xs ml-2"
                  >
                    ✕ Xóa
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* point */}
          <div className="bg-[#2E3A4E]/40 p-3 sm:p-4 rounded-lg mb-4">
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <input
                type="text"
                className="flex-1 bg-[#474787]/26 text-white rounded-xl p-2 sm:p-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[#5B4CBD]"
                placeholder="1,000 points = 1,000 VND"
              />
              <button className="bg-[#5B4CBD] hover:bg-[#5B4CBD]/80 text-white font-bold rounded-xl p-2 sm:p-3 text-xs sm:text-sm whitespace-nowrap">
                Use Point
              </button>
            </div>
          </div>

          {/* payment method */}
          <h3 className="text-base sm:text-lg mb-4 font-semibold">Payment Methods</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-6">
            <button
              onClick={() => handlePaymentMethod("3")}
              className={`flex flex-col items-center justify-center rounded-lg p-3 sm:p-4 h-20 sm:h-24 font-semibold transition-colors ${paymentMethod === "3" ? "bg-[#5B4CBD]" : "bg-[#474787]/26 hover:bg-[#2E3A4E]"
                } text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#5B4CBD]`}
            >
              <img
                src="https://cdn.haitrieu.com/wp-content/uploads/2022/10/Logo-VNPAY-QR-350x65.png"
                alt="VnPay logo"
                className="w-20 h-6 mb-1 "
              />
            </button>
            <button
              onClick={() => handlePaymentMethod("4")}
              className={`flex flex-col items-center justify-center rounded-lg p-3 sm:p-4 h-20 sm:h-24 font-semibold transition-colors ${paymentMethod === "4"
                ? "bg-[#5B4CBD]"
                : "bg-[#474787]/26 hover:bg-[#2E3A4E]"
                } text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#5B4CBD]`}
            >
              <img
                src="https://vectorseek.com/wp-content/uploads/2023/09/Zalopay-Logo-Vector.svg-.png"
                alt="ZaloPay logo"
                className="w-20 h-8 mb-1 "
              />
            </button>

            <button
              onClick={() => handlePaymentMethod("2")}
              className={`flex flex-col items-center justify-center rounded-lg p-3 sm:p-4 h-20 sm:h-24 font-semibold transition-colors ${paymentMethod === "2" ? "bg-[#5B4CBD]" : "bg-[#474787]/26 hover:bg-[#2E3A4E]"
                } text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#5B4CBD]`}
            >
              <img
                src="https://cdn.haitrieu.com/wp-content/uploads/2022/10/Logo-MoMo-Transparent-1024x1024.png"
                alt="Momo logo"
                className="w-12 h-10 mb-1 "
              />
            </button>
          </div>

          {/* action button */}
          <div className="space-y-3">
            <button
              type="button"
              className="appearance-none w-full py-3 pl-4 pr-10 text-lg font-semibold text-purple-100 bg-gradient-to-r from-[#36355a] to-[#4e408e] 
                 border-b-2 border-purple-500 hover:border-purple-400 focus:outline-none focus:ring-0 
                 transition duration-300 ease-in-out tracking-wide rounded-4xl"
              onClick={handleConfirm}
              disabled={!paymentMethod}
            >
              Confirm And Payment
            </button>
            <button
              type="button"
              className="bg-transparent hover:bg-[#000000bf]/30 border-2 border-purple-500/70 text-white px-4 py-2 sm:px-5 sm:py-2.5 rounded-4xl flex items-center font-semibold w-full justify-center text-base sm:text-xl transition-colors"
              onClick={() => navigate("/")}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmPayment;