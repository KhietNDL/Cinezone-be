import React, { useState, useEffect, useMemo, useCallback } from "react";
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
import { resetMember } from '../../../redux/features/memberSlice';
import VersionCard from "../component/VersionCard";

const SellTicketPage = () => {
  const dispatch = useDispatch();
  const {
    selectedMovie,
    selectedDay,
    selectedVersion,
    selectedTime,
    room,
    // showtimeId
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

  const getCurrentMovie = useCallback(async () => {
    try {
      const response = await getCurrentMovies();
      if (response.data) {
        setMovies(response.data);
      }
    } catch (error) {
      console.error("Error fetching movies:", error);
    }
  }, []);

  const handleSearch = useCallback(async (value) => {
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
  }, [getCurrentMovie]);

  const handleCancel = useCallback(() => {
    dispatch(resetBooking());
    dispatch(resetMember());
    setVersionsAndTimes([]);
    setDays([]);
  }, [dispatch]);

  useEffect(() => {
    getCurrentMovie();
  }, [getCurrentMovie]);

  const swiperBreakpoints = useMemo(() => ({
    320: { slidesPerView: 1, spaceBetween: 50, slidesPerGroup: 1 },
    640: { slidesPerView: 2, spaceBetween: 30, slidesPerGroup: 1 },
    768: { slidesPerView: 2, spaceBetween: 50, slidesPerGroup: 2 },
    1024: { slidesPerView: 4, spaceBetween: 50, slidesPerGroup: 2 },
  }), []);

  const handleSelectMovie = useCallback((movie) => {
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
  }, [selectedMovie, dispatch]);

  const handleSelectDay = useCallback((day) => {
    dispatch(setSelectedDay(day));
  }, [dispatch]);

  const handleSelectTime = useCallback((ver, time) => {
    dispatch(setSelectedVersion(ver));
    dispatch(setSelectedTime(time));
  }, [dispatch]);

  return (
    <div className="w-full bg-[#fafbfc] p-[20px]">
      <div className="flex flex-col justify-between items-center sm:flex-row gap-4">
        <h1 className="text-3xl font-bold text-[#9810FA]">Sell Movie Ticket</h1>
        <Input.Search
          placeholder="Search movie..."
          style={{ width: 250 }}
          value={search}
          onChange={e => handleSearch(e.target.value)}
        />
      </div>

      <p className="font-semibold mt-5"><i className="fa-solid fa-film"></i> Select Movie</p>

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
            loop={true}
          >
            {movies.map((movie) => (
              <SwiperSlide key={movie.MovieId}>
                <div className="flex justify-center p-2 w-[260px]">
                  <ItemCard
                    item={movie}
                    type="movie"
                    onSelect={() => handleSelectMovie(movie)}
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
            onSelectDay={handleSelectDay}
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
          <div className="flex flex-wrap gap-6 p-4 ml-1 items-center">
            {versionsAndTimes.map(ver => (
              <VersionCard
                key={ver.version}
                version={ver.version}
                selectedVersion={selectedVersion}
              >
                <ShowtimeButton
                  parentVersion={ver.version}
                  selectedTime={selectedTime}
                  onSelectTime={handleSelectTime}
                  times={ver.showtimes}
                  showTime
                />
              </VersionCard>
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
        <Link to="/staff/ticket-selling/select-seats">
          <Button
            type="primary"
            disabled={!selectedMovie || !selectedDay || !selectedVersion || !selectedTime}
            icon={<i className="fa-solid fa-couch" />}
            className="font-semibold px-4 py-2"
          >
            Select seats
          </Button>
        </Link>

        <Button
          danger
          type="default"
          onClick={handleCancel}
          icon={<i className="fa-solid fa-xmark" />}
          className="font-semibold px-4 py-2"
        >
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default SellTicketPage;