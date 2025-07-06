import { useEffect, useMemo, useRef, useState } from "react";
import { FaTicketAlt, FaChevronLeft, FaChevronRight, FaChevronDown, FaRegClock, FaCalendarAlt } from "react-icons/fa";
import { MdOutlineOndemandVideo, MdOutlineMeetingRoom, MdOutlineStarOutline } from "react-icons/md";
import { RiMovie2AiLine } from "react-icons/ri";
import { GiRegeneration } from "react-icons/gi";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import {
  setSelectedSeats,
  setSeatIds,
  setCalculatedTotalPrice,
  setSelectedRoom,
  setSelectedDate,
  setSelectedTime,
  setSelectedShowtimeId,
  setSeatsData,
  setSeatQuantity,
  setMovie,
  setFinalTotalPrice,
  resetBooking,
  setProduct,
  setOrderProductsId,
} from "../../../redux/features/bookingSlice";
import { useAuth } from "../../../context/AuthContext";
import { slugify } from "./Slug";
import { getAllProducts, getMovies, getSeatsByShowtimeId, getShowtimeByMovieId, getTimeByDay, holdProducts } from "../../../services/API";
import { LayoutSelectSeat } from "../../../component/LayoutSelectSeat";
import { ProductCard } from "../../../component/productCard";

const BookingPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { slug } = useParams();
  const { user } = useAuth();
  const popupVideoRef = useRef(null);

  const {
    selectedSeats,
    seatIds,
    selectedRoom,
    selectedDate,
    selectedShowtimeId,
    seatQuantity,
    seatsData,
    movie,
    product,
    calculatedTotalPrice,
    finalTotalPrice,
  } = useSelector((state) => state.booking);

  const [showtimes, setShowtimes] = useState([]);
  const [timeOptions, setTimeOptions] = useState([]);
  const [dateIndex, setDateIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [lastRefreshTime, setLastRefreshTime] = useState(Date.now());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  // New states for products with Hold API
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [totalProductPrice, setTotalProductPrice] = useState(0);
  const [orderProductIds, setOrderProductIds] = useState([]); // Store OrderProductIds from Hold API
  const [isHoldingProducts, setIsHoldingProducts] = useState(false);

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const response = await getMovies();
        const movies = Array.isArray(response.data) ? response.data : response.data.movies || [];
        const matchedMovie = movies.find((m) => m.NameOfEnglish && slugify(m.NameOfEnglish) === slug);
        if (matchedMovie) dispatch(setMovie(matchedMovie));
      } catch (err) {
        console.error("Lỗi khi fetch movie:", err);
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
        console.error("Lỗi khi lấy showtimes:", error);
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
        console.error("Lỗi khi lấy giờ chiếu:", error);
      }
    };
    fetchTimeByDay();
  }, [selectedDate, movie]);

  useEffect(() => {
    const fetchSeatsByShowtimeId = async () => {
      if (!selectedShowtimeId) return;
      setIsRefreshing(true);
      try {
        console.log("== SELECTED SHOWTIMEID:", selectedShowtimeId);
        const response = await getSeatsByShowtimeId(selectedShowtimeId);
        dispatch(setSeatsData(response.seats));
        dispatch(setSeatQuantity(response.seatQuantity));
        dispatch(setSelectedSeats([]));
        dispatch(setCalculatedTotalPrice(0));
        dispatch(setSeatIds([]));
        setLastRefreshTime(Date.now());

        console.log("== SEATS DATA fetched successfully");
      } catch (error) {
        console.error("Lỗi khi lấy seats:", error);
      } finally {
        setIsRefreshing(false);
      }
    };
    fetchSeatsByShowtimeId();
  }, [selectedShowtimeId, dispatch]);

  const refreshSeats = async () => {
    if (!selectedShowtimeId) return;
    setIsRefreshing(true);
    try {
      console.log("Refreshing seats for showtime:", selectedShowtimeId);
      const response = await getSeatsByShowtimeId(selectedShowtimeId);
      dispatch(setSeatsData(response.seats));
      dispatch(setSeatQuantity(response.seatQuantity));
      dispatch(setSelectedSeats([]));
      dispatch(setCalculatedTotalPrice(0));
      dispatch(setSeatIds([]));
      setLastRefreshTime(Date.now());
    } catch (error) {
      console.error("Lỗi khi refresh seats:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getAllProducts();
        dispatch(setProduct(response.Products || []));
        console.log("Products fetched successfully:", response.Products);
      } catch (err) {
        console.error("Lỗi khi fetch product:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [dispatch]);

  useEffect(() => {
    const handleFocus = () => {
      if (selectedShowtimeId) {
        console.log("Window focused, refreshing seats...");
        refreshSeats();
      }
    };
    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [selectedShowtimeId]);

  // New function to handle Product Hold API
  const handleProductHold = async (products) => {
    console.log("=== HOLD PRODUCTS START ===");
    console.log("User:", user);
    console.log("User MemberId:", user?.MemberId);
    console.log("User userId:", user?.userId); // Check if using userId instead
    console.log("User ID field:", user?.id); // Check other possible ID fields
    console.log("Products to hold:", products);
    console.log("Products length:", products.length);
    
    // Try different possible user ID fields
    const memberId = user?.MemberId || user?.userId || user?.id;
    
    if (!memberId) {
      console.error("No user ID found");
      return { success: false, message: "User not logged in or ID missing" };
    }
    
    if (!products || products.length === 0) {
      console.error("No products to hold");
      return { success: false, message: "No products selected" };
    }

    setIsHoldingProducts(true);
    try {
      const productsPayload = products.map(p => {
        console.log("Mapping product for hold:", p);
        console.log("- ProductId:", p.ProductId);
        console.log("- selectedQuantity:", p.selectedQuantity);
        console.log("- Available Quantity:", p.Quantity);
        
        return {
          ProductId: p.ProductId,
          Quantity: p.selectedQuantity // Use selectedQuantity (user selected amount)
        };
      });

      console.log("Final hold params:");
      console.log("- MemberId:", memberId);
      console.log("- Products:", productsPayload);
      console.log("- Notes:", "");
      
      // Call API with separate parameters instead of single payload object
      const response = await holdProducts(memberId, productsPayload, "");
      
      // Log full response to debug structure
      console.log("Hold API Response:", response);
      
      // Handle the actual response structure: { OrderProductId: "...", totalAmount: 100000 }
      if (response && response.OrderProductId) {
        const orderProductId = response.OrderProductId;
        const holdTotalAmount = response.totalAmount;
        
        // Store single OrderProductId (convert to array for consistency with existing code)
        const orderIds = [orderProductId];
        setOrderProductIds(orderIds);
        dispatch(setOrderProductsId(orderIds));
        
        // Update total product price with actual amount from API
        if (holdTotalAmount !== undefined) {
          setTotalProductPrice(holdTotalAmount);
        }
        
        console.log("Products held successfully:");
        console.log("- OrderProductId:", orderProductId);
        console.log("- Total Amount:", holdTotalAmount);
        
        return { 
          success: true, 
          orderIds: [orderProductId], // Return as array for compatibility
          orderProductId: orderProductId, // Also return single ID
          totalAmount: holdTotalAmount 
        };
      } else {
        const errorMessage = response?.message || response?.error || "Invalid response format";
        console.error("Failed to hold products:", errorMessage);
        return { success: false, message: errorMessage };
      }
    } catch (error) {
      console.error("Error holding products:", error);
      console.error("Error details:", error.response?.data);
      console.error("Error status:", error.response?.status);
      
      let errorMessage = "An error occurred while holding products";
      
      if (error.response?.status === 401) {
        errorMessage = "Authentication failed. Please login again.";
      } else if (error.response?.status === 400) {
        errorMessage = error.response?.data?.message || "Invalid request data";
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      return { success: false, message: errorMessage };
    } finally {
      setIsHoldingProducts(false);
    }
  };

  const handleProductSelect = (product, quantity) => {
    if (!user) {
      Swal.fire({
        icon: "info",
        title: "Sign In Required",
        text: "Please sign in to select products",
        confirmButtonText: "Sign In",
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/login");
        }
      });
      return;
    }

    console.log("Product being selected:", product); // Debug log
    console.log("Quantity:", quantity); // Debug log

    const existingIndex = selectedProducts.findIndex(p => p.ProductId === product.ProductId);

    let newProducts;
    if (quantity === 0) {
      // Remove product if quantity is 0
      if (existingIndex >= 0) {
        newProducts = selectedProducts.filter(p => p.ProductId !== product.ProductId);
      } else {
        return; // No change needed
      }
    } else {
      // Add or update product
      const newProduct = { ...product, selectedQuantity: quantity };

      if (existingIndex >= 0) {
        newProducts = [...selectedProducts];
        newProducts[existingIndex] = newProduct;
      } else {
        newProducts = [...selectedProducts, newProduct];
      }
    }

    console.log("Updated selectedProducts:", newProducts); // Debug log
    setSelectedProducts(newProducts);
    updateTotalProductPrice(newProducts);
  };

  const totalAmount = useMemo(() => {
    return (calculatedTotalPrice || 0) + totalProductPrice;
  }, [calculatedTotalPrice, totalProductPrice]);

  useEffect(() => {
    dispatch(setFinalTotalPrice(totalAmount));
    console.log("Total Amount updated:", totalAmount);
  }, [totalAmount, dispatch]);

  const updateTotalProductPrice = (products) => {
    const total = products.reduce((sum, p) => sum + (parseFloat(p.Price) * p.selectedQuantity), 0);
    setTotalProductPrice(total);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const handleContinue = async () => {
    // If user has selected products, hold them first
    if (selectedProducts.length > 0) {
      const holdResult = await handleProductHold(selectedProducts);
      
      if (!holdResult.success) {
        Swal.fire({
          icon: "error",
          title: "Hold Failed",
          text: holdResult.message || "Failed to hold products. Please try again.",
        });
        return;
      }
      
      // Use the orderProductId from holdResult
      const orderProductId = holdResult.orderProductId;
      const orderIds = holdResult.orderIds || []; // For backward compatibility
      
      // Pass orderProductId to the next page
      const navigationState = {
        orderProductId: orderProductId, // Single OrderProductId
        orderProductIds: orderIds, // Array format (for compatibility)
        hasProducts: true,
        selectedProducts: selectedProducts,
        productTotalAmount: holdResult.totalAmount
      };
      
      console.log("Navigating with OrderProductId:", orderProductId);
      console.log("Navigation state:", navigationState);
      navigate("/confirmPayment", { state: navigationState });
    } else {
      // No products selected, proceed normally
      navigate("/confirmPayment");
    }
  };

  const handleManualRefresh = () => {
    refreshSeats();
  };

  const visibleDates = showtimes.slice(dateIndex, dateIndex + 6);

  const handleOpenPopup = () => {
    setIsPopupOpen(true);
    setTimeout(() => {
      if (popupVideoRef.current) {
        popupVideoRef.current.load();
        popupVideoRef.current.muted = false;
        popupVideoRef.current.play().catch(console.error);
      }
    }, 100);
  };

  const handleClosePopup = () => {
    if (popupVideoRef.current) {
      popupVideoRef.current.pause();
      popupVideoRef.current.currentTime = 0;
    }
    setIsPopupOpen(false);
  };

  const DNALoader = () => (
    <div className="relative w-12 h-12 mx-auto">
      <div className="absolute inset-0 animate-spin" style={{ animation: 'spin 2s linear infinite' }}>
        <div className="w-1 h-6 bg-gradient-to-b from-cyan-400 to-blue-600 rounded-full absolute left-1 top-0 animate-pulse"></div>
        <div className="w-1 h-6 bg-gradient-to-b from-pink-400 to-purple-600 rounded-full absolute right-1 bottom-0 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
      </div>
      <div className="absolute inset-0 animate-spin" style={{ animation: 'spin 2s linear infinite reverse' }}>
        <div className="w-1 h-4 bg-gradient-to-b from-green-400 to-emerald-600 rounded-full absolute left-2 top-1 animate-pulse" style={{ animationDelay: '0.25s' }}></div>
        <div className="w-1 h-4 bg-gradient-to-b from-yellow-400 to-orange-600 rounded-full absolute right-2 bottom-1 animate-pulse" style={{ animationDelay: '0.75s' }}></div>
      </div>
    </div>
  );

  const handleChangeDate = (direction) => {
    const currentIdx = showtimes.findIndex((d) => {
      const dDate = new Date(d.Day).toISOString().split("T")[0];
      const sDate = new Date(selectedDate).toISOString().split("T")[0];
      return dDate === sDate;
    });

    if (currentIdx === -1) return;

    const newIndex = currentIdx + direction;

    if (newIndex >= 0 && newIndex < showtimes.length) {
      dispatch(setSelectedDate(showtimes[newIndex].Day));
      if (direction === -1 && newIndex < dateIndex) {
        setDateIndex(dateIndex - 1);
      } else if (direction === 1 && newIndex >= dateIndex + 6) {
        setDateIndex(dateIndex + 1);
      }
    }
  };

  // // Clean up timer on unmount
  // useEffect(() => {
  //   return () => {
  //     if (holdTimerRef.current) {
  //       clearTimeout(holdTimerRef.current);
  //     }
  //   };
  // }, []);

  console.log("Product from REDUX:", product);
  console.log("Order Product IDs:", orderProductIds);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a005f] via-[#3f2b96] to-[#000c2d] text-white">
      <div className="max-w-7xl mx-auto py-1 md:py-14 lg:py-18 px-4 sm:px-10 mt-0 pb-8">
        <div className="space-y-6 mt-10">
          {/* Grid 2 cột với chiều cao bằng nhau */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6 lg:gap-8">
            {/* Div trái chứa thông tin phim */}
            <div className="lg:col-span-4 order-1 lg:order-none">
              <div className="relative bg-white/5 backdrop-blur-md rounded-3xl p-4 md:p-6 border border-white/10 shadow-2xl h-full">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-pink-500/5 rounded-3xl"></div>

                <div className="relative z-10 h-full flex flex-col">
                  {/* Poster */}
                  <div className="relative group mb-6">
                    <img
                      src={movie?.PosterImage || "https://via.placeholder.com/300x400"}
                      alt="poster"
                      className="w-full h-64 sm:h-80 md:h-96 lg:h-130 object-cover shadow-xl border rounded-2xl border-white/10"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent rounded-2xl"></div>
                  </div>

                  {/* Thông tin phim - flex-1 để chiếm hết không gian còn lại */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div className="space-y-4 md:space-y-6 mb-6 md:mb-8">
                      {/* Simple Info Cards */}
                      <div className="space-y-3">
                        {/* Runtime */}
                        <div className="flex items-center justify-between p-3 md:p-4 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-all">
                          <div className="flex items-center gap-3">
                            <FaRegClock className="text-purple-400 text-lg" />
                            <span className="text-gray-300 font-medium text-sm md:text-base">Runtime</span>
                          </div>
                          <span className="text-white font-semibold text-sm md:text-base">{movie?.RunningTime} min</span>
                        </div>

                        {/* Release Period */}
                        <div className="flex items-center justify-between p-3 md:p-4 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-all">
                          <div className="flex items-center gap-3">
                            <FaCalendarAlt className="text-purple-400 text-lg" />
                            <span className="text-gray-300 font-medium text-sm md:text-base">Release</span>
                          </div>
                          <span className="text-white font-semibold text-xs md:text-sm">
                            {new Date(movie?.FromDate).toLocaleDateString("vi-VN")} - {new Date(movie?.ToDate).toLocaleDateString("vi-VN")}
                          </span>
                        </div>

                        {/* Director */}
                        <div className="flex items-center justify-between p-3 md:p-4 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-all">
                          <div className="flex items-center gap-3">
                            <RiMovie2AiLine className="text-purple-400 text-xl" />
                            <span className="text-gray-300 font-medium text-sm md:text-base">Director</span>
                          </div>
                          <span className="text-white font-semibold text-right max-w-xs truncate text-sm md:text-base">{movie?.Director}</span>
                        </div>

                        {/* Cast */}
                        <div className="flex items-center justify-between p-3 md:p-4 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-all">
                          <div className="flex items-center gap-3">
                            <MdOutlineStarOutline className="text-purple-400 text-xl" />
                            <span className="text-gray-300 font-medium mr-4 md:mr-10 text-sm md:text-base">Cast</span>
                          </div>
                          <span className="text-white font-semibold text-right max-w-xs truncate text-sm md:text-base">{movie?.Actors}</span>
                        </div>

                        {/* Genre */}
                        <div className="flex items-center justify-between p-3 md:p-4 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-all">
                          <div className="flex items-center gap-3">
                            <GiRegeneration className="text-purple-400 text-xl" />
                            <span className="text-gray-300 font-medium text-sm md:text-base">Genre</span>
                          </div>
                          <div className="flex flex-wrap gap-2 justify-end">
                            {movie?.Genres?.split(',').map((genre, index) => (
                              <span
                                key={index}
                                className="px-2 md:px-3 py-1 bg-purple-500/20 border border-purple-400/30 rounded-full text-xs font-medium text-purple-200"
                              >
                                {genre.trim()}
                              </span>
                            )) || (
                                <span className="px-2 md:px-3 py-1 bg-purple-500/20 border border-purple-400/30 rounded-full text-xs font-medium text-purple-200">
                                  {movie?.Genres}
                                </span>
                              )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* TRAILER - đặt ở cuối */}
                    <button
                      onClick={handleOpenPopup}
                      className="w-full sm:w-1/2 group relative overflow-hidden bg-gradient-to-r from-purple-600 via-purple-500 to-pink-500 
                               hover:from-purple-700 hover:via-purple-600 hover:to-pink-600 
                               rounded-4xl p-2 text-white font-bold text-sm md:text-base
                               shadow-xl hover:shadow-2xl hover:shadow-purple-500/20 
                               transform hover:scale-[1.02] transition-all duration-300 ease-out
                               border border-purple-400/20 mt-auto"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                      <div className="relative flex items-center justify-center gap-3">
                        <MdOutlineOndemandVideo className="text-xl" />
                        <span className="tracking-wide">Watch Trailer</span>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Div phải chứa seatmap và thông tin phim, showtimes selection */}
            <div className="lg:col-span-8 order-2 lg:order-none">
              <div className="bg-white/5 backdrop-blur-md rounded-3xl p-4 md:p-6 lg:p-8 border border-white/10 shadow-2xl h-full">
                <div className="h-full flex flex-col">
                  <div className="mb-6 md:mb-8">
                    <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3 bg-gradient-to-r from-white via-purple-100 to-pink-100 bg-clip-text text-transparent">
                      {movie?.NameOfEnglish}
                    </h1>
                    <p className="text-gray-300 text-base md:text-lg font-medium mb-4">({movie?.NameOfVietnamese})</p>
                  </div>

                  {/* Showtimes div */}
                  <div className="mb-6 md:mb-8">
                    <div className="space-y-6 md:space-y-0 md:flex md:items-center md:gap-4 lg:gap-8 text-sm text-white/80">

                      {/* Date Selection */}
                      <div className="flex-1">
                        <label className="block mb-4 text-white font-bold text-lg md:text-xl text-center md:text-left">Date</label>
                        <div className="flex items-center gap-2 md:gap-3">
                          <button
                            className="p-2 text-purple-400 hover:text-purple-300 hover:bg-white/10 rounded-xl transition-all flex-shrink-0"
                            onClick={() => handleChangeDate(-1)}
                          >
                            <FaChevronLeft />
                          </button>

                          <div className="flex gap-1 md:gap-2 overflow-x-auto flex-1 scrollbar-hide">
                            {visibleDates.map((d, idx) => {
                              const isSelected = d.Day === selectedDate;
                              const dayObj = new Date(d.Day);
                              return (
                                <div
                                  key={idx}
                                  className={`flex flex-col items-center justify-center min-w-[48px] md:min-w-[64px] h-12 md:h-16 rounded-2xl md:rounded-4xl text-xs md:text-sm cursor-pointer transition-all duration-200
                                   ${isSelected
                                      ? "bg-gradient-to-r from-purple-600 via-purple-500 to-pink-500  text-white shadow-lg"
                                      : "bg-white/10 hover:bg-white/20 text-white/80"
                                    }`}
                                  onClick={() => dispatch(setSelectedDate(d.Day))}

                                >
                                  <span className="text-[8px] md:text-[10px] font-medium opacity-90">
                                    {dayObj.toLocaleDateString("en-US", { month: "short" }).toUpperCase()}
                                  </span>
                                  <span className="text-sm md:text-base font-bold">
                                    {dayObj.getDate().toString().padStart(2, "0")}
                                  </span>
                                  <span className="text-[8px] md:text-[10px] opacity-90 hidden md:block">
                                    {dayObj.toLocaleDateString("en-US", { weekday: "short" }).toUpperCase()}
                                  </span>
                                </div>
                              );
                            })}
                          </div>

                          <button
                            className="p-2 text-purple-400 hover:text-purple-300 hover:bg-white/10 rounded-xl transition-all flex-shrink-0"
                            onClick={() => handleChangeDate(+1)}
                          >
                            <FaChevronRight />
                          </button>
                        </div>
                      </div>

                      {/* Time Selection */}
                      <div className="w-full md:w-64 lg:w-80">
                        <label className="block mb-4 text-white font-bold text-lg md:text-xl text-center md:text-left">Time</label>
                        <div className="relative">
                          <select
                            value={selectedShowtimeId || ""}
                            onChange={(e) => {
                              const selectedId = e.target.value;
                              const matched = timeOptions
                                .flatMap((ver) =>
                                  ver.showtimes.map((s) => ({ ...s, version: ver.version }))
                                )
                                .find((s) => s.showtimeId === selectedId);

                              if (matched) {
                                dispatch(setSelectedTime(matched.time));
                                dispatch(setSelectedRoom(`Room ${matched.roomName} — ${matched.version}`));
                                dispatch(setSelectedShowtimeId(matched.showtimeId));
                              } else {
                                dispatch(setSelectedTime(""));
                                dispatch(setSelectedRoom(""));
                                dispatch(setSelectedShowtimeId(null));
                              }
                            }}

                            className="appearance-none w-full py-3 pl-4 pr-10 text-xs md:text-sm font-semibold text-white 
                           bg-gradient-to-r from-[#36355a] to-[#4e408e] border border-purple-500/30 
                          hover:border-purple-400/50 focus:outline-none focus:ring-1 focus:ring-purple-500/50
                           transition duration-200 rounded-2xl md:rounded-4xl shadow-md"
                          >
                            <option value="" disabled>
                              Choose Time
                            </option>
                            {timeOptions.flatMap((ver) =>
                              ver.showtimes.map((s) => (
                                <option
                                  key={s.showtimeId}
                                  value={s.showtimeId}
                                  className="text-gray-900 bg-white"
                                >
                                  {s.time} - ({ver.version})
                                </option>
                              ))
                            )}
                          </select>
                          <FaChevronDown className="absolute top-1/2 right-3 -translate-y-1/2 text-purple-300 pointer-events-none text-sm" />
                        </div>
                      </div>

                      {/* Room Display */}
                      <div className="w-full md:w-48 lg:w-64">
                        <label className="block mb-4 text-white font-bold text-lg md:text-xl text-center md:text-left">Room</label>
                        <div className="bg-white/10 rounded-2xl md:rounded-4xl p-3 border border-white/20 h-12 flex items-center">
                          <div className="flex items-center gap-2 text-white text-xs md:text-sm font-medium">
                            <MdOutlineMeetingRoom className="text-purple-400 text-lg flex-shrink-0" />
                            <span className="truncate">
                              {selectedRoom || "—"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Seat Map - flex-1 để chiếm hết không gian còn lại */}
                  <div className="flex-1 flex flex-col">
                    {/* Refresh button */}
                    {selectedShowtimeId && (
                      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
                        <h3 className="text-lg md:text-xl font-bold text-white">Select Your Seats</h3>
                        <button
                          onClick={handleManualRefresh}
                          disabled={isRefreshing}
                          className="flex items-center gap-2 px-3 md:px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 
                                   border border-purple-400/30 rounded-xl text-purple-300 hover:text-purple-200 
                                   transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <span className="text-xs md:text-sm font-medium">
                            {isRefreshing ? 'Refreshing...' : 'Refresh Seats'}
                          </span>
                        </button>
                      </div>
                    )}

                    {/* Seat Map Container - flex-1 */}
                    <div className="flex-1 flex flex-col justify-center">
                      {seatsData.length > 0 ? (
                        <div className="flex justify-center bg-white/2 rounded-2xl p-3 md:p-6 border border-white/10 overflow-x-auto">
                          <LayoutSelectSeat
                            key={`${selectedShowtimeId}-${lastRefreshTime}`}
                            initialSelectedSeats={selectedSeats}
                            seatDataFromAPI={seatsData}
                            totalSeats={seatQuantity}
                            onSeatSelect={({ seats, totalPrice, seatIds }) => {
                              if (!user) {
                                Swal.fire({
                                  icon: "info",
                                  title: "Sign In !",
                                  text: "Please sign in for service",
                                  confirmButtonText: "Sign In",
                                }).then((result) => {
                                  if (result.isConfirmed) {
                                    navigate("/login");
                                  }
                                });
                                return;
                              }
                              dispatch(setSelectedSeats(seats.map((s) => s.seatNumber)));
                              dispatch(setCalculatedTotalPrice(totalPrice));
                              dispatch(setSeatIds(seatIds));
                            }}
                            width={24}
                            height={24}
                            widthDouble={48}
                            heightDouble={32}
                            gapX={3}
                            textColor="text-blue-300/70"
                            seatColors={{
                              available: "text-gray-500",
                              selected: "text-[#5341DB]",
                              taken: "text-[#6A7282]",
                            }}
                          />
                        </div>
                      ) : (
                        <div className="text-center py-8 md:py-12 bg-white/5 rounded-2xl text-gray-400">
                          <DNALoader />
                          <p className="font-semibold mt-2 text-sm md:text-base">
                            {isRefreshing ? 'Refreshing seats...' : 'Loading seats...'}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Products Section - nằm dưới và rộng bằng 2 div trên */}
          {product && product.length > 0 && (
            <div className="bg-white/5 backdrop-blur-md rounded-3xl p-4 md:p-6 lg:p-8 border border-white/10 shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg md:text-xl font-bold text-white">Snacks & Drinks</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
                {product.filter(p => !p.IsDeleted && p.Quantity > 0).map((prod) => (
                  <ProductCard
                    key={prod.ProductId}
                    product={prod}
                    onQuantityChange={handleProductSelect}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Order Summary Section */}
          {(selectedSeats.length > 0 || selectedProducts.length > 0) && (
            <div className="bg-white/5 backdrop-blur-md rounded-3xl p-4 md:p-6 lg:p-8 border border-white/10 shadow-2xl">
              <h3 className="text-lg md:text-xl font-bold text-white mb-6">Order Summary</h3>

              <div className="space-y-4">
                {/* Seats Summary */}
                {selectedSeats.length > 0 && (
                  <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-300 font-medium">Movie Tickets</span>
                      <span className="text-white font-semibold">{formatPrice(calculatedTotalPrice || 0)}</span>
                    </div>
                    <div className="text-sm text-gray-400">
                      {selectedSeats.length} seat{selectedSeats.length > 1 ? 's' : ''}: {selectedSeats.join(', ')}
                    </div>
                  </div>
                )}

                {/* Products Summary */}
                {selectedProducts.length > 0 && (
                  <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-300 font-medium">Snacks & Drinks</span>
                      <span className="text-white font-semibold">{formatPrice(totalProductPrice)}</span>
                    </div>
                    <div className="space-y-1 text-sm text-gray-400">
                      {selectedProducts.map((item, index) => (
                        <div key={index} className="flex justify-between">
                          <span>{item.ProductName} x{item.selectedQuantity}</span>
                          <span>{formatPrice(item.Price * item.selectedQuantity)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Total */}
                <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-2xl p-4 border border-purple-400/30">
                  <div className="flex justify-between items-center">
                    <span className="text-white font-bold text-lg">Total Amount</span>
                    <span className="text-purple-300 font-bold text-2xl">{formatPrice(totalAmount)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Continue Payment Button - đặt trong trang thay vì fixed */}
          {(selectedSeats.length > 0 || selectedProducts.length > 0) && (
            <div className="bg-white/5 backdrop-blur-md rounded-3xl p-4 md:p-6 lg:p-8 border border-white/10 shadow-2xl">
              <div className="flex justify-center">
                <button
                  disabled={isHoldingProducts}
                  onClick={handleContinue}
                  className="px-8 py-4 bg-gradient-to-r from-purple-600 via-purple-500 to-pink-500 hover:from-purple-700 hover:via-purple-600 hover:to-pink-600 shadow-xl hover:shadow-2xl hover:shadow-purple-500/20 
                           transform hover:scale-[1.02] transition-all duration-300 ease-out
                           border border-purple-400/20 text-white font-semibold rounded-4xl disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap text-lg"
                >
                  <FaTicketAlt className="inline-block mr-2" />
                  {isHoldingProducts ? 'Holding Products...' : 'Continue Payment'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Video Popup */}
      {isPopupOpen && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="relative w-full max-w-5xl">
            <video
              ref={popupVideoRef}
              controls
              className="w-full rounded-2xl shadow-2xl"
            >
              <source
                src={
                  movie?.TrailerUrl ||
                  "https://storage.googleapis.com/movie-c96b6.firebasestorage.app/trailers/1749720180325-The_Smurfs_2_-_How_Smurfette_Came_to_Be___Fandango_Family.mp4"
                }
                type="video/mp4"
              />
              Your browser does not support the video tag.
            </video>
            <button
              onClick={handleClosePopup}
              className="absolute -top-2 -right-2 md:-top-4 md:-right-4 text-white bg-red-500 hover:bg-red-600 w-10 h-10 md:w-12 md:h-12 rounded-full hover:scale-110 transition-all duration-200 shadow-xl text-sm md:text-base"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingPage;