// Landing.jsx - Cách tích hợp component
import React, { useEffect, useState } from "react";
import { FaRegCalendarCheck, FaRegCirclePlay } from "react-icons/fa6";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { IoMdBookmark } from "react-icons/io";
import { GoClockFill } from "react-icons/go";
import { Pagination, Navigation } from "swiper/modules";
import { useNavigate } from "react-router-dom";
import MovieHeroSwiper from "./MovieHeroSwiper";
import { slugify } from "./Slug";
import {
  getCurrentMovies,
  getMovies,
  getPromotion,
  getUpcomingMovies,
} from "../../../services/API";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { resetBooking } from "../../../redux/features/bookingSlice";

const LandingPage = () => {
  const [movieData, setMovieData] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [itemsPerPage, setItemsPerPage] = useState(7);
  const [currentPage, setCurrentPage] = useState(1);
  // eslint-disable-next-line no-unused-vars
  const [totalPages, setTotalPages] = useState(0);
  // const [totalCurrentPages, setTotalCurrentPages] = useState(0);
  // const [totalUpcomingPages, setTotalUpcomingPages] = useState(0);
  const [hoveredMovie, setHoveredMovie] = useState(null);
 
  const [isHovered, setIsHovered] = useState(false);
  const [currentMovies, setCurrentMovies] = useState([]);
  const [upcomingMovies, setUpcomingMovies] = useState([]);
  const [promotionData, setPromotionData] = useState([]);
  const [hoveredPromotion, setHoveredPromotion] = useState(null);
  const dispatch = useDispatch();
  const fetchPromotions = async () => {
    try {
      const res = await getPromotion();
      if (res.data) {
        setPromotionData(res.data);
      }
    } catch (error) {
      console.error("Error fetching promotions:", error);
      setPromotionData([]);
    }
  };
  const getMovie = async () => {
    try {
      const response = await getMovies({
        limit: itemsPerPage,
        page: currentPage,
      });
      if (response.data) {
        setMovieData(response.data);
        setTotalPages(
          response.data.totalPages ||
            Math.ceil(response.data.total / itemsPerPage)
        );
      }
    } catch (error) {
      console.error("Error fetching movies:", error);
    }
  };

  const getCurrentMovie = async () => {
    try {
      const response = await getCurrentMovies({
        limit: itemsPerPage,
        page: currentPage,
      });
      if (response.data) {
        setCurrentMovies(response.data);
      }
    } catch (error) {
      console.error("Error fetching current movies:", error);
    }
  };

  const getUpcomingMovie = async () => {
    try {
      const response = await getUpcomingMovies({
        limit: itemsPerPage,
        page: currentPage,
      });
      if (response.data) {
        setUpcomingMovies(response.data);
      }
    } catch (error) {
      console.error("Error fetching upcoming movies:", error);
    }
  };

  useEffect(() => {
    getCurrentMovie();
    getUpcomingMovie();
    getMovie();
    fetchPromotions();
  }, [itemsPerPage, currentPage]);
  const navigate = useNavigate();

  const handleClickMovie = (movieTitle) => {
    const slug = slugify(movieTitle);
    navigate(`/${slug}`);
  };

  useEffect(() => {
  dispatch(resetBooking()); // reset lại state bôking
}, []);


  // Responsive breakpoints for Swiper
  const swiperBreakpoints = {
    320: {
      slidesPerView: 1,
      spaceBetween: 20,
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

  // eslint-disable-next-line no-unused-vars
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const months = [
      "JAN",
      "FEB",
      "MAR",
      "APR",
      "MAY",
      "JUN",
      "JUL",
      "AUG",
      "SEP",
      "OCT",
      "NOV",
      "DEC",
    ];

    const day = String(date.getDate()).padStart(2, "0");
    const month = months[date.getMonth()];
    const year = date.getFullYear();

    return `${day} ${month} ${year}`;
  };

  // Format date range
  const formatDateRange = (fromDate, toDate) => {
    if (!fromDate || !toDate) return "Coming Soon";
    return `${formatDate(fromDate)} - ${formatDate(toDate)}`;
  };

  // Format running time
  const formatRunningTime = (minutes) => {
    if (!minutes) return "N/A";
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  return (
    <div className="w-full select-none landingPage">
      {/* HERO SECTION - Replace with MovieHeroSwiper */}
      <MovieHeroSwiper movieData={movieData} />

      {/* Screen 3D Effect */}
      <div className="w-full mt-10 px-4">
        <div className="w-full h-[40px] relative overflow-hidden group">
          {/* SVG for gradient curve */}
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 800 40"
            className="absolute inset-0 transition-transform duration-500 group-hover:scale-110"
            preserveAspectRatio="none"
            style={{ background: "transparent" }}
          >
            {/* Define gradient from light to dark in the middle */}
            <defs>
              <linearGradient
                id="purpleGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
              >
                <stop offset="0%" stopColor="#6a57f5" stopOpacity="0.1" />
                <stop offset="25%" stopColor="#6a57f5" stopOpacity="0.4" />
                <stop offset="50%" stopColor="#6a57f5" stopOpacity="1" />
                <stop offset="75%" stopColor="#6a57f5" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#6a57f5" stopOpacity="0.1" />
              </linearGradient>

              <linearGradient id="purpleGlow" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#6a57f5" stopOpacity="0.1" />
                <stop offset="25%" stopColor="#6a57f5" stopOpacity="0.5" />
                <stop offset="50%" stopColor="#6a57f5" stopOpacity="1" />
                <stop offset="75%" stopColor="#6a57f5" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#6a57f5" stopOpacity="0.1" />
              </linearGradient>

              <linearGradient
                id="purpleGlowHover"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
              >
                <stop offset="0%" stopColor="#b0a8ff" stopOpacity="0" />
                <stop offset="25%" stopColor="#b0a8ff" stopOpacity="0.7" />
                <stop offset="50%" stopColor="#c9c2ff" stopOpacity="1" />
                <stop offset="75%" stopColor="#b0a8ff" stopOpacity="0.7" />
                <stop offset="100%" stopColor="#b0a8ff" stopOpacity="0" />
              </linearGradient>

              <linearGradient
                id="purpleGradientHover"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
              >
                <stop offset="0%" stopColor="#b0a8ff" stopOpacity="0.01" />
                <stop offset="25%" stopColor="#b0a8ff" stopOpacity="0.6" />
                <stop offset="50%" stopColor="#c9c2ff" stopOpacity="1" />
                <stop offset="75%" stopColor="#b0a8ff" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#b0a8ff" stopOpacity="0.01" />
              </linearGradient>

              <linearGradient
                id="lightGlowBelow"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#c9c2ff" stopOpacity="0.3" />
                <stop offset="50%" stopColor="#c9c2ff" stopOpacity="0.1" />
                <stop offset="100%" stopColor="#c9c2ff" stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* Curve with glow effect */}
            <path
              d="M 0 20 Q 400 0 800 20"
              stroke="url(#purpleGlow)"
              strokeWidth="6"
              strokeLinecap="round"
              fill="none"
              className="blur-[1px] transition-all duration-500 group-hover:blur-[0px] group-hover:stroke-[7px] group-hover:[stroke:url(#purpleGlowHover)]"
            />

            {/* Main curve */}
            <path
              d="M 0 20 Q 400 0 800 20"
              stroke="url(#purpleGradient)"
              strokeWidth="4"
              strokeLinecap="round"
              fill="none"
              className="transition-all duration-500 group-hover:stroke-[6px] group-hover:[stroke:url(#purpleGradientHover)]"
            />

            {/* Soft light below on hover */}
            <path
              d="M 0 25 Q 400 5 800 25"
              stroke="url(#lightGlowBelow)"
              strokeWidth="12"
              strokeLinecap="round"
              fill="none"
              className="opacity-0 blur-[2px] transition-opacity duration-500 group-hover:opacity-100"
            />
          </svg>
        </div>
      </div>

      {/* NOW SHOWING */}
      <div className="w-full px-[30px] pt-[40px] space-y-3 ">
        <div className="flex justify-center items-center text-white">
          <p className="font-bold pb-[30px] text-center text-[30px]">
            Now Showing
          </p>
        </div>
        <div className="flex items-center justify-center mt-[20px] ">
          <Swiper
            breakpoints={swiperBreakpoints}
            slidesPerView={5}
            spaceBetween={50}
            pagination={{
              clickable: true,
            }}
            navigation={true}
            modules={[Pagination, Navigation]}
            className="mySwiper"
          >
            {currentMovies.map((item) => (
              <SwiperSlide
                onMouseEnter={() => {
                  setIsHovered(true);
                  setHoveredMovie(item.MovieId);
                }}
                onMouseLeave={() => {
                  setIsHovered(false);
                  setHoveredMovie(null);
                }}
                key={item.idMovie}
                className="bg-slate-800 flex flex-col justify-center items-center pb-2 rounded-xl space-y-2"
              >
                <div role="button" className="relative w-full">
                  <img
                    src={item.PosterImage}
                    alt={item.NameOfEnglish}
                    loading="lazy"
                    className="w-full h-[250px] md:h-[320px] object-cover rounded-tl-xl rounded-tr-xl"
                  />
                  {/* Hover Overlay */}
                  {hoveredMovie === item.MovieId && (
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex flex-col justify-center items-start p-4 rounded-tl-xl rounded-tr-xl transition-all duration-300 ease-in-out">
                      <div className="text-white space-y-3">
                        <h3 className="font-bold text-lg mb-3 text-white">
                          {item.NameOfEnglish}
                        </h3>

                        <div className="space-y-3 text-sm">
                          <div className="flex items-center">
                            <span className="text-gray-300">
                              <FaRegCalendarCheck size={20} />{" "}
                            </span>
                            <span className="ml-1">
                              {formatDateRange(item.FromDate, item.ToDate)}
                            </span>
                          </div>

                          <div className="flex ">
                            <span className="text-gray-300 mr-1">
                              <GoClockFill size={20} />
                            </span>
                            <span className="ml-1">
                              {formatRunningTime(item.RunningTime)}
                            </span>
                          </div>

                          <div className="flex">
                            <span className="text-gray-300 mr-1">
                              <IoMdBookmark size={24} />
                            </span>
                            {item.Genres && (
                              <div className="flex items-center space-x-3">
                                {item.Genres.split(", ").map((genre, index) => (
                                  <span
                                    key={index}
                                    className=" text-white rounded-xl text-md font-medium"
                                  >
                                    {genre}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="text-white text-center font-semibold text-sm md:text-base px-2">
                  {item.NameOfEnglish}
                </div>
                <div className="flex xl:flex-row md:flex-col sm:flex-row justify-evenly md:space-y-2 xl:space-y-0 sm:space-y-0 sm:space-x-1 items-center w-full px-2">
                  <div
                    role="button"
                    className="text-white flex items-center justify-center hover:bg-slate-700 p-2 rounded-4xl px-3 text-[11px] md:text-[12px] sm:w-auto"
                  >
                    <FaRegCirclePlay size={16} className="mr-1" />
                    Watch Trailer
                  </div>
                  <div
                    role="button"
                    onClick={() => handleClickMovie(item.NameOfEnglish)}
                    className="bg-[#6a57f5] rounded-4xl px-6 py-2 text-white hover:bg-[#6957f5ea] text-[12px]  shadow-[#6a57f5]  shadow-sm sm:w-auto "
                  >
                    Book Now
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>

      {/* COMING SOON SECTION */}
      <div className="w-full px-4 md:px-[30px] pt-[30px] md:pt-[40px] space-y-3">
        <div className="flex justify-center items-center text-white">
          <p className="font-bold pb-[20px] md:pb-[30px] text-[24px] md:text-[30px]">
            Coming Soon
          </p>
        </div>
        <div className="flex items-center justify-center mt-[15px] md:mt-[20px]">
          <Swiper
            breakpoints={swiperBreakpoints}
            slidesPerView={5}
            spaceBetween={50}
            pagination={{
              clickable: true,
            }}
            navigation={true}
            modules={[Pagination, Navigation]}
            className="mySwiper"
          >
            {upcomingMovies.map((item) => (
              <SwiperSlide
                onMouseEnter={() => {
                  setHoveredMovie(`coming-${item.MovieId}`);
                }}
                onMouseLeave={() => {
                  setHoveredMovie(null);
                }}
                key={item.MovieId}
                className="bg-slate-800 flex flex-col justify-center items-center pb-2 rounded-xl space-y-2"
              >
                <div className="relative ww-full">
                  <img
                    src={item.PosterImage}
                    alt={item.NameOfEnglish}
                    loading="lazy"
                    className="w-full h-[250px] md:h-[320px] object-cover rounded-tl-xl rounded-tr-xl"
                  />
                  {/* Hover Overlay for Coming Soon */}
                  {hoveredMovie === `coming-${item.MovieId}` && (
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex flex-col justify-center items-start p-4 rounded-tl-xl rounded-tr-xl transition-all duration-300 ease-in-out">
                      <div className="text-white space-y-3">
                        <h3 className="font-bold text-lg mb-3 text-white">
                          {item.NameOfEnglish}
                        </h3>

                        <div className="space-y-3 text-sm">
                          <div className="flex items-center">
                            <span className="text-gray-300">
                              <FaRegCalendarCheck size={20} />{" "}
                            </span>
                            <span className="ml-1">
                              {formatDateRange(item.FromDate, item.ToDate)}
                            </span>
                          </div>

                          <div className="flex ">
                            <span className="text-gray-300 mr-1">
                              <GoClockFill size={20} />
                            </span>
                            <span className="ml-1">
                              {formatRunningTime(item.RunningTime)}
                            </span>
                          </div>

                          <div className="flex">
                            <span className="text-gray-300 mr-1">
                              <IoMdBookmark size={24} />
                            </span>
                            {item.Genres && (
                              <div className="flex items-center space-x-3">
                                {item.Genres.split(", ").map((genre, index) => (
                                  <span
                                    key={index}
                                    className=" text-white rounded-xl text-md font-medium"
                                  >
                                    {genre}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="text-white text-center font-semibold text-sm md:text-base px-2">
                  {item.NameOfEnglish}
                </div>
                <div className="flex md:flex-col lg:flex-row sm:flex-row justify-center md:space-y-2 sm:space-y-0 sm:space-x-1 items-center w-full px-2">
                  <div
                    role="button"
                    className="text-white flex items-center justify-center hover:bg-slate-700 p-2 rounded-4xl px-3 text-[11px] md:text-[12px] w-full sm:w-auto"
                  >
                    <FaRegCirclePlay size={16} className="mr-1" />
                    Watch Trailer
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>

      {/* PROMOTION SECTION */}
      <div className="py-[30px] md:py-[40px] px-4 md:px-[30px] w-full space-y-8">
        <div className="text-white font-bold text-[24px] md:text-[30px]">
          Special Promotions
        </div>

        <div className="flex w-full items-center justify-center mt-[15px] md:mt-[20px]">
          <Swiper
            breakpoints={swiperBreakpoints}
            pagination={{
              clickable: true,
            }}
            navigation={true}
            modules={[Pagination, Navigation]}
            className="mySwiper"
          >
            {promotionData
              .filter((item) => {
                const now = new Date();
                const start = new Date(item.StartTime || item.startTime);
                const end = new Date(item.EndTime || item.endTime);
                return start <= now && now <= end;
              })
              .map((item) => (
                <SwiperSlide
                  key={item.idPromotion}
                  className="w-full flex flex-col justify-center items-center pb-2 rounded-xl space-y-2"
                  onMouseEnter={() => setHoveredPromotion(item.idPromotion)}
                  onMouseLeave={() => setHoveredPromotion(null)}
                >
                  <div className="relative h-[180px] w-full md:h-[200px] lg:h-[180px]">
                    <img
                      src={item.Image}
                      alt={item.Title}
                      className="w-full rounded-md h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    {/* Hover: Show code/title */}
                    {hoveredPromotion === item.idPromotion && (
                      <div
                        className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-md cursor-pointer transition"
                        onClick={() => {
                          navigator.clipboard.writeText(
                            item.Title || item.title || ""
                          );
                          toast.success("Copied!");
                        }}
                      >
                        <span className="text-white text-lg font-bold bg-black/60 px-4 py-2 rounded shadow">
                          {item.Title || item.title}
                        </span>
                      </div>
                    )}
                    {/* Decorative circles and dashed line */}
                    <div className="absolute w-[40px] md:w-[60px] h-[40px] md:h-[60px] lg:w-[50px] lg:h-[50px] rounded-full bg-black top-[-20px] md:top-[-30px] md:right-[10%] lg:right-[20%] right-[20%] transform translate-x-1/2 md:translate-x-0"></div>
                    <div className="absolute w-[40px] md:w-[60px] h-[40px] md:h-[60px] lg:w-[50px] lg:h-[50px] rounded-full bg-black bottom-[-20px] md:bottom-[-30px] lg:right-[20%] md:right-[10%] right-[20%]  transform translate-x-1/2 md:translate-x-0"></div>
                    <div className=" absolute h-[75%] top-[12%] border-dashed border-black  border-2 md:right-[45px] right-[70px] lg:right-[35%] xl:right-[27%]"></div>
                  </div>
                </SwiperSlide>
              ))}
          </Swiper>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
