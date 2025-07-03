import { useEffect, useRef, useState } from "react";
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
  resetBooking,
  
} from "../../../redux/features/bookingSlice";
import { useAuth } from "../../../context/AuthContext";
import { slugify } from "./Slug";
import { getAllProducts, getMovies, getSeatsByShowtimeId, getShowtimeByMovieId, getTimeByDay } from "../../../services/API";
import { LayoutSelectSeat } from "../../../component/LayoutSelectSeat";
import DoubleSeatNoneLight from "../../../assets/DoubleSeatNoneLight.svg";
import DoubleSeatSelectingLight from "../../../assets/DoubleSeatSelectingLight.svg";
import DoubleSeatSelected from "../../../assets/DoubleSeatSelected.svg";


const BookingPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { slug } = useParams();
  const { user } = useAuth();
  const popupVideoRef = useRef(null);

  const {
    selectedSeats,
    seatIds,
    calculatedTotalPrice,
    selectedRoom,
    selectedDate,
    selectedTime,
    selectedShowtimeId,
    seatQuantity,
    seatsData,
    movie,
    
  } = useSelector((state) => state.booking);

  const [showtimes, setShowtimes] = useState([]);
  const [timeOptions, setTimeOptions] = useState([]);
  const [dateIndex, setDateIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [lastRefreshTime, setLastRefreshTime] = useState(Date.now());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);



  useEffect(() => {
    const fetchMovie = async () => {
      dispatch(resetBooking());
      
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
  }, [slug]);

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

        console.log("== SEATS DATA:", seatIds);
      } catch (error) {
        console.error("Lỗi khi lấy seats:", error);
      } finally {
        setIsRefreshing(false);
      }
    };
    fetchSeatsByShowtimeId();
  }, [selectedShowtimeId]);

  const refreshSeats = async () => {
    if (!selectedShowtimeId) return;
    setIsRefreshing(true);
    try {
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
    const interval = setInterval(() => {
      refreshSeats();
    }, 30000);
    return () => clearInterval(interval);
  }, [selectedShowtimeId]);

  useEffect(() => {
    const handleFocus = () => {
      if (selectedShowtimeId) refreshSeats();
    };
    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [selectedShowtimeId]);

  // const handleSeatSelect = ({ seats, totalPrice, seatIds }) => {
  //   if (!user) {
  //     Swal.fire({
  //       icon: "info",
  //       title: "Sign In !",
  //       text: "Please sign in for service",
  //       confirmButtonText: "Sign In",
  //     }).then((result) => {
  //       if (result.isConfirmed) {
  //         navigate("/login");
  //       }
  //     });
  //     return;
  //   }
  //   dispatch(setSelectedSeats(seats.map((s) => s.seatNumber)));
  //   dispatch(setCalculatedTotalPrice(totalPrice));
  //   dispatch(setSeatIds(seatIds));
  // };

  // const handleTimeChange = (e) => {
  //   const selectedId = e.target.value;
  //   const matched = timeOptions.flatMap((ver) =>
  //     ver.showtimes.map((s) => ({ ...s, version: ver.version }))
  //   ).find((s) => s.showtimeId === selectedId);

  //   if (matched) {
  //     dispatch(setSelectedTime(matched.time));
  //     dispatch(setSelectedRoom(`Room ${matched.roomName} — ${matched.version}`));
  //     dispatch(setSelectedShowtimeId(matched.showtimeId));
  //   } else {
  //     dispatch(setSelectedTime(""));
  //     dispatch(setSelectedRoom(""));
  //     dispatch(setSelectedShowtimeId(null));
  //   }
  // };

  const handleContinue = () => {
    navigate("/confirmPayment");
  };


  // useEffect(() => {
  //   if (!selectedShowtimeId) return;

  //   const interval = setInterval(() => {
  //     console.log("== Auto refreshing seats...");
  //     refreshSeats();
  //   }, 30000);

  //   return () => clearInterval(interval);
  // }, [selectedShowtimeId]);


  useEffect(() => {
    const handleFocus = () => {
      if (selectedShowtimeId) {
        console.log("== Window focused, refreshing seats...");
        refreshSeats();
      }
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [selectedShowtimeId]);


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

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a005f] via-[#3f2b96] to-[#000c2d] text-white">
      <div className="max-w-7xl mx-auto py-4 md:py-8 lg:py-26 px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6 lg:gap-8">
          {/* Div trái chứa thông tin phim */}
          <div className="lg:col-span-4 order-1 lg:order-none">
            <div className="relative bg-white/5 backdrop-blur-md rounded-3xl p-4 md:p-6 border border-white/10 shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-pink-500/5 rounded-3xl"></div>

              <div className="relative z-10 ">
                {/* Poster */}
                <div className="relative group mb-6 ">
                  <img
                    src={movie?.PosterImage || "https://via.placeholder.com/300x400"}
                    alt="poster"
                    className="w-full h-64 sm:h-80 md:h-96 lg:h-130 object-cover shadow-xl border rounded-2xl border-white/10"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent rounded-2xl"></div>
                </div>

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

                {/* TRAILER */}
                <button
                  onClick={handleOpenPopup}
                  className="w-full sm:w-1/2 group relative overflow-hidden bg-gradient-to-r from-purple-600 via-purple-500 to-pink-500 
                           hover:from-purple-700 hover:via-purple-600 hover:to-pink-600 
                           rounded-4xl p-2 text-white font-bold text-sm md:text-base
                           shadow-xl hover:shadow-2xl hover:shadow-purple-500/20 
                           transform hover:scale-[1.02] transition-all duration-300 ease-out
                           border border-purple-400/20"
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

          {/* BOOKING SECTION - Right Side */}
          <div className="lg:col-span-8 order-2 lg:order-none">
            <div className="bg-white/5 backdrop-blur-md rounded-3xl p-4 md:p-6 lg:p-8 border border-white/10 shadow-2xl">

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

              {/* Seat Map */}
              <div className="mb-6 md:mb-8">
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
                      <GiRegeneration className={`text-lg ${isRefreshing ? 'animate-spin' : ''}`} />
                      <span className="text-xs md:text-sm font-medium">
                        {isRefreshing ? 'Refreshing...' : 'Refresh Seats'}
                      </span>
                    </button>
                  </div>
                )}

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
                        // coupleSeat: {
                        //   available: DoubleSeatNoneLight,
                        //   selected: DoubleSeatSelectingLight,
                        //   taken: DoubleSeatSelected,
                        // }
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

              {/* Continue Button */}
              <div className="flex justify-center md:justify-end">
                <button
                  disabled={selectedSeats.length === 0}
                  onClick={handleContinue}
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 via-purple-500 to-pink-500  hover:from-purple-700 hover:via-purple-600 hover:to-pink-600 shadow-xl hover:shadow-2xl hover:shadow-purple-500/20 
                           transform hover:scale-[1.02] transition-all duration-300 ease-out
                           border border-purple-400/20  text-white font-semibold rounded-4xl disabled:opacity-50"
                >
                  
                  <FaTicketAlt className="inline-block mr-2" />
                  Continue Payment
                </button>
              </div>
            </div>
          </div>
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