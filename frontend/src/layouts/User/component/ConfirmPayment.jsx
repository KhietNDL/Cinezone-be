import { Await, useLocation, useNavigate } from "react-router-dom";
import { FaStar, FaRegClock, FaCalendarAlt, FaHeart } from "react-icons/fa";
import { RiMovie2AiLine } from "react-icons/ri";
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import { getPromotionByTitle, HoldingSeats, cancelBooking, holdProducts, getMembership, createStripePayment } from "../../../services/API";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import StripeCheckoutForm from "./StripeCheckoutForm";
import { setBookingId, setOrderProductsId } from "../../../redux/features/bookingSlice";
import MembershipProgress from "../bookingComponent/MembershipProgress";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;


const ConfirmPayment = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [paymentMethod, setPaymentMethod] = useState("");
  const [stripeCardType, setStripeCardType] = useState("VISA");
  const [stripeClientSecret, setStripeClientSecret] = useState(null);
  const [stripePaymentId, setStripePaymentId] = useState(null);
  const [stripeLoading, setStripeLoading] = useState(false);
  const [stripeError, setStripeError] = useState("");

  //MEMbership 
  const [userDiscount,setUserDiscount]=useState(0);

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
  const [discountType, setDiscountType] = useState('');
  const [memberPoints, setMemberPoints] = useState(0); // 'promotion' or 'points'

  // Loading state for confirm button
  const [isConfirming, setIsConfirming] = useState(false);
  const dispatch = useDispatch();

  const {
    movie,
    selectedSeats,
    seatIds,
    selectedRoom,
    selectedDate,
    selectedTime,
    finalTotalPrice,
    selectedShowtimeId,
    product,
    bookingId,
  } = useSelector((state) => state.booking);

  // Danh sách các loại thẻ hỗ trợ
  const cardTypes = [
    {
      value: "VISA",
      name: "Visa",
      logo: "https://upload.wikimedia.org/wikipedia/commons/4/41/Visa_Logo.png"
    },
    {
      value: "MASTERCARD",
      name: "MasterCard",
      logo: "https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg"
    },
    {
      value: "JCB",
      name: "JCB",
      logo: "https://upload.wikimedia.org/wikipedia/commons/4/40/JCB_logo.svg"
    },
    {
      value: "UNIONPAY",
      name: "UnionPay",
      logo: "https://upload.wikimedia.org/wikipedia/commons/1/1b/UnionPay_logo.svg"
    },
    {
      value: "American Express",
      name: "American Express",
      logo: "https://upload.wikimedia.org/wikipedia/commons/f/fa/American_Express_logo_%282018%29.svg"
    }
  ];

  // Calculate product total for display
  const productTotal = product && Array.isArray(product)
    ? product.reduce((sum, p) => sum + (parseFloat(p.Price || 0) * parseInt(p.Quantity || 0)), 0)
    : 0;

  // Initialize prices - SEPARATE SEAT AND PRODUCT
  useEffect(() => {
    console.log("Final total price from Redux:", finalTotalPrice);
    console.log("Product total calculated:", productTotal);
    console.log("USER DISCOUNT", userDiscount)

    // Tách giá ghế và product
    const calculatedSeatPrice = (finalTotalPrice - productTotal)*(100-userDiscount)/100;
    const calculatedProductPrice = productTotal;
    const priceAfterMembership=calculatedSeatPrice+calculatedProductPrice;
    
    setSeatPrice(calculatedSeatPrice);
    setProductPrice(calculatedProductPrice);
    setDiscountedSeatPrice(calculatedSeatPrice); // Ban đầu chưa giảm
    setFinalPrice(priceAfterMembership); // Tổng ban đầu

  }, [finalTotalPrice, productTotal,userDiscount]);

  // Stripe integration effect - MODIFIED: Only reset state, don't create intent
  useEffect(() => {
    // Chỉ reset state khi thay đổi payment method, không tạo intent ngay
    if (paymentMethod !== "3") {
      setStripeClientSecret(null);
      setStripePaymentId(null);
      setStripeError("");
      setStripeLoading(false);
    }
  }, [paymentMethod, stripeCardType]);

  // NEW: Function to create Stripe payment intent after holding
  // const createStripePaymentIntent = async (bookingId, orderProductId = null) => {
  //   setStripeLoading(true);
  //   setStripeError("");

  //   try {
  //     const payload = {
  //       amount: finalPrice,
  //       bookingId: bookingId,
  //       orderProductId: orderProductId,
  //       cardType: stripeCardType,
  //     };
  //     console.log("Creating Stripe payment with payload:", payload);

  //     const res = await createStripePayment(payload);
  //     console.log("Stripe API response:", res);

  //     if (res.status === "success") {
  //       const clientSecret = res.data.clientSecret || res.data.ClientSecret;
  //       const paymentId = res.data.paymentId || res.data.PaymentId;
        
  //       setStripeClientSecret(clientSecret);
  //       setStripePaymentId(paymentId);
        
  //       return { clientSecret, paymentId };
  //     } else {
  //       setStripeError(res.error || "Không lấy được thông tin thanh toán Stripe");
  //       return null;
  //     }
  //   } catch (error) {
  //     console.error("Stripe API error:", error);
  //     setStripeError(error.message || "Lỗi kết nối Stripe");
  //     return null;
  //   } finally {
  //     setStripeLoading(false);
  //   }
  // };

  // Handle payment method selection
  const handlePaymentMethod = (method) => {
    setPaymentMethod(method);
    // Reset Stripe states khi chuyển sang phương thức khác
    if (method !== "3") {
      setStripeClientSecret(null);
      setStripePaymentId(null);
      setStripeError("");
      setStripeLoading(false);
    }
  };

  // Handle card type selection
  const handleCardTypeChange = (cardType) => {
    setStripeCardType(cardType);
  };

  console.log("METHOD SELECTED", paymentMethod);
  console.log("CARD TYPE SELECTED", stripeCardType);

  // Promotion handling - CHỈ ÁP DỤNG CHO GHẾ
  const handleInputPromoCode = (event) => {
    setPromoCode(event.target.value);
    if (promotionError) setPromotionError('');
  };

  const handleAddPromotion = async () => {
    if (promoCode.trim() === '') {
      toast.error('Please enter a promotion code!', {
        duration: 4000,
        position: "top-center",
      });
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
      console.log("Promotion response:", response);
      let promotionData = Array.isArray(response.promotions) ? response.promotions[0] : response.promotions;
      const dayObj = new Date(promotionData?.Endtime);
      const dateToCheck = new Date(dayObj.getFullYear(), dayObj.getMonth(), dayObj.getDate());
      const today = new Date();
      const todayForComparison = new Date(today.getFullYear(), today.getMonth(), today.getDate());

      if (promotionData?.Code && dateToCheck ) {
       
        const seatDiscount = seatPrice * (promotionData.DiscountValue / 100);
        const newSeatPrice = seatPrice - seatDiscount;
        const newFinalPrice = newSeatPrice + productPrice; 

        setAppliedPromotion(promotionData);
        setDiscountAmount(seatDiscount);
        setDiscountType('promotion');
        setDiscountedSeatPrice(newSeatPrice);
        setFinalPrice(newFinalPrice);
        setPromoCode('');

        toast.success(`Promotion "${promotionData.Code}" applied successfully! Save ${formatPrice(seatDiscount)}`, {
          duration: 4000,
          position: "top-center",
        });

        console.log("🎫 Promotion applied:", {
          originalSeatPrice: seatPrice,
          seatDiscount,
          newSeatPrice,
          productPrice,
          newFinalPrice
        });
      } else {
        setPromotionError(' Invalid or expired promotion code');
        toast.error('  Invalid or expired promotion code   ', {
          duration: 4000,
          position: "top-center",
        });
      }
    } catch (error) {
      console.error("Error checking promotion:", error);
      setPromotionError('Error occurred while checking promotion code');
      toast.error('Invalid promotion code', {
        duration: 4000,
        position: "top-center",
      });
    } finally {
      setIsLoadingPromotion(false);
    }
  };

  useEffect(() => {
    const fetchMembership = async () => {
      try {
        const res = await getMembership(user.userId);
        const memberPoints = res.TotalAccumulatedPoints;

        setMemberPoints(res.TotalAccumulatedPoints);
        console.log("MEMBER POINTS", memberPoints)
      } catch (error) {
        console.error("Error fetching membership", error);
      }
    };

    if (user?.userId) {
      fetchMembership();
    }
  }, [user]);

  const handleRemovePromotion = () => {
    const savedAmount = discountAmount;
    setAppliedPromotion(null);
    setPromotionError('');
    setPromoCode('');
    setDiscountAmount(0);
    setDiscountType('');
    setDiscountedSeatPrice(seatPrice); // Reset về giá ghế gốc
    setFinalPrice(seatPrice + productPrice); // Reset về tổng gốc

    toast.info(`Promotion removed. Added back ${formatPrice(savedAmount)}`, {
      duration: 3000,
      position: "top-center",
    });
  };

  // Points handling - CHỈ ÁP DỤNG CHO GHẾ
  const handlePointsChange = (event) => {
    const value = event.target.value.replace(/\D/g, '');
    setPointsToUse(value);
    if (pointsError) setPointsError('');
  };

  const handleUsePoints = () => {
    if (!pointsToUse || pointsToUse <= 0) {
      setPointsError('Please enter valid points');
      toast.error('Please enter valid points', {
        duration: 4000,
        position: "top-center",
      });
      return;
    }

    const points = parseInt(pointsToUse);

    if (points > user?.scoreBalance) {
      setPointsError(`Available points: ${user.scoreBalance}`);
      toast.error(`Available points: ${user.scoreBalance}`, {
        duration: 4000,
        position: "top-center",
      });
      return;
    }

    // *** CHỈ KIỂM TRA VỚI GIÁ GHẾ, KHÔNG PHẢI TỔNG ***
    if (points > seatPrice) {
      setPointsError('Points cannot be greater than seat price');
      toast.error('Points cannot be greater than seat price', {
        duration: 4000,
        position: "top-center",
      });
      return;
    }

    if (appliedPromotion) {
      const confirm = window.confirm('You are using a promotion. Using points will cancel the promotion. Continue?');
      if (!confirm) return;
      handleRemovePromotion();
    }

    const seatDiscount = Math.min(points, seatPrice) * 1000;
    const newSeatPrice = seatPrice - seatDiscount;
    const newFinalPrice = newSeatPrice + productPrice; // Ghế đã giảm + Product gốc

    setIsUsingPoints(true);
    setDiscountAmount(seatDiscount);
    setDiscountType('points');
    setDiscountedSeatPrice(newSeatPrice);
    setFinalPrice(newFinalPrice);
    setPointsError('');

    toast.success(`${points.toLocaleString()} points applied successfully! Save ${formatPrice(seatDiscount)}`, {
      duration: 4000,
      position: "top-center",
    });

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
    const savedAmount = discountAmount;
    const usedPoints = pointsToUse;

    setIsUsingPoints(false);
    setPointsToUse('');
    setPointsError('');
    setDiscountAmount(0);
    setDiscountType('');
    setDiscountedSeatPrice(seatPrice); // Reset về giá ghế gốc
    setFinalPrice(seatPrice + productPrice); // Reset về tổng gốc

    toast.info(`${parseInt(usedPoints).toLocaleString()} points removed. Added back ${formatPrice(savedAmount)}`, {
      duration: 3000,
      position: "top-center",
    });
  };

 
  const handleConfirm = async (e) => {
    e.preventDefault();

    if (!paymentMethod) {
      toast.error("Please select a payment method!", {
        duration: 4000,
        position: "top-center",
      });
      return;
    }

    // Kiểm tra nếu chọn Stripe nhưng chưa chọn card type
    if (paymentMethod === "3" && !stripeCardType) {
      toast.error("Please select a card type!", {
        duration: 4000,
        position: "top-center",
      });
      return;
    }

    setIsConfirming(true);

    try {
      let holdingResult = null;
      let productHoldResult = null;

      // 1. HOLD SEATS
      holdingResult = await HoldingSeats(
        user.userId,
        selectedShowtimeId,
        seatIds,
        [],
        appliedPromotion?.Code || '',
        isUsingPoints ? parseInt(pointsToUse) : 0
      );
      console.log("BOOKING ID TRUOC KHI SET REDUX", holdingResult.bookingId)
      dispatch(setBookingId(holdingResult.bookingId))

      console.log("HOLDING SEAT SUCCESSSS:", holdingResult);

      // 2. HOLD PRODUCTS - Only if products are selected
      if (product && Array.isArray(product) && product.length > 0) {
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
        productHoldResult = await holdProducts(
          productHoldPayload.MemberId,
          productHoldPayload.products,
          productHoldPayload.Notes
        );

        console.log("HOLDING PRODUCT SUCCESSSSS:", productHoldResult);
      } else {
        console.log("ℹ️ No products to hold");
      }

      // 3. HANDLE PAYMENT METHOD
      // if (paymentMethod === "3") {
      //   // STRIPE PAYMENT - Create intent after holding
      //   const stripeResult = await createStripePaymentIntent(
      //     holdingResult.bookingId,
      //     productHoldResult?.OrderProductId || null
      //   );
        
      //   if (!stripeResult) {
      //     throw new Error("Failed to create Stripe payment intent");
      //   }
        
      //   // Navigate to Stripe payment page or continue with current page
      //   const stripePaymentData = {
      //     // Booking data
      //     selectedSeats,
      //     finalTotalPrice,
      //     paymentMethod,
      //     selectedRoom,
      //     selectedDate,
      //     selectedTime,
      //     selectedShowtimeId,
      //     userId: user.userId,
      //     seatIds,
      //     movie,
          
      //     // Price data
      //     discountType,
      //     promotionCode: appliedPromotion?.Code || null,
      //     promotionData: appliedPromotion,
      //     pointsUsed: isUsingPoints ? parseInt(pointsToUse) : 0,
      //     discountAmount,
      //     seatPrice,
      //     discountedSeatPrice,
      //     productPrice,
      //     finalPrice,
          
      //     // Stripe specific data
      //     stripeClientSecret: stripeResult.clientSecret,
      //     stripePaymentId: stripeResult.paymentId,
      //     stripeCardType,
          
      //     // Hold results
      //     bookingId: holdingResult.bookingId,
      //     holdingSeats: holdingResult,
          
      //     // Product data
      //     products: product || [],
      //     OrderProductId: productHoldResult?.OrderProductId || null,
      //     productHoldResult: productHoldResult,
      //   };
        
        // console.log("Stripe payment ready with data:", stripePaymentData);
        
        // Stay on current page to show Stripe form
        // The form will appear automatically due to stripeClientSecret being set
        
      // } else {
        // OTHER PAYMENT METHODS - Navigate to waiting page
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
          promotionCode: appliedPromotion?.Code || null,
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
          stripeCardType,
        };

        console.log("Navigating to waiting page with data:", waitingData);

        // Delay navigation slightly to show success message
        setTimeout(() => {
          navigate("/waiting", {
            state: waitingData
          });
        }, 1000);
      }

     catch (error) {
      console.error("❌ Error during confirmation process:", error);
      toast.error(error.message || "An error occurred during booking confirmation!", {
        duration: 4000,
        position: "top-center",
      });
    } finally {
      setIsConfirming(false);
    }
  };

  // Handle cancel action
  const handleCancel = () => {
    toast.info("Booking cancelled. Returning to home page...", {
      duration: 2000,
      position: "top-center",
    });
    setTimeout(() => {
      navigate("/");
    }, 1000);
  };

  const handleTierChange = useCallback((tierInfo) => {
  console.log(" Setting userDiscount to:", tierInfo.discount);
  setUserDiscount(tierInfo.discount);
 
}, []);

  useEffect(() => {
    console.log("==CURRENT FINAL PRICE:", finalPrice);
    console.log("==SEAT PRICE (discounted):", discountedSeatPrice);
    console.log("==PRODUCT PRICE (original):", productPrice);
  }, [finalPrice, discountedSeatPrice, productPrice]);

  // Check if user is logged in
  useEffect(() => {
    if (!user) {
      toast.error("Please login to continue with payment", {
        duration: 4000,
        position: "top-center",
      });
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    }
  }, [user, navigate]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  // Show loading or redirect if no user
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1a005f] via-[#3f2b96] to-[#000c2d] text-white flex items-center justify-center">
        <ToastContainer />
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white mb-4"></div>
          <p className="text-lg">Checking authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a005f] via-[#3f2b96] to-[#000c2d] text-white">
      <ToastContainer
        position="top-center"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
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
                </div>
                
                <MembershipProgress
                  points={memberPoints}
                  onTierChange={handleTierChange}
                />
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
                    <h3 className="text-lg md:text-xl font-bold text-white mb-4">Price </h3>
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
                        <div>
                          <p className="flex justify-end text-sm text-green-400">Member Discount {userDiscount}%</p>
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
                          className={`px-6 py-3 bg-gradient-to-r from-purple-600 via-purple-500 to-purple-700 hover:from-purple-700 hover:via-purple-600 hover:to-purple-800 text-white font-semibold rounded-xl text-sm transition-all duration-300 whitespace-nowrap ${isLoadingPromotion || appliedPromotion || isUsingPoints ? 'opacity-50 cursor-not-allowed' : ''}`}
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
                              ✓ Promotion applied: {appliedPromotion.Code} (-{appliedPromotion.DiscountValue}%)
                            </div>
                            <button
                              onClick={handleRemovePromotion}
                              className="text-red-400 hover:text-red-300 text-xs ml-2 transition-colors"
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
                          disabled={isUsingPoints || appliedPromotion||userDiscount!==0}
                        />
                        <button
                          className={`px-6 py-3 bg-gradient-to-r from-purple-600 via-purple-500 to-purple-700 hover:from-purple-700 hover:via-purple-600 hover:to-purple-800 text-white  rounded-xl text-sm transition-all duration-300 whitespace-nowrap ${isUsingPoints || appliedPromotion ? 'opacity-50 cursor-not-allowed' : ''}`}
                          onClick={handleUsePoints}
                          disabled={isUsingPoints || appliedPromotion||userDiscount!==0}
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
                              className="text-red-400 hover:text-red-300 text-xs ml-2 transition-colors"
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
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                      {/* Stripe (Visa/MasterCard/JCB/UnionPay) */}
                      <div>
                        <button
                          onClick={() => handlePaymentMethod("3")}
                          className={`flex flex-col items-center justify-center rounded-2xl p-4 h-20 font-semibold transition-all duration-300 border-2 ${paymentMethod === "3"
                            ? "bg-blue-600/30 border-blue-400 shadow-lg"
                            : "bg-white/90 hover:bg-white/95 border-white/20"
                            } focus:outline-none focus:ring-4 focus:ring-blue-500 w-full`}
                        >
                          <img
                            src="https://www.thesmbguide.com/images/Stripe-Payments-Review-1024x512-20200129.png"
                            alt="Stripe Logo"
                            className="w-16 h-7 mb-1"
                          />
                        </button>
                      </div>

                      {/* ZaloPay */}
                      <div>
                        <button
                          onClick={() => handlePaymentMethod("4")}
                          className={`flex flex-col items-center justify-center rounded-2xl p-4 h-20 font-semibold transition-all duration-300 border-2 ${paymentMethod === "4"
                            ? "bg-blue-600/30 border-blue-400 shadow-lg"
                            : "bg-white/90 hover:bg-white/95 border-white/20"
                            } focus:outline-none focus:ring-4 focus:ring-blue-500 w-full`}
                        >
                          <img
                            src="https://vectorseek.com/wp-content/uploads/2023/09/Zalopay-Logo-Vector.svg-.png"
                            alt="ZaloPay logo"
                            className="w-16 h-5 mb-1"
                          />
                        </button>
                      </div>

                      {/* Momo */}
                      <div>
                        <button
                          onClick={() => handlePaymentMethod("2")}
                          className={`flex flex-col items-center justify-center rounded-2xl p-4 h-20 font-semibold transition-all duration-300 border-2 ${paymentMethod === "2"
                            ? "bg-blue-600/30 border-blue-400 shadow-lg"
                            : "bg-white/90 hover:bg-white/95 border-white/20"
                            } focus:outline-none focus:ring-4 focus:ring-blue-500 w-full`}
                        >
                          <img
                            src="https://cdn.haitrieu.com/wp-content/uploads/2022/10/Logo-MoMo-Transparent-1024x1024.png"
                            alt="Momo logo"
                            className="w-10 h-8 mb-1"
                          />
                        </button>
                      </div>
                    </div>

                    {/* Card Type Selection for Stripe */}
                    {paymentMethod === "3" && (
                      <div className="bg-white/5 rounded-2xl p-4 border border-white/10 mb-4">
                        <h4 className="text-md font-semibold text-white mb-3">Select Card Type</h4>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                          {cardTypes.map((card) => (
                            <button
                              key={card.value}
                              onClick={() => handleCardTypeChange(card.value)}
                              className={`flex flex-col items-center justify-center p-3 rounded-xl transition-all duration-300 border-2 ${
                                stripeCardType === card.value
                                  ? "bg-purple-600/30 border-purple-400 shadow-lg"
                                  : "bg-white/5 hover:bg-white/10 border-white/20"
                              } focus:outline-none focus:ring-2 focus:ring-purple-500`}
                            >
                              <img
                                src={card.logo}
                                alt={`${card.name} logo`}
                                className="w-12 h-8 object-contain mb-1"
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                  e.target.nextSibling.style.display = 'block';
                                }}
                              />
                              <span 
                                className="text-xs text-white font-medium text-center hidden"
                                style={{ display: 'none' }}
                              >
                                {card.name}
                              </span>
                              <span className="text-xs text-gray-300 text-center">
                                {card.name}
                              </span>
                            </button>
                          ))}
                        </div>
                        
                        {/* Stripe Processing Status */}
                        {stripeLoading && (
                          <div className="mt-4 flex items-center justify-center space-x-2 text-purple-400">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-400"></div>
                            <span className="text-sm">Setting up payment...</span>
                          </div>
                        )}
                        
                        {stripeError && (
                          <div className="mt-4 p-3 bg-red-500/20 rounded-lg border border-red-400/30">
                            <p className="text-red-400 text-sm">{stripeError}</p>
                          </div>
                        )}
                        
                        {stripeClientSecret && !stripeError && (
                          <div className="mt-4 p-3 bg-green-500/20 rounded-lg border border-green-400/30">
                            <p className="text-green-400 text-sm">✓ Payment ready for {cardTypes.find(c => c.value === stripeCardType)?.name}</p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Stripe Checkout Form */}
                    {paymentMethod === "3" && stripeClientSecret && (
                      <div className="bg-white/5 rounded-2xl p-4 border border-white/10 mb-4">
                        <h4 className="text-md font-semibold text-white mb-3">Payment Details</h4>
                        <StripeCheckoutForm
                          clientSecret={stripeClientSecret}
                          onSuccess={(paymentIntent) => {
                            toast.success("Payment processed successfully!", {
                              duration: 4000,
                              position: "top-center",
                            });
                            console.log("Stripe payment successful:", paymentIntent);
                          }}
                          onError={(error) => {
                            toast.error(`Payment failed: ${error.message}`, {
                              duration: 4000,
                              position: "top-center",
                            });
                            console.error("Stripe payment error:", error);
                          }}
                        />
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-auto space-y-4">
                    <button
                      type="button"
                      className={`w-full py-4 bg-gradient-to-r from-purple-600 via-purple-500 to-purple-700 hover:from-purple-700 hover:via-purple-600 hover:to-purple-800 shadow-xl hover:shadow-2xl hover:shadow-purple-500/20 transform hover:scale-[1.02] transition-all duration-300 ease-out border border-purple-400/10 text-white font-semibold rounded-2xl text-lg ${(!paymentMethod || isConfirming || (paymentMethod === "3" && !stripeCardType)) ? 'opacity-50 cursor-not-allowed' : ''}`}
                      onClick={handleConfirm}
                      disabled={!paymentMethod || isConfirming || (paymentMethod === "3" && !stripeCardType)}
                    >
                      {isConfirming ? (
                        <div className="flex items-center justify-center space-x-2">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                          <span>
                            {paymentMethod === "3" && stripeLoading ? "Setting up Stripe payment..." : "Processing..."}
                          </span>
                        </div>
                      ) : (
                        'Confirm And Payment'
                      )}
                    </button>

                    <button
                      type="button"
                      className="w-full py-4 bg-transparent hover:bg-white/10 border-2 border-purple-500/50 hover:border-purple-400 text-white font-semibold rounded-2xl text-lg transition-all duration-300"
                      onClick={handleCancel}
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