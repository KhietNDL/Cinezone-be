import { useEffect, useRef, useState } from "react";
import {
  FaStar,
  FaRegClock,
  FaCalendarAlt,
  FaTicketAlt,
  FaChevronLeft,
  FaChevronRight,
  FaChevronDown,
} from "react-icons/fa";
import { MdOutlineOndemandVideo, MdOutlineMeetingRoom, MdOutlineStarOutline } from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import Swal from "sweetalert2";
import { slugify } from "./Slug";
import {
  getAllProducts,
  getMovies,
  getSeatsByShowtimeId,
  getShowtimeByMovieId,
  getTimeByDay,
} from "../../../services/API";
import { LayoutSelectSeat } from "../../../component/LayoutSelectSeat";
import { RiMovie2AiLine } from "react-icons/ri";
import { GiRegeneration } from "react-icons/gi";

import DoubleSeatNoneLight from "../../../assets/DoubleSeatNoneLight.svg";
import DoubleSeatSelectingLight from "../../../assets/DoubleSeatSelectingLight.svg"
import DoubleSeatSelected from "../../../assets/DoubleSeatSelected.svg";

const BookingPage = () => {
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [showtimes, setShowtimes] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [timeOptions, setTimeOptions] = useState([]);
  const [dateIndex, setDateIndex] = useState(0);
  const [seatsData, setSeatsData] = useState([]);
  const [seatQuantity, setSeatQuantity] = useState(0);

  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const popupVideoRef = useRef(null);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { slug } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedRoom, setSelectedRoom] = useState("");
  const [selectedShowtimeId, setSelectedShowtimeId] = useState("");

  const ticketPrice = 100000;
  const totalPrice = selectedSeats.length * ticketPrice;
  const [calculatedTotalPrice, setCalculatedTotalPrice] = useState(0);
  const [seatIds, setSeatIds] = useState([]);

  // Thêm state để track refresh
  const [lastRefreshTime, setLastRefreshTime] = useState(Date.now());
  const [isRefreshing, setIsRefreshing] = useState(false);

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
        if (matchedMovie) setMovie(matchedMovie);
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
        const response = await getShowtimeByMovieId(movie.MovieId);
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
        const response = await getTimeByDay(movie.MovieId, selectedDate);
        setTimeOptions(response.versions);
        console.log("== Time options được set:", response.versions);
      } catch (error) {
        console.error("Lỗi khi lấy giờ chiếu:", error);
      }
    };
    fetchTimeByDay();
  }, [selectedDate, movie]);

  // FIXED: Fetch seats khi selectedShowtimeId thay đổi
  useEffect(() => {
    const fetchSeatsByShowtimeId = async () => {
      if (!selectedShowtimeId) return;
      
      setIsRefreshing(true);
      console.log("== Fetching seats for showtime ID:", selectedShowtimeId);
      
      try {
        const response = await getSeatsByShowtimeId(selectedShowtimeId);
        setSeatsData(response.seats);
        setSeatQuantity(response.seatQuantity);
        
        // Reset selected seats khi load lại data
        setSelectedSeats([]);
        setCalculatedTotalPrice(0);
        setSeatIds([]);
        
        console.log("== Seat Data được set:", response.seats);
        console.log("== Seat Quantity được set:", response.seatQuantity);
      } catch (error) {
        console.error("Lỗi khi lấy seats:", error);
      } finally {
        setIsRefreshing(false);
      }
    };
    fetchSeatsByShowtimeId();
  }, [selectedShowtimeId]); // Chỉ depend vào selectedShowtimeId

  // FIXED: Separate function để refresh seats
  const refreshSeats = async () => {
    if (!selectedShowtimeId) return;
    
    setIsRefreshing(true);
    console.log("== Refreshing seats for showtime ID:", selectedShowtimeId);
    
    try {
      const response = await getSeatsByShowtimeId(selectedShowtimeId);
      setSeatsData(response.seats);
      setSeatQuantity(response.seatQuantity);
      
      // Reset selected seats khi refresh
      setSelectedSeats([]);
      setCalculatedTotalPrice(0);
      setSeatIds([]);
      
      console.log("== Seat Data được refresh:", response.seats);
      setLastRefreshTime(Date.now()); // Update để force re-render component
    } catch (error) {
      console.error("Lỗi khi refresh seats:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  // FIXED: Auto refresh seats mỗi 30 giây để sync với backend
  useEffect(() => {
    if (!selectedShowtimeId) return;

    const interval = setInterval(() => {
      console.log("== Auto refreshing seats...");
      refreshSeats(); // Gọi function refresh thay vì set lastRefreshTime
    }, 30000); // Refresh mỗi 30 giây

    return () => clearInterval(interval);
  }, [selectedShowtimeId]);

  // FIXED: Refresh khi window focus (khi user quay lại tab)
  useEffect(() => {
    const handleFocus = () => {
      if (selectedShowtimeId) {
        console.log("== Window focused, refreshing seats...");
        refreshSeats(); // Gọi function refresh thay vì set lastRefreshTime
      }
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [selectedShowtimeId]);

  // FIXED: Manual refresh function
  const handleManualRefresh = () => {
    refreshSeats(); // Gọi function refresh
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

  if (loading)
    return <div className="text-white text-center mt-20">LOADING...</div>;
  if (!movie)
    return (
      <div className="text-white text-center mt-20">NOT FOUND</div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a005f] via-[#3f2b96] to-[#000c2d] text-white">
      <div className="max-w-7xl mx-auto py-26 px-6">
        <div className="grid grid-cols-12 gap-8">
          {/* DIV BEN TRAIL */}
          <div className="col-span-4 space-y-6">

            <div className="relative bg-white/5 backdrop-blur-md rounded-3xl p-6 border border-white/10 shadow-2xl">

              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-pink-500/5 rounded-3xl"></div>

              <div className="relative z-10">
                {/* Poster */}
                <div className="relative group mb-6">
                  <img
                    src={movie.PosterImage || "https://via.placeholder.com/300x400"}
                    alt="poster"
                    className="w-full h-130  object-cover shadow-xl border rounded-2xl border-white/10"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent rounded-2xl"></div>
                </div>

                <div className="space-y-6 mb-8">
                  {/* Simple Info Cards */}
                  <div className="space-y-3">
                    {/* Runtime */}
                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-all">
                      <div className="flex items-center gap-3">
                        <FaRegClock className="text-purple-400 text-lg" />
                        <span className="text-gray-300 font-medium">Runtime</span>
                      </div>
                      <span className="text-white font-semibold">{movie.RunningTime} min</span>
                    </div>

                    {/* Release Period */}
                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-all">
                      <div className="flex items-center gap-3">
                        <FaCalendarAlt className="text-purple-400 text-lg" />
                        <span className="text-gray-300 font-medium">Release</span>
                      </div>
                      <span className="text-white font-semibold text-sm">
                        {new Date(movie.FromDate).toLocaleDateString("vi-VN")} - {new Date(movie.ToDate).toLocaleDateString("vi-VN")}
                      </span>
                    </div>

                    {/* Director */}
                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-all">
                      <div className="flex items-center gap-3">

                        <RiMovie2AiLine className="text-purple-400 text-xl" />

                        <span className="text-gray-300 font-medium">Director</span>
                      </div>
                      <span className="text-white font-semibold text-right max-w-xs truncate">{movie.Director}</span>
                    </div>

                    {/* Cast */}
                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-all">
                      <div className="flex items-center gap-3">

                        <MdOutlineStarOutline className="text-purple-400 text-xl" />

                        <span className="text-gray-300 font-medium mr-10">Cast</span>
                      </div>
                      <span className="text-white font-semibold text-right max-w-xs truncate">{movie.Actors}</span>
                    </div>


                    {/* Genre */}
                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-all">
                      <div className="flex items-center gap-3">
                        <GiRegeneration className="text-purple-400 text-xl" />
                        <span className="text-gray-300 font-medium">Genre</span>
                      </div>
                      <div className="flex flex-wrap gap-2 justify-end">
                        {movie.Genres?.split(',').map((genre, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-purple-500/20 border border-purple-400/30 rounded-full text-xs font-medium text-purple-200"
                          >
                            {genre.trim()}
                          </span>
                        )) || (
                            <span className="px-3 py-1 bg-purple-500/20 border border-purple-400/30 rounded-full text-xs font-medium text-purple-200">
                              {movie.Genres}
                            </span>
                          )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* TRAILER */}
                <button
                  onClick={handleOpenPopup}
                  className="w-1/2 group relative overflow-hidden bg-gradient-to-r from-purple-600 via-purple-500 to-pink-500 
                           hover:from-purple-700 hover:via-purple-600 hover:to-pink-600 
                           rounded-4xl p-2 text-white font-bold text-base
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

          {/* DIV BEN PHAI*/}
          <div className="col-span-8">
            <div className="bg-white/5 backdrop-blur-md rounded-3xl p-8 border border-white/10 shadow-2xl">

              <div className="mb-8 ">
                <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-white via-purple-100 to-pink-100 bg-clip-text text-transparent">
                  {movie.NameOfEnglish}
                </h1>
                <p className="text-gray-300 text-lg font-medium mb-4">({movie.NameOfVietnamese})</p>

              </div>

              {/*showtimes div*/}
              <div className="mb-8">
                <div className="flex items-center gap-8 text-sm text-white/80">

                  {/* chon ngay*/}
                  <div className="flex-1">
                    <label className="block mb-4 text-white font-bold text-xl ml-11">Date</label>
                    <div className="flex items-center gap-3">
                      <button
                        className="p-2 text-purple-400 hover:text-purple-300 hover:bg-white/10 rounded-xl transition-all flex-shrink-0"
                        onClick={() => {
                          const currentIdx = showtimes.findIndex((d) => d.Day === selectedDate);
                          if (currentIdx > 0) {
                            setSelectedDate(showtimes[currentIdx - 1].Day);
                            if (currentIdx - 1 < dateIndex) setDateIndex(dateIndex - 1);
                          }
                        }}
                      >
                        <FaChevronLeft />
                      </button>

                      <div className="flex gap-2 overflow-x-auto flex-1">
                        {visibleDates.map((d, idx) => {
                          const isSelected = d.Day === selectedDate;
                          const dayObj = new Date(d.Day);
                          return (
                            <div
                              key={idx}
                              className={`flex flex-col items-center justify-center min-w-[64px] h-16 rounded-4xl text-sm cursor-pointer transition-all duration-200
                               ${isSelected
                                  ? "bg-purple-500 text-white shadow-lg"
                                  : "bg-white/10 hover:bg-white/20 text-white/80"
                                }`}
                              onClick={() => setSelectedDate(d.Day)}
                            >
                              <span className="text-[10px] font-medium opacity-90">
                                {dayObj.toLocaleDateString("en-US", { month: "short" }).toUpperCase()}
                              </span>
                              <span className="text-base font-bold">
                                {dayObj.getDate().toString().padStart(2, "0")}
                              </span>
                              <span className="text-[10px] opacity-90">
                                {dayObj.toLocaleDateString("en-US", { weekday: "short" }).toUpperCase()}
                              </span>
                            </div>
                          );
                        })}
                      </div>

                      <button
                        className="p-2 text-purple-400 hover:text-purple-300 hover:bg-white/10 rounded-xl transition-all flex-shrink-0"
                        onClick={() => {
                          const currentIdx = showtimes.findIndex((d) => d.Day === selectedDate);
                          if (currentIdx < showtimes.length - 1) {
                            setSelectedDate(showtimes[currentIdx + 1].Day);
                            if (currentIdx + 1 >= dateIndex + 6) setDateIndex(dateIndex + 1);
                          }
                        }}
                      >
                        <FaChevronRight />
                      </button>
                    </div>
                  </div>

                  {/* Chon thoi gian*/}
                  <div className="w-80">
                    <label className="block mb-4 text-white font-bold text-xl ">Time</label>
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
                            setSelectedTime(matched.time);
                            setSelectedRoom(`Room ${matched.roomName} — ${matched.version}`);
                            setSelectedShowtimeId(matched.showtimeId);
                          } else {
                            setSelectedTime("");
                            setSelectedRoom("");
                            setSelectedShowtimeId(null);
                          }
                        }}
                        className="appearance-none w-full py-3 pl-4 pr-10 text-sm font-semibold text-white 
                       bg-gradient-to-r from-[#36355a] to-[#4e408e] border border-purple-500/30 
                      hover:border-purple-400/50 focus:outline-none focus:ring-1 focus:ring-purple-500/50
                       transition duration-200 rounded-4xl shadow-md"
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

                  {/* room theo showtime */}
                  <div className="w-64">
                    <label className="block mb-4 text-white font-bold text-xl">Room</label>
                    <div className="bg-white/10 rounded-4xl p-3 border border-white/20 h-12 flex items-center">
                      <div className="flex items-center gap-2 text-white text-sm font-medium">
                        <MdOutlineMeetingRoom className="text-purple-400 text-lg flex-shrink-0" />
                        <span className="truncate">
                          {selectedRoom || "—"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* seatmap */}
              <div className="mb-8">
                {/* FIXED: Thêm refresh button */}
                {selectedShowtimeId && (
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-white">Select Your Seats</h3>
                    <button
                      onClick={handleManualRefresh}
                      disabled={isRefreshing}
                      className="flex items-center gap-2 px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 
                               border border-purple-400/30 rounded-xl text-purple-300 hover:text-purple-200 
                               transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <GiRegeneration className={`text-lg ${isRefreshing ? 'animate-spin' : ''}`} />
                      <span className="text-sm font-medium">
                        {isRefreshing ? 'Refreshing...' : 'Refresh Seats'}
                      </span>
                    </button>
                  </div>
                )}

                {seatsData.length > 0 ? (
                  <div className="flex justify-center bg-white/2 rounded-2xl p-6 border border-white/10">
                    <LayoutSelectSeat
                      key={`${selectedShowtimeId}-${lastRefreshTime}`} // FIXED: Force re-render khi data thay đổi
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
                        setSelectedSeats(seats.map((s) => s.seatNumber));
                        setCalculatedTotalPrice(totalPrice);
                        setSeatIds(seatIds);
                      }}
                      width={30}
                      height={30}
                      widthDouble={60}
                      heightDouble={40}
                      gapX={4}
                      textColor="text-blue-300/70"
                      seatColors={{
                        available: "text-gray-500",
                        selected: "text-[#5341DB]",
                        taken: "text-[#6A7282]",
                        coupleSeat: {
                          available: DoubleSeatNoneLight,
                          selected: DoubleSeatSelectingLight,
                          taken: DoubleSeatSelected,
                        }
                      }}
                    />
                  </div>
                ) : (
                  <div className="text-center py-12 bg-white/5 rounded-2xl text-gray-400">
                    <DNALoader />
                    <p className="font-semibold mt-2">
                      {isRefreshing ? 'Refreshing seats...' : 'Loading seats...'}
                    </p>
                  </div>
                )}
              </div>

              {/* Continue Button */}
              <div className="flex justify-end">
                <button
                  className="px-5 py-2 bg-gradient-to-r from-white/10 to-white/20 rounded-4xl 
                           hover:from-white/20 hover:to-white/30 disabled:opacity-40 
                           font-bold text-lg disabled:cursor-not-allowed transition-all duration-300
                           border border-white/20 hover:border-white/30 shadow-xl
                           hover:scale-105 hover:shadow-2xl"
                  disabled={selectedSeats.length === 0}
                  onClick={() =>
                    navigate("/confirmPayment", {
                      state: {
                        selectedSeats,
                        calculatedTotalPrice,
                        selectedRoom,
                        selectedDate,
                        selectedTime,
                        movie,
                        selectedShowtimeId,
                        userId: user?.userId || null,
                        seatIds,
                      },
                    })
                  }
                >
                  <FaTicketAlt className="inline-block mr-3" />
                  Continue Payment
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Video Popup */}
      {isPopupOpen && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="relative w-full max-w-5xl mx-4">
            <video
              ref={popupVideoRef}
              controls
              className="w-full rounded-2xl shadow-2xl"
            >
              <source
                src={
                  movie.TrailerUrl ||
                  "https://storage.googleapis.com/movie-c96b6.firebasestorage.app/trailers/1749720180325-The_Smurfs_2_-_How_Smurfette_Came_to_Be___Fandango_Family.mp4"
                }
                type="video/mp4"
              />
              Your browser does not support the video tag.
            </video>
            <button
              onClick={handleClosePopup}
              className="absolute -top-4 -right-4 text-white bg-red-500 hover:bg-red-600 w-12 h-12 rounded-full hover:scale-110 transition-all duration-200 shadow-xl"
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