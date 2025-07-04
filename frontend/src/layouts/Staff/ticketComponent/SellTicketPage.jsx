import React, { useState, useEffect } from "react";
import { Button, Input, Spin } from "antd";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Pagination, Navigation } from "swiper/modules";
import '../component/SwiperButton.css';
import { IoTime } from "react-icons/io5";
import {
  getCurrentMovies,
  searchMovies,
  getShowtimesByMovieId,
  getShowtimesByMovieIdAndDay
} from "../../../services/APIForStaff/API";

import ItemCard from "../component/ItemCard";
import ShowtimeButton from "./ShowtimeButton";

import { useDispatch, useSelector } from 'react-redux';
import {
  setSelectedMovie,
  setSelectedDay,
  setSelectedVersion,
  setSelectedTime,
  setRoom,
  setShowtimeId,
  resetBooking
} from '../../../redux/features/sellingSlice';

const SellTicketPage = () => {
  const dispatch = useDispatch();
  const {
    selectedMovie,
    selectedDay,
    selectedVersion,
    selectedTime,
    room,
    showtimeId
  } = useSelector((state) => state.selling);

  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [days, setDays] = useState([]);
  const [versionsAndTimes, setVersionsAndTimes] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!selectedMovie) return;

    getShowtimesByMovieId(selectedMovie.MovieId).then(res => {
      if (res?.showtimes) {
        const uniqueDays = Array.from(
          new Set(
            res.showtimes
              .map(st => st.Day)
              .filter(Boolean)
              .map(day => {
                const d = new Date(day);
                return d.toLocaleDateString('en-GB');
              })
          )
        );
        setDays(uniqueDays);
      }
    });
  }, [selectedMovie]);

  useEffect(() => {
    if (!selectedMovie || !selectedDay) return;

    const [day, month, year] = selectedDay.split('/');
    const formattedDay = `${year}-${month}-${day}`;

    getShowtimesByMovieIdAndDay(selectedMovie.MovieId, formattedDay).then(res => {
      if (res?.versions) {
        setVersionsAndTimes(res.versions);

        // Giữ lại room/showtime nếu version + time vẫn còn trong dữ liệu mới
        const ver = res.versions.find(v => v.version === selectedVersion);
        const timeObj = ver?.showtimes.find(t => t.time === selectedTime);

        if (ver && timeObj) {
          dispatch(setRoom(timeObj.roomName));
          dispatch(setShowtimeId(timeObj.showtimeId));
        } else {
          dispatch(setRoom(""));
          dispatch(setShowtimeId(""));
        }
      }
    });
  }, [selectedDay, selectedMovie]);

  useEffect(() => {
    if (selectedVersion && selectedTime && versionsAndTimes.length > 0) {
      const verObj = versionsAndTimes.find(v => v.version === selectedVersion);
      if (verObj) {
        const showtime = verObj.showtimes.find(t => t.time === selectedTime);
        if (showtime) {
          dispatch(setRoom(showtime.roomName));
          dispatch(setShowtimeId(showtime.showtimeId));
        } else {
          dispatch(setRoom(""));
          dispatch(setShowtimeId(""));
        }
      }
    }
  }, [selectedVersion, selectedTime, versionsAndTimes]);

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

  const handleCancel = () => {
    dispatch(resetBooking());
    setVersionsAndTimes([]);
    setDays([]);
  };

  useEffect(() => {
    getCurrentMovie();
  }, []);

