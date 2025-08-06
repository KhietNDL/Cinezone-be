import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import {
  setSelectedSeats,
  setSeatIds,
  setCalculatedTotalPrice,
  setSeatsData,
  setSeatQuantity,
  setMovie,
  setFinalTotalPrice,
  setProduct,
  setSelectedTime,
  setSelectedShowtimeId,
} from "../../../redux/features/bookingSlice";
import { useAuth } from "../../../context/AuthContext";
import { slugify } from "./Slug";
import {
  createMovieRating,
  deleteMovieRating,
  getAllProducts,
  getMovieRatingsList,
  getMovies,
  getSeatsByShowtimeId,
  getShowtimeByMovieId,
  getTimeByDay,
  updateMovieRating,
} from "../../../services/API";
import MovieInfo from "../bookingComponent/MovieInfor";
import ShowtimeSelector from "../bookingComponent/ShowtimeSelector";
import SeatMap from "../bookingComponent/SeatMap";
import ProductsSection from "../bookingComponent/ProductsSection";
import OrderSummary from "../bookingComponent/OrderSummary";
import VideoPopup from "../bookingComponent/VideoPopup";
import FeedbackModal from "../bookingComponent/FeedbackModal";
import RatingListModal from "../bookingComponent/RatingListModal";
import BackButton from "../../../component/BackButton";
import MagicBento from "../../../component/MagicBentoAnimation";
import AnimatedWrapper from "../../../component/MagicBentoAnimation";
import { FadeInWrapper } from "../../../component/FadeIn";

const BookingPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { slug } = useParams();
  const { user } = useAuth();
  const popupVideoRef = useRef(null);
  const [editingRatingId, setEditingRatingId] = useState(null);
  const [editRatingValue, setEditRatingValue] = useState(0);
  const [editRatingComment, setEditRatingComment] = useState("");
  const [editLoading, setEditLoading] = useState(false);
  const {
    selectedSeats,
    selectedRoom,
    selectedDate,
    selectedTime,
    selectedShowtimeId,
    seatQuantity,
    seatsData,
    movie,
    product,
    calculatedTotalPrice,
  } = useSelector((state) => state.booking);

  const [showtimes, setShowtimes] = useState([]);
  const [timeOptions, setTimeOptions] = useState([]);
  const [dateIndex, setDateIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [lastRefreshTime, setLastRefreshTime] = useState(Date.now());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [totalProductPrice, setTotalProductPrice] = useState(0);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [feedbackRating, setFeedbackRating] = useState(0);
  const [feedbackComment, setFeedbackComment] = useState("");
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [ratingSummary, setRatingSummary] = useState(null);
  const [isRatingListOpen, setIsRatingListOpen] = useState(false);
  const [ratingsList, setRatingsList] = useState([]);
  const [ratingsTotal, setRatingsTotal] = useState(0);
  const [ratingsPage, setRatingsPage] = useState(1);
  const [ratingsLoading, setRatingsLoading] = useState(false);

  const [seatMapLoading, setSeatMapLoading] = useState(false);
  const [previousDate, setPreviousDate] = useState(null);

  const [pageLoaded, setPageLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPageLoaded(true);
    }, 200);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (previousDate !== null && previousDate !== selectedDate) {
      dispatch(setSelectedTime(null));
      dispatch(setSelectedShowtimeId(null));
      dispatch(setSeatsData([]));
      dispatch(setSeatQuantity(0));
      dispatch(setSelectedSeats([]));
      dispatch(setCalculatedTotalPrice(0));
      dispatch(setSeatIds([]));
      setSeatMapLoading(true);
    }
    setPreviousDate(selectedDate);
  }, [selectedDate, previousDate, dispatch]);

  useEffect(() => {
    if (!selectedShowtimeId) {
      setSeatMapLoading(false);
    }
  }, [selectedShowtimeId]);

  const handleProductSelect = (product, quantity) => {
    if (!product || !product.ProductId) return;
    if (quantity === undefined || quantity === null) return;
    if (!user?.userId) {
      toast.error("Please sign in to select products", {
        duration: 4000,
        position: "top-center",
      });
      setTimeout(() => navigate("/login"), 1000);
      return;
    }

    const existingIndex = selectedProducts.findIndex(
      (p) => p.ProductId === product.ProductId
    );

    if (quantity === 0) {
      const newProducts = selectedProducts.filter(
        (p) => p.ProductId !== product.ProductId
      );
      setSelectedProducts(newProducts);
      updateTotalProductPrice(newProducts);
    } else {
      const newProduct = {
        ...product,
        selectedQuantity: parseInt(quantity),
        ProductId: product.ProductId,
        Quantity: parseInt(quantity),
      };
      let newProducts;
      if (existingIndex >= 0) {
        newProducts = [...selectedProducts];
        newProducts[existingIndex] = newProduct;
      } else {
        newProducts = [...selectedProducts, newProduct];
      }
      setSelectedProducts(newProducts);
      updateTotalProductPrice(newProducts);
    }
  };

  const updateTotalProductPrice = (products) => {
    const total = products.reduce((sum, p) => {
      const price = parseFloat(p.Price) || 0;
      const quantity = p.selectedQuantity || p.Quantity || 0;
      return sum + price * quantity;
    }, 0);
    setTotalProductPrice(total);
  };

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const response = await getMovies();
        const movies = Array.isArray(response.data)
          ? response.data
          : response.data.movies || [];
        const matchedMovie = movies.find(
          (m) => m.NameOfEnglish && slugify(m.NameOfEnglish) === slug
        );
        if (matchedMovie) {
          dispatch(setMovie(matchedMovie));
        }
      } catch (err) {
        console.error("Error fetching movie:", err);
        toast.error("Failed to load movie details", {
          duration: 4000,
          position: "top-center",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchMovie();
  }, [slug, dispatch]);

  useEffect(() => {
    const fetchShowtimes = async () => {
      if (!movie?.MovieId) return;
      try {
        const response = await getShowtimeByMovieId(movie?.MovieId);
        setShowtimes(response.showtimes || []);
      } catch (error) {
        console.error("Error fetching showtimes:", error);
        toast.error("Failed to load showtimes", {
          duration: 4000,
          position: "top-center",
        });
      }
    };
    fetchShowtimes();
  }, [movie]);

  useEffect(() => {
    const fetchTimeByDay = async () => {
      if (!movie?.MovieId || !selectedDate) return;
      try {
        const response = await getTimeByDay(movie?.MovieId, selectedDate);
        setTimeOptions(response.versions);
      } catch (error) {
        console.error("Error fetching time options:", error);
        toast.error("Failed to load time options", {
          duration: 4000,
          position: "top-center",
        });
      }
    };
    fetchTimeByDay();
  }, [selectedDate, movie]);

  // Tạo hàm dùng chung để load seats
  const loadSeats = async (showtimeId, showLoading = true) => {
    if (!showtimeId) return;

    setIsRefreshing(true);
    if (showLoading) setSeatMapLoading(true);

    try {
      const response = await getSeatsByShowtimeId(showtimeId);

      // Reset state ghế
      dispatch(setSeatsData(response.seats));
      dispatch(setSeatQuantity(response.seatQuantity));
      dispatch(setSelectedSeats([]));
      dispatch(setCalculatedTotalPrice(0));
      dispatch(setSeatIds([]));

      setLastRefreshTime(Date.now());
    } catch (error) {
      console.error("Error loading seats:", error);
      toast.error("Failed to load seat data", {
        duration: 4000,
        position: "top-center",
      });
    } finally {
      setIsRefreshing(false);
      if (showLoading) setSeatMapLoading(false);
    }
  };

  // Gọi loadSeats trong useEffect khi selectedShowtimeId thay đổi
  useEffect(() => {
    loadSeats(selectedShowtimeId);
  }, [selectedShowtimeId, dispatch]);

  // Dùng cùng hàm này cho nút Refresh
  const refreshSeats = () => {
    loadSeats(selectedShowtimeId, false); // false để không set loading cho seat map (chỉ icon refresh)
  };

  const handleContinue = async () => {
    if (!user) {
      toast.error("Please sign in to continue with payment", {
        duration: 4000,
        position: "top-center",
      });
      setTimeout(() => navigate("/login"), 1000);
      return;
    }

    if (selectedSeats.length === 0) {
      toast.error("Please select at least one seat to continue", {
        duration: 4000,
        position: "top-center",
      });
      return;
    }

    const productPayload = selectedProducts.map((p) => ({
      ProductId: p.ProductId,
      Quantity: p.selectedQuantity || p.Quantity,
      Price: p.Price,
      ProductName: p.ProductName || p.productName,
    }));

    dispatch(setProduct(productPayload));
    navigate("/confirmPayment");
  };

  const totalAmount = useMemo(() => {
    return (calculatedTotalPrice || 0) + totalProductPrice;
  }, [calculatedTotalPrice, totalProductPrice]);

  useEffect(() => {
    dispatch(setFinalTotalPrice(totalAmount));
  }, [totalAmount, dispatch]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const handleFetchRatings = useCallback(async () => {
    if (!movie?.MovieId) return;
    setRatingsLoading(true);
    try {
      const data = await getMovieRatingsList(movie.MovieId, {
        page: 1,
        limit: 10,
        sortBy: "newest",
      });
      setRatingsList(data.ratings || []);
      setRatingsTotal(data.total || 0);
      setRatingsPage(1);
    } catch (error) {
      console.error("Error fetching ratings:", error);
      toast.error("Failed to load ratings", {
        duration: 4000,
        position: "top-center",
      });
    } finally {
      setRatingsLoading(false);
    }
  }, [movie?.MovieId]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getAllProducts();
        dispatch(setProduct(response.products || []));
      } catch (error) {
        console.error("Lỗi khi lấy sản phẩm:", error);
        toast.error("Không thể tải danh sách sản phẩm", {
          duration: 4000,
          position: "top-center",
        });
      }
    };
    fetchProducts();
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 via-50% via-purple-950/50 to-slate-900 text-white relative">
      <FadeInWrapper delay={100} className="lg:col-span-4 order-1 lg:order-1">
        <BackButton
          className="absolute top-28 left-14 z-10"
          onClick={() => {
            window.scrollTo({ top: 0, behavior: "instant" });
            navigate("/");
          }}
        />
      </FadeInWrapper>
      <ToastContainer />

      <div className="max-w-7xl mx-auto py-6 md:py-8 lg:py-16 px-4 sm:px-10 pb-8">
        <div className="space-y-6 w-full-screen">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6 lg:gap-8 mt-15">
            {/* Movie Info Section - fade in đầu tiên */}
            <FadeInWrapper
              delay={200}
              className="lg:col-span-4 order-1 lg:order-1"
            >
              <AnimatedWrapper
                enableStars={true}
                enableTilt={false}
                enableMagnetism={false}
                clickEffect={true}
                enableBorderGlow={false}
                particleCount={6}
                glowColor="132, 0, 255"
              >
                <MovieInfo
                  movie={movie}
                  ratingSummary={ratingSummary}
                  onOpenTrailer={() => setIsPopupOpen(true)}
                  onOpenRatingList={() => {
                    setIsRatingListOpen(true);
                    handleFetchRatings();
                  }}
                  setRatingSummary={setRatingSummary}
                  onFetchRatings={handleFetchRatings}
                />
              </AnimatedWrapper>
            </FadeInWrapper>

            {/* Main Booking Section - fade in thứ hai */}
            <FadeInWrapper
              delay={400}
              className="lg:col-span-8 order-2 lg:order-2"
            >
              <div className="bg-white/5 backdrop-blur-md rounded-3xl p-4 md:p-6 lg:p-8 border border-white/10 shadow-2xl h-full">
                <div className="h-full flex flex-col rounded-3xl">
                  <AnimatedWrapper
                    enableStars={true}
                    enableTilt={false}
                    enableMagnetism={false}
                    clickEffect={true}
                    enableBorderGlow={false}
                    particleCount={6}
                    glowColor="132, 0, 255"
                  >
                    {/* Title Section */}
                    <FadeInWrapper delay={600} className="mb-6 md:mb-8">
                      <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3 bg-gradient-to-r from-white via-purple-100 to-pink-100 bg-clip-text text-transparent">
                        {movie?.NameOfEnglish}
                      </h1>
                      <p className="text-gray-300 text-base md:text-lg font-medium mb-4">
                        ({movie?.NameOfVietnamese})
                      </p>
                    </FadeInWrapper>

                    {/* Showtime Selector */}
                    <FadeInWrapper delay={800}>
                      <ShowtimeSelector
                        showtimes={showtimes}
                        dateIndex={dateIndex}
                        selectedDate={selectedDate}
                        timeOptions={timeOptions}
                        selectedShowtimeId={selectedShowtimeId}
                        selectedRoom={selectedRoom}
                        setDateIndex={setDateIndex}
                        dispatch={dispatch}
                      />
                    </FadeInWrapper>

                    {/* Seat Map */}
                    <FadeInWrapper delay={1000}>
                      <SeatMap
                        seatsData={seatsData}
                        selectedSeats={selectedSeats}
                        seatQuantity={seatQuantity}
                        selectedShowtimeId={selectedShowtimeId}
                        lastRefreshTime={lastRefreshTime}
                        isRefreshing={isRefreshing}
                        seatMapLoading={seatMapLoading}
                        user={user}
                        onRefresh={refreshSeats}
                        dispatch={dispatch}
                        navigate={navigate}
                      />
                    </FadeInWrapper>
                  </AnimatedWrapper>
                </div>
              </div>
            </FadeInWrapper>
          </div>

          {/* Products Section */}
          <FadeInWrapper delay={1200}>
            <AnimatedWrapper
              enableStars={true}
              enableTilt={false}
              enableMagnetism={false}
              clickEffect={true}
              enableBorderGlow={false}
              particleCount={6}
              glowColor="132, 0, 255"
            >
              <ProductsSection
                product={product}
                selectedProducts={selectedProducts}
                onProductSelect={handleProductSelect}
              />
            </AnimatedWrapper>
          </FadeInWrapper>

          {/* Order Summary */}
          <FadeInWrapper delay={1400}>
            <OrderSummary
              selectedSeats={selectedSeats}
              selectedProducts={selectedProducts}
              calculatedTotalPrice={calculatedTotalPrice}
              totalProductPrice={totalProductPrice}
              totalAmount={totalAmount}
              movie={movie}
              selectedDate={selectedDate}
              selectedTime={selectedTime}
              formatPrice={formatPrice}
              onContinue={handleContinue}
            />
          </FadeInWrapper>
        </div>
      </div>

      {/* Modals - không cần fade in vì chúng xuất hiện theo action */}
      <VideoPopup
        isOpen={isPopupOpen}
        movie={movie}
        popupVideoRef={popupVideoRef}
        onClose={() => setIsPopupOpen(false)}
      />

      <FeedbackModal
        isOpen={isFeedbackOpen}
        feedbackRating={feedbackRating}
        feedbackComment={feedbackComment}
        hoveredStar={hoveredStar}
        isSubmittingFeedback={isSubmittingFeedback}
        movie={movie}
        setFeedbackRating={setFeedbackRating}
        setFeedbackComment={setFeedbackComment}
        setHoveredStar={setHoveredStar}
        setIsFeedbackOpen={setIsFeedbackOpen}
        onSubmit={async () => {
          if (!feedbackRating || !feedbackComment.trim()) {
            toast.error("Please provide both rating and comment", {
              duration: 4000,
              position: "top-center",
            });
            return;
          }
          if (!movie?.MovieId) {
            toast.error("Movie not found", {
              duration: 4000,
              position: "top-center",
            });
            return;
          }
          setIsSubmittingFeedback(true);
          try {
            await createMovieRating({
              movieId: movie.MovieId,
              rating: feedbackRating,
              comment: feedbackComment.trim(),
            });
            setIsFeedbackOpen(false);
            setFeedbackRating(0);
            setFeedbackComment("");
            toast.success("Feedback submitted successfully", {
              duration: 4000,
              position: "top-center",
            });
            handleFetchRatings();
          } catch (err) {
            console.error("Error submitting feedback:", err);
            toast.error("Failed to submit feedback", {
              duration: 4000,
              position: "top-center",
            });
          } finally {
            setIsSubmittingFeedback(false);
          }
        }}
      />

      <RatingListModal
        isOpen={isRatingListOpen}
        ratingsList={ratingsList}
        ratingsTotal={ratingsTotal}
        ratingsLoading={ratingsLoading}
        user={user}
        editingRatingId={editingRatingId}
        editRatingValue={editRatingValue}
        editRatingComment={editRatingComment}
        editLoading={editLoading}
        setEditingRatingId={setEditingRatingId}
        setEditRatingValue={setEditRatingValue}
        setEditRatingComment={setEditRatingComment}
        setEditLoading={setEditLoading}
        setIsRatingListOpen={setIsRatingListOpen}
        setIsFeedbackOpen={setIsFeedbackOpen}
        onFetchRatings={handleFetchRatings}
        onUpdateRating={async () => {
          setEditLoading(true);
          try {
            await updateMovieRating(editingRatingId, {
              rating: editRatingValue,
              comment: editRatingComment,
            });
            setEditingRatingId(null);
            setEditRatingValue(0);
            setEditRatingComment("");
            await handleFetchRatings();
            toast.success("Rating updated successfully", {
              duration: 4000,
              position: "top-center",
            });
          } catch (error) {
            console.error("Error updating rating:", error);
            toast.error("Failed to update rating", {
              duration: 4000,
              position: "top-center",
            });
          } finally {
            setEditLoading(false);
          }
        }}
        onDeleteRating={async (ratingId) => {
          try {
            await deleteMovieRating(ratingId);
            await handleFetchRatings();
            toast.success("Rating deleted successfully", {
              duration: 4000,
              position: "top-center",
            });
          } catch (error) {
            console.error("Error deleting rating:", error);
            toast.error("Failed to delete rating", {
              duration: 4000,
              position: "top-center",
            });
          } finally {
            setEditLoading(false);
          }
        }}
      />
    </div>
  );
};

export default BookingPage;
