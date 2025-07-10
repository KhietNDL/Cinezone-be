import { useLocation, useNavigate } from "react-router-dom";
import { FaStar, FaRegClock, FaCalendarAlt, FaHeart } from "react-icons/fa";
import { RiMovie2AiLine } from "react-icons/ri";
import { useEffect, useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import { getPromotionByTitle, HoldingSeats, cancelBooking, holdProducts } from "../../../services/API";
import { useSelector } from "react-redux";

const ConfirmPayment = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [paymentMethod, setPaymentMethod] = useState("");

  // Promotion states
  const [promoCode, setPromoCode] = useState('');
  const [isLoadingPromotion, setIsLoadingPromotion] = useState(false);
  const [appliedPromotion, setAppliedPromotion] = useState(null);
  const [promotionError, setPromotionError] = useState('');

  // Points states
  const [pointsToUse, setPointsToUse] = useState('');
  const [isUsingPoints, setIsUsingPoints] = useState(false);
  const [pointsError, setPointsError] = useState('');

  // Price states - SEPARATED SEAT AND PRODUCT PRICES
  const [seatPrice, setSeatPrice] = useState(0); // Giá ghế gốc
  const [productPrice, setProductPrice] = useState(0); // Giá product gốc
  const [discountedSeatPrice, setDiscountedSeatPrice] = useState(0); // Giá ghế sau giảm
  const [finalPrice, setFinalPrice] = useState(0); // Tổng cuối = ghế đã giảm + product gốc
  const [discountAmount, setDiscountAmount] = useState(0);
  const [discountType, setDiscountType] = useState(''); // 'promotion' or 'points'

  // Loading state for confirm button
  const [isConfirming, setIsConfirming] = useState(false);

  const {
    movie,
    selectedSeats,
    seatIds,
    selectedRoom,
    selectedDate,
    selectedTime,
    finalTotalPrice,
    selectedShowtimeId,
    product, // Product data from Redux
  } = useSelector((state) => state.booking);

  // Calculate product total for display
  const productTotal = product && Array.isArray(product)
    ? product.reduce((sum, p) => sum + (parseFloat(p.Price || 0) * parseInt(p.Quantity || 0)), 0)
    : 0;

  // Initialize prices - SEPARATE SEAT AND PRODUCT
  useEffect(() => {
    console.log("Final total price from Redux:", finalTotalPrice);
    console.log("Product total calculated:", productTotal);

    // Tách giá ghế và product
    const calculatedSeatPrice = finalTotalPrice - productTotal;
    const calculatedProductPrice = productTotal;

    setSeatPrice(calculatedSeatPrice);
    setProductPrice(calculatedProductPrice);
    setDiscountedSeatPrice(calculatedSeatPrice); // Ban đầu chưa giảm
    setFinalPrice(finalTotalPrice); // Tổng ban đầu

    console.log("💰 Price breakdown:", {
      seatPrice: calculatedSeatPrice,
      productPrice: calculatedProductPrice,
      totalPrice: finalTotalPrice
    });

  }, [finalTotalPrice, productTotal]);

  console.log(" Products from Redux:", product);
  console.log(" Seat PRICE:", seatPrice);
  console.log("SLECTED SEAT ID", seatIds)
  console.log("Product PRICE:", productPrice);
  console.log( "Final PRICE:", finalPrice);

  // Handle payment method selection
  const handlePaymentMethod = (method) => setPaymentMethod(method);
  console.log("METHOD SELECTED", paymentMethod);

  // Promotion handling - CHỈ ÁP DỤNG CHO GHẾ
  const handleInputPromoCode = (event) => {
    setPromoCode(event.target.value);
    if (promotionError) setPromotionError('');
  };

  const handleAddPromotion = async () => {
    if (promoCode.trim() === '') {
      alert('Vui lòng nhập mã khuyến mãi!');
      return;
    }

    // Nếu đang sử dụng points, hỏi người dùng
    if (isUsingPoints) {
      const confirm = window.confirm('Cancel points usage to apply promotion?');
      if (!confirm) return;
      handleRemovePoints();
    }

    setIsLoadingPromotion(true);
    setPromotionError('');

    try {
      const response = await getPromotionByTitle(promoCode);
      let promotionData = Array.isArray(response.promotions) ? response.promotions[0] : response.promotions;

      if (promotionData?.Title) {
        // *** CHỈ GIẢM GIÁ GHẾ, KHÔNG GIẢM PRODUCT ***
        const seatDiscount = seatPrice * (promotionData.DiscountValue / 100);
        const newSeatPrice = seatPrice - seatDiscount ;
        const newFinalPrice = newSeatPrice + productPrice; // Ghế đã giảm + Product gốc

        setAppliedPromotion(promotionData);
        setDiscountAmount(seatDiscount);
        setDiscountType('promotion');
        setDiscountedSeatPrice(newSeatPrice);
        setFinalPrice(newFinalPrice);
        setPromoCode('');
        alert('Áp dụng mã khuyến mãi thành công!');

        console.log("🎫 Promotion applied:", {
          originalSeatPrice: seatPrice,
          seatDiscount,
          newSeatPrice,
          productPrice,
          newFinalPrice
        });
      } else {
        setPromotionError('Mã khuyến mãi không hợp lệ');
        alert('Mã khuyến mãi không hợp lệ!');
      }
    } catch (error) {
      console.error("Lỗi khi kiểm tra promotion:", error);
      setPromotionError('Có lỗi xảy ra khi kiểm tra mã khuyến mãi');
      alert('Có lỗi xảy ra khi kiểm tra mã khuyến mãi!');
    } finally {
      setIsLoadingPromotion(false);
    }
  };

  const handleRemovePromotion = () => {
    setAppliedPromotion(null);
    setPromotionError('');
    setPromoCode('');
    setDiscountAmount(0);
    setDiscountType('');
    setDiscountedSeatPrice(seatPrice); // Reset về giá ghế gốc
    setFinalPrice(seatPrice + productPrice); // Reset về tổng gốc
  };

  // Points handling - CHỈ ÁP DỤNG CHO GHẾ
  const handlePointsChange = (event) => {
    const value = event.target.value.replace(/\D/g, '');
    setPointsToUse(value);
    if (pointsError) setPointsError('');
  };

  const handleUsePoints = () => {
    if (!pointsToUse || pointsToUse <= 0) {
      setPointsError('Vui lòng nhập số điểm hợp lệ');
      return;
    }

    const points = parseInt(pointsToUse);


    if (points > user?.scoreBalance) {
      setPointsError(`Bạn chỉ có ${scoreBalance} điểm`);
      return;
    }

    // *** CHỈ KIỂM TRA VỚI GIÁ GHẾ, KHÔNG PHẢI TỔNG ***
    if (points > seatPrice) {
      setPointsError('Số điểm không thể lớn hơn giá ghế');
      return;
    }

    if (appliedPromotion) {
      const confirm = window.confirm('Bạn đang sử dụng mã khuyến mãi. Sử dụng điểm sẽ hủy mã khuyến mãi. Tiếp tục?');
      if (!confirm) return;
      handleRemovePromotion();
    }

    // *** CHỈ TRỪ ĐIỂM TỪ GIÁ GHẾ ***
    const seatDiscount = Math.min(points, seatPrice) * 1000;
    const newSeatPrice = seatPrice - seatDiscount;
    const newFinalPrice = newSeatPrice + productPrice; // Ghế đã giảm + Product gốc

    setIsUsingPoints(true);
    setDiscountAmount(seatDiscount);
    setDiscountType('points');
    setDiscountedSeatPrice(newSeatPrice);
    setFinalPrice(newFinalPrice);
    setPointsError('');
    alert('Sử dụng điểm thành công!');

    console.log("Points applied:", {
      originalSeatPrice: seatPrice,
      pointsUsed: points,
      seatDiscount,
      newSeatPrice,
      productPrice,
      newFinalPrice
    });
  };

  const handleRemovePoints = () => {
    setIsUsingPoints(false);
    setPointsToUse('');
    setPointsError('');
    setDiscountAmount(0);
    setDiscountType('');
    setDiscountedSeatPrice(seatPrice); // Reset về giá ghế gốc
    setFinalPrice(seatPrice + productPrice); // Reset về tổng gốc
  };

  // Enhanced handleConfirm with both HoldingSeats and holdProducts
  const handleConfirm = async (e) => {
    e.preventDefault();

    if (!paymentMethod) {
      alert("Vui lòng chọn phương thức thanh toán!");
      return;
    }

    setIsConfirming(true);

    try {
      let holdingResult = null;
      let productHoldResult = null;

      // 1. HOLD SEATS - Always required
      console.log("🪑 Holding seats with data:", {
        userId: user.userId,
        selectedShowtimeId,
        seatIds,
        promotionTitle: appliedPromotion?.Title || '',
        PointsToUse: isUsingPoints ? parseInt(pointsToUse) : 0
      });

      holdingResult = await HoldingSeats(
        user.userId,
        selectedShowtimeId,
        seatIds,
        [],
        appliedPromotion?.Title || '',
        isUsingPoints ? parseInt(pointsToUse) : 0
      );


      console.log("✅ Seats held successfully:", holdingResult);

      // 2. HOLD PRODUCTS - Only if products are selected
      if (product && Array.isArray(product) && product.length > 0) {
        console.log("🛍️ Holding products with data:", product);

        // Prepare products for API call
        const productsForAPI = product.map(p => ({
          ProductId: p.ProductId.toString(),
          Quantity: parseInt(p.Quantity || 0)
        }));

        const productHoldPayload = {
          MemberId: user.userId.toString(),
          products: productsForAPI,
          Notes: `Product hold for booking: ${holdingResult.bookingId || 'Unknown'} - Movie: ${movie?.NameOfEnglish || 'Unknown Movie'}`
        };

        console.log("🔄 Calling holdProducts API with payload:", productHoldPayload);

        productHoldResult = await holdProducts(
          productHoldPayload.MemberId,
          productHoldPayload.products,
          productHoldPayload.Notes
        );

        console.log("✅ Products held successfully:", productHoldResult);
      } else {
        console.log("ℹ️ No products to hold");
      }

      // 3. Navigate to waiting page with all data
      const waitingData = {
        // Seat data
        selectedSeats,
        finalTotalPrice, // Keep original for reference
        paymentMethod,
        selectedRoom,
        selectedDate,
        selectedTime,
        selectedShowtimeId,
        userId: user.userId,
        seatIds,
        movie,

        // *** UPDATED PRICE DATA ***
        discountType,
        promotionTitle: appliedPromotion?.Title || null,
        promotionData: appliedPromotion,
        pointsUsed: isUsingPoints ? parseInt(pointsToUse) : 0,
        discountAmount, // Chỉ là discount của ghế
        seatPrice, // Giá ghế gốc
        discountedSeatPrice, // Giá ghế sau giảm
        productPrice, // Giá product gốc
        finalPrice, // Tổng cuối = ghế đã giảm + product gốc

        // Hold results
        bookingId: holdingResult.bookingId,
        holdingSeats: holdingResult,

        // Product data
        products: product || [],
        OrderProductId: productHoldResult?.OrderProductId || null,
        productHoldResult: productHoldResult,
      };

      console.log("Navigating to waiting page with data:", waitingData);

      navigate("/waiting", {
        state: waitingData
      });

    } catch (error) {
      console.error("❌ Error during confirmation process:", error);

      // Show specific error message based on which step failed
      if (error.message && error.message.includes('product')) {
        alert("Có lỗi xảy ra khi giữ sản phẩm. Vui lòng thử lại!");
      } else {
        alert("Có lỗi xảy ra khi đặt chỗ. Vui lòng thử lại!");
      }
    } finally {
      setIsConfirming(false);
    }
  };

  useEffect(() => {
    console.log("==CURRENT FINAL PRICE:", finalPrice);
    console.log("==SEAT PRICE (discounted):", discountedSeatPrice);
    console.log("==PRODUCT PRICE (original):", productPrice);
  }, [finalPrice, discountedSeatPrice, productPrice]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a005f] via-[#3f2b96] to-[#000c2d] text-white">
      <div className="max-w-7xl mx-auto py-1 md:py-14 lg:py-18 px-4 sm:px-10 mt-0 pb-8">
        <div className="space-y-6 mt-10">
          {/* Grid 2 cột với chiều cao bằng nhau */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 md:gap-6 lg:gap-8">
            {/* Div trái chứa thông tin phim và user */}
            <div className="xl:col-span-5 order-1 xl:order-none space-y-6">
              {/* Movie Info Card */}
              <div className="relative bg-white/5 backdrop-blur-md rounded-3xl p-4 md:p-6 border border-white/10 shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-pink-500/5 rounded-3xl"></div>
                
                <div className="relative z-10">
                  <h2 className="text-xl md:text-2xl font-bold mb-6 bg-gradient-to-r from-white via-purple-100 to-pink-100 bg-clip-text text-transparent">
                    Movie Information
                  </h2>
                  
                  <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                    <div className="flex justify-center sm:justify-start">
                      <img
                        src={movie?.PosterImage}
                        alt={movie?.NameOfEnglish}
                        className="w-32 h-48 sm:w-40 sm:h-60 object-cover rounded-2xl shadow-xl border border-white/10"
                      />
                    </div>

                    <div className="flex flex-col justify-between flex-1">
                      <div>
                        <h3 className="text-lg sm:text-xl font-bold mb-2 text-center sm:text-left">
                          {movie?.NameOfEnglish}
                        </h3>
                        <h4 className="text-sm sm:text-base font-medium mb-4 text-center sm:text-left text-gray-300">
                          ({movie?.NameOfVietnamese})
                        </h4>
                        
                        <div className="space-y-3">
                          <div className="flex items-center justify-between p-3 bg-white/5 rounded-2xl border border-white/10">
                            <div className="flex items-center gap-3">
                              <FaRegClock className="text-purple-400 text-sm" />
                              <span className="text-gray-300 text-sm">Runtime</span>
                            </div>
                            <span className="text-white font-semibold text-sm">{movie?.RunningTime} min</span>
                          </div>
                          
                          <div className="flex items-center justify-between p-3 bg-white/5 rounded-2xl border border-white/10">
                            <div className="flex items-center gap-3">
                              <FaCalendarAlt className="text-purple-400 text-sm" />
                              <span className="text-gray-300 text-sm">Release</span>
                            </div>
                            <span className="text-white font-semibold text-xs">{new Date(movie?.FromDate).toLocaleDateString("vi-VN")}</span>
                          </div>
                          
                          <div className="flex items-center justify-between p-3 bg-white/5 rounded-2xl border border-white/10">
                            <div className="flex items-center gap-3">
                              <RiMovie2AiLine className="text-purple-400 text-sm" />
                              <span className="text-gray-300 text-sm">Genre</span>
                            </div>
                            <span className="text-white font-semibold text-xs text-right max-w-xs truncate">{movie?.Genres}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {movie?.ContentSynopsis && (
                    <div className="mt-4 p-3  rounded-2xl">
                      <p className="text-gray-300 text-xs leading-relaxed line-clamp-3">
                        {movie?.ContentSynopsis}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* User Info Card */}
              <div className="relative bg-white/5 backdrop-blur-md rounded-3xl p-4 md:p-6 border border-white/10 shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-pink-500/5 rounded-3xl"></div>
                
                <div className="relative z-10">
                  <h2 className="text-xl md:text-2xl font-bold mb-6 bg-gradient-to-r from-white via-purple-100 to-pink-100 bg-clip-text text-transparent">
                    Customer Information
                  </h2>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 rounded-2xl ">
                      <span className="text-gray-300 font-medium text-sm">Full Name</span>
                      <span className="text-white font-semibold text-sm">{user?.fullName || 'N/A'}</span>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 rounded-2xl">
                      <span className="text-gray-300 font-medium text-sm">Email</span>
                      <span className="text-white font-semibold text-sm truncate max-w-xs">{user?.email || 'N/A'}</span>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 rounded-2xl ">
                      <span className="text-gray-300 font-medium text-sm">Phone</span>
                      <span className="text-white font-semibold text-sm">{user?.phoneNumber || 'N/A'}</span>
                    </div>
                    
                    <div className="flex items-center justify-between p-3  rounded-2xl ">
                      <span className="text-gray-300 font-medium text-sm">Identity Card</span>
                      <span className="text-white font-semibold text-sm">{user?.cccd}</span>
                    </div>
                    
                    <div className="flex items-center justify-between p-3  rounded-2xl ">
                      <span className="text-gray-300 font-medium text-sm">Available Points</span>
                      <span className="text-yellow-400 font-bold text-sm">{user?.scoreBalance || 0} points</span>
                    </div>
                  </div>

                  {/* Terms and Policy Section */}
                  <div className="mt-6 pt-4 border-t border-white/20">
                    <div className="text-xs text-gray-400 space-y-2">
                      <p className="leading-relaxed">
                        By proceeding with this booking, you agree to our
                        <a href="/terms" className="text-purple-400 hover:text-purple-300 underline mx-1">
                          Terms of Service
                        </a>
                        and
                        <a href="/privacy" className="text-purple-400 hover:text-purple-300 underline ml-1">
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
            </div>

            {/* Div phải chứa booking confirmation và payment */}
            <div className="xl:col-span-7 order-2 xl:order-none">
              <div className="relative bg-white/5 backdrop-blur-md rounded-3xl p-4 md:p-6 lg:p-8 border border-white/10 shadow-2xl h-full">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-pink-500/5 rounded-3xl"></div>
                
                <div className="relative z-10 h-full flex flex-col">
                 
                  {/* Booking Details */}
                  <div className="mb-6">
                    <h3 className="text-lg md:text-xl font-bold text-white mb-4">Booking Details</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                        <p className="text-gray-300 text-sm mb-1">Room</p>
                        <p className="text-white font-semibold">{selectedRoom}</p>
                      </div>
                      <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                        <p className="text-gray-300 text-sm mb-1">Date</p>
                        <p className="text-white font-semibold">{selectedDate ? new Date(selectedDate).toLocaleDateString("vi-VN").replace(/\//g, "-") : "N/A"}</p>
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

                  {/* Price Breakdown */}
                  <div className="mb-6">
                    <h3 className="text-lg md:text-xl font-bold text-white mb-4">Price Breakdown</h3>
                    <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                      <div className="space-y-3">
                        {/* Seat Price */}
                        <div className="flex justify-between items-center">
                          <span className="text-gray-300">Seats ({selectedSeats.join(", ")})</span>
                          <div className="text-right">
                            {discountAmount > 0 ? (
                              <>
                                <span className="text-gray-400 line-through text-sm">{formatPrice(seatPrice)}</span>
                                <br />
                                <span className="text-white font-semibold">{formatPrice(discountedSeatPrice)}</span>
                              </>
                            ) : (
                              <span className="text-white font-semibold">{formatPrice(seatPrice)}</span>
                            )}
                          </div>
                        </div>

                        {/* Product Price */}
                        {product && Array.isArray(product) && product.length > 0 && (
                          <>
                           
                            <div className="flex justify-between items-center text-gray-300">
                               {product.map((item, index) => (
                                <div key={index} className="flex justify-between">
                                  <span>{item.ProductName} x{item.Quantity}</span>
                                  
                                </div>
                              ))}
                              <span className="text-white font-semibold">{formatPrice(productPrice)}</span>
                            </div>
                          </>
                        )}

                        {/* Discount Display */}
                        {discountAmount > 0 && (
                          <div className="flex justify-between items-center text-green-400">
                            <span>Seat Discount ({discountType})</span>
                            <span>-{formatPrice(discountAmount)}</span>
                          </div>
                        )}

                        {/* Final Total */}
                        <div className="flex justify-between items-center text-lg font-bold border-t border-white/20 pt-3 mt-3">
                          <span className="text-white">Total Amount</span>
                          <span className="text-purple-300">{formatPrice(finalPrice)}</span>
                        </div>
                      </div>

                      {/* Display active discount */}
                      {/* {appliedPromotion && (
                        <p className="text-xs text-green-400 mt-3">
                          ✓ Applied promotion: {appliedPromotion.Title}
                          {appliedPromotion.DiscountValue && ` (-${appliedPromotion.DiscountValue}% on seats)`}
                        </p>
                      )}
                      {isUsingPoints && (
                        <p className="text-xs text-yellow-400 mt-2">
                          ✓ Using {parseInt(pointsToUse).toLocaleString()} points on seats
                        </p>
                      )} */}
                    </div>
                  </div>

                  {/* Promotion Section */}
                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-white mb-4">Promotion Code</h3>
                    <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                      <div className="flex flex-col sm:flex-row gap-3">
                        <input
                          type="text"
                          className="flex-1 bg-white/10 text-white rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 border border-white/20"
                          placeholder="Enter promotion code (seats only)"
                          value={promoCode}
                          onChange={handleInputPromoCode}
                          disabled={isLoadingPromotion || appliedPromotion || isUsingPoints}
                        />
                        <button
                          className={`px-6 py-3 bg-gradient-to-r  via-purple-500  hover:from-purple-700 hover:via-purple-600  text-white font-semibold rounded-xl text-sm transition-all duration-300 whitespace-nowrap ${isLoadingPromotion || appliedPromotion || isUsingPoints ? 'opacity-50 cursor-not-allowed' : ''}`}
                          onClick={handleAddPromotion}
                          disabled={isLoadingPromotion || appliedPromotion || isUsingPoints}
                        >
                          {isLoadingPromotion ? 'Checking...' : 'Apply'}
                        </button>
                      </div>

                      {/* Promotion error */}
                      {promotionError && (
                        <p className="text-red-400 text-xs mt-3">{promotionError}</p>
                      )}

                      {/* Promotion applied notification */}
                      {appliedPromotion && (
                        <div className="mt-3 p-3 bg-green-500/20 rounded-lg border border-green-400/30">
                          <div className="flex justify-between items-center">
                            <div className="text-green-400 text-sm">
                              ✓ Promotion applied: {appliedPromotion.Title}
                            </div>
                            <button
                              onClick={handleRemovePromotion}
                              className="text-red-400 hover:text-red-300 text-xs ml-2"
                            >
                              ✕ Remove
                            </button>
                          </div>
                        </div>
                      )}

                      {isUsingPoints && (
                        <div className="mt-3 text-xs text-gray-400">
                          Cannot use both discounts at the same time.
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Points Section */}
                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-white mb-4">Use Points</h3>
                    <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                      <div className="flex flex-col sm:flex-row gap-3">
                        <input
                          type="text"
                          className="flex-1 bg-white/10 text-white rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 border border-white/20"
                          placeholder="Enter points to use on seats (1 point = 1,000 VND)"
                          value={pointsToUse}
                          onChange={handlePointsChange}
                          disabled={isUsingPoints || appliedPromotion}
                        />
                        <button
                          className={`px-6 py-3 bg-gradient-to-r  via-purple-500  hover:from-purple-700 hover:via-purple-600  text-white font-semibold rounded-xl text-sm transition-all duration-300 whitespace-nowrap ${isUsingPoints || appliedPromotion ? 'opacity-50 cursor-not-allowed' : ''}`}
                          onClick={handleUsePoints}
                          disabled={isUsingPoints || appliedPromotion}
                        >
                          Use Points
                        </button>
                      </div>

                      {/* Points error */}
                      {pointsError && (
                        <p className="text-red-400 text-xs mt-3">{pointsError}</p>
                      )}

                      {/* Points applied notification */}
                      {isUsingPoints && (
                        <div className="mt-3 p-3 bg-yellow-500/20 rounded-lg border border-yellow-400/30">
                          <div className="flex justify-between items-center">
                            <div className="text-yellow-400 text-sm">
                              ✓ Using {parseInt(pointsToUse).toLocaleString()} points on seats
                            </div>
                            <button
                              onClick={handleRemovePoints}
                              className="text-red-400 hover:text-red-300 text-xs ml-2"
                            >
                              ✕ Remove
                            </button>
                          </div>
                        </div>
                      )}

                      {appliedPromotion && (
                        <div className="mt-3 text-xs text-gray-400">
                          Cannot use both discounts at the same time.
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Payment Methods Section */}
                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-white mb-4">Payment Methods</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <button
                        onClick={() => handlePaymentMethod("3")}
                        className={`flex flex-col items-center justify-center rounded-2xl p-4 h-20 font-semibold transition-all duration-300 border-2 ${
                          paymentMethod === "3" 
                            ? "bg-gray/20 shadow-lg" 
                            : "bg-white hover:bg-white/10 border-white/20"
                        } focus:outline-none focus:ring-4 focus:ring-purple-500`}
                      >
                        <img
                          src="https://cdn.haitrieu.com/wp-content/uploads/2022/10/Logo-VNPAY-QR-350x65.png"
                          alt="VnPay logo"
                          className="w-16 h-3 mb-1"
                        />
                        
                      </button>
                      
                      <button
                        onClick={() => handlePaymentMethod("4")}
                        className={`flex flex-col items-center justify-center rounded-2xl p-4 h-20 font-semibold transition-all duration-300 border-2 ${
                          paymentMethod === "4" 
                            ? "bg-gray/20 shadow-lg" 
                            : "bg-white hover:bg-white/10 border-white/20"
                        } focus:outline-none focus:ring-4 focus:ring-purple-500`}
                      >
                        <img
                          src="https://vectorseek.com/wp-content/uploads/2023/09/Zalopay-Logo-Vector.svg-.png"
                          alt="ZaloPay logo"
                          className="w-16 h-5 mb-1"
                        />
                        
                      </button>

                      <button
                        onClick={() => handlePaymentMethod("2")}
                        className={`flex flex-col items-center justify-center rounded-2xl p-4 h-20 font-semibold transition-all duration-300 border-2 ${
                          paymentMethod === "2" 
                            ? "bg-gray/20 shadow-lg" 
                            : "bg-white hover:bg-white/10 border-white/20"
                        } focus:outline-none focus:ring-4 focus:ring-purple-500`}
                      >
                        <img
                          src="https://cdn.haitrieu.com/wp-content/uploads/2022/10/Logo-MoMo-Transparent-1024x1024.png"
                          alt="Momo logo"
                          className="w-10 h-8 mb-1"
                        />
                        
                      </button>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-auto space-y-4">
                    <button
                      type="button"
                      className={`w-full py-4 bg-gradient-to-r from-purple-600 via-purple-500 to-pink-500 hover:from-purple-700 hover:via-purple-600 hover:to-pink-600 shadow-xl hover:shadow-2xl hover:shadow-purple-500/20 transform hover:scale-[1.02] transition-all duration-300 ease-out border border-purple-400/20 text-white font-semibold rounded-2xl text-lg ${(!paymentMethod || isConfirming) ? 'opacity-50 cursor-not-allowed' : ''}`}
                      onClick={handleConfirm}
                      disabled={!paymentMethod || isConfirming}
                    >
                      {isConfirming ? 'Processing...' : 'Confirm And Payment'}
                    </button>
                    
                    <button
                      type="button"
                      className="w-full py-4 bg-transparent hover:bg-white/10 border-2 border-purple-500/70 hover:border-purple-400 text-white font-semibold rounded-2xl text-lg transition-all duration-300"
                      onClick={() => navigate("/")}
                      disabled={isConfirming}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmPayment;