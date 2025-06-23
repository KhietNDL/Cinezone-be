import React, { useState, useEffect } from "react";
import { Input, Spin } from "antd";
import ShowtimeButton from "./ShowtimeButton";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Pagination, Navigation } from "swiper/modules";
import "./SwiperButton.css";
import ItemCard from "./ItemCard";
import {
  getCurrentMovies,
  searchMovies,
} from "../../../services/APIForStaff/API";

export default function MoviePage() {
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const toSlug = (str) =>
    str
      .toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // bỏ dấu tiếng Việt
      .replace(/[^a-z0-9]+/g, '-') // thay ký tự đặc biệt bằng -
      .replace(/^-+|-+$/g, ''); // bỏ - ở đầu/cuối

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

  const handleSearch = async (value) => {
    setSearch(value);
    setLoading(true);
    try {
      if (!value) {
        await getCurrentMovie();
      } else {
        const response = await searchMovies(value);
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

  useEffect(() => {
    getCurrentMovie();
  }, []);

  const swiperBreakpoints = {
    320: {
      slidesPerView: 1,
      spaceBetween: 50,
    },
    640: {
      slidesPerView: 2,
      spaceBetween: 30,
    },
    768: {
      slidesPerView: 3,
      spaceBetween: 40,
    },
    1024: {
      slidesPerView: 4,
      spaceBetween: 50,
    },
  };

  return (
    <div className="w-full bg-[#fafbfc] p-[20px]">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row justify-between items-center">
          <h1 className="text-3xl font-bold text-[#9810FA]">Movies</h1>
          <Input.Search
            placeholder="Search movie..."
            style={{ width: 250 }}
            value={search}
            onChange={e => handleSearch(e.target.value)}
          />
        </div>
        <h5 className="mt-5">
          <i className="fa-solid fa-film"></i> Select Movie to view details and showtimes
        </h5>

        <div className="staff-swiper">
          {loading ? (
            <div className="text-center my-8">
              <Spin size="large" />
            </div>
          ) : (
            <Swiper
              modules={[Navigation, Pagination]}
              breakpoints={swiperBreakpoints}
              navigation
              pagination={{
                clickable: true,
              }}
              slidesPerView={4}
              slidesPerGroup={2}
              loop={true}
            >
              {movies.map((movie) => (
                <SwiperSlide key={movie.MovieId}>
                  <div className="flex justify-center p-2 w-[260px]">
                    <Link to={`/staff/movie/${toSlug(movie.NameOfEnglish)}`}>
                      <ItemCard
                        item={movie}
                        type="movie"
                        selected={selectedMovie?.MovieId === movie.MovieId}
                        onSelect={() =>
                          setSelectedMovie(
                            selectedMovie?.MovieId === movie.MovieId ? null : movie
                          )
                        }
                      />
                    </Link>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </div>
      </div>
    </div>
  );
}
