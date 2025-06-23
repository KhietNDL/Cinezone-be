import React, { useEffect, useRef, useState } from "react";
import { GoPlus } from "react-icons/go";
import {
  IoCalendarOutline,
  IoClose,
  IoEyeOutline,
  IoFilmOutline,
  IoSearchOutline,
  IoTimeOutline,
  IoPersonOutline,
  IoVideocamOutline,
  IoBookmarkOutline,
  IoMapOutline,
} from "react-icons/io5";
import { PiChartLineDownBold } from "react-icons/pi";
import { MdMovie, MdDeleteForever } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBin5Line } from "react-icons/ri";
import { FaUpload, FaCalendarAlt, FaClock } from "react-icons/fa";
import {
  createMovie,
  getMovies,
  editMovie,
  deleteMovie,
  searchMovies,
  getUpcomingMovies,
} from "../../../services/API";
import { formatDateRange } from "../../../utils/dateUtils";
import debounce from "lodash/debounce";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const MovieManagement = () => {
  const [movies, setMovies] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [selectedTooltipMovie, setSelectedTooltipMovie] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [searchMovie, setSearchMovie] = useState("");
  const itemsPerPage = 7;
  const [totalPages, setTotalPages] = useState(0);

  // State for each field
  const [nameOfVietnamese, setNameOfVietnamese] = useState("");
  const [nameOfEnglish, setNameOfEnglish] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [actors, setActors] = useState("");
  const [productionCompany, setProductionCompany] = useState("");
  const [director, setDirector] = useState("");
  const [runningTime, setRunningTime] = useState("");
  const [version, setVersion] = useState("2D");
  const [genres, setGenres] = useState("");
  const [contentSynopsis, setContentSynopsis] = useState("");
  const [posterImage, setPosterImage] = useState(null);
  const [trailerUrl, setTrailerUrl] = useState(null);
  const [posterFileName, setPosterFileName] = useState("");
  const [trailerFileName, setTrailerFileName] = useState("");
  const [upcomingMovies, setUpcomingMovies] = useState([]);
  const [posterPreview, setPosterPreview] = useState(null);
  const [trailerPreview, setTrailerPreview] = useState(null);

  const posterUploadRef = useRef(null);
  const trailerUploadRef = useRef(null);
  const getMovieData = async () => {
    try {
      const response = await getMovies({
        page: currentPage,
        limit: itemsPerPage,
      });
      if (response.data) {
        setMovies(response.data);
        const total = response.data.total || response.data.length;
        if (!searchMovie) {
          setTotalPages(
            response.data.totalPages || Math.ceil(total / itemsPerPage)
          );
        }
      }
    } catch (error) {
      console.error("Error fetching movies:", error);
    }
  };

  const getUpcomingMovie = async () => {
    try {
      const response = await getUpcomingMovies({
        limit: itemsPerPage,
        page: currentPage,
      });
      if (response.data) {
        console.log(" response.data.data", response.data);
        setUpcomingMovies(response.data);
      }
    } catch (error) {
      console.error("Error fetching upcoming movies:", error);
    }
  };

  useEffect(() => {
    getMovieData();
    getUpcomingMovie();
  }, [itemsPerPage, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
    debouncedSearchMovieData(searchMovie);
  }, [searchMovie]);

  const searchMovieData = async (searchTerm) => {
    if (!searchTerm.trim()) {
      getMovieData();
      return;
    }
    try {
      const response = await searchMovies({ name: searchTerm });
      if (response.data.data) {
        const normalizedMovies = response.data.data.map((movie) => ({
          ...movie,
        }));
        setMovies(normalizedMovies);
        const total = response.data.total || normalizedMovies.length; // Adjust based on API
        setTotalPages(Math.ceil(total / itemsPerPage));
        console.log("Total pages (searchMovieData):", totalPages);
      }
    } catch (error) {
      console.error("Error searching movies:", error);
      setMovies([]);
      setTotalPages(0);
    }
  };
  const debouncedSearchMovieData = debounce(searchMovieData, 500);

  const renderPaginationButtons = () => {
    const maxVisibleButtons = 5;
    const halfVisible = Math.floor(maxVisibleButtons / 2);
    let startPage = Math.max(1, currentPage - halfVisible);
    let endPage = Math.min(totalPages, currentPage + halfVisible);

    if (currentPage <= halfVisible) {
      endPage = Math.min(maxVisibleButtons, totalPages);
    }
    if (currentPage + halfVisible >= totalPages) {
      startPage = Math.max(1, totalPages - maxVisibleButtons + 1);
    }

    const pages = [];
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={`page-${i}`}
          onClick={() => handlePageChange(i)}
          className={`px-4 py-2 rounded ${
            currentPage === i
              ? "bg-blue-500 text-white"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
          aria-label={`Page ${i}`}
          aria-current={currentPage === i ? "true" : undefined}
        >
          {i}
        </button>
      );
    }

    if (startPage > 1) {
      pages.unshift(
        <button
          key="ellipsis-start"
          className="px-4 py-2 bg-gray-200 rounded cursor-default"
          disabled
        >
          ...
        </button>
      );
      pages.unshift(
        <button
          key="page-1"
          onClick={() => handlePageChange(1)}
          className={`px-4 py-2 rounded ${
            currentPage === 1
              ? "bg-blue-500 text-white"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
          aria-label="Page 1"
        >
          1
        </button>
      );
    }
    if (endPage < totalPages) {
      pages.push(
        <button
          key="ellipsis-end"
          className="px-4 py-2 bg-gray-200 rounded cursor-default"
          disabled
        >
          ...
        </button>
      );
      pages.push(
        <button
          key={`page-${totalPages}`}
          onClick={() => handlePageChange(totalPages)}
          className={`px-4 py-2 rounded ${
            currentPage === totalPages
              ? "bg-blue-500 text-white"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
          aria-label={`Page ${totalPages}`}
        >
          {totalPages}
        </button>
      );
    }

    return pages.length > 0 ? pages : <span>No pages to display</span>;
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      console.log("Page changed to:", page);
    }
  };

  const handleInputChange = (field, value) => {
    switch (field) {
      case "NameOfVietnamese":
        setNameOfVietnamese(value);
        break;
      case "NameOfEnglish":
        setNameOfEnglish(value);
        break;
      case "FromDate":
        setFromDate(value);
        break;
      case "ToDate":
        setToDate(value);
        break;
      case "Actors":
        setActors(value);
        break;
      case "ProductionCompany":
        setProductionCompany(value);
        break;
      case "Director":
        setDirector(value);
        break;
      case "RunningTime": {
        const numValue = parseInt(value, 10);
        if (value === "" || (!isNaN(numValue) && numValue > 0)) {
          setRunningTime(value);
        }
        break;
      }
      case "Version":
        setVersion(value);
        break;
      case "Genres":
        setGenres(value);
        break;
      case "ContentSynopsis":
        setContentSynopsis(value);
        break;
      default:
        break;
    }
  };

  const handleFileChange = (field, e) => {
    const file = e.target.files[0];
    if (file) {
      if (field === "PosterImage" && file.size > 10 * 1024 * 1024) {
        alert("Poster image must be less than 10MB");
        return;
      }
      if (field === "TrailerUrl" && file.size > 50 * 1024 * 1024) {
        alert("Trailer video must be less than 50MB");
        return;
      }

      if (field === "PosterImage") {
        setPosterImage(file);
        setPosterFileName(file.name);
        setPosterPreview(URL.createObjectURL(file));
      } else if (field === "TrailerUrl") {
        setTrailerUrl(file);
        setTrailerFileName(file.name);
        setTrailerPreview(URL.createObjectURL(file));
      }
    }
  };

  const validateForm = () => {
    const requiredFields = [
      { value: nameOfVietnamese, name: "Movie name (VN)" },
      { value: nameOfEnglish, name: "Movie name (ENG)" },
      { value: fromDate, name: "From date" },
      { value: toDate, name: "To date" },
      { value: actors, name: "Actors" },
      { value: productionCompany, name: "Production Company" },
      { value: director, name: "Director" },
      { value: runningTime, name: "Duration" },
      { value: version, name: "Version" },
      { value: genres, name: "Genres" },
      { value: contentSynopsis, name: "Content" },
      { value: posterImage || posterFileName, name: "Poster Image" }, // Allow existing file name
      { value: trailerUrl || trailerFileName, name: "Trailer URL" }, // Allow existing file name
    ];

    for (const field of requiredFields) {
      if (
        !field.value &&
        (typeof field.value !== "string" || !field.value.trim())
      ) {
        alert(`${field.name} is required`);
        return false;
      }
    }

    // Validate NameOfVietnamese for Vietnamese characters with accents
    const vietnameseRegex = /^[A-Za-z0-9À-ỹ\s,.:-]+$/;
    if (!vietnameseRegex.test(nameOfVietnamese.trim())) {
      alert(
        "Vietnamese movie name must contain valid characters (letters, numbers, Vietnamese accents, spaces, commas, periods, hyphens, colons)"
      );
      return false;
    }
    const hasVietnameseAccent = /[À-ỹ]/.test(nameOfVietnamese.trim());
    if (!hasVietnameseAccent) {
      console.error(
        "Vietnamese movie name must contain at least one accented character"
      );
      alert(
        "Vietnamese movie name must contain at least one accented character"
      );
      return false;
    }

    // Validate NameOfEnglish for English characters
    const englishRegex = /^[A-Za-z0-9\s,.:-]+$/;
    if (!englishRegex.test(nameOfEnglish.trim())) {
      alert(
        "English movie name must contain only letters, numbers, spaces, commas, periods, hyphens, colons"
      );
      return false;
    }

    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(fromDate)) {
      alert("From date must be in yyyy-mm-dd format");
      return false;
    }
    if (!dateRegex.test(toDate)) {
      alert("To date must be in yyyy-mm-dd format");
      return false;
    }

    const runningTimeNum = parseInt(runningTime, 10);
    if (isNaN(runningTimeNum) || runningTimeNum <= 0) {
      alert("Duration must be a positive integer");
      return false;
    }

    const fromDateObj = new Date(fromDate);
    const toDateObj = new Date(toDate);

    if (fromDateObj >= toDateObj) {
      alert("To date must be after from date (same day not allowed)");
      return false;
    }
    if (fromDateObj < new Date("2025-06-19T01:06:00+07:00")) {
      alert("From date must not be in the past");
      return false;
    }

    return true;
  };

  const handleCreateMovie = async () => {
    if (!validateForm()) return;

    try {
      const movieData = new FormData();
      movieData.append("NameOfVietnamese", nameOfVietnamese.trim());
      movieData.append("NameOfEnglish", nameOfEnglish.trim());
      movieData.append("FromDate", fromDate);
      movieData.append("ToDate", toDate);
      movieData.append("Actors", actors.trim());
      movieData.append("ProductionCompany", productionCompany.trim());
      movieData.append("Director", director.trim());
      movieData.append("RunningTime", parseInt(runningTime, 10).toString());
      movieData.append("Version", version);
      movieData.append("Genres", genres.trim());
      movieData.append("ContentSynopsis", contentSynopsis.trim());
      if (posterImage) movieData.append("poster", posterImage);
      if (trailerUrl) movieData.append("trailer", trailerUrl);

      const newMovie = await createMovie(movieData);
      setMovies((prev) => [...prev, newMovie]);
      resetForm();
      setShowAddForm(false);
      toast.success("Movie added successfully!");
    } catch (error) {
      if (
        error.response?.data?.errors &&
        Array.isArray(error.response.data.errors)
      ) {
        const errorMessages = error.response.data.errors
          .map((err) => err.msg)
          .join("\n");
        alert(`Failed to create movie:\n${errorMessages}`);
      } else {
        alert(
          `Failed to create movie: ${
            error.response?.data?.message || error.message || "Server error"
          }`
        );
      }
    }
  };

  const handleEditMovie = async () => {
    try {
      const movieData = new FormData();
      movieData.append("MovieId", selectedMovie.MovieId);
      movieData.append("NameOfVietnamese", nameOfVietnamese.trim());
      movieData.append("NameOfEnglish", nameOfEnglish.trim());
      movieData.append("FromDate", fromDate);
      movieData.append("ToDate", toDate);
      movieData.append("Actors", actors.trim());
      movieData.append("ProductionCompany", productionCompany.trim());
      movieData.append("Director", director.trim());
      movieData.append("RunningTime", parseInt(runningTime, 10).toString());
      movieData.append("Version", version);
      movieData.append("Genres", genres.trim());
      movieData.append("ContentSynopsis", contentSynopsis.trim());
      if (posterImage) movieData.append("poster", posterImage);
      else if (posterFileName && !posterImage)
        movieData.append("poster", posterFileName); // Send existing file name if no new upload
      if (trailerUrl) movieData.append("trailer", trailerUrl);
      else if (trailerFileName && !trailerUrl)
        movieData.append("trailer", trailerFileName); // Send existing file name if no new upload

      const updatedMovie = await editMovie(movieData);
      setMovies((prev) =>
        prev.map((mov) =>
          mov.MovieId === updatedMovie.MovieId ? updatedMovie : mov
        )
      );
      resetForm();
      setShowEditForm(false);
      setSelectedMovie(null);
      toast.success("Movie updated successfully!");
    } catch (error) {
      console.error("Error editing movie:", {
        response: error.response?.data,
        status: error.response?.status,
        message: error.message,
      });
      if (
        error.response?.data?.errors &&
        Array.isArray(error.response.data.errors)
      ) {
        const errorMessages = error.response.data.errors
          .map((err) => err.msg)
          .join("\n");
        alert(`Failed to edit movie:\n${errorMessages}`);
      } else {
        alert(
          `Failed to edit movie: ${
            error.response?.data?.message || error.message || "Server error"
          }`
        );
      }
    }
  };

  const resetForm = () => {
    setNameOfVietnamese("");
    setNameOfEnglish("");
    setFromDate("");
    setToDate("");
    setActors("");
    setProductionCompany("");
    setDirector("");
    setRunningTime("");
    setVersion("2D");
    setGenres("");
    setContentSynopsis("");
    setPosterImage(null);
    setTrailerUrl(null);
    setPosterFileName("");
    setTrailerFileName("");
    setPosterPreview(null);
    setTrailerPreview(null);
  };
  const handleEdit = (movie) => {
    setSelectedMovie(movie);
    setNameOfVietnamese(movie.NameOfVietnamese || "");
    setNameOfEnglish(movie.NameOfEnglish || "");
    const formatDate = (dateStr) => {
      if (!dateStr) return "";
      const date = new Date(dateStr);
      return date.toISOString().split("T")[0];
    };
    setFromDate(formatDate(movie.FromDate));
    setToDate(formatDate(movie.ToDate));
    setActors(movie.Actors || "");
    setProductionCompany(movie.ProductionCompany || "");
    setDirector(movie.Director || "");
    setRunningTime(movie.RunningTime ? movie.RunningTime.toString() : "");
    setVersion(movie.Version || "2D");
    setGenres(movie.Genres || ""); // Đảm bảo genres là chuỗi
    setContentSynopsis(movie.ContentSynopsis || "");
    setPosterFileName(movie.PosterImage || "");
    setTrailerFileName(movie.trailer || "");
    setPosterImage(null);
    setTrailerUrl(null);
    // Set previews if URLs are available (optional, depends on your API)
    if (movie.PosterImage && movie.PosterImage.startsWith("http")) {
      setPosterPreview(movie.PosterImage);
    }
    if (movie.trailer && movie.trailer.startsWith("http")) {
      setTrailerPreview(movie.trailer);
    }
    setShowEditForm(true);
  };

  const handleDelete = (movie) => {
    console.log("Movie to delete:", movie); // Debug
    if (!movie || !movie.MovieId) {
      console.error("Invalid movie or movieId:", movie);
      alert("Cannot delete: Invalid movie selection.");
      return;
    }
    setSelectedMovie(movie);
    setShowDeletePopup(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteMovie(selectedMovie.MovieId);
      setMovies((prev) =>
        prev.filter((mov) => mov.MovieId !== selectedMovie.MovieId)
      );
      setShowDeletePopup(false);
      setSelectedMovie(null);
      toast.success("Movie deleted successfully!");
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  const handleRowClick = (movie, event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setTooltipPosition({
      x: rect.right + 10,
      y: rect.top + window.scrollY,
    });
    setSelectedTooltipMovie(movie);
  };

  const handleOutsideClick = (e) => {
    if (!e.target.closest("tr") && !e.target.closest(".tooltip")) {
      setSelectedTooltipMovie(null);
    }
  };

  const handleCloseMovieForm = () => {
    setShowAddForm(false);
    setShowEditForm(false);
    resetForm();
    setSelectedMovie(null);
  };

  const MovieTooltip = ({ movie, onClose }) => (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50">
      <div className="bg-white rounded-2xl shadow-2xl p-6 w-[650px] h-[calc(100vh_-_4rem)] overflow-y-auto transform transition-all duration-300 scale-100">
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900 mb-1">
              {movie.NameOfEnglish}
            </h2>
            <p className="text-sm text-gray-500 font-medium">
              {movie.NameOfVietnamese}
            </p>
            <p className="text-sm text-gray-600 font-medium mt-1">
              {movie.ProductionCompany}
            </p>
          </div>
          <div
            onClick={onClose}
            role="button"
            className="p-2 rounded-2xl hover:bg-slate-100 active:bg-slate-200 transition-all duration-200 hover:scale-110 active:scale-95"
          >
            <IoClose size={24} className="text-gray-600" />
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-shrink-0">
            <div className="relative group">
              <img
                src={movie.PosterImage}
                alt={movie.NameOfEnglish}
                className="w-48 h-72 rounded-xl object-cover shadow-lg border border-gray-200 group-hover:shadow-xl transition-shadow duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          </div>
          <div className="flex-1 space-y-4">
            <div className="flex items-center p-3 bg-blue-50 rounded-lg border border-blue-100">
              <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full mr-3">
                <IoCalendarOutline size={20} className="text-blue-600" />
              </div>
              <div>
                <span className="text-sm font-medium text-blue-800 block">
                  Release Date
                </span>
                <span className="text-sm text-blue-600 font-semibold">
                  {formatDateRange(movie.FromDate, movie.ToDate)}
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center p-3 w-[49%] bg-green-50 rounded-lg border border-green-100">
                <div className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-full mr-3">
                  <IoTimeOutline size={20} className="text-green-600" />
                </div>
                <div>
                  <span className="text-sm font-medium text-green-800 block">
                    Duration
                  </span>
                  <span className="text-sm text-green-600 font-semibold">
                    {movie.RunningTime ? `${movie.RunningTime} min` : "TBA"}
                  </span>
                </div>
              </div>
              <div className="flex items-center p-3 bg-teal-50 rounded-lg border border-teal-100">
                <div className="flex items-center justify-center w-10 h-10 bg-teal-100 rounded-full mr-3">
                  <IoMapOutline size={20} className="text-teal-600" />
                </div>
                <div>
                  <span className="text-sm font-medium text-teal-800 block">
                    Cinema Room
                  </span>
                  <span className="text-sm text-teal-600 font-semibold">
                    {movie.cinemaRoom || "N/A"}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center p-3 bg-yellow-50 rounded-lg border border-yellow-100">
              <div className="flex items-center justify-center w-10 h-10 bg-yellow-100 rounded-full mr-3">
                <IoPersonOutline size={20} className="text-yellow-600" />
              </div>
              <div>
                <span className="text-sm font-medium text-yellow-800 block">
                  Actors
                </span>
                <span className="text-sm text-yellow-600 font-semibold">
                  {movie.Actors}
                </span>
              </div>
            </div>
            <div className="flex items-center p-3 bg-red-50 rounded-lg border border-red-100">
              <div className="flex items-center justify-center w-10 h-10 bg-red-100 rounded-full mr-3">
                <IoVideocamOutline size={20} className="text-red-600" />
              </div>
              <div>
                <span className="text-sm font-medium text-red-800 block">
                  Director
                </span>
                <span className="text-sm text-red-600 font-semibold">
                  {movie.Director}
                </span>
              </div>
            </div>
            <div className="flex items-center p-3 bg-purple-50 rounded-lg border border-purple-100">
              <div className="flex items-center justify-center w-10 h-10 bg-purple-100 rounded-full mr-3">
                <IoFilmOutline size={20} className="text-purple-600" />
              </div>
              <div>
                <span className="text-sm font-medium text-purple-800 block">
                  Version
                </span>
                <span className="text-sm text-purple-600 font-semibold">
                  {movie.Version}
                </span>
              </div>
            </div>
            <div className="flex items-center p-3 bg-indigo-50 rounded-lg border border-indigo-100">
              <div className="flex items-center justify-center w-10 h-10 bg-indigo-100 rounded-full mr-3">
                <IoBookmarkOutline size={20} className="text-indigo-600" />
              </div>
              <div>
                <span className="text-sm font-medium text-indigo-800 block">
                  Genres
                </span>
                <span className="text-sm text-indigo-600 font-semibold">
                  {movie.Genres}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Synopsis</h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            {movie.ContentSynopsis}
          </p>
        </div>
      </div>
    </div>
  );

  const DeletePopup = () => (
    <div className="fixed inset-0 bg-black/30 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-[400px]">
        <div className="text-center">
          <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <MdDeleteForever className="text-red-500" size={24} />
          </div>
          <h3 className="text-lg font-semibold mb-2">Delete Movie</h3>
          <p className="text-gray-600 mb-6">
            Are you sure you want to delete{" "}
            <strong>{selectedMovie?.NameOfEnglish}</strong>? This action cannot
            be undone.
          </p>
          <div className="flex justify-center space-x-3">
            <button
              onClick={() => setShowDeletePopup(false)}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              onClick={confirmDelete}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div
      className="flex items-center h-full justify-between"
      onClick={handleOutsideClick}
    >
      <div className="w-[90%] space-y-4 h-[calc(100vh_-_7rem)]">
        <div className="flex items-center justify-between w-full">
          <div className="bg-white rounded-md p-3 w-[23%] shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-slate-500">Total Views</p>
              <div className="p-2 bg-sky-100 rounded-full">
                <MdMovie size={20} className="text-blue-500" />
              </div>
            </div>
            <div className="font-bold text-[19px]">{movies.length}</div>
          </div>
          <div className="bg-white rounded-md p-3 w-[23%] shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-slate-500 text-[14px]">Upcoming Releases</p>
              <div className="p-2 bg-rose-50 rounded-full">
                <FaCalendarAlt size={20} className="text-red-500" />
              </div>
            </div>
            <div className="font-bold text-[19px]">{upcomingMovies.length}</div>
          </div>
          <div className="bg-white rounded-md p-3 w-[23%] shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-slate-500">Expired Movies</p>
              <div className="p-2 bg-sky-100 rounded-full">
                <PiChartLineDownBold size={20} className="text-blue-500" />
              </div>
            </div>
            {movies.filter((movie) => movie.isDeleted === 1).length}
          </div>
          <div className="bg-white rounded-md p-3 w-[23%] shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-slate-500">Average Duration</p>
              <div className="p-2 bg-rose-50 rounded-full">
                <FaClock size={20} className="text-red-500" />
              </div>
            </div>
            {movies.length
              ? Math.round(
                  movies.reduce(
                    (sum, movie) => sum + (movie.RunningTime || 0),
                    0
                  ) / movies.length
                )
              : 0}
          </div>
        </div>
        <div className="w-full py-3 space-y-4">
          <div className="flex items-center justify-between">
            <div className="w-full">
              <div className="flex items-center p-1 px-2 w-2/4 rounded-xl bg-white shadow-sm">
                <div className="shrink-0">
                  <IoSearchOutline size={20} />
                </div>
                <input
                  type="text"
                  value={searchMovie}
                  onChange={(e) => setSearchMovie(e.target.value)}
                  className="p-2 focus:outline-none w-full"
                  placeholder="Search by name movie ENG or VN"
                />
              </div>
            </div>
            <div className="flex items-center justify-between gap-2">
              <div
                role="button"
                onClick={() => setShowAddForm(true)}
                className="flex items-center text-[#6051F3] hover:bg-slate-50 p-2 rounded-md active:bg-slate-100 bg-white shadow-sm"
              >
                <GoPlus size={20} className="mr-2" />
                Movie
              </div>
            </div>
          </div>
          <div className="bg-white  p-4 rounded-md shadow-sm">
            <table className="w-full table-auto border-collapse">
              <thead>
                <tr className="text-left text-slate-500 text-sm border-b border-slate-200">
                  <th className="py-2">Poster Movie</th>
                  <th className="py-2">Name Movie (ENG)</th>
                  <th className="py-2">Name Movie (VN)</th>
                  <th className="py-2 text-center">Release Date</th>
                  <th className="py-2 pl-2">Duration</th>
                  <th className="py-2 text-center">Version</th>
                  <th className="py-2 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {movies
                  .slice(
                    (currentPage - 1) * itemsPerPage,
                    currentPage * itemsPerPage
                  )
                  .map((mov) => (
                    <tr
                      key={mov.MovieId}
                      role="button"
                      onClick={(e) => handleRowClick(mov, e)}
                      className="border-b border-slate-200 hover:bg-slate-100 text-sm"
                    >
                      <td className="py-2 text-center">
                        <img
                          src={mov.PosterImage}
                          alt=""
                          className="w-[80px] h-[100px] rounded-lg"
                        />
                      </td>

                      {mov.NameOfEnglish.length > 20 ? (
                        <td className="py-2">
                          {mov.NameOfEnglish.slice(0, 20) + "..."}
                        </td>
                      ) : (
                        <td className="py-2">{mov.NameOfEnglish}</td>
                      )}
                      {mov.NameOfVietnamese.length > 20 ? (
                        <td className="py-2">
                          {mov.NameOfVietnamese.slice(0, 20) + "..."}
                        </td>
                      ) : (
                        <td className="py-2">{mov.NameOfVietnamese}</td>
                      )}
                      <td className="py-2 text-center">
                        {formatDateRange(mov.FromDate, mov.ToDate)}
                      </td>
                      <td className="py-2 text-center">
                        {mov.RunningTime} mins
                      </td>
                      <td className="py-2 text-center">{mov.Version}</td>
                      <td className=" py-2">
                        <div className="flex items-center justify-between">
                          <div
                            role="button"
                            className="text-blue-500 hover:text-blue-700"
                          >
                            <IoEyeOutline size={20} />
                          </div>
                          <div
                            role="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEdit(mov);
                            }}
                            className="text-blue-500 hover:text-blue-700"
                            title="Edit"
                          >
                            <FaRegEdit size={20} />
                          </div>
                          <div
                            role="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(mov);
                            }}
                            className="text-red-400 hover:text-red-600"
                            title="Delete"
                          >
                            <RiDeleteBin5Line size={20} />
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-end space-x-2 pt-4">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50 hover:bg-gray-300"
              aria-label="Previous page"
            >
              Previous
            </button>

            {renderPaginationButtons()}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50 hover:bg-gray-300"
              aria-label="Next page"
            >
              Next
            </button>
          </div>
        </div>

        {(showAddForm || showEditForm) && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[95vh] overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold">
                      {showEditForm ? "Edit Movie" : "Add New Movie"}
                    </h2>
                    <p className="text-blue-100 text-sm mt-1">
                      {showEditForm
                        ? "Update the details below to edit the movie entry"
                        : "Fill in the details below to add a movie entry"}
                    </p>
                  </div>
                  <button
                    onClick={handleCloseMovieForm}
                    className="p-2 hover:bg-white/10 rounded-full transition-colors"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Form Content */}
              <div className="p-6 overflow-y-auto max-h-[calc(95vh-170px)]">
                <div className="space-y-6">
                  {/* Movie Names */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <svg
                        className="w-5 h-5 mr-2 text-blue-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2h4a1 1 0 110 2h-1v12a2 2 0 01-2 2H6a2 2 0 01-2-2V6H3a1 1 0 110-2h4z"
                        />
                      </svg>
                      Movie Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Movie Name (Vietnamese){" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          placeholder="Tên phim tiếng Việt"
                          value={nameOfVietnamese}
                          onChange={(e) =>
                            handleInputChange(
                              "NameOfVietnamese",
                              e.target.value
                            )
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Movie Name (English){" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          placeholder="English movie name"
                          value={nameOfEnglish}
                          onChange={(e) =>
                            handleInputChange("NameOfEnglish", e.target.value)
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Date Range */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <svg
                        className="w-5 h-5 mr-2 text-green-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      Screening Period
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          From Date <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="date"
                          value={fromDate || ""}
                          onChange={(e) =>
                            handleInputChange("FromDate", e.target.value)
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          To Date <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="date"
                          value={toDate || ""}
                          onChange={(e) =>
                            handleInputChange("ToDate", e.target.value)
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Production Details */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <svg
                        className="w-5 h-5 mr-2 text-purple-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                      </svg>
                      Production Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Main Actors <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          placeholder="Actor 1, Actor 2, Actor 3..."
                          value={actors || ""}
                          onChange={(e) =>
                            handleInputChange("Actors", e.target.value)
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Production Company{" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          placeholder="Studio name"
                          value={productionCompany || ""}
                          onChange={(e) =>
                            handleInputChange(
                              "ProductionCompany",
                              e.target.value
                            )
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Director <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          placeholder="Director name"
                          value={director || ""}
                          onChange={(e) =>
                            handleInputChange("Director", e.target.value)
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Duration (minutes){" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="number"
                          placeholder="120"
                          value={runningTime || ""}
                          onChange={(e) =>
                            handleInputChange("RunningTime", e.target.value)
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Technical Details */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <svg
                        className="w-5 h-5 mr-2 text-orange-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                      Technical Specifications
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Version <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={version || "2D"}
                          onChange={(e) =>
                            handleInputChange("Version", e.target.value)
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        >
                          <option value="2D">2D</option>
                          <option value="3D">3D</option>
                          <option value="IMAX">IMAX</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Genres <span className="text-red-500">*</span>
                        </label>
                        <select
                          multiple
                          value={
                            genres ? genres.split(", ").filter(Boolean) : []
                          }
                          onChange={(e) => {
                            const selectedOptions = Array.from(
                              e.target.selectedOptions,
                              (option) => option.value
                            );
                            handleInputChange(
                              "Genres",
                              selectedOptions.join(", ").trim() || ""
                            );
                          }}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all h-32"
                        >
                          <option value="Action">Action</option>
                          <option value="Romance">Romance</option>
                          <option value="Comedy">Comedy</option>
                          <option value="Drama">Drama</option>
                          <option value="Horror">Horror</option>
                          <option value="Sci-Fi">Sci-Fi</option>
                          <option value="Fantasy">Fantasy</option>
                          <option value="Adventure">Adventure</option>
                          <option value="Thriller">Thriller</option>
                          <option value="Animation">Animation</option>
                        </select>
                        <p className="text-xs text-gray-500 mt-1">
                          Hold Ctrl/Cmd to select multiple genres
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Content and Media */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <svg
                        className="w-5 h-5 mr-2 text-red-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      Content & Media
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Movie Synopsis <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          placeholder="Enter a compelling movie description..."
                          value={contentSynopsis || ""}
                          onChange={(e) =>
                            handleInputChange("ContentSynopsis", e.target.value)
                          }
                          rows={6}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Poster Image <span className="text-red-500">*</span>
                        </label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                          {posterPreview ? (
                            <div className="relative">
                              <img
                                src={posterPreview}
                                alt="Poster Preview"
                                className="w-full h-48 object-cover rounded-lg"
                              />
                              <button
                                onClick={() => {
                                  handleFileChange("PosterImage", {
                                    target: { files: [] },
                                  });
                                  setPosterFileName("");
                                  setPosterPreview(null);
                                  if (posterUploadRef.current) {
                                    posterUploadRef.current.value = "";
                                  }
                                }}
                                className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 transition-colors"
                              >
                                ✕
                              </button>
                            </div>
                          ) : (
                            <div>
                              <svg
                                className="mx-auto h-12 w-12 text-gray-400 mb-4"
                                stroke="currentColor"
                                fill="none"
                                viewBox="0 0 48 48"
                              >
                                <path
                                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                  strokeWidth={2}
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                              <input
                                type="file"
                                accept="image/png, image/jpeg"
                                onChange={(e) =>
                                  handleFileChange("PosterImage", e)
                                }
                                className="hidden"
                                id="posterUpload"
                                ref={posterUploadRef}
                              />
                              <label
                                htmlFor="posterUpload"
                                className="text-blue-600 hover:text-blue-800 font-semibold cursor-pointer"
                              >
                                Click to upload poster
                              </label>
                              <p className="text-xs text-gray-500 mt-2">
                                PNG, JPG up to 10MB
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Trailer Upload */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <svg
                        className="w-5 h-5 mr-2 text-indigo-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                        />
                      </svg>
                      Movie Trailer
                    </h3>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                      {trailerPreview ? (
                        <div className="relative">
                          <video
                            src={trailerPreview}
                            controls
                            className="w-full h-48 object-cover rounded-lg"
                          />
                          <button
                            onClick={() => {
                              handleFileChange("TrailerUrl", {
                                target: { files: [] },
                              });
                              setTrailerFileName("");
                              setTrailerPreview(null);
                              if (trailerUploadRef.current) {
                                trailerUploadRef.current.value = "";
                              }
                            }}
                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 transition-colors"
                          >
                            ✕
                          </button>
                        </div>
                      ) : (
                        <div>
                          <svg
                            className="mx-auto h-12 w-12 text-gray-400 mb-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                            />
                          </svg>
                          <input
                            type="file"
                            accept="video/*"
                            onChange={(e) => handleFileChange("TrailerUrl", e)}
                            className="hidden"
                            id="trailerUpload"
                            ref={trailerUploadRef}
                          />
                          <label
                            htmlFor="trailerUpload"
                            className="text-blue-600 hover:text-blue-800 font-semibold cursor-pointer"
                          >
                            Click to upload trailer
                          </label>
                          <p className="text-xs text-gray-500 mt-2">
                            Video files up to 50MB
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="bg-gray-50 px-6 py-4 border-slate-300 border-t flex justify-end space-x-3">
                <button
                  onClick={handleCloseMovieForm}
                  className="px-6 py-3 text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={showEditForm ? handleEditMovie : handleCreateMovie}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg font-medium transition-all shadow-md hover:shadow-lg"
                >
                  {showEditForm ? "Save Changes" : "Create Movie"}
                </button>
              </div>
            </div>
          </div>
        )}
        {showDeletePopup && <DeletePopup />}
        {selectedTooltipMovie && (
          <MovieTooltip
            movie={selectedTooltipMovie}
            onClose={() => setSelectedTooltipMovie(null)}
          />
        )}
      </div>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        // pauseOnHover
      />
    </div>
  );
};

export default MovieManagement;
