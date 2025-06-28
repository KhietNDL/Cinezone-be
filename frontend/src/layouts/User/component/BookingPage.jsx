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
import { MdOutlineOndemandVideo, MdOutlineMeetingRoom } from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import Swal from "sweetalert2";
import { slugify } from "./Slug";
import {
  getMovies,
  getSeatsByShowtimeId,
  getShowtimeByMovieId,

  getTimeByDay,
} from "../../../services/API";
import { LayoutSelectSeat } from "../../../component/LayoutSelectSeat";
import { RiMovie2AiLine } from "react-icons/ri";

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

  useEffect(() => {
    const fetchSeatsByShowtimeId = async () => {
      if (!selectedShowtimeId) return;

      try {

        const response = await getSeatsByShowtimeId(selectedShowtimeId);
        setSeatsData(response.seats);
        setSeatQuantity(response.seatQuantity);
        console.log("== Seat Data duoc set:", response.seats);
        console.log("== Seat Quantity duoc set:", response.seatQuantity);
      } catch (error) {
        console.error("Lỗi khi lấy giờ chiếu:", error);
      }
    };
    fetchSeatsByShowtimeId();
  }, [selectedShowtimeId]);

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

  const comboList = [
    {
      id: 1,
      name: "Combo 1",
      description: "1 Bắp + 1 Nước",
      price: 69000,
      image: "https://library.the1.co.th/content/dam/the1/offers/20220720_Redeem_790PComboMAWO_SFC.jpg",
    },
    {
      id: 2,
      name: "Combo 2",
      description: "2 Bắp + 2 Nước",
      price: 129000,
      image: "https://cdn.eventcinemas.com.au/cdn/resources/contentupload/images/promo/2023/theflash/combo_1458x1115.jpg",
    },
    {
      id: 3,
      name: "Combo Siêu Vip",
      description: "2 Bắp lớn + 2 Pepsi lớn + snack",
      price: 159000,
      image: "https://www.everydayonsales.com/wp-content/uploads/2020/02/TGV-Cinemas-FREE-Popcorn-Combo-with-MasterCard-2020-Malaysia-FREEBIES-2021-Promotion-Movie-Times-937x1024.jpg",
    },
    {
      id: 4,
      name: "Combo Siêu Vip",
      description: "2 Bắp lớn + 2 Pepsi lớn + snack",
      price: 159000,
      image: "https://library.the1.co.th/content/dam/the1/offers/20220720_Redeem_790PComboMAWO_SFC.jpg",
    },
  ];


  if (loading)
    return <div className="text-white text-center mt-20">Đang tải...</div>;
  if (!movie)
    return (
      <div className="text-white text-center mt-20">Không tìm thấy phim.</div>
    );
  console.log("selectedId:", selectedShowtimeId);
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a005f] via-[#3f2b96] to-[#000c2d] text-white p-4 pt-[100px] ">
      <div className="max-w-6xl mx-auto flex gap-6 bg-white/5 py-10 rounded-t-2xl">

        <img
          src={movie.PosterImage || "https://via.placeholder.com/150x200"}
          alt="poster"
          className="w-32 sm:w-40 h-48 sm:h-60 rounded-lg object-cover ml-26"
        />
        <div className="flex-1 space-y-2">
          <h1 className="text-4xl font-bold  ">
            {movie.NameOfEnglish} <span className="text-xl ">({movie.NameOfVietnamese})</span>
          </h1>
          <div className="flex flex-col gap-2 text-sm text-gray-300 mt-1">
            <span className="flex items-center gap-1">
              <FaRegClock className="text-green-400" /> {movie.RunningTime} min
            </span>
            <span className="flex items-center gap-1">
              <FaCalendarAlt className="text-blue-400" /> {new Date(movie.FromDate).toLocaleDateString("vi-VN")}
            </span>
            <span className="flex items-center gap-1">
              <RiMovie2AiLine className="text-red-400" /> {movie.Genres}
            </span>
          </div>

          <p className="text-xs sm:text-sm text-gray-400 line-clamp-3">
            {movie.ContentSynopsis}
          </p>
          <button
            onClick={handleOpenPopup}
            className="mt-10 inline-flex items-center  gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 font-semibold  "
          >
            View trailer <MdOutlineOndemandVideo />
          </button>
        </div>


      </div>

      <div className=" pb-11 max-w-6xl mx-auto bg-white/5  p-4  ">




        <div className=" flex items-center gap-6 text-sm text-white/80">
          <div className="flex items-center overflow-x-auto gap-2 py-2">
            <div className="font-semibold text-white/80 text-lg pl-26 ">Date</div>

            <button
              className="p-2 text-purple-400 hover:text-purple-500"
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

            {visibleDates.map((d, idx) => {
              const isSelected = d.Day === selectedDate;
              const dayObj = new Date(d.Day);
              return (
                <div
                  key={idx}
                  className={`flex flex-col items-center justify-center w-14 h-20 rounded-3xl text-sm cursor-pointer transition-all duration-200 
          ${isSelected
                      ? "scale-110 bg-purple-500/70 text-white shadow-lg"
                      : "bg-white/10 hover:bg-white/20 text-white/80"
                    }`}
                  onClick={() => setSelectedDate(d.Day)}
                >
                  <span className="text-xs font-semibold">
                    {dayObj.toLocaleDateString("en-US", { month: "short" }).toUpperCase()}
                  </span>
                  <span className="text-lg font-bold">
                    {dayObj.getDate().toString().padStart(2, "0")}
                  </span>
                  <span className="text-xs">
                    {dayObj.toLocaleDateString("en-US", { weekday: "short" }).toUpperCase()}
                  </span>
                </div>
              );
            })}

            <button
              className="p-2 text-purple-400 hover:text-purple-500"
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
          <div className="h-15 border-l border-white/30 mt-3" />
          <div className="flex-1 px-4">
            <label className="block mb-1 ml-3 text-white/80 font-semibold text-lg">Time</label>
            <div className="relative w-full group">
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
                className="appearance-none w-full py-3 pl-4 pr-10 text-base font-semibold text-purple-100 
    bg-gradient-to-r from-[#36355a] to-[#4e408e] border-b-2 border-purple-500 
    hover:border-purple-400 focus:outline-none focus:ring-0 
    transition duration-300 ease-in-out tracking-wide rounded-3xl"
              >
                <option value="" disabled>
                  Choose Showtime
                </option>

                {timeOptions.flatMap((ver) =>
                  ver.showtimes.map((s) => (
                    <option
                      key={s.showtimeId}
                      value={s.showtimeId}
                      className="text-gray-900 bg-white"
                    >
                      {s.time} — Room {s.roomName} ({ver.version})
                    </option>
                  ))
                )}
              </select>

              <FaChevronDown className="absolute top-1/2 right-3 -translate-y-1/2 text-purple-300 pointer-events-none group-hover:rotate-180 transition duration-300" />
            </div>
          </div>


          <div className="h-15 border-l border-white/30 mt-3" />
          <div className="flex-1 pl-4">
            <label className="block mb-1 text-white/80 font-semibold text-lg">Room</label>
            <div className="relative group w-fit">
              <div className="flex items-center gap-2 text-white text-base font-medium tracking-wide">
                <MdOutlineMeetingRoom className="text-purple-500 group-hover:scale-110 transition-transform duration-200" />
                <span className="group-hover:text-purple-300">{selectedRoom || "—"}</span>

              </div>
              <div className="h-0.5 bg-purple-500 mt-1 w-full group-hover:w-full transition-all duration-300"></div>
            </div>
          </div>




        </div>
      </div>

      <div className=" max-w-6xl mx-auto bg-white/5 h-[1300px] rounded-b-2xl" >

        {seatsData.length > 0 ? (
          <div className="w-full flex justify-center">
            <LayoutSelectSeat

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
          </div >
        ) : (
          <p className="text-center text-white font-semibold">Loading...</p>
        )}
        {/* COMBO POPCORN SECTION */}



        <div className="max-w-6xl mx-auto mt-6 flex flex-col sm:flex-row justify-end items-center gap-4">
          {/* <div className="ml-4">
                <p className="text-sm mb-1 ">
                  <span className="font-semibold">Seat: </span> {selectedSeats.length > 0 ? selectedSeats.join(", ") : "Not yet"}
                </p>
                <p className="text-lg  ">
                  <span className="font-semibold"> Total:</span> {totalPrice.toLocaleString("vi-VN")}đ
                </p>
              </div> */}
          <button
            className="px-6 py-3 bg-white/10 rounded-full hover:bg-white/20 disabled:opacity-40 mr-4 font-semibold"
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
            <FaTicketAlt className="inline-block mr-2 " /> Continue Payment
          </button>
        </div>



      </div>



      {isPopupOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="relative w-full max-w-4xl">
            <video
              ref={popupVideoRef}
              controls
              className="w-full rounded-xl"
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
              className="absolute top-2 right-2 text-white bg-black/50 p-2 rounded-full hover:bg-black"
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
