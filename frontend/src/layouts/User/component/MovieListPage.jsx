import React, { useEffect, useState } from "react";
import { getMovies, searchMovies } from "../../../services/API";
import { FaStar } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

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

  // Helper: slugify for movie detail route
  const slugify = (str) =>
    str
      .toString()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-zA-Z0-9 ]/g, "")
      .replace(/\s+/g, "-")
      .toLowerCase();

  return (
    <div className="pt-24 pb-15 px-4 min-h-screen bg-slate-900">
      <h1 className="text-3xl font-bold text-white mb-8 text-center">
        All Movies
      </h1>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
        <form className="flex items-center gap-2" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search by movie name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-3 py-2 rounded bg-slate-800 text-white border border-slate-700"
          />
          <button
            type="submit"
            className="px-4 py-2 rounded bg-[#6a57f5] text-white font-semibold hover:bg-[#5543c6] transition"
          >
            Search
          </button>
        </form>
        <select
          value={sortOrder}
          onChange={(e) => handleSortChange(e.target.value)}
          className="px-3 py-2 rounded bg-slate-800 text-white border border-slate-700"
        >
          <option value="desc">Newest</option>
          <option value="asc">Oldest</option>
        </select>
      </div>
      {loading ? (
        <div className="text-white text-center">Loading...</div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {movies.map((movie) => (
              <div
                key={movie.MovieId}
                className="bg-slate-800 rounded-xl overflow-hidden shadow-lg flex flex-col relative group cursor-pointer"
                onMouseEnter={() => setHoveredMovie(movie.MovieId)}
                onMouseLeave={() => setHoveredMovie(null)}
                onClick={() => navigate(`/${slugify(movie.NameOfEnglish)}`)}
                tabIndex={0}
                role="button"
              >
                <img
                  src={movie.PosterImage}
                  alt={movie.NameOfEnglish}
                  className="w-full h-64 object-cover"
                />
                {/* Hover Overlay */}
                {hoveredMovie === movie.MovieId && (
                  <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col justify-center items-start p-4 transition-all duration-300 ease-in-out z-10 rounded-xl">
                    <div className="text-white space-y-3 w-full">
                      <h3 className="font-bold text-lg mb-3 text-white">
                        {movie.NameOfEnglish}
                      </h3>
                      <div className="flex items-center gap-2 mb-2">
                        <FaStar className="text-yellow-400" />
                        <span className="text-yellow-300 font-semibold">
                          {movie.AverageRating
                            ? parseFloat(movie.AverageRating).toFixed(1)
                            : "N/A"}
                        </span>
                      </div>
                      <p className="text-gray-300 text-sm">
                        {movie.Description?.slice(0, 100) || ""}
                        {movie.Description &&
                          movie.Description.length > 100 &&
                          "..."}
                      </p>
                    </div>
                  </div>
                )}
                <div className="p-4 flex-1 flex flex-col z-0">
                  <h2 className="text-lg font-bold text-white mb-2">
                    {movie.NameOfEnglish}
                  </h2>
                  <div className="flex items-center gap-2 mb-2">
                    <FaStar className="text-yellow-400" />
                    <span className="text-yellow-300 font-semibold">
                      {movie.AverageRating
                        ? parseFloat(movie.AverageRating).toFixed(1)
                        : "N/A"}
                    </span>
                  </div>
                  <p className="text-gray-300 text-sm flex-1">
                    {movie.Description?.slice(0, 80) || ""}
                    {movie.Description &&
                      movie.Description.length > 80 &&
                      "..."}
                  </p>
                </div>
              </div>
            ))}
          </div>
          {/* Pagination */}
          <div className="flex justify-center items-center mt-8 gap-2">
            <button
              onClick={() => handlePageChange(pagination.currentPage - 1)}
              disabled={pagination.currentPage === 1}
              className="px-3 py-1 rounded bg-slate-700 text-white disabled:opacity-50"
            >
              Prev
            </button>
            {Array.from({ length: pagination.totalPages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => handlePageChange(i + 1)}
                className={`px-3 py-1 rounded ${
                  pagination.currentPage === i + 1
                    ? "bg-[#6a57f5] text-white"
                    : "bg-slate-700 text-white"
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(pagination.currentPage + 1)}
              disabled={pagination.currentPage === pagination.totalPages}
              className="px-3 py-1 rounded bg-slate-700 text-white disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default MovieListPage;
