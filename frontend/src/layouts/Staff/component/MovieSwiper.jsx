import React, { useMemo } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "./SwiperButton.css";
import ItemCard from "./ItemCard";
import { Link } from "react-router-dom";

const MovieSwiper = ({
  movies = [],
  selectedMovie = null,
  onSelectMovie = () => {},
  useLink = false,
  linkTo = (movie) => `/staff/movie/${movie.MovieId}`
}) => {
  const swiperBreakpoints = useMemo(
    () => ({
      320: { slidesPerView: 1, spaceBetween: 20, slidesPerGroup: 1 },
      640: { slidesPerView: 2, spaceBetween: 30, slidesPerGroup: 1 },
      768: { slidesPerView: 3, spaceBetween: 50, slidesPerGroup: 2 },
      1024: { slidesPerView: 4, spaceBetween: 60, slidesPerGroup: 2 },
      1280: { slidesPerView: 4, spaceBetween: 60, slidesPerGroup: 2 },
    }),
    []
  );

  return (
    <Swiper
      key={movies.length}
      modules={[Navigation, Pagination]}
      breakpoints={swiperBreakpoints}
      navigation
      pagination={{ clickable: true }}
      loop
    >
      {movies.map((movie) => {
        const isSelected = selectedMovie?.MovieId === movie.MovieId;
        const card = (
          <ItemCard
            item={movie}
            type="movie"
            selected={isSelected}
            onSelect={() => onSelectMovie(movie)}
          />
        );

        return (
          <SwiperSlide key={movie.MovieId}>
            <div className="flex justify-center p-2 w-[100%]">
              {useLink ? <Link to={linkTo(movie)}>{card}</Link> : card}
            </div>
          </SwiperSlide>
        );
      })}
    </Swiper>
  );
};

export default MovieSwiper;
