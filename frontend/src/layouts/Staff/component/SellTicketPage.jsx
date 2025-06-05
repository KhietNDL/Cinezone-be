
import React, { useState, useEffect, useRef } from "react";
import { Button, Typography, Spin, message, DatePicker } from "antd";
import axios from "axios";
import MovieCard from "./MovieCard"; // Giữ nguyên component MovieCard của bạn
import ShowtimeButton from "./ShowtimeButton";
import { Link } from "react-router-dom";

const MOVIES_PER_PAGE = 12;
const SCROLL_STEP = 2; // Mỗi lần trượt 2 phim

const SellTicketPage = () => {
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);

  const [currentIndex, setCurrentIndex] = useState(MOVIES_PER_PAGE);
  const [isAnimating, setIsAnimating] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          "https://683d6711199a0039e9e55241.mockapi.io/movie"
        );
        setMovies(res.data);
        setCurrentIndex(MOVIES_PER_PAGE);
      } catch (err) {
        message.error("Failed to fetch movies");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, []);

  // Clone cuối thêm vào đầu, clone đầu thêm vào cuối
  const extendedMovies = [
    ...movies.slice(-MOVIES_PER_PAGE),
    ...movies,
    ...movies.slice(0, MOVIES_PER_PAGE),
  ];

  const totalLength = extendedMovies.length;

  const handleNext = () => {
    if (isAnimating || movies.length === 0) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => prev + SCROLL_STEP);
  };

  const handlePrev = () => {
    if (isAnimating || movies.length === 0) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => prev - SCROLL_STEP);
  };

  const handleTransitionEnd = () => {
    setIsAnimating(false);

    if (currentIndex >= movies.length + MOVIES_PER_PAGE) {
      setCurrentIndex(MOVIES_PER_PAGE);
      containerRef.current.style.transition = "none";
      containerRef.current.style.transform = `translateX(-${(MOVIES_PER_PAGE * 100) / MOVIES_PER_PAGE}%)`;
      setTimeout(() => {
        containerRef.current.style.transition = "transform 0.5s ease-in-out";
      }, 50);
    } else if (currentIndex < MOVIES_PER_PAGE) {
      const maxIndex = movies.length + MOVIES_PER_PAGE - SCROLL_STEP;
      setCurrentIndex(maxIndex);
      containerRef.current.style.transition = "none";
      containerRef.current.style.transform = `translateX(-${(maxIndex * 100) / MOVIES_PER_PAGE}%)`;
      setTimeout(() => {
        containerRef.current.style.transition = "transform 0.5s ease-in-out";
      }, 50);
    }
  };

  const translatePercent = -(currentIndex * 100) / MOVIES_PER_PAGE;

  return (
    <div className="p-3">
      <h1 className="text-3xl font-bold">Sell Movie Ticket</h1>

      <h5 className="mt-5">
        <i className="fa-solid fa-film"></i> Select Movie
      </h5>

      {loading ? (
        <div className="text-center my-8">
          <Spin size="large" />
        </div>
      ) : (
        <div className="flex items-center justify-center gap-4">
          <Button
            shape="circle"
            icon={<i className="fa-solid fa-chevron-left" />}
            onClick={handlePrev}
            disabled={movies.length === 0 || isAnimating}
          />
          <div className="overflow-hidden w-full max-w-6xl">
            <div
              ref={containerRef}
              className="flex transition-transform duration-500 ease-in-out"
              style={{
                width: `${(totalLength * 100) / MOVIES_PER_PAGE}%`,
                transform: `translateX(${translatePercent}%)`,
              }}
              onTransitionEnd={handleTransitionEnd}
            >
              {extendedMovies.map((movie, idx) => (
                <div
                  key={`${movie.id}-${idx}`}
                  className="flex w-[80px] h-[410px] p-2"
                  style={{ flex: `0 0 ${80 / MOVIES_PER_PAGE}%` }}
                >
                  <MovieCard
                    movie={movie}
                    onSelect={setSelectedMovie}
                    selected={selectedMovie?.id === movie.id}
                  />
                </div>
              ))}
            </div>
          </div>
          <Button
            shape="circle"
            icon={<i className="fa-solid fa-chevron-right" />}
            onClick={handleNext}
            disabled={movies.length === 0 || isAnimating}
          />
        </div>
      )}

      <h5 className="mt-5">
        <i className="fa-solid fa-clock"></i> Select Showtime
      </h5>
      {/* <div className="p-4 flex items-center justify-start ">
        <DatePicker
          className="w-[200px]"
          style={{ marginLeft: "50px" }}
          placeholder="Select date"
        />
      </div> */}

      <ShowtimeButton
        selectedTime={null}
        onSelectTime={(time) => console.log("Selected time:", time)}
      />
      <div className="mt-5 text-center">
        <Link to="/staff/select-seats">
          <Button
            style={{
              backgroundColor: "#4F46E5",
              color: "white",
              padding: "1rem",
              borderRadius: "0.25rem",
            }}
          >
            <i className="fa-solid fa-couch"></i> Select seats
          </Button>
        </Link>
        <Button style={{ marginLeft: 10 }} danger>
          <i className="fa-solid fa-xmark"></i> Cancel
        </Button>
      </div>
    </div>
  );
};

export default SellTicketPage;
