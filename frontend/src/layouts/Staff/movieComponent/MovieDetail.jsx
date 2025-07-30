import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  FaStar,
  FaRegStar,
  FaStarHalfAlt,
  FaClock,
  FaCalendarAlt,
  FaFilm,
  FaUsers,
} from "react-icons/fa";
import { LuChartBar } from "react-icons/lu";
import { GiTrophyCup } from "react-icons/gi";
import { IoTicketOutline } from "react-icons/io5";
import { Card, Badge, Divider, Spin } from "antd";
import { getCurrentMovies } from "../../../services/APIForStaff/API";
import MovieSwiper from "../component/MovieSwiper";
import "../component/SwiperButton.css";
import { toast } from "react-toastify";
import BackButton from "../component/BackButton";
import VersionCard from "../component/VersionCard";

export default function MovieDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);

  const [imageError, setImageError] = useState({});
  const [recommended, setRecommended] = useState([]);
  const [topMovies, setTopMovies] = useState([]);

  const toSlug = (str) =>
    str
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

  const fetchMovie = async () => {
    setLoading(true);
    try {
      const res = await getCurrentMovies();
      if (res.data) {
        const found = res.data.find((m) => toSlug(m.NameOfEnglish) === slug);
        setMovie(found || null);
      } else {
        setMovie(null);
      }
    } catch (error) {
      setMovie(null);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchTopMovies = async () => {
    try {
      const res = await getCurrentMovies();
      if (res.data) {
        const sortedMovies = res.data
          .filter((movie) => movie.AverageRating)
          .sort(
            (a, b) => parseFloat(b.AverageRating) - parseFloat(a.AverageRating)
          )
          .slice(0, 5)
          .map((movie, index) => ({
            MovieId: movie.MovieId,
            name: movie.NameOfEnglish,
            image: movie.PosterImage,
            rating: movie.AverageRating,
            index,
          }));
        setTopMovies(sortedMovies);
      }
    } catch (error) {
      console.error("Error fetching top movies:", error);
      setTopMovies([]);
    }
  };

  const fetchRecommended = async () => {
    if (!movie) return;
    try {
      const res = await getCurrentMovies();
      if (res.data) {
        const currentGenres =
          movie.Genres?.split(",").map((g) => g.trim().toLowerCase()) || [];
        const filtered = res.data.filter(
          (m) =>
            m.MovieId !== movie.MovieId &&
            m.Genres &&
            m.Genres.split(",").some((g) =>
              currentGenres.includes(g.trim().toLowerCase())
            )
        );
        setRecommended(filtered);
      }
    } catch (error) {
      setRecommended([]);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchMovie();
    fetchTopMovies();
  }, [slug]);

  useEffect(() => {
    fetchRecommended();
  }, [movie]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Spin size="large" />
          <h3 className="mt-4 text-lg font-medium text-gray-700">
            Loading Movie Details
          </h3>
          <p className="mt-2 text-gray-500">
            Please wait while we fetch the movie information...
          </p>
        </div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaFilm className="text-3xl text-red-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            Movie Not Found
          </h3>
          <p className="text-gray-500">
            The requested movie could not be found.
          </p>
        </div>
      </div>
    );
  }

  const versions = Array.isArray(movie.versions) ? movie.versions : [];

  const renderStars = (AverageRating) => {
    const stars = [];
    const full = Math.floor(AverageRating);
    const hasHalf = AverageRating % 1 >= 0.5;

    for (let i = 0; i < 5; i++) {
      if (i < full) {
        stars.push(<FaStar key={i} className="text-yellow-400" />);
      } else if (i === full && hasHalf) {
        stars.push(<FaStarHalfAlt key={i} className="text-yellow-400" />);
      } else {
        stars.push(<FaRegStar key={i} className="text-gray-300" />);
      }
    }

    return stars;
  };

  const fallbackImage = "https://via.placeholder.com/80x120.png?text=No+Image";

  const formatDate = (isoString) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <div className="min-h-screen">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-3 sm:py-4 bg-white shadow-md rounded-lg">
        <div className="flex flex-row items-center gap-3 lg:gap-4">
          <BackButton /> {/* Left: Logo/Brand */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-purple-600 to-purple-700 rounded-lg flex items-center justify-center">
              <FaFilm className="text-white text-lg sm:text-xl" />
            </div>
            <div>
              <h1 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-purple-600 to-purple-700 bg-clip-text text-transparent">
                Movie Details
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 hidden sm:block">
                Staff Portal - Cinema Management
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="pb-6 mt-6">
        <div className="flex gap-6 w-full lg:flex-row flex-col">
          {/* Main Movie Information */}
          <Card className="w-full lg:w-[70%] shadow-lg border-0 rounded-xl overflow-hidden">
            <div className="flex lg:flex-row flex-col w-full">
              {/* Movie Poster */}
              <div className="w-full lg:w-[35%] ">
                <div className="relative group">
                  <img
                    className="rounded-xl w-full h-auto lg:h-[400px] object-cover shadow-lg transition-transform group-hover:scale-105"
                    src={movie.PosterImage}
                    alt={movie.NameOfEnglish}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
              </div>

              {/* Movie Details */}
              <div className="w-full lg:w-[65%] lg:pl-10">
                <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-lg mb-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    {movie.NameOfEnglish}
                  </h2>
                  <p className="text-lg text-gray-600">
                    ({movie.NameOfVietnamese})
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <FaUsers className="text-purple-600 flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-gray-700">Director</p>
                        <p className="text-gray-600">{movie.Director}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <FaClock className="text-purple-600 flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-gray-700">Duration</p>
                        <p className="text-gray-600">
                          {movie.RunningTime} minutes
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <FaCalendarAlt className="text-purple-600 flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-gray-700">
                          Show Period
                        </p>
                        <p className="text-gray-600">
                          {formatDate(movie.FromDate)} -{" "}
                          {formatDate(movie.ToDate)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <p className="font-semibold text-gray-700 mb-2">Genres</p>
                      <div className="flex flex-wrap gap-2">
                        {movie.Genres?.split(",").map((genre, index) => (
                          <Badge
                            key={index}
                            color="purple"
                            text={genre.trim()}
                          />
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="font-semibold text-gray-700 mb-2">
                        Versions Available
                      </p>
                      <div className="flex gap-2 flex-wrap">
                        {versions.map((ver, index) => (
                          <VersionCard
                            key={index}
                            version={ver.VersionType}
                            selectedVersion={null}
                            readonly={true}
                          />
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="font-semibold text-gray-700 mb-2">Rating</p>
                      <div className="flex items-center gap-2">
                        <div className="flex">
                          {renderStars(movie.AverageRating)}
                        </div>
                        <span className="text-lg font-semibold text-gray-700">
                          ({movie.AverageRating})
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="font-semibold text-gray-700 mb-2">Cast</p>
                  <p className="text-gray-600 leading-relaxed">
                    {movie.Actors}
                  </p>
                </div>
              </div>
            </div>

            <Divider />

            {/* Synopsis */}

            <div className="flex items-center gap-2 mb-3">
              <LuChartBar className="text-purple-600" />
              <h3 className="font-semibold text-gray-800">Synopsis</h3>
            </div>
            <p className="text-gray-600 leading-relaxed">
              {movie.ContentSynopsis}
            </p>
          </Card>

          {/* Top Movies Sidebar */}
          <Card className="w-full lg:w-[30%] shadow-lg border-0 rounded-xl">
            <div className="">
              {/* Header */}
              <div className="flex items-center gap-3 justify-center mb-6 pb-4 border-b border-gray-100">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-purple-700 rounded-lg flex items-center justify-center">
                  <GiTrophyCup className="text-white text-lg" />
                </div>
                <div className="text-center">
                  <h3 className="text-lg font-bold text-gray-800">
                    Top 5 Movies
                  </h3>
                  <p className="text-xs text-gray-500">Highest rated films</p>
                </div>
              </div>

              {/* Movies List */}
              <div className="space-y-3">
                {topMovies.map((top, index) => (
                  <div
                    key={top.MovieId}
                    className="relative group cursor-pointer"
                    onClick={() => navigate(`/staff/movie/${toSlug(top.name)}`)}
                  >
                    <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-purple-50 transition-all duration-300 border border-transparent hover:border-purple-200 hover:shadow-md">
                      {/* Rank Badge */}
                      <div className="flex-shrink-0">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shadow-sm ${
                            index === 0
                              ? "bg-gradient-to-r from-yellow-400 to-yellow-500 text-white"
                              : index === 1
                              ? "bg-gradient-to-r from-gray-400 to-gray-500 text-white"
                              : index === 2
                              ? "bg-gradient-to-r from-orange-400 to-orange-500 text-white"
                              : "bg-gradient-to-r from-purple-500 to-purple-600 text-white"
                          }`}
                        >
                          {index === 0 && <span>🥇</span>}
                          {index === 1 && <span>🥈</span>}
                          {index === 2 && <span>🥉</span>}
                          {index > 2 && <span>{index + 1}</span>}
                        </div>
                      </div>

                      {/* Movie Info */}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm text-gray-800 group-hover:text-purple-700 transition-colors duration-300 line-clamp-2 mb-1">
                          {top.name}
                        </h4>

                        {/* Rating */}
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1">
                            <FaStar className="text-yellow-400 text-xs" />
                            <span className="text-xs font-medium text-gray-600">
                              {top.rating}
                            </span>
                          </div>
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <FaStar
                                key={i}
                                className={`text-xs ${
                                  i < Math.floor(top.rating)
                                    ? "text-yellow-400"
                                    : "text-gray-200"
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Movie Poster Preview */}
                      <div className="flex-shrink-0 w-10 h-14 rounded-md overflow-hidden shadow-sm border border-gray-200 group-hover:shadow-md transition-all duration-300">
                        <img
                          src={imageError[index] ? fallbackImage : top.image}
                          onError={() =>
                            setImageError((prev) => ({
                              ...prev,
                              [index]: true,
                            }))
                          }
                          alt={top.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>

        {/* Recommended Movies */}
        <Card
          style={{ marginTop: 30 }}
          className="shadow-lg border-0 rounded-xl"
        >
          {/* Header */}
          <div className="flex items-center gap-3 justify-center mb-6 pb-4 border-b border-gray-100">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-purple-700 rounded-lg flex items-center justify-center">
              <FaFilm className="text-white text-lg" />
            </div>
            <div className="text-center">
              <h3 className="text-lg font-bold text-gray-800">
                Recommended Movies
              </h3>
              <p className="text-xs text-gray-500">
                Movies you might also like
              </p>
            </div>
          </div>

          {/* Content */}
          <div className="px-6 pb-6">
            {recommended.length === 0 ? (
              <div className="text-center py-16">
                <div className="relative mx-auto mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-blue-100 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
                    <FaFilm className="text-3xl text-purple-500" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-orange-400 to-red-400 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-white text-xs font-bold">!</span>
                  </div>
                </div>
                <h4 className="text-xl font-semibold text-gray-700 mb-2">
                  No Recommendations Yet
                </h4>
                <p className="text-gray-500 max-w-md mx-auto leading-relaxed">
                  We're working on finding the perfect movie recommendations for
                  you. Check back later for personalized suggestions!
                </p>
              </div>
            ) : (
              <MovieSwiper
                movies={recommended}
                useLink={false}
                onSelectMovie={(movie) =>
                  navigate(`/staff/movie/${toSlug(movie.NameOfEnglish)}`)
                }
              />
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
