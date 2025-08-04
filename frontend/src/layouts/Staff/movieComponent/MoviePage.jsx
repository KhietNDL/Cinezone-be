import React, { useState, useEffect } from "react";
import { Input, Spin, Badge, Card } from "antd";
import { IoSearch, IoFilm, IoSearchOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "../component/SwiperButton.css";
import {
  getCurrentMovies,
  searchMovies,
} from "../../../services/APIForStaff/API";
import { useDebounce } from "../../../hooks/useDebounce";
import MovieSwiper from "../component/MovieSwiper";

export default function MoviePage() {
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const debouncedSearch = useDebounce(search, 500); // Giảm từ 3000ms xuống 500ms

  const toSlug = (str) =>
    str
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

  const handleMovieSelect = (movie) => {
    const newSelectedMovie =
      selectedMovie?.MovieId === movie.MovieId ? null : movie;
    setSelectedMovie(newSelectedMovie);

    // Navigate to movie detail page
    navigate(`/staff/movie/${toSlug(movie.NameOfEnglish)}`);
  };

  const getCurrentMovie = async () => {
    try {
      const response = await getCurrentMovies();
      if (response.data) {
        setMovies(response.data);
      }
    } catch (error) {
      console.error("Error fetching movies:", error);
    }
  };

  const fetchMovies = async (keyword) => {
    setLoading(true);
    try {
      if (!keyword) {
        await getCurrentMovie();
      } else {
        const response = await searchMovies(keyword);
        if (response.data) {
          setMovies(response.data);
        }
      }
    } catch (error) {
      console.error("Error searching movies:", error);
    } finally {
      setLoading(false);
    }
  };

  // Gọi API khi debouncedSearch thay đổi
  useEffect(() => {
    fetchMovies(debouncedSearch);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]); // Chỉ phụ thuộc vào debouncedSearch

  useEffect(() => {
    getCurrentMovie(); // initial load
  }, []); // Chỉ chạy một lần khi component mount

  return (
    <div className="min-h-screen  ">
      {/* Header Section with Modern Design */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-3 sm:py-4 bg-white shadow-md rounded-lg">
        <div className="flex flex-col md:flex-row justify-between items-center gap-3 lg:gap-4">
          {/* Left: Logo/Brand */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-purple-600 to-purple-700 rounded-lg flex items-center justify-center">
              <IoFilm className="text-white text-lg sm:text-xl" />
            </div>
            <div>
              <h1 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-purple-600 to-purple-700 bg-clip-text text-transparent">
                Movie Management
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 hidden sm:block">
                Staff Portal - Cinema Management
              </p>
            </div>
          </div>

          {/* Right: Search */}
          <div className="w-full md:w-[30%] flex items-center justify-center gap-3">
            <div className="flex items-center p-1 px-2 w-full max-w-[400px] rounded-xl bg-white shadow-sm">
              <IoSearchOutline size={20} />
              <input
                placeholder="Search movies"
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="p-1 sm:p-2 focus:outline-none w-full text-sm sm:text-base"
                style={{
                  fontSize: "14px",
                  backgroundColor: "#ffffff",
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Movies Grid Section */}
      <Card
        className="mt-[30px] shadow-lg border-0 rounded-xl overflow-hidden"
        style={{ marginTop: 30 }}
      >
        {loading ? (
          <div className="flex items-center justify-center py-16 sm:py-24">
            <div className="text-center">
              <div className="relative">
                <Spin size="large" />
                <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-purple-600 rounded-full opacity-20 animate-pulse"></div>
              </div>
              <h3 className="mt-6 text-lg font-medium text-gray-700">
                Loading Movies
              </h3>
              <p className="mt-2 text-gray-500 text-sm">
                Please wait while we fetch the latest movies...
              </p>
            </div>
          </div>
        ) : (
          <>
            {movies.length === 0 ? (
              <div className="text-center py-16 sm:py-24">
                <div className="relative mx-auto mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto">
                    <IoFilm className="text-3xl text-gray-400" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-100 rounded-full flex items-center justify-center">
                    <span className="text-red-500 text-xs">!</span>
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-700 mb-3">
                  No Movies Found
                </h3>
                <p className="text-gray-500 text-sm max-w-md mx-auto leading-relaxed">
                  {search
                    ? `We couldn't find any movies matching "${search}". Try a different search term.`
                    : "No movies are currently available. Please check back later or contact system administrator."}
                </p>
                {search && (
                  <button
                    onClick={() => setSearch("")}
                    className="mt-4 px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors duration-200 text-sm font-medium"
                  >
                    Clear Search
                  </button>
                )}
              </div>
            ) : (
              <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-6 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-purple-700 rounded-lg flex items-center justify-center">
                    <IoFilm className="text-white text-lg" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      Movie Selection
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Choose a movie to view details and manage bookings
                    </p>
                  </div>
                </div>
              </div>
            )}

            {movies.length > 0 && (
              <div className="p-6">
                <div className="staff-swiper">
                  <MovieSwiper
                    movies={movies}
                    selectedMovie={selectedMovie}
                    onSelectMovie={handleMovieSelect}
                  />
                </div>
              </div>
            )}
          </>
        )}
      </Card>
    </div>
  );
}
