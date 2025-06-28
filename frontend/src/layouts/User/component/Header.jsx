import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../../assets/logoWeb.png";
import { FaSearch, FaUser } from "react-icons/fa";
import { useAuth } from "../../../context/AuthContext";
import { MdAccountCircle } from "react-icons/md";
import { searchMovies } from "../../../services/API";
import { slugify } from "./Slug";

const Header = () => {
  const navigate = useNavigate();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const { user } = useAuth();

  // Function to call the API
  const handleSearch = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    try {
      const response = await searchMovies({ name: query });
      console.log("API Response:", response.data.data); // Log toàn bộ response
      if (response.data.data && Array.isArray(response.data.data)) {
        setSearchResults(response.data.data); // Trích xuất mảng từ response.data.data
      } else {
        setSearchResults([]);
        console.log(
          "No valid array data found in response:",
          response.data.data
        );
      }
    } catch (error) {
      console.error("Error fetching movies:", error);
      setSearchResults([]);
    }
  };

  // Handle input change and search with debounce effect
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      handleSearch(searchQuery);
    }, 300); // Delay 300ms to avoid excessive API calls
    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  // Navigate to movie page
  const handleMovieSelect = (MovieName) => {
    const slug = slugify(MovieName);
    navigate(`/${slug}`);
    setIsSearchOpen(false);
    setSearchQuery("");
    setSearchResults([]);
  };

  return (
    <div className="p-2 fixed md:px-5 bg-black/40 text-white flex items-center justify-between select-none w-[100%] top-0 left-0 z-50">
      <div role="button" className="flex items-center">
        <img
          src={logo}
          alt=""
          loading="lazy"
          role="button"
          onClick={() => navigate("/")}
          className="w-[160px] h-[70px] object-cover"
        />
      </div>
      <div className="md:flex items-center text-[17px] font-bold space-x-8 hidden">
        <div role="button" className="hover:underline shadow-2xl">
          Movies
        </div>
        <Link
          to="/promotions"
          className="hover:underline shadow-2xl block text-center py-2 px-4 cursor-pointer"
          role="button"
        >
          Promotions
        </Link>
      </div>
      <div className="flex items-center space-x-4">
        <div className="relative flex items-center z-50">
          {/* Input search nằm sau nút search */}
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsSearchOpen(true)}
            className={`absolute right-0 top-1/2 -translate-y-1/2 transition-all duration-300 bg-black text-white border border-[#6a57f5] rounded-4xl pl-4 pr-13 py-2.5 outline-none z-10 ${
              isSearchOpen
                ? "w-70 opacity-100 visible"
                : "w-0 opacity-0 invisible px-0 py-0 border-0"
            }`}
            style={{ minWidth: 0 }}
            autoFocus={isSearchOpen}
          />

          <div
            role="button"
            className="p-2.5 z-20 border-solid border-[1px] border-[#6a57f5] rounded-full shadow-[#6a57f5] shadow-md hover:bg-[#6957f538] transition-all duration-300 bg-black"
            onClick={() => setIsSearchOpen((prev) => !prev)}
            style={{ position: "relative" }}
          >
            <FaSearch size={20} className="text-white" />
          </div>
          {/* Dropdown kết quả */}
          {isSearchOpen && searchQuery && searchResults.length > 0 && (
            <div className="absolute p-2 right-0 pt-7 pb-3 top-3 w-70 bg-black border border-[#6a57f5] rounded-b-xl shadow-[#6a57f5] shadow-md max-h-40 overflow-y-auto mt-2 transition-all duration-300 z-0">
              {searchResults.map((movie) => (
                <div
                  key={movie.MovieId}
                  className="p-2 hover:bg-slate-900 cursor-pointer hover:rounded-lg text-white"
                  onClick={() => handleMovieSelect(movie.NameOfEnglish)}
                >
                  {movie.NameOfEnglish || movie.NameOfVietnamese}
                </div>
              ))}
            </div>
          )}
        </div>

        {user ? (
          <div className="flex items-center space-x-2">
            {user.avatar_url ? (
              <div className="relative">
                <div className="absolute inset-0 rounded-full border-2 border-white shadow-lg"></div>
                <img
                  src={user.avatar_url}
                  alt="User Avatar"
                  className="w-10 h-10 rounded-full object-cover cursor-pointer border-solid border-[1px] border-[#6a57f5] shadow-[#6a57f5] shadow-md hover:shadow-lg transition-all duration-300 relative z-10"
                  onClick={() => navigate("/account")}
                />
              </div>
            ) : (
              <FaUser
                size={25}
                className="cursor-pointer text-white"
                onClick={() => navigate("/account")}
              />
            )}
          </div>
        ) : (
          <div
            role="button"
            onClick={() => navigate("/login")}
            className="bg-transparent border-2 rounded-4xl p-2 px-6 border-[#6a57f5] shadow-[#6a57f5] hover:bg-[#6957f538] shadow-md font-bold active:scale-[1.1] transition-all duration-100"
          >
            Sign In
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
