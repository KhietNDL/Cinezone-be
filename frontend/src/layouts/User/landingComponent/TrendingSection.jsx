// TrendingSection.jsx - Modern trending movies section
import React, { useState, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay, EffectCoverflow } from "swiper/modules";
// import { Fire, TrendingUp, Star, Calendar, Clock } from "lucide-react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/effect-coverflow";
import {
  Calendar,
  Clock,
  FireExtinguisher,
  Star,
  TrendingUp,
} from "lucide-react";

const TrendingSection = ({
  movieData,
  onClickMovie,
  onOpenTrailer,
  formatDateRange,
  formatRunningTime,
}) => {
  const [activeSlide, setActiveSlide] = useState(0);
  const swiperRef = useRef(null);

  // Get top rated movies as trending (sorted by rating)
  const trendingMovies =
    movieData
      ?.filter((movie) => movie.AverageRating)
      ?.sort(
        (a, b) => parseFloat(b.AverageRating) - parseFloat(a.AverageRating)
      )
      ?.slice(0, 10) || [];

  if (!trendingMovies.length) return null;

  const handleSlideChange = (swiper) => {
    setActiveSlide(swiper.realIndex);
  };

  return (
    <div className="w-full py-16 px-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/3 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/3 w-80 h-80 bg-red-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20 mb-6">
            <FireExtinguisher size={16} className="text-orange-400" />
            <span className="text-orange-400 text-sm font-medium">
              Hot Right Now
            </span>
          </div>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            <span className="bg-gradient-to-r from-orange-400 via-red-400 to-pink-400 bg-clip-text text-transparent">
              Trending
            </span>{" "}
            Movies
          </h2>

          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Discover the most popular movies that everyone's talking about
          </p>
        </div>

        {/* Main Featured Movie */}
        <div className="mb-12">
          <div className="relative bg-gradient-to-r from-slate-900/80 via-slate-800/60 to-slate-900/80 rounded-3xl overflow-hidden border border-slate-700/50 backdrop-blur-sm">
            <div className="flex flex-col lg:flex-row">
              {/* Movie Poster */}
              <div className="lg:w-1/3 relative">
                <img
                  src={trendingMovies[activeSlide]?.PosterImage}
                  alt={trendingMovies[activeSlide]?.NameOfEnglish}
                  className="w-full h-[400px] lg:h-[500px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-black/60" />

                {/* Trending Badge */}
                <div className="absolute top-4 left-4 flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 px-3 py-1.5 rounded-full">
                  <TrendingUp size={16} className="text-white" />
                  <span className="text-white text-sm font-semibold">
                    #{activeSlide + 1} Trending
                  </span>
                </div>
              </div>

              {/* Movie Info */}
              <div className="lg:w-2/3 p-6 lg:p-12 flex flex-col justify-center">
                <div className="space-y-6">
                  {/* Genres */}
                  {trendingMovies[activeSlide]?.Genres && (
                    <div className="flex flex-wrap gap-2">
                      {trendingMovies[activeSlide].Genres.split(",")
                        .slice(0, 3)
                        .map((genre, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-[#6a57f5]/20 border border-[#6a57f5]/30 rounded-full text-[#6a57f5] text-sm font-medium"
                          >
                            {genre.trim()}
                          </span>
                        ))}
                    </div>
                  )}

                  {/* Title */}
                  <h3 className="text-2xl lg:text-4xl font-bold text-white leading-tight">
                    {trendingMovies[activeSlide]?.NameOfEnglish}
                  </h3>

                  {/* Movie Stats */}
                  <div className="flex flex-wrap items-center gap-6 text-gray-300">
                    {trendingMovies[activeSlide]?.AverageRating && (
                      <div className="flex items-center gap-2">
                        <Star
                          size={18}
                          className="text-yellow-400 fill-yellow-400"
                        />
                        <span className="font-semibold">
                          {parseFloat(
                            trendingMovies[activeSlide].AverageRating
                          ).toFixed(1)}
                        </span>
                      </div>
                    )}

                    {trendingMovies[activeSlide]?.RunningTime && (
                      <div className="flex items-center gap-2">
                        <Clock size={18} className="text-blue-400" />
                        <span>
                          {formatRunningTime(
                            trendingMovies[activeSlide].RunningTime
                          )}
                        </span>
                      </div>
                    )}

                    <div className="flex items-center gap-2">
                      <Calendar size={18} className="text-green-400" />
                      <span>
                        {formatDateRange(
                          trendingMovies[activeSlide]?.FromDate,
                          trendingMovies[activeSlide]?.ToDate
                        )}
                      </span>
                    </div>
                  </div>

                  {/* Description */}
                  {trendingMovies[activeSlide]?.ContentSynopsis && (
                    <p className="text-gray-400 leading-relaxed line-clamp-3">
                      {trendingMovies[activeSlide].ContentSynopsis}
                    </p>
                  )}

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-4">
                    <button
                      onClick={() =>
                        onClickMovie(trendingMovies[activeSlide]?.NameOfEnglish)
                      }
                      className="px-6 py-3 bg-gradient-to-r from-[#6a57f5] to-blue-500 text-white rounded-xl font-semibold hover:scale-105 transition-all duration-300 shadow-lg shadow-[#6a57f5]/30"
                    >
                      Book Now
                    </button>
                    <button
                      onClick={() => onOpenTrailer(trendingMovies[activeSlide])}
                      className="px-6 py-3 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-xl font-semibold hover:bg-white/20 transition-all duration-300"
                    >
                      Watch Trailer
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Trending Movies Carousel */}
        <div className="relative landingPage-trending">
          <Swiper
            ref={swiperRef}
            modules={[Navigation, Autoplay, EffectCoverflow]}
            effect="coverflow"
            grabCursor={true}
            centeredSlides={true}
            slidesPerView="auto"
            coverflowEffect={{
              rotate: 15,
              stretch: 0,
              depth: 100,
              modifier: 2,
              slideShadows: true,
            }}
            autoplay={{
              delay: 4000,
              disableOnInteraction: false,
            }}
            navigation={true}
            onSlideChange={handleSlideChange}
            className="trending-swiper"
            breakpoints={{
              320: {
                slidesPerView: 1.2,
                spaceBetween: 20,
              },
              640: {
                slidesPerView: 2.5,
                spaceBetween: 30,
              },
              1024: {
                slidesPerView: 3.5,
                spaceBetween: 40,
              },
            }}
          >
            {trendingMovies.map((movie, index) => (
              <SwiperSlide key={movie.MovieId} className="!w-[280px]">
                <TrendingMovieCard
                  movie={movie}
                  index={index}
                  isActive={index === activeSlide}
                  onClickMovie={onClickMovie}
                  onOpenTrailer={onOpenTrailer}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>

      <style jsx>{`
        .trending-swiper .swiper-slide {
          transition: all 0.3s ease;
        }
        .trending-swiper .swiper-slide-active {
          transform: scale(1.1);
        }
        .trending-swiper .swiper-button-next,
        .trending-swiper .swiper-button-prev {
          color: #6a57f5;
          background: rgba(0, 0, 0, 0.5);
          width: 50px;
          height: 50px;
          border-radius: 50%;
          backdrop-filter: blur(10px);
        }
        .trending-swiper .swiper-button-next:after,
        .trending-swiper .swiper-button-prev:after {
          font-size: 20px;
        }
      `}</style>
    </div>
  );
};

const TrendingMovieCard = ({
  movie,
  index,
  isActive,
  onClickMovie,
  onOpenTrailer,
}) => {
  return (
    <div
      className={`relative group cursor-pointer transition-all duration-500 ${
        isActive ? "scale-110 z-10" : "scale-100"
      }`}
      onClick={() => onClickMovie(movie.NameOfEnglish)}
    >
      {/* Card Container */}
      <div className="relative bg-slate-800/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-slate-700/50 hover:border-slate-600/50 transition-all duration-300 group-hover:shadow-2xl group-hover:shadow-[#6a57f5]/20">
        {/* Movie Image */}
        <div className="relative h-[350px] overflow-hidden">
          <img
            src={movie.PosterImage}
            alt={movie.NameOfEnglish}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

          {/* Rank Badge */}
          <div className="absolute top-3 left-3 flex items-center gap-1 bg-gradient-to-r from-orange-500 to-red-500 px-2 py-1 rounded-lg">
            <TrendingUp size={14} className="text-white" />
            <span className="text-white text-sm font-bold">#{index + 1}</span>
          </div>

          {/* Rating */}
          {movie.AverageRating && (
            <div className="absolute top-3 right-3 flex items-center gap-1 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-lg">
              <Star size={14} className="text-yellow-400 fill-yellow-400" />
              <span className="text-white text-sm font-semibold">
                {parseFloat(movie.AverageRating).toFixed(1)}
              </span>
            </div>
          )}

          {/* Hover Play Button */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onOpenTrailer(movie);
              }}
              className="bg-white/20 backdrop-blur-sm border border-white/30 text-white p-3 rounded-full hover:bg-white/30 transition-all duration-300 hover:scale-110"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Movie Info */}
        <div className="p-4 space-y-2">
          <h4 className="text-white font-semibold text-lg line-clamp-1 group-hover:text-[#6a57f5] transition-colors duration-300">
            {movie.NameOfEnglish}
          </h4>

          {movie.Genres && (
            <p className="text-gray-400 text-sm line-clamp-1">
              {movie.Genres.split(",").slice(0, 2).join(", ")}
            </p>
          )}
        </div>

        {/* Glow Effect */}
        <div
          className={`absolute inset-0 rounded-2xl transition-all duration-500 ${
            isActive
              ? "shadow-2xl shadow-[#6a57f5]/30 ring-2 ring-[#6a57f5]/50"
              : "shadow-lg shadow-black/20"
          }`}
        />
      </div>
    </div>
  );
};

export default TrendingSection;
