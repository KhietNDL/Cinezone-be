import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  createMovie,
  getMovies,
  editMovie,
  deleteMovie,
  searchMovies,
  getUpcomingMovies,
  getCinemaRooms,
} from "../../../services/API";
import { BiSolidCameraMovie } from "react-icons/bi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import StatsCards from "../movieComponent/StatsCards";
import MovieTable from "../movieComponent/MovieTable";
import Pagination from "../movieComponent/Pagination";
import MovieForm from "../movieComponent/MovieForm";
import DeletePopup from "../movieComponent/DeletePopup";
import MovieTooltip from "../movieComponent/MovieTooltip";
import AddShowtimePopup from "../movieComponent/AddShowtimePopup";
import { IoEyeOutline } from "react-icons/io5";
import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBin5Line } from "react-icons/ri";

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
  // eslint-disable-next-line no-unused-vars
  const [totalMovies, setTotalMovies] = useState(0);
  const [searchMovie, setSearchMovie] = useState("");
  const itemsPerPage = 7;
  const [totalPages, setTotalPages] = useState(0);
  const [sortBy, setSortBy] = useState("NameOfEnglish");
  const [sortOrder, setSortOrder] = useState("asc");

  // Filter and stats states
  const [activeFilter, setActiveFilter] = useState(null);
  const [movieStats, setMovieStats] = useState({
    total: 0,
    active: 0,
    upcoming: 0,
    expired: 0,
  });

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
  const [posterImageHorizontal, setPosterImageHorizontal] = useState(null);
  const [trailerUrl, setTrailerUrl] = useState(null);
  const [posterFileName, setPosterFileName] = useState("");
  const [posterHorizontalFileName, setPosterHorizontalFileName] = useState("");
  const [trailerFileName, setTrailerFileName] = useState("");
  // eslint-disable-next-line no-unused-vars
  const [upcomingMovies, setUpcomingMovies] = useState([]);
  const [posterPreview, setPosterPreview] = useState(null);
  const [posterHorizontalPreview, setPosterHorizontalPreview] = useState(null);
  const [trailerPreview, setTrailerPreview] = useState(null);
  const [versions, setVersions] = useState([{ VersionType: "", Language: "" }]);
  const [iframeUrl, setIframeUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const posterUploadRef = useRef(null);
  const posterHorizontalUploadRef = useRef(null);
  const trailerUploadRef = useRef(null);
  const [cinemaRooms, setCinemaRooms] = useState([]);
  const [selectedRoomId, setSelectedRoomId] = useState("");
  const [showtimeDate, setShowtimeDate] = useState("");
  const [showtimeTimes, setShowtimeTimes] = useState([""]);
  // eslint-disable-next-line no-unused-vars
  const [allMoviesForStats, setAllMoviesForStats] = useState([]);

  const getMovieData = useCallback(async () => {
    try {
      const response = await getMovies({
        page: currentPage,
        limit: itemsPerPage,
        sortBy,
        sortOrder,
      });
      if (response.data) {
        const moviesArray = Array.isArray(response.data) ? response.data : [];
        setMovies(moviesArray);

        if (response.pagination) {
          setTotalPages(response.pagination.totalPages);
        }
      } else {
        setMovies([]);
      }
    } catch (error) {
      console.error("Error fetching movies:", error);
      setMovies([]);
    }
  }, [currentPage, itemsPerPage, sortBy, sortOrder]);

  // Fetch all movies for statistics calculation
  const getAllMoviesForStats = useCallback(async () => {
    try {
      const response = await getMovies({
        page: 1,
        limit: 10000, // Large number to get all movies
        sortBy: "MovieId",
        sortOrder: "asc",
      });

      if (response.data) {
        const allMoviesArray = Array.isArray(response.data)
          ? response.data
          : [];
        setAllMoviesForStats(allMoviesArray);
        calculateMovieStats(allMoviesArray);
      }
    } catch (error) {
      console.error("Error fetching all movies for stats:", error);
      // Fallback: just set empty stats if fetch fails
      setMovieStats({
        total: 0,
        active: 0,
        upcoming: 0,
        expired: 0,
      });
    }
  }, []); // Không có dependencies để tránh re-render

  // Calculate movie statistics from all movies
  const calculateMovieStats = (allMoviesData) => {
    const now = new Date();

    const stats = allMoviesData.reduce(
      (acc, movie) => {
        const fromDate = new Date(movie.FromDate);
        const toDate = new Date(movie.ToDate);

        // Active: fromDate <= now <= toDate
        if (fromDate <= now && toDate >= now) {
          acc.active++;
        }
        // Upcoming: fromDate > now
        else if (fromDate > now) {
          acc.upcoming++;
        }
        // Expired: toDate < now
        else if (toDate < now) {
          acc.expired++;
        }

        return acc;
      },
      { total: allMoviesData.length, active: 0, upcoming: 0, expired: 0 }
    );

    setMovieStats(stats);
  };

  // Handle filter changes
  const handleFilterChange = (filterType) => {
    setActiveFilter(filterType);
    setCurrentPage(1); // Reset to first page when filter changes
  };

  // Filter movies based on active filter using current page movies
  const getFilteredMovies = () => {
    if (!activeFilter || activeFilter === "total") {
      return movies;
    }

    const now = new Date();

    switch (activeFilter) {
      case "active":
        return movies.filter((movie) => {
          const fromDate = new Date(movie.FromDate);
          const toDate = new Date(movie.ToDate);
          return fromDate <= now && toDate >= now;
        });
      case "upcoming":
        return movies.filter((movie) => {
          const fromDate = new Date(movie.FromDate);
          return fromDate > now;
        });
      case "expired":
        return movies.filter((movie) => {
          const toDate = new Date(movie.ToDate);
          return toDate < now;
        });
      default:
        return movies;
    }
  };

  const filteredMovies = getFilteredMovies();

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
    setCurrentPage(1);
  };

  const getUpcomingMovie = useCallback(async () => {
    try {
      const response = await getUpcomingMovies({
        limit: itemsPerPage,
        page: currentPage,
      });
      if (response.data) {
        setUpcomingMovies(Array.isArray(response.data) ? response.data : []);
      } else {
        setUpcomingMovies([]);
      }
    } catch (error) {
      console.error("Error fetching upcoming movies:", error);
      setUpcomingMovies([]);
    }
  }, [itemsPerPage, currentPage]);

  const fetchCinemaRooms = useCallback(async () => {
    try {
      const response = await getCinemaRooms();
      if (response.data) {
        setCinemaRooms(response.data);
      }
    } catch (error) {
      console.error("Error fetching cinema rooms:", error);
    }
  }, []);

  const searchMovieData = useCallback(
    async (searchTerm) => {
      if (!searchTerm.trim()) {
        getMovieData();
        return;
      }

      try {
        const response = await searchMovies({
          name: searchTerm,
          page: currentPage,
          limit: itemsPerPage,
          sortBy: sortBy,
          sortOrder: sortOrder,
        });

        // Backend search now returns paginated structure
        let moviesData = [];
        let totalPagesData = 1;
        let totalMoviesData = 0;

        if (response.data) {
          moviesData = response.data;
          // Check if backend returned pagination info
          if (response.pagination) {
            totalPagesData = response.pagination.totalPages;
            totalMoviesData = response.pagination.total;
          } else {
            // Fallback to simple calculation
            totalMoviesData = moviesData.length;
            totalPagesData = Math.ceil(totalMoviesData / itemsPerPage);
          }
        }

        setMovies(moviesData);
        setTotalPages(totalPagesData);
        setTotalMovies(totalMoviesData);
      } catch (error) {
        console.error("Error searching movies:", error);
        setMovies([]);
        setTotalPages(0);
        setTotalMovies(0);
      }
    },
    [currentPage, itemsPerPage, getMovieData, sortBy, sortOrder]
  );
  // Load initial data when component mounts - chạy một lần duy nhất
  useEffect(() => {
    getMovieData();
    getAllMoviesForStats();
    getUpcomingMovie();
    fetchCinemaRooms();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array - chỉ chạy một lần khi component mount

  // Effect riêng cho việc reload data khi searchMovie thay đổi
  useEffect(() => {
    if (!searchMovie.trim()) {
      getMovieData();
      getAllMoviesForStats();
    }
  }, [searchMovie, getMovieData, getAllMoviesForStats]);

  // Effect riêng cho searchMovie để reset về trang 1
  useEffect(() => {
    if (searchMovie !== "") {
      setCurrentPage(1); // Reset về trang 1 khi có search term mới
    }
  }, [searchMovie]);

  // useEffect với debounce cho search - chỉ phụ thuộc vào searchMovie
  useEffect(() => {
    const searchTimeout = setTimeout(() => {
      if (searchMovie.trim()) {
        searchMovieData(searchMovie);
      } else {
        getMovieData();
        getAllMoviesForStats(); // Reload stats when clearing search
      }
    }, 300);

    return () => clearTimeout(searchTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchMovie]); // Chỉ phụ thuộc vào searchMovie

  // Effect riêng cho currentPage, sortBy, sortOrder khi có search
  useEffect(() => {
    if (searchMovie.trim()) {
      const timeoutId = setTimeout(() => {
        searchMovieData(searchMovie);
      }, 100); // Debounce ngắn hơn cho pagination
      return () => clearTimeout(timeoutId);
    } else {
      getMovieData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, sortBy, sortOrder]); // Loại bỏ searchMovie khỏi đây để tránh duplicate calls

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
      if (
        (field === "PosterImage" || field === "PosterImageHorizontal") &&
        file.size > 10 * 1024 * 1024
      ) {
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
      } else if (field === "PosterImageHorizontal") {
        setPosterImageHorizontal(file);
        setPosterHorizontalFileName(file.name);
        setPosterHorizontalPreview(URL.createObjectURL(file));
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
      {
        value: posterImageHorizontal || posterHorizontalFileName,
        name: "Horizontal Poster Image",
      },
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
      else if (posterFileName && !posterImage)
        movieData.append("poster", posterFileName);
      if (posterImageHorizontal)
        movieData.append("posterHorizontal", posterImageHorizontal);
      else if (posterHorizontalFileName && !posterImageHorizontal)
        movieData.append("posterHorizontal", posterHorizontalFileName);
      if (trailerUrl) movieData.append("trailer", trailerUrl);
      else if (trailerFileName && !trailerUrl)
        movieData.append("trailer", trailerFileName);

      // Debug log
      console.log("FormData contents:", {
        posterImage: !!posterImage,
        posterFileName,
        posterImageHorizontal: !!posterImageHorizontal,
        posterHorizontalFileName,
        trailerUrl: !!trailerUrl,
        trailerFileName,
      });

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
    setPosterHorizontalFileName(movie.PosterImageHorizontal || "");
    setTrailerFileName(movie.TrailerUrl || "");
    setPosterImage(null);
    setPosterImageHorizontal(null);
    setTrailerUrl(null);
    setPosterPreview(
      movie.PosterImage && movie.PosterImage.startsWith("http")
        ? movie.PosterImage
        : null
    );
    setPosterHorizontalPreview(
      movie.PosterImageHorizontal &&
        movie.PosterImageHorizontal.startsWith("http")
        ? movie.PosterImageHorizontal
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
      if (posterImageHorizontal)
        movieData.append("posterHorizontal", posterImageHorizontal);
      else if (posterHorizontalFileName && !posterImageHorizontal)
        movieData.append("posterHorizontal", posterHorizontalFileName);
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
    setPosterImageHorizontal(null);
    setTrailerUrl(null);
    setPosterFileName("");
    setPosterHorizontalFileName("");
    setTrailerFileName("");
    setPosterPreview(null);
    setPosterHorizontalPreview(null);
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}

      <div className="max-w-7xl select-none mx-auto px-3 sm:px-6 py-3 sm:py-4 bg-white shadow-md rounded-lg mb-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-3 lg:gap-4">
          {/* Left: Logo/Brand */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-purple-600 to-purple-700 rounded-lg flex items-center justify-center">
              <BiSolidCameraMovie className="text-white text-lg sm:text-xl" />
            </div>
            <div>
              <h1 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-purple-600 to-purple-700 bg-clip-text text-transparent">
                Movie Management
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 hidden sm:block">
                Admin Portal - Manage Cinema Content
              </p>
            </div>
          </div>

          {/* Right: Search & Actions */}
          <div className="flex flex-col sm:flex-row items-center gap-3 lg:gap-4 w-full md:w-auto">
            {/* Search Input */}
            <div className="relative flex items-center w-full md:w-[350px]">
              <div className="absolute left-3 z-10">
                <svg
                  className="w-4 h-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <input
                type="text"
                value={searchMovie}
                onChange={(e) => setSearchMovie(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 hover:border-gray-300 shadow-sm"
                placeholder="Search by movie name (ENG or VN)..."
              />
            </div>

            {/* Add Movie Button */}
            {!showEditForm && (
              <button
                onClick={() => setShowAddForm(true)}
                className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl font-medium text-sm hover:from-purple-700 hover:to-purple-800 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 w-full sm:w-auto min-w-[120px] whitespace-nowrap"
              >
                <svg
                  className="w-4 h-4"
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
                Add Movie
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center lg:items-start h-auto min-h-screen max-w-7xl mx-auto w-full overflow-x-hidden">
        <div className="w-[90%] md:w-[95%] lg:w-full max-w-7xl space-y-4 sm:space-y-6">
          {/* Stats Cards */}
          <StatsCards
            totalMovies={movieStats.total}
            activeMovies={movieStats.active}
            upcomingMovies={movieStats.upcoming}
            expiredMovies={movieStats.expired}
            onFilterChange={handleFilterChange}
            activeFilter={activeFilter}
          />

          {/* Main Content */}
          <div
            className="bg-white p-2 sm:p-3 md:p-4 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300"
            onClick={handleOutsideClick}
          >
            {/* Filter Indicator */}
            {activeFilter && activeFilter !== "total" && (
              <div className="mb-4 p-3 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg border border-purple-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                    <span className="text-sm font-medium text-purple-700">
                      Filtering by:{" "}
                      {activeFilter === "active"
                        ? "Active Movies"
                        : activeFilter === "upcoming"
                        ? "Upcoming Movies"
                        : activeFilter === "expired"
                        ? "Expired Movies"
                        : ""}
                    </span>
                    <span className="text-xs text-purple-600 bg-purple-100 px-2 py-1 rounded-full">
                      {filteredMovies.length} movies
                    </span>
                  </div>
                  <button
                    onClick={() => setActiveFilter(null)}
                    className="text-purple-600 hover:text-purple-800 text-sm font-medium hover:bg-purple-100 px-2 py-1 rounded transition-colors duration-200"
                  >
                    Clear Filter
                  </button>
                </div>
              </div>
            )}

            {/* Desktop Table View */}
            <div className="hidden sm:block">
              <MovieTable
                movies={Array.isArray(filteredMovies) ? filteredMovies : []}
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
            <div className="block sm:hidden space-y-4 p-4">
              {Array.isArray(filteredMovies) && filteredMovies.length > 0 ? (
                filteredMovies.map((movie) => {
                  const now = new Date();
                  const start = new Date(movie.FromDate);
                  const end = new Date(movie.ToDate);
                  const status =
                    end < now
                      ? "Expired"
                      : start <= now
                      ? "Active"
                      : "Upcoming";
                  const statusClass =
                    status === "Expired"
                      ? "bg-red-100 text-red-700"
                      : status === "Active"
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700";

                  return (
                    <article
                      key={movie.MovieId}
                      className="bg-gradient-to-br from-white to-gray-50 p-4 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200"
                      onClick={(e) => handleRowClick(movie, e)}
                    >
                      <div className="flex items-center gap-4 w-full">
                        {movie.PosterImage ? (
                          <img
                            src={movie.PosterImage}
                            alt={movie.NameOfEnglish}
                            className="w-20 h-20 object-cover rounded-xl border border-gray-200"
                          />
                        ) : (
                          <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center border border-gray-200">
                            <span className="text-gray-400 text-xs">
                              No image
                            </span>
                          </div>
                        )}
                        <div className="flex-1 w-[200px]">
                          <h3 className="text-sm font-semibold text-gray-900 break-words mb-1">
                            {movie.NameOfEnglish}
                          </h3>
                          <p className="text-xs text-gray-600 break-words">
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
                      <div className="flex gap-2 mt-3">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRowClick(movie, e);
                          }}
                          className="flex items-center justify-center w-8 h-8 text-blue-500 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-all duration-200 transform hover:scale-110 shadow-sm hover:shadow-md"
                          title="View Movie"
                          aria-label={`View ${movie.NameOfEnglish || "movie"}`}
                        >
                          <IoEyeOutline size={14} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(movie);
                          }}
                          className="flex items-center justify-center w-8 h-8 text-blue-500 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-all duration-200 transform hover:scale-110 shadow-sm hover:shadow-md"
                          title="Edit Movie"
                          aria-label={`Edit ${movie.NameOfEnglish || "movie"}`}
                        >
                          <FaRegEdit size={14} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(movie);
                          }}
                          className="flex items-center justify-center w-8 h-8 text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 rounded-lg transition-all duration-200 transform hover:scale-110 shadow-sm hover:shadow-md"
                          title="Delete Movie"
                          aria-label={`Delete ${
                            movie.NameOfEnglish || "movie"
                          }`}
                        >
                          <RiDeleteBin5Line size={14} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openAddShowtimePopup(movie);
                          }}
                          className="flex items-center justify-center w-8 h-8 text-green-500 hover:text-green-700 bg-green-50 hover:bg-green-100 rounded-lg transition-all duration-200 transform hover:scale-110 shadow-sm hover:shadow-md"
                          title="Add Showtime"
                          aria-label={`Add showtime for ${
                            movie.NameOfEnglish || "movie"
                          }`}
                        >
                          <svg
                            className="w-4 h-4"
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
                })
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                    <BiSolidCameraMovie className="w-8 h-8 text-gray-400" />
                  </div>
                  <div className="text-lg font-semibold mb-2 text-gray-700">
                    {searchMovie.trim()
                      ? "No movies found for your search"
                      : "No movies found"}
                  </div>
                  <p className="text-sm text-gray-500">
                    {searchMovie.trim()
                      ? `Try searching with different terms or add new movies.`
                      : "Try adjusting your search criteria or add new movies."}
                  </p>
                </div>
              )}
            </div>
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            handlePageChange={handlePageChange}
          />
        </div>
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
          posterHorizontalPreview={posterHorizontalPreview}
          trailerPreview={trailerPreview}
          versions={versions}
          iframeUrl={iframeUrl}
          posterUploadRef={posterUploadRef}
          posterHorizontalUploadRef={posterHorizontalUploadRef}
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
          setPosterHorizontalFileName={setPosterHorizontalFileName}
          setPosterHorizontalPreview={setPosterHorizontalPreview}
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

      <AddShowtimePopup
        showAddShowtimePopup={showAddShowtimePopup}
        selectedMovie={selectedMovie}
        cinemaRooms={cinemaRooms}
        selectedRoomId={selectedRoomId}
        setSelectedRoomId={setSelectedRoomId}
        showtimeDate={showtimeDate}
        setShowtimeDate={setShowtimeDate}
        showtimeTimes={showtimeTimes}
        setShowtimeTimes={setShowtimeTimes}
        closeAddShowtimePopup={closeAddShowtimePopup}
        getMovieData={getMovieData}
        loading={loading}
        setLoading={setLoading}
      />

      <ToastContainer position="top-right" autoClose={2000} />
      {loading && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[9999]">
          <div className="bg-white rounded-xl p-6 sm:p-8 flex flex-col items-center shadow-2xl border border-gray-100">
            <svg
              className="animate-spin h-8 sm:h-10 w-8 sm:w-10 text-purple-600 mb-4 sm:mb-6"
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
            <div className="font-semibold text-lg sm:text-xl text-purple-700 text-center">
              {loading ? "Processing, please wait..." : "Searching..."}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieManagement;
