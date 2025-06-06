
import React, { useState, useEffect } from "react";
import { Button, Spin, Tag, message } from "antd";
import axios from "axios";
import MovieCard from "./MovieCard";
import ShowtimeButton from "./ShowtimeButton";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import './SwiperButton.css';
import { RiMovie2AiFill } from "react-icons/ri";


const SellTicketPage = () => {
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedVersion, setSelectedVersion] = useState(null);



  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          "https://683d6711199a0039e9e55241.mockapi.io/movie"
        );
        setMovies(res.data);
      } catch (err) {
        message.error("Failed to fetch movies");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, []);

  return (
    <div className="p-3">
      <h1 className="text-3xl font-bold">Sell Movie Ticket</h1>

      <h5 className="mt-5">
        <i className="fa-solid fa-film"></i> Select Movie
      </h5>

      <div className="staff-swiper">
        {loading ? (
          <div className="text-center my-8">
            <Spin size="large" />
          </div>
        ) : (
          <Swiper
            modules={[Navigation]}
            navigation
            spaceBetween={0}
            slidesPerView={5}
            loop
            breakpoints={{
              320: { slidesPerView: 1 },
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 5 },
            }}
          >
            {movies.map((movie) => (
              <SwiperSlide key={movie.id}>
                <div className="flex justify-center p-2 w-[230px]">
                  <MovieCard
                    movie={movie}
                    onSelect={setSelectedMovie}
                    selected={selectedMovie?.id === movie.id}
                  />
                </div>

              </SwiperSlide>
            ))}
          </Swiper>
        )}

        <h5 className="mt-5 flex items-center gap-2">
          <RiMovie2AiFill /> Select Version
        </h5>
        <div className="pl-15 pt-2 ">
          {(!selectedVersion || selectedVersion === "IMAX") && (
            <Tag
              className="cursor-pointer"
              color="geekblue"
              onClick={() =>
                setSelectedVersion(selectedVersion === "IMAX" ? null : "IMAX")
              }
            >
              IMAX
            </Tag>
          )}
          {(!selectedVersion || selectedVersion === "4DX") && (
            <Tag
              className="cursor-pointer"
              color="volcano"
              onClick={() =>
                setSelectedVersion(selectedVersion === "4DX" ? null : "4DX")
              }
            >
              4DX
            </Tag>
          )}
          {(!selectedVersion || selectedVersion === "3D") && (
            <Tag
              className="cursor-pointer"
              color="cyan"
              onClick={() =>
                setSelectedVersion(selectedVersion === "3D" ? null : "3D")
              }
            >
              3D
            </Tag>
          )}
          {(!selectedVersion || selectedVersion === "2D") && (
            <Tag
              className="cursor-pointer"
              color="green"
              onClick={() =>
                setSelectedVersion(selectedVersion === "2D" ? null : "2D")
              }
            >
              2D
            </Tag>
          )}
        </div>

      </div>

      <h5 className="mt-5">
        <i className="fa-solid fa-clock"></i> Select Showtime
      </h5>

      <ShowtimeButton
        selectedTime={selectedTime}
        onSelectTime={setSelectedTime}
      />

      <div className="mt-5 text-center">
        <Link to="/staff/ticket-selling/select-seats">
          <Button
            style={{
              backgroundColor: "#4F46E5",
              color: "white",
              padding: "1rem",
              borderRadius: "0.25rem",
            }}
          >
            <i className="fa-solid fa-couch"></i> Select seats
          </Button>
        </Link>
        <Button style={{ marginLeft: 10 }} danger>
          <i className="fa-solid fa-xmark"></i> Cancel
        </Button>
      </div>
    </div>
  );
};

export default SellTicketPage;
