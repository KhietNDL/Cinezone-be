import React, { useEffect, useRef, useState } from "react";
import {
  createMovie,
  getMovies,
  editMovie,
  deleteMovie,
  searchMovies,
  getUpcomingMovies,
} from "../../../services/API";

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

  useEffect(() => {
    getMovieData();
    getUpcomingMovie();
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
        const total = response.data.total || normalizedMovies.length;
        const totalPagesFromApi = response.data.totalPages;
        setTotalPages(totalPagesFromApi || Math.ceil(total / itemsPerPage));
        console.log("Search Response data:", response.data);
        console.log("Search Total:", total, "Search Total Pages:", totalPages);
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
      { value: iframeUrl, name: "Trailer Iframe URL" }, // Bắt buộc nhập
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
  };
  const handleCloseMovieForm = () => {
    setShowAddForm(false);
    setShowEditForm(false);
    resetForm();
    setSelectedMovie(null);
  };

  const formatDate = (dateString) =>
    dateString ? dateString.split("T")[0] : "";

  return (
    <div
      className="flex items-center h-full justify-between"
      onClick={handleOutsideClick}
    >
      <div className="w-[90%] space-y-4 h-[calc(100vh_-_7rem)] movie-management-page">
        <HeaderStats
          totalMovies={totalMovies}
          upcomingMovies={upcomingMovies}
          movies={movies}
        />
        <SearchAndAdd
          searchMovie={searchMovie}
          setSearchMovie={setSearchMovie}
          setShowAddForm={setShowAddForm}
        />
        <MovieTable
          movies={movies}
          handleSort={handleSort}
          sortBy={sortBy}
          sortOrder={sortOrder}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
          handleRowClick={handleRowClick}
          formatDate={formatDate}
        />
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          handlePageChange={handlePageChange}
          renderPaginationButtons={() => <></>}
        />
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
      />
    </div>
  );
};

export default MovieManagement;
