import { FaRegClock, FaCalendarAlt } from "react-icons/fa";
import { MdOutlineOndemandVideo, MdStar } from "react-icons/md";
import { RiMovie2AiLine } from "react-icons/ri";
import { GiRegeneration } from "react-icons/gi";
import { useEffect } from "react";
import { getMovieRatingSummary } from "../../../services/API";
import { toast } from "react-toastify";

const MovieInfo = ({
  movie,
  ratingSummary,
  onOpenTrailer,
  onOpenRatingList,
  setRatingSummary,
  onFetchRatings,
}) => {
  useEffect(() => {
    if (movie?.MovieId) {
      getMovieRatingSummary(movie.MovieId)
        .then(setRatingSummary)
        .catch(() => {
          setRatingSummary(null);
          toast.error("Failed to load rating summary", {
            duration: 4000,
            position: "top-center",
          });
        });
    }
  }, [movie?.MovieId, setRatingSummary]);

  return (
    <div className="relative bg-white/5 backdrop-blur-md rounded-3xl p-4 md:p-6 border border-white/10 shadow-2xl h-full">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-pink-500/5 rounded-3xl"></div>
      <div className="relative z-10 h-full flex flex-col">
        <div className="relative group mb-6">
          <img
            src={movie?.PosterImage || "https://via.placeholder.com/300x400"}
            alt="poster"
            className="w-full h-64 sm:h-80 md:h-96 lg:h-130 object-cover shadow-xl border rounded-2xl border-white/10"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent rounded-2xl"></div>
        </div>
        <div className="flex-1 flex flex-col justify-between">
          <div className="space-y-4 md:space-y-6 mb-6 md:mb-8">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 md:p-4 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-all">
                <div className="flex items-center gap-3">
                  <FaRegClock className="text-purple-400 text-lg" />
                  <span className="text-gray-300 font-medium text-sm md:text-base">
                    Runtime
                  </span>
                </div>
                <span className="text-white font-semibold text-sm md:text-base">
                  {movie?.RunningTime} min
                </span>
              </div>
              <div className="flex items-center justify-between p-3 md:p-4 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-all">
                <div className="flex items-center gap-3">
                  <FaCalendarAlt className="text-purple-400 text-lg" />
                  <span className="text-gray-300 font-medium text-sm md:text-base">
                    Release
                  </span>
                </div>
                <span className="text-white font-semibold text-xs md:text-sm">
                  {new Date(movie?.FromDate).toLocaleDateString("vi-VN")} -{" "}
                  {new Date(movie?.ToDate).toLocaleDateString("vi-VN")}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 md:p-4 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-all">
                <div className="flex items-center gap-3">
                  <RiMovie2AiLine className="text-purple-400 text-xl" />
                  <span className="text-gray-300 font-medium text-sm md:text-base">
                    Director
                  </span>
                </div>
                <span className="text-white font-semibold text-right max-w-xs truncate text-sm md:text-base">
                  {movie?.Director}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 md:p-4 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-all">
                <div className="flex items-center gap-3">
                  <MdOutlineOndemandVideo className="text-purple-400 text-xl" />
                  <span className="text-gray-300 font-medium mr-4 md:mr-10 text-sm md:text-base">
                    Cast
                  </span>
                </div>
                <span className="text-white font-semibold text-right max-w-xs truncate text-sm md:text-base">
                  {movie?.Actors}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 md:p-4 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-all">
                <div className="flex items-center gap-3">
                  <GiRegeneration className="text-purple-400 text-xl" />
                  <span className="text-gray-300 font-medium text-sm md:text-base">
                    Genre
                  </span>
                </div>
                <div className="flex flex-wrap gap-2 justify-end">
                  {movie?.Genres?.split(",").map((genre, index) => (
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
          <div className="flex items-center justify-between gap-3 mt-4">
            <button
              onClick={onOpenTrailer}
              className="flex-1 group relative overflow-hidden bg-gradient-to-r from-purple-600 via-purple-500 to-pink-500 hover:from-purple-700 hover:via-purple-600 hover:to-pink-600 rounded-2xl p-3 text-white font-bold text-sm md:text-base shadow-xl hover:shadow-2xl hover:shadow-purple-500/20 transform hover:scale-[1.02] transition-all duration-300 ease-out border border-purple-400/20 focus:outline-none focus:ring-4 focus:ring-purple-500/50 flex items-center justify-center gap-2"
            >
              <MdOutlineOndemandVideo className="text-xl" />
              <span className="tracking-wide">Watch Trailer</span>
            </button>
            {ratingSummary && (
              <button
                className="flex-1 group relative overflow-hidden bg-gradient-to-r from-purple-600 via-purple-500 to-pink-500 hover:from-purple-700 hover:via-purple-600 hover:to-pink-600 rounded-2xl p-3 text-white font-bold text-sm md:text-base shadow-xl hover:shadow-2xl hover:shadow-purple-500/20 transform hover:scale-[1.02] transition-all duration-300 ease-out border border-purple-400/20 focus:outline-none focus:ring-4 focus:ring-purple-500/50 flex items-center justify-center gap-2"
                onClick={() => {
                  onOpenRatingList();
                  onFetchRatings();
                }}
              >
                <MdStar className="text-yellow-400 text-lg" />
                <span className="text-white font-bold text-base">
                  {Number(ratingSummary.averageRating).toFixed(1)}
                </span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieInfo;
