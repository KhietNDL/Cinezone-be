import React, { useEffect, useState } from "react";
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

  // State riêng cho từng trường
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
    setCurrentPage(1); // Reset to first page on search
    debouncedSearchMovieData(searchMovie); // Use debounced function
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
  useEffect(() => {
    setCurrentPage(1); // Reset to first page on search
    debouncedSearchMovieData(searchMovie); // Use debounced function
  }, [searchMovie]);

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
      } else if (field === "TrailerUrl") {
        setTrailerUrl(file);
        setTrailerFileName(file.name);
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
      { value: posterImage, name: "Poster Image" },
      { value: trailerUrl, name: "Trailer URL" },
    ];

    for (const field of requiredFields) {
      if (
        !field.value ||
        (typeof field.value === "string" && !field.value.trim())
      ) {
        alert(`${field.name} là bắt buộc`);
        return false;
      }
    }

    // Validate NameOfVietnamese for Vietnamese characters with accents
    const vietnameseRegex = /^[A-Za-z0-9À-ỹ\s,.:-]+$/; // Thêm số (0-9) và dấu hai chấm (:)
    if (!vietnameseRegex.test(nameOfVietnamese.trim())) {
      alert(
        "Tên phim tiếng Việt phải chứa các ký tự hợp lệ (chữ cái, số, dấu tiếng Việt, dấu cách, dấu phẩy, dấu chấm, dấu gạch ngang, dấu hai chấm)"
      );
      return false;
    }
    // Require at least one Vietnamese accented character
    const hasVietnameseAccent = /[À-ỹ]/.test(nameOfVietnamese.trim());
    if (!hasVietnameseAccent) {
      console.error(
        "Vietnamese movie name must contain at least one accented character"
      );
      alert("Tên phim tiếng Việt phải chứa ít nhất một ký tự có dấu");
      return false;
    }

    // Validate NameOfEnglish for English characters
    const englishRegex = /^[A-Za-z0-9\s,.:-]+$/; // Thêm dấu hai chấm (:) cho tên tiếng Anh
    if (!englishRegex.test(nameOfEnglish.trim())) {
      alert(
        "Tên phim tiếng Anh chỉ được chứa chữ cái, số, dấu cách, dấu phẩy, dấu chấm, dấu gạch ngang, dấu hai chấm"
      );
      return false;
    }

    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(fromDate)) {
      alert("Ngày bắt đầu phải có định dạng yyyy-mm-dd");
      return false;
    }
    if (!dateRegex.test(toDate)) {
      alert("Ngày kết thúc phải có định dạng yyyy-mm-dd");
      return false;
    }

    const runningTimeNum = parseInt(runningTime, 10);
    if (isNaN(runningTimeNum) || runningTimeNum <= 0) {
      alert("Thời lượng phim phải là số nguyên dương");
      return false;
    }

    if (new Date(fromDate) > new Date(toDate)) {
      alert("Ngày bắt đầu phải trước ngày kết thúc");
      return false;
    }
    if (new Date(fromDate) < new Date("2025-06-19T01:06:00+07:00")) {
      alert("Ngày bắt đầu không được là ngày trong quá khứ");
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
    if (!validateForm() || !selectedMovie || !selectedMovie.MovieId) {
      alert("Cannot edit: Invalid movie selection or form data.");
      return;
    }

    try {
      const movieData = new FormData();
      movieData.append("MovieId", selectedMovie.MovieId); // Use MovieId
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

      const updatedMovie = await editMovie(movieData);
      setMovies((prev) =>
        prev.map((mov) =>
          mov.MovieId === updatedMovie.MovieId ? updatedMovie : mov
        )
      );
      resetForm();
      setShowEditForm(false);
      setSelectedMovie(null);
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
  };
  const handleEdit = (movie) => {
    console.log("Movie to edit:", movie); // Debug
    if (!movie || !movie.MovieId) {
      console.error("Invalid movie or movieId:", movie);
      alert("Cannot delete: Invalid movie selection.");
      return;
    }
    setSelectedMovie(movie);
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
    if (!selectedMovie || !selectedMovie.MovieId) {
      alert("Cannot delete: No movie selected or invalid movie ID.");
      return;
    }

    try {
      await deleteMovie(selectedMovie.MovieId);
      setMovies((prev) =>
        prev.filter((mov) => mov.MovieId !== selectedMovie.MovieId)
      );
      setShowDeletePopup(false);
      setSelectedMovie(null);
    } catch (error) {
      console.error("Delete error:", error);
      alert(`Failed to delete movie: ${error.message || "Server error"}`);
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
      className="p-[20px] flex items-center h-full justify-between"
      onClick={handleOutsideClick}
    >
      <div className="w-[70%] space-y-4">
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
            <div className="font-bold text-[19px]">25,340</div>
          </div>
          <div className="bg-white rounded-md p-3 w-[23%] shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-slate-500">Average Duration</p>
              <div className="p-2 bg-rose-50 rounded-full">
                <FaClock size={20} className="text-red-500" />
              </div>
            </div>
            <div className="font-bold text-[19px]">25,340</div>
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
          <div className="bg-white min-h-[340px] max-h-[340px] p-4 rounded-md shadow-sm">
            <table className="w-full table-auto border-collapse">
              <thead>
                <tr className="text-left text-slate-500 text-sm border-b border-slate-200">
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
                      <td className="flex items-center justify-between py-2">
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
        <div className="flex items-center top-[25%] justify-center w-[28%] fixed right-[-40px]">
          <div className="flex items-center justify-center">
            <div className="bg-white p-10 py-6 rounded-[20px] shadow-sm w-full">
              <div className="flex items-center space-x-1 justify-between mb-6">
                <h2 className="text-lg font-bold text-gray-800">
                  Upcoming Releases
                </h2>
              </div>
              <div className="space-y-4">
                {upcomingMovies.map((movie) => (
                  <div key={movie.MovieId} className="relative pl-6">
                    <div className="absolute left-0 top-0 w-2 h-2 bg-indigo-600 rounded-full"></div>

                    <div className="bg-gray-100 p-2 rounded-lg">
                      <div className="text-sm text-gray-600">
                        {formatDateRange(movie.FromDate, movie.ToDate)}
                      </div>
                      <div className="text-md font-medium text-gray-800">
                        {movie.NameOfEnglish}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        {showAddForm && (
          <div className="fixed inset-0 bg-black/30 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-[600px] max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">
                    Add New Movie
                  </h2>
                  <p className="text-gray-500 text-sm mt-1">
                    Fill in the details below to add a movie entry.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Movie name (VN) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Enter movie name in Vietnamese"
                      value={nameOfVietnamese}
                      onChange={(e) =>
                        handleInputChange("NameOfVietnamese", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Movie name (ENG) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Enter movie name in English"
                      value={nameOfEnglish}
                      onChange={(e) =>
                        handleInputChange("NameOfEnglish", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      From date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={fromDate || ""}
                      onChange={(e) =>
                        handleInputChange("FromDate", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      To date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={toDate || ""}
                      onChange={(e) =>
                        handleInputChange("ToDate", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Actors <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Enter main actors"
                      value={actors || ""}
                      onChange={(e) =>
                        handleInputChange("Actors", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Production Company <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Enter production company"
                      value={productionCompany || ""}
                      onChange={(e) =>
                        handleInputChange("ProductionCompany", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Director <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Enter director"
                      value={director || ""}
                      onChange={(e) =>
                        handleInputChange("Director", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Duration (minutes) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      placeholder="e.g. 120"
                      value={runningTime || ""}
                      onChange={(e) =>
                        handleInputChange("RunningTime", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Version <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={version || "2D"}
                      onChange={(e) =>
                        handleInputChange("Version", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="2D">2D</option>
                      <option value="3D">3D</option>
                      <option value="IMAX">IMAX</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Genres <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Enter genres (e.g., Action, Comedy)"
                      value={genres || ""}
                      onChange={(e) =>
                        handleInputChange("Genres", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Content <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      placeholder="Enter movie synopsis or description"
                      value={contentSynopsis || ""}
                      onChange={(e) =>
                        handleInputChange("ContentSynopsis", e.target.value)
                      }
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    />
                  </div>
                  <div className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center">
                    <FaUpload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                    <input
                      type="file"
                      accept="image/png, image/jpeg"
                      onChange={(e) => handleFileChange("PosterImage", e)}
                      className="hidden"
                      id="posterUpload"
                    />
                    <label
                      htmlFor="posterUpload"
                      className="text-blue-600 hover:text-blue-800 font-medium cursor-pointer"
                    >
                      Upload image
                    </label>
                    <p className="text-xs text-gray-500 mt-1">
                      {posterFileName || "PNG, JPG up to 10MB"}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1">
                  <div className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center">
                    <FaUpload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                    <input
                      type="file"
                      accept="video/*"
                      onChange={(e) => handleFileChange("TrailerUrl", e)}
                      className="hidden"
                      id="trailerUpload"
                    />
                    <label
                      htmlFor="trailerUpload"
                      className="text-blue-600 hover:text-blue-800 font-medium cursor-pointer"
                    >
                      Upload trailer
                    </label>
                    <p className="text-xs text-gray-500 mt-1">
                      {trailerFileName || "Video files up to 50MB"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6 pt-4 border-t">
                <button
                  onClick={handleCloseMovieForm}
                  className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md font-medium"
                >
                  Back
                </button>
                <button
                  onClick={handleCreateMovie}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
        {showEditForm && (
          <div className="fixed inset-0 bg-black/30 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-[600px] max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">
                    Edit Movie
                  </h2>
                  <p className="text-gray-500 text-sm mt-1">
                    Update the details below to edit the movie entry.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Movie name (VN) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Enter movie name in Vietnamese"
                      value={nameOfVietnamese}
                      onChange={(e) =>
                        handleInputChange("NameOfVietnamese", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Movie name (ENG) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Enter movie name in English"
                      value={nameOfEnglish}
                      onChange={(e) =>
                        handleInputChange("NameOfEnglish", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      From date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={fromDate || ""}
                      onChange={(e) =>
                        handleInputChange("FromDate", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      To date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={toDate || ""}
                      onChange={(e) =>
                        handleInputChange("ToDate", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Actors <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Enter main actors"
                      value={actors || ""}
                      onChange={(e) =>
                        handleInputChange("Actors", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Production Company <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Enter production company"
                      value={productionCompany || ""}
                      onChange={(e) =>
                        handleInputChange("ProductionCompany", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Director <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Enter director"
                      value={director || ""}
                      onChange={(e) =>
                        handleInputChange("Director", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Duration (minutes) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      placeholder="e.g. 120"
                      value={runningTime || ""}
                      onChange={(e) =>
                        handleInputChange("RunningTime", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Version <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={version || "2D"}
                      onChange={(e) =>
                        handleInputChange("Version", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="2D">2D</option>
                      <option value="3D">3D</option>
                      <option value="IMAX">IMAX</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Genres <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Enter genres (e.g., Action, Comedy)"
                      value={genres || ""}
                      onChange={(e) =>
                        handleInputChange("Genres", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Content <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      placeholder="Enter movie synopsis or description"
                      value={contentSynopsis || ""}
                      onChange={(e) =>
                        handleInputChange("ContentSynopsis", e.target.value)
                      }
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Poster Image <span className="text-red-500">*</span>
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center">
                      <FaUpload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                      <input
                        type="file"
                        accept="image/png, image/jpeg"
                        onChange={(e) => handleFileChange("PosterImage", e)}
                        className="hidden"
                        id="posterUpload"
                      />
                      <label
                        htmlFor="posterUpload"
                        className="text-blue-600 hover:text-blue-800 font-medium cursor-pointer"
                      >
                        Upload image
                      </label>
                      <p className="text-xs text-gray-500 mt-1">
                        PNG, JPG up to 10MB
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Trailer URL <span className="text-red-500">*</span>
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center">
                      <FaUpload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                      <input
                        type="file"
                        accept="video/*"
                        onChange={(e) => handleFileChange("TrailerUrl", e)}
                        className="hidden"
                        id="trailerUpload"
                      />
                      <label
                        htmlFor="trailerUpload"
                        className="text-blue-600 hover:text-blue-800 font-medium cursor-pointer"
                      >
                        Upload trailer
                      </label>
                      <p className="text-xs text-gray-500 mt-1">
                        Video files up to 50MB
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6 pt-4 border-t">
                <button
                  onClick={handleCloseMovieForm}
                  className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md font-medium"
                >
                  Back
                </button>
                <button
                  onClick={handleEditMovie}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium"
                >
                  Save
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
    </div>
  );
};

export default MovieManagement;
