import { useEffect, useRef, useState } from "react";
import {
  FaStar,
  FaRegClock,
  FaCalendarAlt,
  FaHeart,
  FaTicketAlt,
} from "react-icons/fa";
import { MdChair, MdOutlineOndemandVideo } from "react-icons/md";
import { Await, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import Swal from "sweetalert2";
import { slugify } from "./Slug";

import { getMovies, getShowtimeByMovieId } from "../../../services/API";
import { LayoutSelectSeat } from "../../../component/LayoutSelectSeat";



const BookingPage = () => {
  // State để quản lý số lượng vé, ghế đã chọn, v.v.

  const [selectedSeats, setSelectedSeats] = useState([]);
  
const [showtimes, setShowtimes] = useState([]);

  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const popupVideoRef = useRef(null);

  // eslint-disable-next-line no-unused-vars
  const { user, isLoading } = useAuth();

  // Danh sách ghế (8 hàng, mỗi hàng 8 ghế)
  const rows = ["A", "B", "C", "D", "E", "F", "G", "H"];
  const seatsPerRow = 8;
  const soldSeats = ["A1", "B3", "C5", "D2", "E4"]; // Ghế đã bán (ví dụ)

  // Hàm xử lý chọn ghế
const toggleSeat = (seat) => {
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

  if (soldSeats.includes(seat)) return; // Không cho chọn ghế đã bán

  if (selectedSeats.includes(seat)) {
    setSelectedSeats(selectedSeats.filter((s) => s !== seat));
  } else {
    setSelectedSeats([...selectedSeats, seat]);
  }
};


  const navigate = useNavigate();
  // Tính tổng giá (ví dụ: 100k/vé)
const ticketPrice = 100000;
const totalPrice = selectedSeats.length * ticketPrice;


  const { slug } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);

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
          setMovie(matchedMovie);
        } else {
          console.warn("No movie found for slug:", slug);
        }
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
    if (!movie || !movie.MovieId) return;

    try {
      const res = await getShowtimeByMovieId(movie.MovieId);
      setShowtimes(res.movieinfo || []);
    } catch (error) {
      console.error("Lỗi khi lấy showtimes:", error);
    }
  };

  fetchShowtimes();
}, [movie]);



  if (loading) return <div className="text-white text-center mt-20">Đang tải...</div>;
  if (!movie) return <div className="text-white text-center mt-20">Không tìm thấy phim.</div>;


  const handleOpenPopup = () => {
    setIsPopupOpen(true);
    setTimeout(() => {
      if (popupVideoRef.current) {
        popupVideoRef.current.load();
        popupVideoRef.current.muted = false;
        popupVideoRef.current.play().catch((error) => {
          console.error("Popup video playback failed:", error);
        });
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

  return (
    <div className="min-h-screen overflow-x-hidden bg-gradient-to-br from-[#1a005f] via-[#3f2b96] to-[#000c2d] text-white p-3 sm:p-6 pt-[80px] sm:pt-[100px]">
      {/* Phần thông tin phim */}
      <div className="bg-[#1e1b3a]/30 text-white rounded-tl-xl rounded-tr-xl shadow-lg p-4 sm:p-6 flex flex-col sm:flex-row gap-4 sm:gap-6 max-w-6xl mx-auto">
        {/* Poster */}
        <div className="flex justify-center sm:justify-start">
          <img
            src={movie.PosterImage || "https://via.placeholder.com/150x200"}
            alt={movie.NameOfEnglish || "Movie Poster"}
            className="w-32 h-48 sm:w-40 sm:h-60 object-cover rounded-lg flex-shrink-0"
          />
        </div>

        {/* Thông tin */}
        <div className="flex flex-col justify-between flex-1">
          {/* Tên phim */}
          <div>
            <h2 className="text-xl sm:text-2xl font-semibold mb-2 text-center sm:text-left">
              {movie.NameOfEnglish || "Untitled"}
            </h2>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 sm:gap-4 text-xs sm:text-sm text-gray-400 mb-2">
              <span className="flex items-center gap-1">
                <FaRegClock /> {movie.RunningTime ? `${movie.RunningTime} min` : "N/A"}
              </span>
              <span className="flex items-center gap-1">
                <FaCalendarAlt /> {movie.FromDate ? new Date(movie.FromDate).toLocaleDateString("vi-VN") : "N/A"}
              </span>
              <span>{movie.Genres || "N/A"}</span>
            </div>

            {/* Mô tả */}
            <p className="text-gray-300 text-xs sm:text-sm mb-4 text-center sm:text-left leading-relaxed">
              {movie.ContentSynopsis || "No description available."}
            </p>

            {/* Rating */}
            <div className="flex items-center justify-center sm:justify-start gap-3 sm:gap-4 text-xs sm:text-sm mb-4">
              <span className="flex items-center text-yellow-400 font-bold gap-1">
                <FaStar /> {movie.Rating || "N/A"} <span className="text-white">/10</span>
              </span>

            </div>
          </div>

          {/* Nút */}
          <div className="flex justify-center sm:justify-start">
            <button className="text-white bg-[#6956F5] px-4 py-2 sm:px-5 sm:py-2 rounded-full text-xs sm:text-sm hover:bg-[#6956f5bf] transition font-semibold flex items-center"
              onClick={handleOpenPopup}
            >

              <MdOutlineOndemandVideo className="mr-2" />

              View trailer
            </button>
          </div>
        </div>
      </div>

      {/* Phần chọn ghế */}
      <div className="mt-0 max-w-6xl mx-auto bg-[#252642]/30 rounded-bl-xl rounded-br-xl">
        {/* Phần thông tin rạp chiếu */}
        <div className="mb-6 p-4 sm:p-[24px]">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-4">
            <div>
              <label className="block text-xs sm:text-sm mb-1">Cinema</label>
              <select className="w-full bg-gray-800/40 text-white p-2 rounded text-xs sm:text-sm">
                <option>CGV Crescent Mall</option>
              </select>
            </div>
            <div>
              <label className="block text-xs sm:text-sm mb-1">Date</label>
              <select className="w-full bg-gray-800/40 text-white p-2 rounded text-xs sm:text-sm">
                <option>2024-06-12</option>
              </select>
            </div>
            <div>
              <label className="block text-xs sm:text-sm mb-1">Time</label>
              <select className="w-full bg-gray-800/40 text-white p-2 rounded text-xs sm:text-sm">
                <option>14:00</option>
              </select>
            </div>

          </div>
        </div>

        {/* Phần chọn ghế */}
        <div className="mb-6 px-2 sm:px-0">
          <LayoutSelectSeat
            initialSelectedSeats={selectedSeats}
             onSeatSelect={setSelectedSeats}
          />

        </div>

        {/* Trạng thái ghế */}


        {/* Phần tổng giá và nút thanh toán */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 p-4 sm:p-[24px]">
          <div className="text-center sm:text-left">
            <p className="text-xs sm:text-sm mb-1">
              Seat: {selectedSeats.length > 0 ? selectedSeats.join(", ") : "Not yet"}
            </p>
            <p className="text-sm sm:text-base font-semibold">
              Total price: {totalPrice.toLocaleString("vi-VN")}đ
            </p>

          </div>
          <button
            className="bg-[#6956F5] hover:bg-[#6956f5bf] text-white px-4 py-2 sm:px-5 sm:py-2 rounded-full text-xs sm:text-sm flex items-center font-semibold disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto justify-center"
            disabled={selectedSeats.length === 0}
            onClick={() =>
              navigate("/confirmPayment", {
                state: {
                  selectedSeats,
                  totalPrice,
                  cinema: "CGV Crescent Mall",
                  date: "2024-06-12",
                  time: "14:00",
                  movie,
                },
              })
            }
          >
            <FaTicketAlt className="mr-2" />
            Continue Payment
          </button>

        </div>
      </div>

      {isPopupOpen && (
        <div className="fixed inset-0 bg-black/30  flex items-center justify-center z-50">
          <div className="relative w-full max-w-4xl rounded-2xl">
            <video
              ref={popupVideoRef}
              controls
              className="w-full h-auto rounded-lg shadow-xl"
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
              className="absolute top-4 right-4  hover:bg-slate-800  active:scale-[1.1]  text-white bg-black/50  p-2 rounded-full"
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
