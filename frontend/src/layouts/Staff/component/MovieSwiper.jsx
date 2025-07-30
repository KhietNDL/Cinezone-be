import React, { useMemo } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "./SwiperButton.css";
import ItemCard from "./ItemCard";
import { Link } from "react-router-dom";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import { Empty } from "antd";

const MovieSwiper = ({
  movies = [],
  selectedMovie = null,
  onSelectMovie = () => {},
  useLink = false,
  linkTo = (movie) => `/staff/movie/${movie.MovieId}`,
}) => {
  const swiperBreakpoints = useMemo(
    () => ({
      320: { slidesPerView: 1, spaceBetween: 16 },
      640: { slidesPerView: 2, spaceBetween: 20 },
      768: { slidesPerView: 3, spaceBetween: 24 },
      1024: { slidesPerView: 4, spaceBetween: 28 },
      1280: { slidesPerView: 4, spaceBetween: 32 },
    }),
    []
  );

  // Handle empty state
  if (!movies || movies.length === 0) {
    return (
      <div className="py-16">
        <Empty
          description={
            <div className="text-center">
              <p className="text-gray-500 text-lg mb-2">No movies available</p>
              <p className="text-gray-400 text-sm">
                Please check back later or contact administrator
              </p>
            </div>
          }
          className="text-gray-400"
        />
      </div>
    );
  }

  return (
    <div className="relative movie-swiper-container mt-2">
      {/* Header with count */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-2 h-8 bg-gradient-to-b from-purple-400 to-purple-500 rounded-full"></div>
            <h3 className="text-lg font-semibold text-gray-800">
              Available Movies
            </h3>
          </div>
          <div className="bg-gradient-to-r from-purple-100 to-purple-200 text-purple-700 px-3 py-1 rounded-full text-sm font-medium">
            {movies.length} {movies.length === 1 ? "movie" : "movies"}
          </div>
        </div>

        {selectedMovie && (
          <div className="hidden md:flex items-center gap-2 bg-purple-50 text-purple-700 px-4 py-2 rounded-lg border border-purple-200">
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium">
              Selected: {selectedMovie.Title || selectedMovie.NameOfEnglish}
            </span>
          </div>
        )}
      </div>

      {/* Swiper Container with Navigation */}
      <div className="relative flex items-center">
        {/* Left Navigation Button */}
        <button className="movie-swiper-prev flex-shrink-0 w-12 h-12 bg-white shadow-lg rounded-full flex items-center justify-center text-gray-600 hover:text-purple-400 hover:bg-purple-50 transition-all duration-300 hover:scale-110 z-10 mr-4">
          <FaChevronLeft className="text-sm" />
        </button>

        {/* Swiper Component - Constrained within buttons */}
        <div className="flex-1 overflow-hidden">
          <Swiper
            key={`swiper-${movies.length}`}
            modules={[Navigation, Pagination]}
            breakpoints={swiperBreakpoints}
            navigation={{
              prevEl: ".movie-swiper-prev",
              nextEl: ".movie-swiper-next",
            }}
            pagination={{
              clickable: true,
              dynamicBullets: true,
              bulletClass: "custom-bullet",
              bulletActiveClass: "custom-bullet-active",
            }}
            loop={movies.length > 4}
            loopFillGroupWithBlank={false}
            centeredSlides={false}
            grabCursor={true}
            className="movie-swiper"
            spaceBetween={20}
            watchOverflow={true}
          >
            {movies.map((movie, index) => {
              const isSelected = selectedMovie?.MovieId === movie.MovieId;
              const card = (
                <ItemCard
                  item={movie}
                  type="movie"
                  selected={isSelected}
                  onSelect={() => onSelectMovie(movie)}
                />
              );

              return (
                <SwiperSlide key={`movie-${movie.MovieId}-${index}`}>
                  <div className="flex justify-center w-full px-2">
                    {useLink ? <Link to={linkTo(movie)}>{card}</Link> : card}
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>

        {/* Right Navigation Button */}
        <button className="movie-swiper-next flex-shrink-0 w-12 h-12 bg-white shadow-lg rounded-full flex items-center justify-center text-gray-600 hover:text-purple-400 hover:bg-purple-50 transition-all duration-300 hover:scale-110 z-10 ml-4">
          <FaChevronRight className="text-sm" />
        </button>
      </div>
    </div>
  );
};

export default MovieSwiper;
