
import React, { useState, useEffect } from "react";
import { Button, Input, Spin, Tag, message } from "antd";
import api from "../../../services/API";

import ShowtimeButton from "./ShowtimeButton";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Pagination, Navigation } from "swiper/modules";
import './SwiperButton.css';
import { RiMovie2AiFill } from "react-icons/ri";
import ItemCard from "./ItemCard";

import { getCurrentMovies, searchMovies } from "../../../services/APIForStaff/API";



const SellTicketPage = () => {
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedVersion, setSelectedVersion] = useState(null);
  const [search, setSearch] = useState("");

  const rooms = "Cinema Hall 3";


  const getCurrentMovie = async () => {
    try {
      const response = await getCurrentMovies();

      if (response.data) {
        setMovies(response.data);

      }
    } catch (error) {
      console.error("Error fetching movies:", error);
    }
  }

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

    // Hàm tách version thành mảng
const getVersionsFromMovie = (movie) => {
  if (!movie?.Version) return [];
  // Tách theo dấu cách hoặc dấu phẩy, loại bỏ khoảng trắng thừa
  return movie.Version.split(/[\s,]+/).map(v => v.trim()).filter(Boolean);
};


  return (
    <div className="w-full bg-[#fafbfc] p-[20px]">
      <div className="flex flex-col justify-between items-center sm:flex-row">
        <h1 className="text-3xl font-bold text-[#9810FA]">Sell Movie Ticket</h1>
        <Input.Search
          placeholder="Search movie..."
          style={{ width: 250 }}
          value={search}
          onChange={e => handleSearch(e.target.value)}
        />
      </div>

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
                  <ItemCard
                    item={movie}
                    type="movie"
                    // onSelect={setSelectedMovie}
                    onSelect={() =>
                      setSelectedMovie(
                        selectedMovie?.MovieId === movie.MovieId ? null : movie
                      )
                    }
                    selected={selectedMovie?.MovieId === movie.MovieId}
                  />
                </div>

              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>
 {selectedMovie && (
  <>
    <h5 className="mt-5 flex items-center gap-2 ">
      <RiMovie2AiFill /> Select Version
    </h5>
    <div className="pl-15 pt-2 flex gap-4 w-full">
      {(selectedVersion
        ? [selectedVersion]
        : getVersionsFromMovie(selectedMovie)
      ).map((ver) => (
        <div
          key={ver}
          role="button"
          className={`font-bold text-white text-center px-7 py-2 rounded-lg
            ${ver === "IMAX"
              ? "bg-[linear-gradient(to_right,_#004897,_#509AEA,_#60BCE6,_#56C3F5,_#0AF7FB)]"
              : ver === "4DX"
                ? "bg-[linear-gradient(to_right,_#680000,_#991C1C,_#BF1616,_#DB3838,_#F26969)]"
                : ver === "3D"
                  ? "bg-[linear-gradient(to_right,_#C88200,_#DB9E2D,_#D0B400,_#F3C91E,_#FFE606)]"
                  : ver === "2D"
                    ? "bg-[linear-gradient(to_right,_#147800,_#03B000,_#0ACA00,_#4ADF00,_#5EFF41)]"
                    : "bg-gray-400"
            }
         
          `}
          onClick={() =>
            setSelectedVersion(selectedVersion === ver ? null : ver)
          }
        >
          {ver}
        </div>
      ))}
    </div>
  </>
)}

      {selectedMovie && selectedVersion && (
        <>

          <h5 className="mt-5">
            <i className="fa-solid fa-clock"></i> Select Showtime
          </h5>
          <ShowtimeButton
            selectedDay={selectedDay}
            onSelectDay={setSelectedDay}
            selectedTime={selectedTime}
            onSelectTime={setSelectedTime}
          />

        </>
      )}
      {selectedMovie && selectedVersion && selectedDay && selectedTime && (
        <div className="flex items-center gap-2 mt-5">
          <div className="flex items-center gap-2"><i className="fa-solid fa-location-dot"></i> Room:</div>
          <div className="font-bold">{rooms}</div>
        </div>
      )}
      <div className="mt-5 text-center">
        <Link to="/staff/ticket-selling/select-seats">
          <Button
            style={{
              backgroundColor: "#8A2BE2",
              color: "white",
              padding: "1rem"

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