const swiperBreakpoints = {
  320: { slidesPerView: 1, spaceBetween: 50, slidesPerGroup: 1 },
  640: { slidesPerView: 2, spaceBetween: 30, slidesPerGroup: 1 },
  768: { slidesPerView: 3, spaceBetween: 40, slidesPerGroup: 1 },
  1024: { slidesPerView: 4, spaceBetween: 50, slidesPerGroup: 1 },
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

      <p className=" font-semibold mt-5"><i className="fa-solid fa-film"></i> Select Movie</p>

      <div className="staff-swiper">
        {loading ? (
          <div className="text-center my-8"><Spin size="large" /></div>
        ) : (
          <Swiper
            modules={[Navigation, Pagination]}
            breakpoints={swiperBreakpoints}
            navigation
            pagination={{ clickable: true }}
            slidesPerView={4}
            // slidesPerGroup={2}
            loop={movies.length > 4}
          >
            {movies.map((movie) => (
              <SwiperSlide key={movie.MovieId}>
                <div className="flex justify-center p-2 w-[260px]">
                  <ItemCard
                    item={movie}
                    type="movie"
                    onSelect={() => {
                      const isSame = selectedMovie?.MovieId === movie.MovieId;
                      dispatch(setSelectedMovie(isSame ? null : movie));
                      if (!isSame) {
                        dispatch(setSelectedDay(null));
                        dispatch(setSelectedVersion(null));
                        dispatch(setSelectedTime(null));
                        dispatch(setRoom(""));
                        dispatch(setShowtimeId(""));
                        setVersionsAndTimes([]);
                        setDays([]);
                      }
                    }}
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
          <p className="font-semibold"><i className="fa-solid fa-calendar-days"></i> Select Day</p>
          <ShowtimeButton
            selectedDay={selectedDay}
            onSelectDay={(day) => {
              dispatch(setSelectedDay(day));
            }}
            days={days}
            showDay
          />
        </>
      )}

      {selectedMovie && selectedDay && (
        <>
          <p className="flex items-center gap-1 font-semibold">
            <IoTime /> Select Time
          </p>
          <div className="flex flex-wrap gap-6 p-4 ml-7 items-center">
            {versionsAndTimes.map(ver => (
              <div key={ver.version} className="flex flex-col items-center justify-center">
                <div
                  className={`font-bold px-5 py-2 rounded-lg mb-2
                    ${selectedVersion === ver.version ? "scale-107 shadow-lg shadow-gray-400" : ""}
                    ${ver.version === "IMAX" ? "bg-gradient-to-r from-[#004897] to-[#0AF7FB] text-white" :
                      ver.version === "4DX" ? "bg-gradient-to-r from-[#680000] to-[#F26969] text-white" :
                        ver.version === "3D" ? "bg-gradient-to-r from-[#C88200] to-[#FFE606] text-white" :
                          ver.version === "2D" ? "bg-gradient-to-r from-[#147800] to-[#5EFF41] text-white" :
                            "bg-gradient-to-r from-gray-700 to-gray-400 text-white"
                    }`}
                  role="button"
                  title={ver.version}
                  onClick={() => dispatch(setSelectedVersion(ver.version))}
                >
                  {ver.version}

                  <ShowtimeButton
                    parentVersion={ver.version}
                    selectedTime={selectedTime}
                    onSelectTime={(ver, time) => {
                      dispatch(setSelectedVersion(ver));
                      dispatch(setSelectedTime(time));
                    }}
                    times={ver.showtimes}
                    showTime
                  />
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {selectedMovie && selectedVersion && selectedDay && selectedTime && (
        <div className="flex items-center gap-2 ">
          <div className="flex items-center gap-2 font-semibold"><i className="fa-solid fa-location-dot"></i> Room:</div>
          <div className="font-bold">{room}</div>
        </div>
      )}

      <div className="flex items-center justify-center gap-4 mt-6">
        <Link
          to="/staff/ticket-selling/select-seats"
        >
          <button
            className="font-semibold px-4 py-2 bg-[#8A2BE2] rounded-md text-white cursor-pointer hover:bg-white 
            hover:text-[#8A2BE2] border-2 border-[#8A2BE2]"
            disabled={!selectedMovie || !selectedDay || !selectedVersion || !selectedTime}
          >
            <i className="fa-solid fa-couch"></i> Select seats
          </button>
        </Link>
        <button
          className="font-semibold px-4 py-2 border-2 border-red-500 text-red-500 rounded-md cursor-pointer 
          hover:text-white hover:bg-red-500"
          onClick={handleCancel}
        >
          <i className="fa-solid fa-xmark"></i> Cancel
        </button>
      </div>
    </div>
  );
};

export default SellTicketPage;
