import React, { useEffect, useRef, useState } from "react";
import {
  createMovie,
  getMovies,
  editMovie,
  deleteMovie,
  searchMovies,
  getUpcomingMovies,
  createShowtime,
  getCinemaRooms,
} from "../../../services/API";
import { BiSolidCameraMovie } from "react-icons/bi";
import debounce from "lodash/debounce";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import HeaderStats from "../movieComponent/HeaderStats";
import SearchAndAdd from "../movieComponent/SearchAndAdd";
import MovieTable from "../movieComponent/MovieTable";
import Pagination from "../movieComponent/Pagination";
import MovieForm from "../movieComponent/MovieForm";
import DeletePopup from "../movieComponent/DeletePopup";
import MovieTooltip from "../movieComponent/MovieTooltip";
import { IoEyeOutline } from "react-icons/io5";
import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBin5Line } from "react-icons/ri";
import CustomDatePicker from "../../../component/CustomDatePicker";
import CustomTimePicker from "../../../component/CustomTimePicker ";
import { MdOutlineMeetingRoom } from "react-icons/md";

const MovieManagement = () => {
  const [movies, setMovies] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [selectedTooltipMovie, setSelectedTooltipMovie] = useState(null);
  const [showAddShowtimePopup, setShowAddShowtimePopup] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [totalMovies, setTotalMovies] = useState(0);
  const [searchMovie, setSearchMovie] = useState("");
  const itemsPerPage = 7;
  const [totalPages, setTotalPages] = useState(0);
  const [sortBy, setSortBy] = useState("NameOfEnglish");
  const [sortOrder, setSortOrder] = useState("asc");
  const [nameOfVietnamese, setNameOfVietnamese] = useState("");
  const [nameOfEnglish, setNameOfEnglish] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [actors, setActors] = useState("");
  const [productionCompany, setProductionCompany] = useState("");
  const [director, setDirector] = useState("");
  const [runningTime, setRunningTime] = useState("");
  const [genres, setGenres] = useState("");
  const [contentSynopsis, setContentSynopsis] = useState("");
  const [posterImage, setPosterImage] = useState(null);
  const [trailerUrl, setTrailerUrl] = useState(null);
  const [posterFileName, setPosterFileName] = useState("");
  const [trailerFileName, setTrailerFileName] = useState("");
  const [upcomingMovies, setUpcomingMovies] = useState([]);
  const [posterPreview, setPosterPreview] = useState(null);
  const [trailerPreview, setTrailerPreview] = useState(null);
  const [versions, setVersions] = useState([{ VersionType: "", Language: "" }]);
  const [iframeUrl, setIframeUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const posterUploadRef = useRef(null);
  const trailerUploadRef = useRef(null);
  const [cinemaRooms, setCinemaRooms] = useState([]);
  const [selectedRoomId, setSelectedRoomId] = useState("");
  const [showtimeDate, setShowtimeDate] = useState("");
  const [showtimeTimes, setShowtimeTimes] = useState([""]);

  const getMovieData = async () => {
    try {
      const response = await getMovies({
        page: currentPage,
        limit: itemsPerPage,
        sortBy,
        sortOrder,
      });
      if (response.data) {
        setMovies(response.data);
        if (response.pagination) {
          setTotalPages(response.pagination.totalPages);
          setTotalMovies(response.pagination.total);
        }
      }
    } catch (error) {
      console.error("Error fetching movies:", error);
    }
  };

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
    setCurrentPage(1);
  };

  const getUpcomingMovie = async () => {
    try {
      const response = await getUpcomingMovies({
        limit: itemsPerPage,
        page: currentPage,
      });
      if (response.data) {
        setUpcomingMovies(response.data);
      }
    } catch (error) {
      console.error("Error fetching upcoming movies:", error);
    }
  };

  const fetchCinemaRooms = async () => {
    try {
      const response = await getCinemaRooms();
      if (response.data) {
        setCinemaRooms(response.data);
      }
    } catch (error) {
      console.error("Error fetching cinema rooms:", error);
    }
  };

  useEffect(() => {
    getMovieData();
    getUpcomingMovie();
    fetchCinemaRooms();
  }, [currentPage, sortBy, sortOrder]);

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
        const normalizedMovies = response.data.data;
        setMovies(normalizedMovies);
        setTotalPages(response.data.totalPages);
      }
    } catch (error) {
      console.error("Error searching movies:", error);
      setMovies([]);
      setTotalPages(0);
    }
  };
  const debouncedSearchMovieData = debounce(searchMovieData, 500);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
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
        if (value === "" || (!isNaN(numValue) && numValue > 0))
          setRunningTime(value);
        break;
      }
      case "Genres":
        setGenres(value);
        break;
      case "ContentSynopsis":
        setContentSynopsis(value);
        break;
      case "IframeUrl":
        setIframeUrl(value);
        break;
      default:
        break;
    }
  };

  const handleVersionChange = (idx, field, value) => {
    setVersions((prev) =>
      prev.map((v, i) => (i === idx ? { ...v, [field]: value } : v))
    );
  };

  const addVersion = () =>
    setVersions((prev) => [...prev, { VersionType: "", Language: "" }]);
  const removeVersion = (idx) =>
    setVersions((prev) => prev.filter((_, i) => i !== idx));

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
      { value: genres, name: "Genres" },
      { value: contentSynopsis, name: "Content" },
      { value: posterImage || posterFileName, name: "Poster Image" },
      { value: trailerUrl || trailerFileName, name: "Trailer URL" },
      { value: iframeUrl, name: "Trailer Iframe URL" },
    ];
    for (const field of requiredFields) {
      if (
        !field.value &&
        (typeof field.value !== "string" || !field.value.trim())
      ) {
        toast.error(`${field.name} is required`);
        return false;
      }
    }
    if (!Array.isArray(versions) || versions.length === 0) {
      toast.error("At least one version is required");
      return false;
    }
    for (const v of versions) {
      if (!v.VersionType?.trim() || !v.Language?.trim()) {
        toast.error("Each version must have both VersionType and Language");
        return false;
      }
    }
    const vietnameseRegex = /^[A-Za-z0-9À-ỹ\s,.:-]+$/;
    if (!vietnameseRegex.test(nameOfVietnamese.trim())) {
      toast.error(
        "Vietnamese movie name must contain valid characters (letters, numbers, Vietnamese accents, spaces, commas, periods, hyphens, colons)"
      );
      return false;
    }
    if (!/[À-ỹ]/.test(nameOfVietnamese.trim())) {
      toast.error(
        "Vietnamese movie name must contain at least one accented character"
      );
      return false;
    }
    const englishRegex = /^[A-Za-z0-9\s,.:-]+$/;
    if (!englishRegex.test(nameOfEnglish.trim())) {
      toast.error(
        "English movie name must contain only letters, numbers, spaces, commas, periods, hyphens, colons"
      );
      return false;
    }
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(fromDate)) {
      toast.error("From date must be in yyyy-mm-dd format");
      return false;
    }
    if (!dateRegex.test(toDate)) {
      toast.error("To date must be in yyyy-mm-dd format");
      return false;
    }
    const runningTimeNum = parseInt(runningTime, 10);
    if (isNaN(runningTimeNum) || runningTimeNum <= 0) {
      toast.error("Duration must be a positive integer");
      return false;
    }
    const fromDateObj = new Date(fromDate);
    const toDateObj = new Date(toDate);
    if (fromDateObj >= toDateObj) {
      toast.error("To date must be after from date (same day not allowed)");
      return false;
    }
    if (fromDateObj < new Date("2025-06-19T01:06:00+07:00")) {
      toast.error("From date must not be in the past");
      return false;
    }
    return true;
  };

  const handleCreateMovie = async () => {
    if (!validateForm()) return;
    setLoading(true);
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
      movieData.append("Genres", genres.trim());
      movieData.append("ContentSynopsis", contentSynopsis.trim());
      movieData.append("IframeUrl", iframeUrl.trim());
      movieData.append("versions", JSON.stringify(versions));
      if (posterImage) movieData.append("poster", posterImage);
      if (trailerUrl) movieData.append("trailer", trailerUrl);
      const newMovie = await createMovie(movieData);
      setMovies((prev) => [...prev, newMovie]);
      getMovieData();
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
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (movie) => {
    setSelectedMovie(movie);
    setNameOfVietnamese(movie.NameOfVietnamese || "");
    setNameOfEnglish(movie.NameOfEnglish || "");
    setFromDate(movie.FromDate ? movie.FromDate.split("T")[0] : "");
    setToDate(movie.ToDate ? movie.ToDate.split("T")[0] : "");
    setActors(movie.Actors || "");
    setProductionCompany(movie.ProductionCompany || "");
    setDirector(movie.Director || "");
    setRunningTime(movie.RunningTime ? movie.RunningTime.toString() : "");
    setGenres(movie.Genres || "");
    setContentSynopsis(movie.ContentSynopsis || "");
    setIframeUrl(movie.IframeUrl || "");
    let loadedVersions = [{ VersionType: "", Language: "" }];
    if (Array.isArray(movie.versions) && movie.versions.length > 0) {
      loadedVersions = movie.versions.map((v) => ({
        VersionType: v.VersionType || "",
        Language: v.Language || "",
      }));
    } else if (typeof movie.Version === "string" && movie.Version) {
      try {
        const parsed = JSON.parse(movie.Version);
        if (Array.isArray(parsed) && parsed.length > 0) loadedVersions = parsed;
      } catch (e) {
        console.error("Error parsing movie.Version:", e);
      }
    }
    setVersions(loadedVersions);
    setPosterFileName(movie.PosterImage || "");
    setTrailerFileName(movie.TrailerUrl || "");
    setPosterImage(null);
    setTrailerUrl(null);
    setPosterPreview(
      movie.PosterImage && movie.PosterImage.startsWith("http")
        ? movie.PosterImage
        : null
    );
    setTrailerPreview(
      movie.TrailerUrl && movie.TrailerUrl.startsWith("http")
        ? movie.TrailerUrl
        : null
    );
    setShowEditForm(true);
  };

  const handleEditMovie = async () => {
    if (!validateForm()) return;
    setLoading(true);
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
      movieData.append("Genres", genres.trim());
      movieData.append("ContentSynopsis", contentSynopsis.trim());
      movieData.append("IframeUrl", iframeUrl.trim());
      movieData.append("versions", JSON.stringify(versions));
      if (posterImage) movieData.append("poster", posterImage);
      else if (posterFileName && !posterImage)
        movieData.append("poster", posterFileName);
      if (trailerUrl) movieData.append("trailer", trailerUrl);
      else if (trailerFileName && !trailerUrl)
        movieData.append("trailer", trailerFileName);
      const updatedMovie = await editMovie(movieData);
      setMovies((prev) =>
        prev.map((mov) =>
          mov.MovieId === updatedMovie.MovieId ? updatedMovie : mov
        )
      );
      getMovieData();
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
    } finally {
      setLoading(false);
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
    setGenres("");
    setContentSynopsis("");
    setPosterImage(null);
    setTrailerUrl(null);
    setPosterFileName("");
    setTrailerFileName("");
    setPosterPreview(null);
    setTrailerPreview(null);
    setVersions([{ VersionType: "", Language: "" }]);
    setIframeUrl("");
    setSelectedRoomId("");
    setShowtimeDate("");
    setShowtimeTimes([""]);
  };

  const handleDelete = (movie) => {
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
      getMovieData();
      setShowDeletePopup(false);
      setSelectedMovie(null);
      toast.success("Movie deleted successfully!");
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  const handleRowClick = (movie, event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setTooltipPosition({ x: rect.right + 10, y: rect.top + window.scrollY });
    setSelectedTooltipMovie(movie);
  };

  const handleOutsideClick = (e) => {
    if (!e.target.closest("tr") && !e.target.closest(".tooltip")) {
      setSelectedTooltipMovie(null);
    }
    if (!e.target.closest(".add-showtime-popup")) {
      setShowAddShowtimePopup(false);
    }
  };

  const handleCloseMovieForm = () => {
    setShowAddForm(false);
    setShowEditForm(false);
    resetForm();
    setSelectedMovie(null);
  };

  const formatDate = (dateString) =>
    dateString ? dateString.split("T")[0] : "";

  const openAddShowtimePopup = (movie) => {
    setSelectedMovie(movie);
    setShowAddShowtimePopup(true);
    setSelectedRoomId("");
    setShowtimeDate("");
    setShowtimeTimes([""]);
  };

  const closeAddShowtimePopup = () => {
    setShowAddShowtimePopup(false);
    setSelectedMovie(null);
    setSelectedRoomId("");
    setShowtimeDate("");
    setShowtimeTimes([""]);
  };

  const handleAddShowtime = async () => {
    if (!selectedMovie) {
      toast.error("No movie selected");
      return;
    }
    if (!showtimeDate) {
      toast.error("Showtime date is required");
      return;
    }
    if (showtimeTimes.length === 0 || showtimeTimes.every((time) => !time)) {
      toast.error("At least one start time is required");
      return;
    }
    if (!selectedRoomId) {
      toast.error("Cinema room selection is required");
      return;
    }
    const selectedDate = new Date(showtimeDate);
    const currentDate = new Date();
    const minAllowedDate = new Date(currentDate);
    minAllowedDate.setDate(currentDate.getDate() + 7);
    if (selectedDate < minAllowedDate) {
      toast.error("Showtime date must be at least 7 days from today");
      return;
    }
    const times = showtimeTimes.filter((time) => time);
    if (times.length === 0) {
      toast.error("At least one valid start time is required");
      return;
    }
    const validateTimeFormat = (timeStr) => {
      const timeRegex = /^([01]?[0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])$/;
      return timeRegex.test(timeStr);
    };
    const invalidTimes = times.filter((time) => !validateTimeFormat(time));
    if (invalidTimes.length > 0) {
      toast.error(
        `Invalid time format. Use hh:mm:ss. Invalid times: ${invalidTimes.join(
          ", "
        )}`
      );
      return;
    }
    const duration = parseInt(selectedMovie.RunningTime, 10) + 20;

    const versionId =
      selectedMovie.versions &&
      Array.isArray(selectedMovie.versions) &&
      selectedMovie.versions.length > 0
        ? selectedMovie.versions[0].VersionId
        : null;
    if (!versionId) {
      toast.error(
        `No valid VersionId found for this movie. Versions: ${
          selectedMovie.versions
            ? JSON.stringify(selectedMovie.versions)
            : "undefined or null"
        }`
      );
      return;
    }

    const showtimeData = {
      VersionId: versionId,
      CinemaRoomId: selectedRoomId,
      Day: showtimeDate,
      Times: times,
      Duration: duration,
    };
    setLoading(true);
    try {
      // eslint-disable-next-line no-unused-vars
      const response = await createShowtime(showtimeData);
      toast.success("Showtime added successfully!");
      getMovieData();
    } catch (error) {
      toast.error(`Failed to add showtime: ${error.message || "Server error"}`);
    } finally {
      setLoading(false);
      closeAddShowtimePopup();
    }
  };

  return (
    <div className="h-full">
      <div
        className="flex flex-col lg:flex-row items-center justify-between gap-6"
        onClick={handleOutsideClick}
      >
        <div className="w-[90%] md:w-[95%] lg:w-[95%] max-w-7xl space-y-4">
          <HeaderStats
            totalMovies={totalMovies}
            upcomingMovies={upcomingMovies}
            movies={movies}
          />
          <SearchAndAdd
            searchMovie={searchMovie}
            setSearchMovie={setSearchMovie}
            setShowAddForm={setShowAddForm}
            showEditForm={showEditForm}
          />
          <div className="bg-white rounded-md shadow-sm">
            <div className="hidden sm:block">
              <MovieTable
                movies={movies}
                handleSort={handleSort}
                sortBy={sortBy}
                sortOrder={sortOrder}
                handleEdit={handleEdit}
                handleDelete={handleDelete}
                handleRowClick={handleRowClick}
                formatDate={formatDate}
                openAddShowtimePopup={openAddShowtimePopup}
              />
            </div>
            <div className="block sm:hidden space-y-4">
              {movies.map((movie) => {
                const now = new Date();
                const start = new Date(movie.FromDate);
                const end = new Date(movie.ToDate);
                const status =
                  end < now ? "Expired" : start <= now ? "Active" : "Upcoming";
                const statusClass =
                  status === "Expired"
                    ? "bg-rose-200 text-red-700"
                    : status === "Active"
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700";

                return (
                  <article
                    key={movie.MovieId}
                    className="bg-white p-4 rounded-lg shadow-sm border border-slate-200"
                    onClick={(e) => handleRowClick(movie, e)}
                  >
                    <div className="flex items-center gap-4">
                      {movie.PosterImage ? (
                        <img
                          src={movie.PosterImage}
                          alt={movie.NameOfEnglish}
                          className="w-20 h-20 object-cover rounded"
                        />
                      ) : (
                        <span className="text-gray-400 italic">No image</span>
                      )}
                      <div className="flex-1">
                        <h3 className="text-sm font-semibold text-gray-900 truncate">
                          {movie.NameOfEnglish}
                        </h3>
                        <p className="text-xs text-gray-500 truncate">
                          {movie.NameOfVietnamese}
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 text-xs grid grid-cols-2 space-x-2 space-y-4 text-gray-700">
                      <p>
                        <strong>Duration:</strong> {movie.RunningTime} mins
                      </p>
                      <p>
                        <strong>Start:</strong> {formatDate(movie.FromDate)}
                      </p>
                      <p>
                        <strong>End:</strong> {formatDate(movie.ToDate)}
                      </p>
                      <p>
                        <strong>Status:</strong>{" "}
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${statusClass}`}
                        >
                          {status}
                        </span>
                      </p>
                      <p className="col-span-2">
                        <strong>Version:</strong>{" "}
                        {Array.isArray(movie.versions) &&
                        movie.versions.length > 0
                          ? movie.versions.map((v, idx) => (
                              <span key={idx}>
                                {v.VersionType}
                                {v.Language ? ` - ${v.Language}` : ""}
                                {idx < movie.versions.length - 1 ? ", " : ""}
                              </span>
                            ))
                          : "N/A"}
                      </p>
                    </div>
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRowClick(movie, e);
                        }}
                        className="text-blue-500 hover:text-blue-700"
                        aria-label="View movie"
                      >
                        <IoEyeOutline size={16} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(movie);
                        }}
                        className="text-blue-500 hover:text-blue-700"
                        aria-label="Edit movie"
                      >
                        <FaRegEdit size={16} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(movie);
                        }}
                        className="text-red-400 hover:text-red-600"
                        aria-label="Delete movie"
                      >
                        <RiDeleteBin5Line size={16} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openAddShowtimePopup(movie);
                        }}
                        className="text-green-500 hover:text-green-700"
                        aria-label="Add showtime"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 4v16m8-8H4"
                          />
                        </svg>
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            handlePageChange={handlePageChange}
          />
        </div>
        {(showAddForm || showEditForm) && (
          <MovieForm
            showEditForm={showEditForm}
            handleCloseMovieForm={handleCloseMovieForm}
            nameOfVietnamese={nameOfVietnamese}
            nameOfEnglish={nameOfEnglish}
            fromDate={fromDate}
            toDate={toDate}
            actors={actors}
            productionCompany={productionCompany}
            director={director}
            runningTime={runningTime}
            genres={genres}
            contentSynopsis={contentSynopsis}
            posterPreview={posterPreview}
            trailerPreview={trailerPreview}
            versions={versions}
            iframeUrl={iframeUrl}
            posterUploadRef={posterUploadRef}
            trailerUploadRef={trailerUploadRef}
            handleInputChange={handleInputChange}
            handleVersionChange={handleVersionChange}
            addVersion={addVersion}
            removeVersion={removeVersion}
            handleFileChange={handleFileChange}
            handleCreateMovie={handleCreateMovie}
            handleEditMovie={handleEditMovie}
            setPosterFileName={setPosterFileName}
            setPosterPreview={setPosterPreview}
            setTrailerFileName={setTrailerFileName}
            setTrailerPreview={setTrailerPreview}
            loading={loading}
          />
        )}
        {showDeletePopup && (
          <DeletePopup
            confirmDelete={confirmDelete}
            setShowDeletePopup={setShowDeletePopup}
            selectedMovie={selectedMovie}
          />
        )}
        {selectedTooltipMovie && (
          <MovieTooltip
            movie={selectedTooltipMovie}
            onClose={() => setSelectedTooltipMovie(null)}
          />
        )}
        {showAddShowtimePopup && selectedMovie && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center z-50 p-4 add-showtime-popup">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[95vh] overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 px-8 py-6 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
                <div className="relative flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold mb-1">
                      Add New Showtime
                    </h2>
                    <p className="text-purple-100 text-sm">
                      Schedule a new movie session
                    </p>
                  </div>
                  <button
                    onClick={closeAddShowtimePopup}
                    className="p-3 hover:bg-white/20 rounded-full transition-all duration-200 hover:scale-105 hover:rotate-90"
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

              {/* Content */}
              <div className="p-8 overflow-y-auto max-h-[calc(95vh-200px)]">
                {/* Movie Info Card */}
                <div className="bg-gradient-to-r from-slate-50 to-gray-50 rounded-xl p-6 mb-8 border border-gray-200">
                  <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                    <BiSolidCameraMovie size={20} className="mr-2" />
                    Movie Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                    <div className="space-y-3">
                      <div className="flex items-start md:items-center gap-2">
                        <span className="text-sm font-semibold text-gray-600">
                          English:
                        </span>
                        <span className="text-gray-800 font-semibold">
                          {selectedMovie.NameOfEnglish}
                        </span>
                      </div>
                      <div className="flex items-start md:items-center gap-2">
                        <span className="text-sm font-semibold text-gray-600">
                          Vietnamese:
                        </span>
                        <span className="text-gray-800 font-semibold">
                          {selectedMovie.NameOfVietnamese}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-start">
                      <div className="bg-purple-100 text-purple-800 px-4 py-2 rounded-full text-sm font-semibold">
                        <svg
                          className="w-4 h-4 inline mr-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        {selectedMovie.RunningTime} mins
                      </div>
                    </div>
                  </div>
                </div>

                {/* Form Fields */}
                <div className="space-y-8">
                  {/* Date Selection */}
                  <CustomDatePicker
                    value={showtimeDate}
                    onChange={setShowtimeDate}
                    minDate={
                      new Date(new Date().setDate(new Date().getDate() + 7))
                        .toISOString()
                        .split("T")[0]
                    }
                  />

                  {/* Time Slots */}
                  <CustomTimePicker
                    times={showtimeTimes}
                    setTimes={setShowtimeTimes}
                  />

                  {/* Duration Display */}
                  <div className="group">
                    <label className="block text-lg font-semibold text-gray-800 mb-3 flex items-center">
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
                          d="M13 10V3L4 14h7v7l9-11h-7z"
                        />
                      </svg>
                      Total Duration (Including Ads)
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={`${
                          parseInt(selectedMovie.RunningTime, 10) + 20
                        } minutes`}
                        readOnly
                        className="w-full px-6 py-4 border-2 border-gray-200 rounded-xl bg-gradient-to-r from-gray-50 to-slate-50 text-gray-700 font-semibold text-lg cursor-not-allowed"
                      />
                      <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Cinema Room Selection */}
                  <div className="group">
                    <label className="block text-lg font-semibold text-gray-800 mb-3 flex items-center">
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
                          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                        />
                      </svg>
                      Select Cinema Room
                    </label>
                    <div className="space-y-3">
                      {cinemaRooms.map((room) => (
                        <div
                          key={room.CinemaRoomId}
                          className={`p-4 border-2 rounded-xl transition-all duration-200 cursor-pointer group/room ${
                            selectedRoomId === room.CinemaRoomId
                              ? "border-purple-500 bg-purple-50/50"
                              : "border-gray-200 hover:border-purple-300 hover:bg-purple-50/30"
                          }`}
                          onClick={() => setSelectedRoomId(room.CinemaRoomId)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div
                                className={`w-12 h-12 rounded-lg flex items-center justify-center transition-all duration-200 ${
                                  selectedRoomId === room.CinemaRoomId
                                    ? "bg-purple-200"
                                    : "bg-gradient-to-r from-purple-100 to-purple-200 group-hover/room:from-purple-200 group-hover/room:to-purple-300"
                                }`}
                              >
                                <svg
                                  className="w-6 h-6 text-purple-600"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 0h10l1 8H6l1-8z"
                                  />
                                </svg>
                              </div>
                              <div>
                                <h4 className="font-semibold text-gray-800 text-lg">
                                  {room.Name}
                                </h4>
                                <p className="text-gray-600 text-sm">
                                  Room ID: {room.CinemaRoomId}
                                </p>
                              </div>
                            </div>
                            <div
                              className={`w-6 h-6 rounded-full border-2 transition-all duration-200 flex items-center justify-center ${
                                selectedRoomId === room.CinemaRoomId
                                  ? "border-purple-500 bg-purple-500"
                                  : "border-gray-300 group-hover/room:border-purple-500"
                              }`}
                            >
                              <div
                                className={`w-3 h-3 rounded-full transition-all duration-200 ${
                                  selectedRoomId === room.CinemaRoomId
                                    ? "bg-white"
                                    : "bg-purple-500 opacity-0 group-hover/room:opacity-100"
                                }`}
                              ></div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    {cinemaRooms.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        <svg
                          className="w-12 h-12 mx-auto mb-4 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                          />
                        </svg>
                        <p className="font-semibold">
                          No cinema rooms available
                        </p>
                        <p className="text-sm">Please add cinema rooms first</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="bg-gradient-to-r from-gray-50 to-slate-50 px-8 py-6 border-t border-gray-200 flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4">
                <button
                  onClick={closeAddShowtimePopup}
                  className="px-8 py-3 text-gray-700 bg-white border-2 border-gray-300 hover:bg-gray-50 hover:border-gray-400 rounded-xl font-semibold transition-all duration-200 hover:shadow-md"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddShowtime}
                  className="px-8 py-3 bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:from-purple-600 hover:via-purple-700 hover:to-purple-800 text-white rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  <svg
                    className="w-5 h-5 inline mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                  Add Showtime
                </button>
              </div>
            </div>
          </div>
        )}
        {loading && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999]">
            <div className="bg-white rounded-lg p-4 sm:p-6 flex flex-col items-center shadow-xl">
              <svg
                className="animate-spin h-6 sm:h-8 w-6 sm:w-8 text-indigo-600 mb-3 sm:mb-4"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8z"
                />
              </svg>
              <div className="font-semibold text-base sm:text-lg text-indigo-700">
                Đang xử lý, vui lòng chờ...
              </div>
            </div>
          </div>
        )}
        <ToastContainer position="top-right" autoClose={2000} />
      </div>
    </div>
  );
};

export default MovieManagement;
