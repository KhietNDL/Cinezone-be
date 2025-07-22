// MovieCard.jsx - Component tách biệt để tối ưu performance
import React, { memo, useCallback } from "react";
import { FaRegCalendarCheck, FaRegCirclePlay, FaStar } from "react-icons/fa6";
import { IoMdBookmark } from "react-icons/io";
import { GoClockFill } from "react-icons/go";

const MovieCard = memo(
  ({
    item,
    isHovered,
    onMouseEnter,
    onMouseLeave,
    onClickMovie,
    onOpenTrailer,
    formatDateRange,
    formatRunningTime,
    showBookButton = true,
  }) => {
    const handleMovieClick = useCallback(() => {
      onClickMovie(item.NameOfEnglish);
    }, [item.NameOfEnglish, onClickMovie]);

    const handleTrailerClick = useCallback(
      (e) => {
        e.stopPropagation();
        onOpenTrailer(item);
      },
      [item, onOpenTrailer]
    );

    const handleMouseEnter = useCallback(() => {
      onMouseEnter(item.MovieId);
    }, [item.MovieId, onMouseEnter]);

    return (
      <div
        className="relative group cursor-pointer overflow-hidden"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={onMouseLeave}
        onClick={handleMovieClick}
      >
        {/* Glassmorphism Card */}
        <div
          className="bg-slate-800/30 backdrop-blur-lg border border-slate-700/30 flex flex-col h-full rounded-2xl transition-all duration-700 ease-out
                       md:hover:scale-[1.02] md:hover:shadow-xl md:hover:shadow-[#6a57f5]/15 
                       md:hover:-translate-y-1 md:hover:bg-slate-800/50 md:hover:border-[#6a57f5]/40
                       lg:hover:scale-[1.03] lg:hover:shadow-2xl lg:hover:shadow-[#6a57f5]/20
                       lg:hover:-translate-y-2 lg:hover:border-[#6a57f5]/50
                       relative z-10 md:hover:z-20 lg:hover:z-30
                       before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-br before:from-[#6a57f5]/5 before:to-transparent 
                       before:opacity-0 before:transition-opacity before:duration-700 md:hover:before:opacity-100"
        >
          {/* Enhanced Image Container */}
          <div
            role="button"
            className="relative w-full h-[400px] overflow-hidden rounded-t-2xl"
          >
            <img
              src={item.PosterImage}
              alt={item.NameOfEnglish}
              loading="lazy"
              className="w-full h-[400px] object-cover rounded-t-2xl transition-all duration-700 ease-out
                         md:group-hover:scale-105 md:group-hover:brightness-105 md:group-hover:contrast-110"
            />

            {/* Subtle Gradient Overlays */}
            <div
              className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent 
                            opacity-0 md:group-hover:opacity-100 transition-opacity duration-700 ease-out 
                            rounded-t-2xl"
            />

            <div
              className="absolute inset-0 bg-gradient-to-br from-[#6a57f5]/8 via-transparent to-blue-500/6
                            opacity-0 md:group-hover:opacity-100 transition-opacity duration-900 ease-out 
                            rounded-t-2xl"
            />

            {/* Subtle Glow effect border */}
            <div
              className="absolute inset-0 rounded-t-2xl border border-transparent
                            md:group-hover:border-[#6a57f5]/30 transition-all duration-700 ease-out 
                            md:group-hover:shadow-inner md:group-hover:shadow-[#6a57f5]/10"
            />

            {/* Subtle floating particles effect */}
            <div className="absolute inset-0 opacity-0 md:group-hover:opacity-60 transition-opacity duration-1200">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-0.5 h-0.5 bg-[#6a57f5]/40 rounded-full animate-pulse"
                  style={{
                    left: `${25 + i * 20}%`,
                    top: `${15 + i * 15}%`,
                    animationDelay: `${i * 400}ms`,
                    animationDuration: "3s",
                  }}
                />
              ))}
            </div>

            {/* Enhanced Rating Badge */}
            {item.AverageRating && (
              <div
                className="absolute top-3 right-3 bg-black/40 backdrop-blur-md rounded-xl px-3 py-2 flex items-center gap-2
                              transition-all duration-500 ease-out z-20 border border-white/10
                              md:group-hover:bg-[#6a57f5]/80 md:group-hover:scale-105 md:group-hover:shadow-lg
                              md:group-hover:shadow-[#6a57f5]/30 md:group-hover:border-[#6a57f5]/40"
              >
                <FaStar
                  size={14}
                  className="text-yellow-400 md:group-hover:text-yellow-300 transition-colors duration-500
                             drop-shadow-sm"
                />
                <span
                  className="text-white font-semibold text-sm md:group-hover:text-yellow-100 
                                 transition-colors duration-500 drop-shadow-sm"
                >
                  {parseFloat(item.AverageRating).toFixed(1)}
                </span>
              </div>
            )}

            {/* Enhanced Hover Overlay with Glassmorphism */}
            {isHovered && (
              <div
                className="absolute hidden w-full h-full inset-0 lg:flex flex-col justify-center items-start p-4 rounded-t-2xl transition-all duration-500 ease-in-out overflow-hidden
                              bg-gradient-to-br from-black/60 via-black/40 to-transparent backdrop-blur-lg border-l-4 border-[#6a57f5]/60"
              >
                <div className="text-white w-full flex flex-col justify-center items-start overflow-hidden">
                  <h3 className="font-bold text-lg text-white line-clamp-2 mb-4 drop-shadow-lg">
                    {item.NameOfEnglish}
                  </h3>

                  <div className="space-y-5 text-sm w-full overflow-hidden">
                    <div className="flex items-center justify-start gap-3 group/item">
                      <span className="text-gray-300 flex-shrink-0 group-hover/item:text-[#6a57f5] transition-colors duration-500">
                        <FaRegCalendarCheck size={16} />
                      </span>
                      <span className="truncate drop-shadow-sm">
                        {formatDateRange(item.FromDate, item.ToDate)}
                      </span>
                    </div>

                    <div className="flex items-center justify-start gap-3 group/item">
                      <span className="text-gray-300 flex-shrink-0 group-hover/item:text-[#6a57f5] transition-colors duration-500">
                        <GoClockFill size={16} />
                      </span>
                      <span className="truncate drop-shadow-sm">
                        {formatRunningTime(item.RunningTime)}
                      </span>
                    </div>

                    {item.AverageRating && (
                      <div className="flex items-center justify-start gap-3 group/item">
                        <span className="text-yellow-400 flex-shrink-0 group-hover/item:text-yellow-300 transition-colors duration-500">
                          <FaStar size={16} />
                        </span>
                        <span className="font-semibold drop-shadow-sm">
                          {parseFloat(item.AverageRating).toFixed(1)}
                        </span>
                      </div>
                    )}

                    <div className="flex items-center justify-start gap-2">
                      <div className="flex items-center justify-start gap-2">
                        <span className="text-gray-300 flex-shrink-0">
                          <IoMdBookmark size={16} />
                        </span>
                      </div>
                      {item.Genres && (
                        <div className="flex flex-wrap justify-center gap-2 overflow-hidden">
                          {item.Genres.split(/[,，]/)
                            .map((genre) => genre.trim())
                            .filter((genre) => genre.length > 0)
                            .slice(0, 2)
                            .map((genre, index) => (
                              <span
                                key={index}
                                className="text-white bg-[#6a57f5]/70 backdrop-blur-sm px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap
                                           border border-[#6a57f5]/30 shadow-sm hover:bg-[#6a57f5]/90 transition-colors duration-500"
                              >
                                {genre}
                              </span>
                            ))}
                          {item.Genres.split(/[,，]/)
                            .map((genre) => genre.trim())
                            .filter((genre) => genre.length > 0).length > 2 && (
                            <span className="text-gray-300 text-xs self-center drop-shadow-sm">
                              +
                              {item.Genres.split(/[,，]/)
                                .map((genre) => genre.trim())
                                .filter((genre) => genre.length > 0).length -
                                2}{" "}
                              more
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Movie Title - Enhanced with hover effects */}
          <div
            className="text-white text-center font-semibold text-sm md:text-base px-2 py-2 h-16 flex items-center justify-center mt-[10px]
                        transition-all duration-500 ease-out md:group-hover:text-[#6a57f5] md:group-hover:scale-[1.02]"
          >
            {item.NameOfEnglish?.length > 10 ? (
              <h3 className="font-bold text-base text-white line-clamp-2 md:group-hover:text-[#6a57f5] transition-colors duration-500">
                <span className="block md:hidden lg:block">
                  {item.NameOfEnglish}
                </span>
                <span className="hidden md:block lg:hidden">
                  {item.NameOfEnglish.slice(0, 10) + "..."}
                </span>
              </h3>
            ) : (
              <h3 className="font-bold text-base text-white md:group-hover:text-[#6a57f5] transition-colors duration-500">
                {item.NameOfEnglish}
              </h3>
            )}
          </div>

          {/* Buttons - Enhanced with hover effects */}
          <div
            className="flex xl:flex-row md:flex-col sm:flex-row justify-evenly md:space-y-2 xl:space-y-0 sm:space-y-0 sm:space-x-1 items-center w-full px-2 pb-4 h-20
                        transition-all duration-500 ease-out md:group-hover:pb-5"
          >
            <div
              role="button"
              className="text-white flex items-center justify-center hover:bg-slate-700 p-2 rounded-4xl px-3 text-[11px] md:text-[12px] sm:w-auto 
                       transition-all duration-500 ease-out border border-transparent
                       md:group-hover:border-[#6a57f5]/30 md:group-hover:bg-[#6a57f5]/10 md:group-hover:text-[#6a57f5]
                       md:group-hover:scale-[1.02] md:group-hover:shadow-md backdrop-blur-sm"
              onClick={handleTrailerClick}
            >
              <FaRegCirclePlay
                size={16}
                className="mr-1 transition-transform duration-500 md:group-hover:scale-105"
              />
              Watch Trailer
            </div>

            {showBookButton && (
              <div
                role="button"
                onClick={handleMovieClick}
                className="bg-[#6a57f5] rounded-4xl px-6 py-2 text-white hover:bg-[#6957f5ea] text-[12px] shadow-[#6a57f5] shadow-sm sm:w-auto cursor-pointer 
                         transition-all duration-500 ease-out border border-[#6a57f5] backdrop-blur-sm
                         md:group-hover:bg-white md:group-hover:text-[#6a57f5] md:group-hover:border-white
                         md:group-hover:scale-[1.05] md:group-hover:shadow-lg md:group-hover:shadow-white/20
                         md:group-hover:font-semibold"
              >
                Book Now
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
);

MovieCard.displayName = "MovieCard";

export default MovieCard;
