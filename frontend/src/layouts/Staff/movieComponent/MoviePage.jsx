import React, { useState, useEffect } from "react";
import { Input, Spin } from "antd";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Pagination, Navigation } from "swiper/modules";
import "../component/SwiperButton.css";
import ItemCard from "../component/ItemCard";
import {
  getCurrentMovies,
  searchMovies,
} from "../../../services/APIForStaff/API";
import { useDebounce } from '../../../hooks/useDebounce'
import MovieSwiper from "../component/MovieSwiper";

export default function MoviePage() {
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const debouncedSearch = useDebounce(search, 3000);

  const toSlug = (str) =>
    str
      .toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

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
  }, [debouncedSearch]);

  useEffect(() => {
    getCurrentMovie(); // initial load
  }, []);

  return (
    <div className="w-full bg-[#fafbfc] p-[20px]">
      <div className="flex flex-col justify-between items-center lg:flex-row gap-4">
        <div className="w-[250px]"></div>
        <h1 className="text-3xl font-bold text-[#9810FA]">Movies</h1>
        <Input.Search
          placeholder="Search movie..."
          style={{ width: 250 }}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        // allowClear
        />
      </div>
      <p className="font-semibold mt-5 text-xl">
        <i className="fa-solid fa-film"></i> Select Movie to view details
      </p>

      <div className="staff-swiper w-full mt-4">
        {loading ? (
          <div className="text-center my-8"><Spin size="large" /></div>
        ) : (
          <MovieSwiper
            movies={movies}
            selectedMovie={selectedMovie}
            onSelectMovie={(movie) =>
              setSelectedMovie(selectedMovie?.MovieId === movie.MovieId ? null : movie)
            }
            useLink={true}
            linkTo={(movie) => `/staff/movie/${toSlug(movie.NameOfEnglish)}`}
          />
        )}
      </div>
    </div>
  );
}