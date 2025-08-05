// import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useState, useEffect, useCallback } from "react";
import { Button, Spin, Card, Steps, Badge } from "antd";
import { Link } from "react-router-dom";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "../component/SwiperButton.css";
import { IoTime, IoSearchOutline } from "react-icons/io5";
import { FaCouch } from "react-icons/fa6";
import {
  getCurrentMovies,
  searchMovies,
  getShowtimesByMovieId,
  getShowtimesByMovieIdAndDay,
} from "../../../services/APIForStaff/API";
import ShowtimeButton from "./ShowtimeButton";
import { useDispatch, useSelector } from "react-redux";
import {
  setSelectedMovie,
  setSelectedDay,
  setSelectedVersion,
  setSelectedTime,
  setRoom,
  setShowtimeId,
  resetBooking,
} from "../../../redux/features/sellingSlice";
import { resetMember } from "../../../redux/features/memberSlice";
import VersionCard from "../component/VersionCard";
import {
  FaCalendarDays,
  FaLocationDot,
  FaTicket,
  FaFilm,
} from "react-icons/fa6";
import { MdEventSeat, MdCancel } from "react-icons/md";
import MovieSwiper from "../component/MovieSwiper";
import { CheckCircleOutlined } from "@ant-design/icons";
// import ScrollTopButton from "../component/ScollTopButton";

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

  // Calculate current step for progress indicator
  const getCurrentStep = () => {
    if (!selectedMovie) return 0;
    if (!selectedDay) return 1;
    if (!selectedTime || !selectedVersion) return 2;
    return 3;
  };

  useEffect(() => {
    if (!selectedMovie) return;
    getShowtimesByMovieId(selectedMovie.MovieId).then((res) => {
      if (res?.showtimes) {
        const uniqueDays = Array.from(
          new Set(
            res.showtimes
              .map((st) => st.Day)
              .filter(Boolean)
              .map((day) => {
                const d = new Date(day);
                return d.toLocaleDateString("en-GB");
              })
          )
        );
        setDays(uniqueDays);
      }
    });
  }, [selectedMovie]);

  useEffect(() => {
    if (!selectedMovie || !selectedDay) return;

    const [day, month, year] = selectedDay.split("/");
    const formattedDay = `${year}-${month}-${day}`;

    getShowtimesByMovieIdAndDay(selectedMovie.MovieId, formattedDay).then(
      (res) => {
        if (res?.versions) {
          setVersionsAndTimes(res.versions);

          const ver = res.versions.find((v) => v.version === selectedVersion);
          const timeObj = ver?.showtimes.find((t) => t.time === selectedTime);

          if (ver && timeObj) {
            dispatch(setRoom(timeObj.roomName));
            dispatch(setShowtimeId(timeObj.showtimeId));
          } else {
            dispatch(setRoom(""));
            dispatch(setShowtimeId(""));
          }
        }
      }
    );
  }, [selectedTime, selectedDay, selectedMovie, selectedVersion, dispatch]);

  useEffect(() => {
    if (selectedVersion && selectedTime && versionsAndTimes.length > 0) {
      const verObj = versionsAndTimes.find(
        (v) => v.version === selectedVersion
      );
      if (verObj) {
        const showtime = verObj.showtimes.find((t) => t.time === selectedTime);
        if (showtime) {
          dispatch(setRoom(showtime.roomName));
          dispatch(setShowtimeId(showtime.showtimeId));
        } else {
          dispatch(setRoom(""));
          dispatch(setShowtimeId(""));
        }
      }
    }
  }, [selectedVersion, selectedTime, versionsAndTimes, dispatch]);

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

  const handleSearch = useCallback(
    async (value) => {
      setSearch(value);
      setLoading(true);
      try {
        if (!value) {
          await getCurrentMovie();
          ``;
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
    },
    [getCurrentMovie]
  );

  const handleCancel = useCallback(() => {
    dispatch(resetBooking());
    dispatch(resetMember());
    setVersionsAndTimes([]);
    setDays([]);
  }, [dispatch]);

  useEffect(() => {
    getCurrentMovie();
  }, [getCurrentMovie]);

  const handleSelectMovie = useCallback(
    (movie) => {
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
    },
    [selectedMovie, dispatch]
  );

  const handleSelectDay = useCallback(
    (day) => {
      dispatch(setSelectedDay(day));
    },
    [dispatch]
  );

  const handleSelectTime = useCallback(
    (ver, time) => {
      dispatch(setSelectedVersion(ver));
      dispatch(setSelectedTime(time));
    },
    [dispatch]
  );

  return (
    <div className="min-h-screen ">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-3 sm:py-4 bg-white shadow-md rounded-lg">
        <div className="flex flex-col md:flex-row justify-between items-center gap-3 lg:gap-4">
          {/* Left: Logo/Brand */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-purple-600 to-purple-700 rounded-lg flex items-center justify-center">
              <FaTicket className="text-white text-lg sm:text-xl" />
            </div>
            <div>
              <h1 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-purple-600 to-purple-700 bg-clip-text text-transparent">
                Ticket Sales
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 hidden sm:block">
                Staff Portal - Cinema Management
              </p>
            </div>
          </div>

          {/* Right: Search */}
          <div className="w-full md:w-[30%] flex items-center justify-center gap-3">
            <div className="flex items-center p-1 px-2 w-full max-w-[400px]  rounded-xl bg-white shadow-sm">
              <IoSearchOutline size={20} />
              <input
                placeholder="Search movies"
                size="large"
                type="text"
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
                className="p-1 sm:p-2 focus:outline-none w-full text-sm sm:text-base"
                style={{
                  fontSize: "14px",
                  backgroundColor: "#ffffff",
                }}
              />
            </div>
          </div>
        </div>
      </div>
      {/* Floating Progress Sidebar */}
      {/* <div className="fixed right-3 lg:right-6 lg:top-2/3 top-3/4 transform -translate-y-1/2 z-50 bg-white rounded-xl lg:rounded-2xl shadow-2xl p-2 lg:p-4 border border-gray-100"> */}
      <div className="flex flex-row justify-center items-center gap-3 lg:gap-9 pt-6">
        {/* Step 1: Movie */}
        <div
          className={`relative flex flex-col items-center cursor-pointer transition-all duration-300 ${getCurrentStep() >= 0 ? "opacity-100" : "opacity-50"
            }`}
          onClick={() => {
            // Scroll to movie section
            document
              .querySelector('[data-step="movie"]')
              ?.scrollIntoView({ behavior: "smooth" });
          }}
        >
          <div
            className={`w-8 h-8 lg:w-12 lg:h-12 rounded-full flex items-center justify-center transition-all duration-300 ${getCurrentStep() >= 0
              ? "bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg scale-110"
              : "bg-gray-200 text-gray-400"
              } ${getCurrentStep() === 0
                ? "ring-2 lg:ring-4 ring-purple-200 animate-pulse"
                : ""
              }`}
          >
            <FaFilm className="text-sm lg:text-lg" />
          </div>
          <span
            className={`mt-1 lg:mt-2 text-xs font-medium text-center hidden lg:block ${getCurrentStep() >= 0 ? "text-gray-800" : "text-gray-400"
              }`}
          >
            Movie
          </span>
          {getCurrentStep() > 0 && (
            <div className="absolute left-13 top-2/6 -translate-y-1/2 h-px w-3 lg:w-6 bg-gradient-to-r from-purple-500 to-purple-600"></div>
          )}
        </div>

        {/* Step 2: Date */}
        <div
          className={`relative flex flex-col items-center cursor-pointer transition-all duration-300 ${getCurrentStep() >= 1 ? "opacity-100" : "opacity-50"
            }`}
          onClick={() => {
            if (selectedMovie) {
              document
                .querySelector('[data-step="date"]')
                ?.scrollIntoView({ behavior: "smooth" });
            }
          }}
        >
          <div
            className={`w-8 h-8 lg:w-12 lg:h-12 rounded-full flex items-center justify-center transition-all duration-300 ${getCurrentStep() >= 1
              ? "bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg scale-110"
              : "bg-gray-200 text-gray-400"
              } ${getCurrentStep() === 1
                ? "ring-2 lg:ring-4 ring-purple-200 animate-pulse"
                : ""
              }`}
          >
            <FaCalendarDays className="text-sm lg:text-lg" />
          </div>
          <span
            className={`mt-1 lg:mt-2 text-xs font-medium text-center hidden lg:block ${getCurrentStep() >= 1 ? "text-gray-800" : "text-gray-400"
              }`}
          >
            Date
          </span>
          {getCurrentStep() > 1 && (
            <div className="absolute left-13 top-2/6 -translate-y-1/2 h-px w-3 lg:w-6 bg-gradient-to-r from-purple-500 to-purple-600"></div>
          )}
        </div>

        {/* Step 3: Time */}
        <div
          className={`relative flex flex-col items-center cursor-pointer transition-all duration-300 ${getCurrentStep() >= 2 ? "opacity-100" : "opacity-50"
            }`}
          onClick={() => {
            if (selectedMovie && selectedDay) {
              document
                .querySelector('[data-step="time"]')
                ?.scrollIntoView({ behavior: "smooth" });
            }
          }}
        >
          <div
            className={`w-8 h-8 lg:w-12 lg:h-12 rounded-full flex items-center justify-center transition-all duration-300 ${getCurrentStep() >= 2
              ? "bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg scale-110"
              : "bg-gray-200 text-gray-400"
              } ${getCurrentStep() === 2
                ? "ring-2 lg:ring-4 ring-purple-200 animate-pulse"
                : ""
              }`}
          >
            <IoTime className="text-sm lg:text-lg" />
          </div>
          <span
            className={`mt-1 lg:mt-2 text-xs font-medium text-center hidden lg:block ${getCurrentStep() >= 2 ? "text-gray-800" : "text-gray-400"
              }`}
          >
            Time
          </span>
          {getCurrentStep() > 2 && (
            <div className="absolute left-13 top-2/6 -translate-y-1/2 h-px w-3 lg:w-6 bg-gradient-to-r from-purple-500 to-purple-600"></div>
          )}
        </div>

        {/* Step 4: Seats */}
        <div
          className={`flex flex-col items-center cursor-pointer transition-all duration-300 ${getCurrentStep() >= 3 ? "opacity-100" : "opacity-50"
            }`}
          onClick={() => {
            if (
              selectedMovie &&
              selectedDay &&
              selectedTime &&
              selectedVersion
            ) {
              document
                .querySelector('[data-step="seats"]')
                ?.scrollIntoView({ behavior: "smooth" });
            }
          }}
        >
          <div
            className={`w-8 h-8 lg:w-12 lg:h-12 rounded-full flex items-center justify-center transition-all duration-300 ${getCurrentStep() >= 3
              ? "bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg scale-110"
              : "bg-gray-200 text-gray-400"
              } ${getCurrentStep() === 3
                ? "ring-2 lg:ring-4 ring-purple-200 animate-pulse"
                : ""
              }`}
          >
            <FaCouch className="text-sm lg:text-lg" />
          </div>
          <span
            className={`mt-1 lg:mt-2 text-xs font-medium text-center hidden lg:block ${getCurrentStep() >= 3 ? "text-gray-800" : "text-gray-400"
              }`}
          >
            Seats
          </span>
        </div>
      </div>
      {/* </div> */}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-6">
        {/* Movie Selection Section */}
        <Card
          className="shadow-lg border-0 rounded-xl overflow-hidden mt-3"
          data-step="movie"
        >
          <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-6 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-purple-700 rounded-lg flex items-center justify-center">
                <FaFilm className="text-white text-sm" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  Step 1: Select Movie
                </h2>
                <p className="text-gray-600 text-sm">
                  Choose a movie for your customer
                </p>
              </div>
              {selectedMovie && (
                <Badge
                  count={<CheckCircleOutlined style={{ color: "#52c41a" }} />}
                  className="ml-auto"
                />
              )}
            </div>
          </div>

          <div>
            {loading ? (
              <div className="flex items-center justify-center py-16">
                <Spin size="large" />
                <span className="ml-3 text-gray-600">Loading movies...</span>
              </div>
            ) : (
              <div className="staff-swiper">
                <MovieSwiper
                  movies={movies}
                  selectedMovie={selectedMovie}
                  onSelectMovie={handleSelectMovie}
                />
              </div>
            )}
          </div>
        </Card>

        {/* Date Selection Section */}
        {selectedMovie && (
          <Card
            style={{ marginTop: 30 }}
            className="shadow-lg mt-3 border-0 rounded-xl overflow-hidden animate-fadeIn"
            data-step="date"
          >
            <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-6 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-purple-700 rounded-lg flex items-center justify-center">
                  <FaCalendarDays className="text-white text-sm" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800">
                    Step 2: Select Date
                  </h2>
                  <p className="text-gray-600 text-sm">Pick the showdate</p>
                </div>
                {selectedDay && (
                  <Badge
                    count={<CheckCircleOutlined style={{ color: "#52c41a" }} />}
                    className="ml-auto"
                  />
                )}
              </div>
            </div>

            <div className="p-6">
              <ShowtimeButton
                selectedDay={selectedDay}
                onSelectDay={handleSelectDay}
                days={days}
                showDay
              />
            </div>
          </Card>
        )}

        {/* Time Selection Section */}
        {selectedMovie && selectedDay && (
          <Card
            style={{ marginTop: 30 }}
            className="shadow-lg border-0 rounded-xl overflow-hidden animate-fadeIn"
            data-step="time"
          >
            <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-6 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-purple-700 rounded-lg flex items-center justify-center">
                  <IoTime className="text-white text-sm" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800">
                    Step 3: Select Showtime
                  </h2>
                  <p className="text-gray-600 text-sm">
                    Choose version and time slot
                  </p>
                </div>
                {selectedTime && selectedVersion && (
                  <Badge
                    count={<CheckCircleOutlined style={{ color: "#52c41a" }} />}
                    className="ml-auto"
                  />
                )}
              </div>
            </div>

            <div className="p-6">
              <div>
                {versionsAndTimes.map((ver) => (
                  // <VersionCard
                  //   key={ver.version}
                  //   version={ver.version}
                  //   selectedVersion={selectedVersion}
                  // >
                  <ShowtimeButton
                    parentVersion={ver.version}
                    selectedTime={selectedTime}
                    onSelectTime={handleSelectTime}
                    times={ver.showtimes}
                    showTime
                  />
                  // </VersionCard>
                ))}
              </div>
            </div>
          </Card>
        )}

        {/* Room Info Section */}
        {selectedMovie && selectedVersion && selectedDay && selectedTime && (
          <Card
            style={{ marginTop: 30 }}
            className="shadow-lg border-0 rounded-xl overflow-hidden animate-fadeIn"
          >
            <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-6 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-purple-700 rounded-lg flex items-center justify-center">
                  <FaLocationDot className="text-white text-sm" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800">
                    Step 4: Cinema Room Assignment
                  </h2>
                  <p className="text-gray-600 text-sm">
                    Your selected showtime room
                  </p>
                </div>
                <Badge
                  count={<CheckCircleOutlined style={{ color: "#52c41a" }} />}
                  className="ml-auto"
                />
              </div>
            </div>

            <div className="p-6">
              <div className="flex items-center justify-center">
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200 shadow-sm max-w-md w-full">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-purple-700 rounded-lg flex items-center justify-center mb-3 mx-auto">
                      <FaLocationDot className="text-white text-lg" />
                    </div>
                    <h3 className="text-sm font-medium text-gray-600 mb-2">
                      Cinema Room
                    </h3>
                    <p className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-purple-700 bg-clip-text text-transparent mb-2">
                      {room}
                    </p>
                    <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                      <span>Ready for booking</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Action Buttons Section */}
        <Card
          style={{ marginTop: 30 }}
          className="shadow-lg border-0 rounded-xl overflow-hidden"
          data-step="seats"
        >
          <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-6 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-purple-700 rounded-lg flex items-center justify-center">
                <FaCouch className="text-white text-sm" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  Step 5: Proceed to Booking
                </h2>
                <p className="text-gray-600 text-sm">
                  Complete your selection and proceed
                </p>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
              <Link
                to="/staff/ticket-selling/select-seats"
                className="w-full sm:w-auto"
              >
                <Button
                  type="primary"
                  size="large"
                  disabled={
                    !selectedMovie ||
                    !selectedDay ||
                    !selectedVersion ||
                    !selectedTime
                  }
                  icon={<FaCouch className="text-base" />}
                  className="w-full sm:w-auto px-6 py-2 h-auto font-medium bg-gradient-to-r from-purple-600 to-purple-700 border-0 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
                >
                  Proceed to Seat Selection
                </Button>
              </Link>

              <Button
                danger
                size="large"
                onClick={handleCancel}
                icon={<MdCancel className="text-base" />}
                className="w-full sm:w-auto px-6 py-2 h-auto font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
              >
                Cancel & Reset
              </Button>
            </div>

            {/* Progress Summary */}
            {selectedMovie && (
              <div className="bg-gradient-to-r from-gray-50 to-purple-50 rounded-lg p-4 border border-purple-100">
                <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <div className="w-5 h-5 bg-gradient-to-r from-purple-600 to-purple-700 rounded flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  Booking Summary
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
                  <div className="bg-white rounded-lg p-3 border border-gray-200">
                    <span className="text-gray-500 text-xs font-medium">
                      Movie
                    </span>
                    <p className="font-semibold text-purple-600 truncate mt-1">
                      {selectedMovie.NameOfEnglish}
                    </p>
                  </div>
                  {selectedDay && (
                    <div className="bg-white rounded-lg p-3 border border-gray-200">
                      <span className="text-gray-500 text-xs font-medium">
                        Date
                      </span>
                      <p className="font-semibold text-purple-600 mt-1">
                        {selectedDay}
                      </p>
                    </div>
                  )}
                  {selectedVersion && (
                    <div className="bg-white rounded-lg p-3 border border-gray-200">
                      <span className="text-gray-500 text-xs font-medium">
                        Version
                      </span>
                      <p className="font-semibold text-purple-600 mt-1">
                        {selectedVersion}
                      </p>
                    </div>
                  )}
                  {selectedTime && (
                    <div className="bg-white rounded-lg p-3 border border-gray-200">
                      <span className="text-gray-500 text-xs font-medium">
                        Time
                      </span>
                      <p className="font-semibold text-purple-600 mt-1">
                        {selectedTime}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default SellTicketPage;