import { FaRegClock, FaCalendarAlt } from "react-icons/fa";
import { RiMovie2AiLine } from "react-icons/ri";
import MembershipProgress from "../bookingComponent/MembershipProgress";

const MovieInfoCard = ({ movie, memberPoints, onTierChange }) => {
  return (
    <div className="relative bg-white/5 backdrop-blur-md rounded-3xl p-4 md:p-6 border border-white/10 shadow-2xl">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-pink-500/5 rounded-3xl"></div>

      <div className="relative z-10">
        <h2 className="text-xl md:text-2xl font-bold mb-6 bg-gradient-to-r from-white via-purple-100 to-pink-100 bg-clip-text text-transparent">
          Movie Information
        </h2>

        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
          <div className="flex justify-center sm:justify-start">
            <img
              src={movie?.PosterImage}
              alt={movie?.NameOfEnglish}
              className="w-32 h-48 sm:w-40 sm:h-60 object-cover rounded-2xl shadow-xl border border-white/10"
            />
          </div>

          <div className="flex flex-col justify-between flex-1">
            <div>
              <h3 className="text-lg sm:text-xl font-bold mb-2 text-center sm:text-left">
                {movie?.NameOfEnglish}
              </h3>
              <h4 className="text-sm sm:text-base font-medium mb-4 text-center sm:text-left text-gray-300">
                ({movie?.NameOfVietnamese})
              </h4>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-white/5 rounded-2xl border border-white/10">
                  <div className="flex items-center gap-3">
                    <FaRegClock className="text-purple-400 text-sm" />
                    <span className="text-gray-300 text-sm">Runtime</span>
                  </div>
                  <span className="text-white font-semibold text-sm">{movie?.RunningTime} min</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-white/5 rounded-2xl border border-white/10">
                  <div className="flex items-center gap-3">
                    <FaCalendarAlt className="text-purple-400 text-sm" />
                    <span className="text-gray-300 text-sm">Release</span>
                  </div>
                  <span className="text-white font-semibold text-xs">{new Date(movie?.FromDate).toLocaleDateString("vi-VN")}</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-white/5 rounded-2xl border border-white/10">
                  <div className="flex items-center gap-3">
                    <RiMovie2AiLine className="text-purple-400 text-sm" />
                    <span className="text-gray-300 text-sm">Genre</span>
                  </div>
                  <span className="text-white font-semibold text-xs text-right max-w-xs truncate">{movie?.Genres}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <MembershipProgress
        points={memberPoints}
        onTierChange={onTierChange}
      />
    </div>
  );
};

export default MovieInfoCard;