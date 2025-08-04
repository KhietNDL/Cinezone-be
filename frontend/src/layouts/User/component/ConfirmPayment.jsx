import { Await, useLocation, useNavigate } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import { getPromotionByTitle, HoldingSeats, cancelBooking, holdProducts, getMembership, createStripePayment } from "../../../services/API";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { setBookingId, setOrderProductsId } from "../../../redux/features/bookingSlice";
import ActionButtons from "../confirmComponent/ActionButtons";
import PaymentMethodsSection from "../confirmComponent/PaymentMethodsSection";
import PointsSection from "../confirmComponent/PointsSection";
import PromotionSection from "../confirmComponent/PromotionSection";
import PriceBreakdownCard from "../confirmComponent/PriceBreakdownCard";
import BookingDetailsCard from "../confirmComponent/BookingDetailsCard";
import UserInfoCard from "../confirmComponent/UserInfoCard";
import MovieInfoCard from "../confirmComponent/MovieInfoCard";
import { FadeInWrapper } from "../../../component/FadeIn";
import AnimatedWrapper from "../../../component/MagicBentoAnimation";
import BackButton from "../../../component/BackButton";

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


  const [userDiscount, setUserDiscount] = useState(0);

  const [promoCode, setPromoCode] = useState("");
  const [isLoadingPromotion, setIsLoadingPromotion] = useState(false);
  const [appliedPromotion, setAppliedPromotion] = useState(null);
  const [promotionError, setPromotionError] = useState("");

  const [pointsToUse, setPointsToUse] = useState("");
  const [isUsingPoints, setIsUsingPoints] = useState(false);
  const [pointsError, setPointsError] = useState("");

  const [seatPrice, setSeatPrice] = useState(0); // Giá ghế gốc
  const [productPrice, setProductPrice] = useState(0); // Giá product gốc
  const [discountedSeatPrice, setDiscountedSeatPrice] = useState(0); // Giá ghế sau giảm
  const [finalPrice, setFinalPrice] = useState(0); // Tổng cuối = ghế đã giảm + product gốc
  const [discountAmount, setDiscountAmount] = useState(0);
  const [discountType, setDiscountType] = useState("");
  const [memberPoints, setMemberPoints] = useState(0); // 'promotion' or 'points'

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

  // Calculate product total for display
  const productTotal =
    product && Array.isArray(product)
      ? product.reduce(
        (sum, p) =>
          sum + parseFloat(p.Price || 0) * parseInt(p.Quantity || 0),
        0
      )
      : 0;

  // Initialize prices - SEPARATE SEAT AND PRODUCT
  useEffect(() => {
    // console.log("Final total price from Redux:", finalTotalPrice);
    // console.log("Product total calculated:", productTotal);
    // console.log("USER DISCOUNT", userDiscount);

    // Tách giá ghế và product
    const calculatedSeatPrice = (finalTotalPrice - productTotal) * (100 - userDiscount) / 100;
    const calculatedProductPrice = productTotal;
    const priceAfterMembership = calculatedSeatPrice + calculatedProductPrice;

    setSeatPrice(calculatedSeatPrice);
    setProductPrice(calculatedProductPrice);
    setDiscountedSeatPrice(calculatedSeatPrice); // Ban đầu chưa giảm
    setFinalPrice(priceAfterMembership); // Tổng ban đầu

  }, [finalTotalPrice, productTotal, userDiscount]);

  useEffect(() => {
    // Chỉ reset state khi thay đổi payment method, không tạo intent ngay
    if (paymentMethod !== "3") {
      setStripeClientSecret(null);
      setStripePaymentId(null);
      setStripeError("");
      setStripeLoading(false);
    }
  }, [paymentMethod, stripeCardType]);

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

  // console.log("METHOD SELECTED", paymentMethod);
  // console.log("CARD TYPE SELECTED", stripeCardType);

  // Promotion handling - CHỈ ÁP DỤNG CHO GHẾ
  const handleInputPromoCode = (event) => {
    setPromoCode(event.target.value);
    if (promotionError) setPromotionError("");
  };

  const handleAddPromotion = async () => {
    if (promoCode.trim() === "") {
      toast.error("Please enter a promotion code!", {
        duration: 4000,
        position: "top-center",
      });
      return;
    }

    // Nếu đang sử dụng points, hỏi người dùng
    if (isUsingPoints) {
      const confirm = window.confirm("Cancel points usage to apply promotion?");
      if (!confirm) return;
      handleRemovePoints();
    }

    setIsLoadingPromotion(true);
    setPromotionError("");

    try {
      const response = await getPromotionByTitle(promoCode);
      // console.log("Promotion response:", response);
      let promotionData = Array.isArray(response.promotions) ? response.promotions[0] : response.promotions;
      // console.log("Promotion data:", promotionData);
      const dayObj = new Date(promotionData?.EndTime);
      const dateToCheck = new Date(dayObj.getFullYear(), dayObj.getMonth(), dayObj.getDate());
      const today = new Date();
      const todayForComparison = new Date(today.getFullYear(), today.getMonth(), today.getDate());

      if (promotionData?.Code && todayForComparison <= dateToCheck) {

        const seatDiscount = seatPrice * (promotionData.DiscountValue / 100);
        const newSeatPrice = seatPrice - seatDiscount;
        const newFinalPrice = newSeatPrice + productPrice;

        setAppliedPromotion(promotionData);
        setDiscountAmount(seatDiscount);
        setDiscountType("promotion");
        setDiscountedSeatPrice(newSeatPrice);
        setFinalPrice(newFinalPrice);
        setPromoCode("");

        toast.success(
          `Promotion "${promotionData.Code
          }" applied successfully! Save ${formatPrice(seatDiscount)}`,
          {
            duration: 4000,
            position: "top-center",
          }
        );

        // console.log("🎫 Promotion applied:", {
        //   originalSeatPrice: seatPrice,
        //   seatDiscount,
        //   newSeatPrice,
        //   productPrice,
        //   newFinalPrice,
        // });
      } else {
        setPromotionError(' Invalid or expired promotion code');
        toast.error('  Invalid or expired promotion code   ', {
          duration: 4000,
          position: "top-center",
        });
      }
    } catch (error) {
      console.error("Error checking promotion:", error);
      setPromotionError("Error occurred while checking promotion code");
      toast.error("Invalid promotion code", {
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
        // console.log("MEMBER POINTS", memberPoints);
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
    setPromotionError("");
    setPromoCode("");
    setDiscountAmount(0);
    setDiscountType("");
    setDiscountedSeatPrice(seatPrice); // Reset về giá ghế gốc
    setFinalPrice(seatPrice + productPrice); // Reset về tổng gốc

    toast.info(`Promotion removed. Added back ${formatPrice(savedAmount)}`, {
      duration: 3000,
      position: "top-center",
    });
  };

  // Points handling - CHỈ ÁP DỤNG CHO GHẾ
  const handlePointsChange = (event) => {
    const value = event.target.value.replace(/\D/g, "");
    setPointsToUse(value);
    if (pointsError) setPointsError("");
  };

  const handleUsePoints = () => {
    if (!pointsToUse || pointsToUse <= 0) {
      setPointsError("Please enter valid points");
      toast.error("Please enter valid points", {
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
      setPointsError("Points cannot be greater than seat price");
      toast.error("Points cannot be greater than seat price", {
        duration: 4000,
        position: "top-center",
      });
      return;
    }

    if (appliedPromotion) {
      const confirm = window.confirm(
        "You are using a promotion. Using points will cancel the promotion. Continue?"
      );
      if (!confirm) return;
      handleRemovePromotion();
    }

    const seatDiscount = Math.min(points, seatPrice) * 1000;
    const newSeatPrice = seatPrice - seatDiscount;
    const newFinalPrice = newSeatPrice + productPrice; // Ghế đã giảm + Product gốc

    setIsUsingPoints(true);
    setDiscountAmount(seatDiscount);
    setDiscountType("points");
    setDiscountedSeatPrice(newSeatPrice);
    setFinalPrice(newFinalPrice);
    setPointsError("");

    toast.success(
      `${points.toLocaleString()} points applied successfully! Save ${formatPrice(
        seatDiscount
      )}`,
      {
        duration: 4000,
        position: "top-center",
      }
    );

    console.log("Points applied:", {
      originalSeatPrice: seatPrice,
      pointsUsed: points,
      seatDiscount,
      newSeatPrice,
      productPrice,
      newFinalPrice,
    });
  };

  const handleRemovePoints = () => {
    const savedAmount = discountAmount;
    const usedPoints = pointsToUse;

    setIsUsingPoints(false);
    setPointsToUse("");
    setPointsError("");
    setDiscountAmount(0);
    setDiscountType("");
    setDiscountedSeatPrice(seatPrice); // Reset về giá ghế gốc
    setFinalPrice(seatPrice + productPrice); // Reset về tổng gốc

    toast.info(
      `${parseInt(
        usedPoints
      ).toLocaleString()} points removed. Added back ${formatPrice(
        savedAmount
      )}`,
      {
        duration: 3000,
        position: "top-center",
      }
    );
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
      holdingResult = await HoldingSeats(
        user.userId,
        selectedShowtimeId,
        seatIds,
        [],
        appliedPromotion?.Code || "",
        isUsingPoints ? parseInt(pointsToUse) : 0
      );
      // console.log("BOOKING ID TRUOC KHI SET REDUX", holdingResult.bookingId)
      dispatch(setBookingId(holdingResult.bookingId))

      // console.log("HOLDING SEAT SUCCESSSS:", holdingResult);
      if (product && Array.isArray(product) && product.length > 0) {
        const productsForAPI = product.map((p) => ({
          ProductId: p.ProductId.toString(),
          Quantity: parseInt(p.Quantity || 0),
        }));

        const productHoldPayload = {
          MemberId: user.userId.toString(),
          products: productsForAPI,
          Notes: `Product hold for booking: ${holdingResult.bookingId || "Unknown"
            } - Movie: ${movie?.NameOfEnglish || "Unknown Movie"}`,
        };
        productHoldResult = await holdProducts(
          productHoldPayload.MemberId,
          productHoldPayload.products,
          productHoldPayload.Notes
        );

        // console.log("HOLDING PRODUCT SUCCESSSSS:", productHoldResult);
      } else {
        console.log("ℹ No products to hold");
      }

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

        discountType,
        promotionCode: appliedPromotion?.Code || null,
        promotionData: appliedPromotion,
        pointsUsed: isUsingPoints ? parseInt(pointsToUse) : 0,
        discountAmount, // Chỉ là discount của ghế
        seatPrice, // Giá ghế gốc
        discountedSeatPrice, // Giá ghế sau giảm
        productPrice,
        finalPrice,

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
      setTimeout(() => {
        navigate("/waiting", {
          state: waitingData,
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
    // console.log(" Setting userDiscount to:", tierInfo.discount);
    setUserDiscount(tierInfo.discount);
  }, []);

  // useEffect(() => {
  //   console.log("==CURRENT FINAL PRICE:", finalPrice);
  //   console.log("==SEAT PRICE (discounted):", discountedSeatPrice);
  //   console.log("==PRODUCT PRICE (original):", productPrice);
  // }, [finalPrice, discountedSeatPrice, productPrice]);

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
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
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
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 via-50% via-purple-950/70  to-slate-900 text-white relative">
      <FadeInWrapper delay={600}>
        <BackButton
          className="absolute top-28 left-14 z-10"
          onClick={() => {
            window.scrollTo({ top: 0, behavior: 'instant' });
            navigate(-1);
          }}
        />

      </FadeInWrapper>
      <ToastContainer
        position="top-center mt-20 "
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <div className="max-w-7xl mx-auto py-1 md:py-14 lg:py-18 px-4 sm:px-10 pb-8 ">
        <div className="space-y-6 mt-[80px] sm:mt-[80px] md:mt-[40px]">
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 md:gap-6 lg:gap-8">
            {/* Div trái chứa thông tin phim và user */}
            <div className="xl:col-span-5 order-1 xl:order-none space-y-6">
              {/* Movie Info Card */}
              <FadeInWrapper delay={600}>
                <AnimatedWrapper
                  enableStars={true}
                  enableTilt={false}
                  enableMagnetism={false}
                  clickEffect={true}
                  enableBorderGlow={false}
                  particleCount={6}
                  glowColor="132, 0, 255"
                >
                  <MovieInfoCard
                    movie={movie}
                    memberPoints={memberPoints}
                    onTierChange={handleTierChange}
                  />
                </AnimatedWrapper>
              </FadeInWrapper>

              {/* User Info Card */}
              <FadeInWrapper delay={700}>
                <AnimatedWrapper
                  enableStars={true}
                  enableTilt={false}
                  enableMagnetism={false}
                  clickEffect={true}
                  enableBorderGlow={false}
                  particleCount={6}
                  glowColor="132, 0, 255"
                >
                  <UserInfoCard user={user} />
                </AnimatedWrapper>
              </FadeInWrapper>
            </div>

            {/* Div phải chứa booking confirmation và payment */}

            <div className="xl:col-span-7 order-2 xl:order-none">
              <FadeInWrapper delay={800}>
                <AnimatedWrapper
                  enableStars={true}
                  enableTilt={false}
                  enableMagnetism={false}
                  clickEffect={true}
                  enableBorderGlow={false}
                  particleCount={6}
                  glowColor="132, 0, 255"
                >
                  <div className="relative bg-white/5 backdrop-blur-md rounded-3xl p-4 md:p-6 lg:p-8 border border-white/10 shadow-2xl h-full">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-pink-500/5 rounded-3xl"></div>

                    <div className="relative z-10 h-full flex flex-col">
                      {/* Booking Details */}
                      <FadeInWrapper delay={600}>
                        <BookingDetailsCard
                          selectedRoom={selectedRoom}
                          selectedDate={selectedDate}
                          selectedTime={selectedTime}
                          selectedSeats={selectedSeats}
                        />
                      </FadeInWrapper>

                      {/* Price Breakdown */}
                      <FadeInWrapper delay={600}>
                        <PriceBreakdownCard
                          selectedSeats={selectedSeats}
                          seatPrice={seatPrice}
                          discountedSeatPrice={discountedSeatPrice}
                          discountAmount={discountAmount}
                          userDiscount={userDiscount}
                          product={product}
                          productPrice={productPrice}
                          finalPrice={finalPrice}
                          discountType={discountType}
                          formatPrice={formatPrice}
                        />
                      </FadeInWrapper>

                      {/* Promotion Section */}
                      <FadeInWrapper delay={600}>
                        <PromotionSection
                          promoCode={promoCode}
                          isLoadingPromotion={isLoadingPromotion}
                          appliedPromotion={appliedPromotion}
                          promotionError={promotionError}
                          isUsingPoints={isUsingPoints}
                          handleInputPromoCode={handleInputPromoCode}
                          handleAddPromotion={handleAddPromotion}
                          handleRemovePromotion={handleRemovePromotion}
                        />
                      </FadeInWrapper>

                      {/* Points Section */}
                      <FadeInWrapper delay={600}>
                        <PointsSection
                          pointsToUse={pointsToUse}
                          isUsingPoints={isUsingPoints}
                          appliedPromotion={appliedPromotion}
                          pointsError={pointsError}
                          userDiscount={userDiscount}
                          handlePointsChange={handlePointsChange}
                          handleUsePoints={handleUsePoints}
                          handleRemovePoints={handleRemovePoints}
                        />
                      </FadeInWrapper>

                      {/* Payment Methods Section */}
                      <FadeInWrapper delay={600}>
                        <PaymentMethodsSection
                          paymentMethod={paymentMethod}
                          stripeCardType={stripeCardType}
                          stripeClientSecret={stripeClientSecret}
                          stripeLoading={stripeLoading}
                          stripeError={stripeError}
                          handlePaymentMethod={handlePaymentMethod}
                          handleCardTypeChange={handleCardTypeChange}
                        />
                      </FadeInWrapper>

                      {/* Action Buttons */}
                      <FadeInWrapper delay={600}>
                        <ActionButtons
                          paymentMethod={paymentMethod}
                          stripeCardType={stripeCardType}
                          isConfirming={isConfirming}
                          stripeLoading={stripeLoading}
                          handleConfirm={handleConfirm}
                          handleCancel={handleCancel}
                        />
                      </FadeInWrapper>
                    </div>
                  </div>
                </AnimatedWrapper>
              </FadeInWrapper>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmPayment;
