import React, { useEffect, useState, useRef } from "react";
import { getMovies, searchMovies } from "../../../services/API";
import MovieCard from "../landingComponent/MovieCard";

import {
  FaRegCalendarCheck,
  FaRegCirclePlay,
  FaStar,
  FaStar as FaStar6,
  FaArrowLeft,
} from "react-icons/fa6";
import { IoMdBookmark } from "react-icons/io";
import { GoClockFill } from "react-icons/go";
import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import EnhancedSortDropdown from "../../../component/EnhancedSortDropdown";
import EnhancedSearchForm from "../../../component/EnhancedSearchForm";
import BackButton from "../../../component/BackButton";

const MOVIES_PER_PAGE = 8;

const MovieListPage = () => {
  const [movies, setMovies] = useState([]);
  const [pagination, setPagination] = useState({
    total: 0,
    currentPage: 1,
    totalPages: 1,
    limit: MOVIES_PER_PAGE,
  });
  const [loading, setLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState("desc");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [hoveredMovie, setHoveredMovie] = useState(null);

  // Trailer popup states
  const [isTrailerPopupOpen, setIsTrailerPopupOpen] = useState(false);
  const [currentTrailerMovie, setCurrentTrailerMovie] = useState(null);
  const popupVideoRef = useRef(null);

  const navigate = useNavigate();

  const fetchMovies = async (page = 1, order = "desc", search = "") => {
    setLoading(true);
    try {
      const params = {
        page,
        limit: MOVIES_PER_PAGE,
        sortBy: "FromDate",
        sortOrder: order,
      };
      if (search) params.search = search;
      const res = await getMovies(params);
      setMovies(res.data || res.movies || []);
      if (res.pagination) {
        setPagination(res.pagination);
      } else {
        setPagination({
          total: (res.data || res.movies || []).length,
          currentPage: 1,
          totalPages: 1,
          limit: MOVIES_PER_PAGE,
        });
      }
    } catch (error) {
      console.error("Error fetching movies:", error);
      setMovies([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    if (searchTimeout) clearTimeout(searchTimeout);
    const timeout = setTimeout(() => {
      if (searchTerm.trim()) {
        searchMovies({
          name: searchTerm.trim(),
          page: pagination.currentPage,
          limit: MOVIES_PER_PAGE,
        })
          .then((res) => {
            setMovies(res.data?.data || []);
            setPagination((prev) => ({
              ...prev,
              total: res.data?.total || 0,
              totalPages: res.data?.totalPages || 1,
            }));
          })
          .catch(() => {
            setMovies([]);
          })
          .finally(() => setLoading(false));
      } else {
        fetchMovies(pagination.currentPage, sortOrder, "");
      }
    }, 400);
    setSearchTimeout(timeout);
    // eslint-disable-next-line
  }, [searchTerm, pagination.currentPage, sortOrder]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= pagination.totalPages) {
      setPagination((prev) => ({ ...prev, currentPage: page }));
    }
  };

  const handleSortChange = (order) => {
    setSortOrder(order);
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  const handleBackToLanding = () => {
    navigate("/");
  };

  // Trailer popup functions
  const handleOpenTrailer = (movie) => {
    setCurrentTrailerMovie(movie);
    setIsTrailerPopupOpen(true);

    // Add delay to ensure popup is rendered before trying to play video
    setTimeout(() => {
      if (popupVideoRef.current && movie.TrailerUrl) {
        popupVideoRef.current.load();
        popupVideoRef.current.muted = false;
        popupVideoRef.current.play().catch((error) => {
          console.error("Popup video playback failed:", error);
        });
      }
    }, 100);
  };

  const handleCloseTrailer = () => {
    if (popupVideoRef.current) {
      popupVideoRef.current.pause();
      popupVideoRef.current.currentTime = 0;
    }
    setIsTrailerPopupOpen(false);
    setCurrentTrailerMovie(null);
  };

  // Helper: slugify for movie detail route
  const slugify = (str) =>
    str
      .toString()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-zA-Z0-9 ]/g, "")
      .replace(/\s+/g, "-")
      .toLowerCase();

  // Format date range
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const months = [
      "JAN",
      "FEB",
      "MAR",
      "APR",
      "MAY",
      "JUN",
      "JUL",
      "AUG",
      "SEP",
      "OCT",
      "NOV",
      "DEC",
    ];

    const day = String(date.getDate()).padStart(2, "0");
    const month = months[date.getMonth()];
    const year = date.getFullYear();

    return `${day} ${month} ${year}`;
  };

  const formatDateRange = (fromDate, toDate) => {
    if (!fromDate || !toDate) return "Coming Soon";
    return `${formatDate(fromDate)} - ${formatDate(toDate)}`;
  };

  // Format running time
  const formatRunningTime = (minutes) => {
    if (!minutes) return "N/A";
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const handleClickMovie = (movieTitle) => {
    const slug = slugify(movieTitle);
    navigate(`/${slug}`);
  };

  return (
    <div className="pt-24 pb-15 px-4 min-h-screenbg-gradient-to-b from-black via-gray-900 via-50% via-purple-950/50 to-slate-900">
      {/* Screen 3D Effect */}
      <div className="w-full mb-8 px-4">
        <div className="w-full h-[40px] relative overflow-hidden group">
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 800 40"
            className="absolute inset-0 transition-transform duration-500 group-hover:scale-110"
            preserveAspectRatio="none"
            style={{ background: "transparent" }}
          >
            <defs>
              <linearGradient
                id="purpleGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
              >
                <stop offset="0%" stopColor="#6a57f5" stopOpacity="0.1" />
                <stop offset="25%" stopColor="#6a57f5" stopOpacity="0.4" />
                <stop offset="50%" stopColor="#6a57f5" stopOpacity="1" />
                <stop offset="75%" stopColor="#6a57f5" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#6a57f5" stopOpacity="0.1" />
              </linearGradient>

              <linearGradient id="purpleGlow" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#6a57f5" stopOpacity="0.1" />
                <stop offset="25%" stopColor="#6a57f5" stopOpacity="0.5" />
                <stop offset="50%" stopColor="#6a57f5" stopOpacity="1" />
                <stop offset="75%" stopColor="#6a57f5" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#6a57f5" stopOpacity="0.1" />
              </linearGradient>
            </defs>

            <path
              d="M 0 20 Q 400 0 800 20"
              stroke="url(#purpleGlow)"
              strokeWidth="6"
              strokeLinecap="round"
              fill="none"
              className="blur-[1px] transition-all duration-500 group-hover:blur-[0px]"
            />

            <path
              d="M 0 20 Q 400 0 800 20"
              stroke="url(#purpleGradient)"
              strokeWidth="4"
              strokeLinecap="round"
              fill="none"
              className="transition-all duration-500"
            />
          </svg>
        </div>
      </div>

      {/* Back Button and Title */}
      <div className="flex items-center justify-between mb-8">
        <BackButton/>

        <h1 className="text-3xl font-bold text-white">All Movies</h1>

        {/* Empty div for spacing */}
        <div className="w-[120px]"></div>
      </div>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <EnhancedSearchForm
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onSubmit={handleSearch}
        />
        <EnhancedSortDropdown
          sortOrder={sortOrder}
          onSortChange={handleSortChange}
        />
      </div>

      {loading ? (
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="flex flex-col items-center space-y-4">
            {/* Spinning Movie Reel Animation */}
            <div className="relative">
              <div className="w-16 h-16 border-4 border-[#6a57f5] border-t-transparent rounded-full animate-spin"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="w-8 h-8 bg-[#6a57f5] rounded-full opacity-20 animate-pulse"></div>
              </div>
            </div>

            {/* Loading Text with Dots Animation */}
            <div className="text-white text-lg font-medium">
              <span>Loading movies</span>
              <span className="inline-block animate-pulse">
                <span
                  className="animate-bounce"
                  style={{ animationDelay: "0s" }}
                >
                  .
                </span>
                <span
                  className="animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                >
                  .
                </span>
                <span
                  className="animate-bounce"
                  style={{ animationDelay: "0.4s" }}
                >
                  .
                </span>
              </span>
            </div>

            {/* Skeleton Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-screen mt-8">
              {Array.from({ length: 8 }, (_, i) => (
                <div
                  key={i}
                  className="bg-slate-800 w-full rounded-xl overflow-hidden shadow-lg animate-pulse"
                >
                  <div className="w-full h-64 bg-slate-700"></div>
                  <div className="p-4 space-y-3">
                    <div className="h-6 bg-slate-700 rounded w-3/4"></div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-slate-700 rounded"></div>
                      <div className="h-4 bg-slate-700 rounded w-12"></div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-4 bg-slate-700 rounded w-full"></div>
                      <div className="h-4 bg-slate-700 rounded w-2/3"></div>
                    </div>
                    <div className="space-y-2 pt-2">
                      <div className="h-8 bg-slate-700 rounded w-full"></div>
                      <div className="h-8 bg-slate-700 rounded w-full"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {movies.map((movie) => (
              <MovieCard
                key={movie.MovieId}
                item={movie}
                isHovered={hoveredMovie === movie.MovieId}
                onMouseEnter={setHoveredMovie}
                onMouseLeave={() => setHoveredMovie(null)}
                onClickMovie={handleClickMovie}
                onOpenTrailer={handleOpenTrailer}
                formatDateRange={formatDateRange}
                formatRunningTime={formatRunningTime}
                showBookButton={true}
              />
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center items-center mt-12 gap-2">
            <button
              onClick={() => handlePageChange(pagination.currentPage - 1)}
              disabled={pagination.currentPage === 1}
              className="px-4 py-2 rounded-lg bg-slate-800 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-700 transition-colors"
            >
              Previous
            </button>

            {Array.from({ length: pagination.totalPages }, (_, i) => {
              const pageNumber = i + 1;
              const isCurrentPage = pagination.currentPage === pageNumber;
              const isNearCurrentPage =
                Math.abs(pagination.currentPage - pageNumber) <= 2;

              if (
                pagination.totalPages <= 7 ||
                isNearCurrentPage ||
                pageNumber === 1 ||
                pageNumber === pagination.totalPages
              ) {
                return (
                  <button
                    key={pageNumber}
                    onClick={() => handlePageChange(pageNumber)}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      isCurrentPage
                        ? "bg-[#6a57f5] text-white"
                        : "bg-slate-800 text-white hover:bg-slate-700"
                    }`}
                  >
                    {pageNumber}
                  </button>
                );
              } else if (
                pageNumber === 2 ||
                pageNumber === pagination.totalPages - 1
              ) {
                return (
                  <span key={pageNumber} className="text-white px-2">
                    ...
                  </span>
                );
              }
              return null;
            })}

            <button
              onClick={() => handlePageChange(pagination.currentPage + 1)}
              disabled={pagination.currentPage === pagination.totalPages}
              className="px-4 py-2 rounded-lg bg-slate-800 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-700 transition-colors"
            >
              Next
            </button>
          </div>
        </>
      )}

      {/* Trailer Popup Modal */}
      {isTrailerPopupOpen && currentTrailerMovie && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="relative w-full max-w-4xl mx-auto">
            {/* Close Button */}
            <button
              onClick={handleCloseTrailer}
              className="absolute -top-12 right-0 hover:bg-white/10 text-white bg-black/50 p-2 rounded-full transition-all duration-300 hover:scale-110 z-60"
              aria-label="Close trailer"
            >
              <X size={24} />
            </button>

            {/* Trailer Content */}
            <div className="bg-black rounded-2xl overflow-hidden shadow-2xl">
              {currentTrailerMovie.IframeUrl ? (
                <iframe
                  src={currentTrailerMovie.IframeUrl}
                  title={`${currentTrailerMovie.NameOfEnglish} Trailer`}
                  allow="autoplay; encrypted-media; fullscreen"
                  allowFullScreen
                  className="w-full aspect-video"
                />
              ) : currentTrailerMovie.TrailerUrl ? (
                <video
                  ref={popupVideoRef}
                  className="w-full aspect-video"
                  controls
                  autoPlay
                  preload="metadata"
                >
                  <source
                    src={currentTrailerMovie.TrailerUrl}
                    type="video/mp4"
                  />
                  Your browser does not support the video tag.
                </video>
              ) : (
                <div className="w-full aspect-video flex items-center justify-center bg-slate-800 text-white">
                  <div className="text-center">
                    <FaRegCirclePlay
                      size={48}
                      className="mx-auto mb-4 text-[#6a57f5]"
                    />
                    <p className="text-lg">Trailer not available</p>
                  </div>
                </div>
              )}
            </div>

            {/* Movie Info Below Video */}
            <div className="mt-6 text-white">
              <h3 className="text-2xl font-bold mb-2">
                {currentTrailerMovie.NameOfEnglish}
              </h3>
              <div className="flex items-center gap-4 text-sm text-gray-300">
                {currentTrailerMovie.AverageRating && (
                  <div className="flex items-center gap-1">
                    <FaStar className="text-yellow-400" />
                    <span>
                      {parseFloat(currentTrailerMovie.AverageRating).toFixed(1)}
                    </span>
                  </div>
                )}
                {currentTrailerMovie.RunningTime && (
                  <div className="flex items-center gap-1">
                    <GoClockFill />
                    <span>
                      {formatRunningTime(currentTrailerMovie.RunningTime)}
                    </span>
                  </div>
                )}
                {currentTrailerMovie.Genres && (
                  <div className="flex items-center gap-1">
                    <IoMdBookmark />
                    <span>{currentTrailerMovie.Genres}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieListPage;
