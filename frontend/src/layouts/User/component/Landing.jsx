import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
  useMemo,
  lazy,
} from "react";
import { FaRegCirclePlay, FaStar } from "react-icons/fa6";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { IoMdBookmark } from "react-icons/io";
import { GoClockFill } from "react-icons/go";
import { Pagination, Navigation } from "swiper/modules";
import { useNavigate } from "react-router-dom";
import { slugify } from "./Slug";
import { useIntersectionObserver } from "../../../hooks/useIntersectionObserver";
import {
  useHeroMovies,
  useCurrentMovies,
  useUpcomingMovies,
} from "../../../hooks/useLazyMovies";
import { usePromotions } from "../../../hooks/useLazyPromotions";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { resetBooking } from "../../../redux/features/bookingSlice";
import { X } from "lucide-react";
import MovieHeroSwiper from "../landingComponent/MovieHeroSwiper";
import SkeletonLoader from "../landingComponent/SkeletonLoader";
import SectionLoadingSkeleton from "../landingComponent/SectionLoadingSkeleton";
import StatsSection from "../landingComponent/StatsSection";
import TrendingSection from "../landingComponent/TrendingSection";
import MovieCard from "../landingComponent/MovieCard";
import PromotionCard from "../landingComponent/PromotionCard";

const LandingPage = () => {
  const [hoveredMovie, setHoveredMovie] = useState(null);
  const [hoveredPromotion, setHoveredPromotion] = useState(null);
  const [isTrailerPopupOpen, setIsTrailerPopupOpen] = useState(false);
  const [currentTrailerMovie, setCurrentTrailerMovie] = useState(null);
  const popupVideoRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Intersection observers for each section
  const {
    targetRef: currentMoviesRef,
    hasIntersected: shouldLoadCurrentMovies,
  } = useIntersectionObserver();
  const {
    targetRef: upcomingMoviesRef,
    hasIntersected: shouldLoadUpcomingMovies,
  } = useIntersectionObserver();
  const { targetRef: promotionsRef, hasIntersected: shouldLoadPromotions } =
    useIntersectionObserver();

  // API calls with lazy loading
  const {
    movieData: heroMovies,
    isLoading: heroLoading,
    error: heroError,
  } = useHeroMovies();
  const {
    currentMovies,
    isLoading: currentLoading,
    error: currentError,
  } = useCurrentMovies(shouldLoadCurrentMovies);
  const {
    upcomingMovies,
    isLoading: upcomingLoading,
    error: upcomingError,
  } = useUpcomingMovies(shouldLoadUpcomingMovies);
  const {
    promotionData,
    isLoading: promotionsLoading,
    error: promotionsError,
  } = usePromotions(shouldLoadPromotions);

  // Suppress ESLint warnings for variables used in development/debugging
  // eslint-disable-next-line no-unused-vars
  const debugVars = {
    heroLoading,
    heroError,
    currentLoading,
    currentError,
    upcomingLoading,
    upcomingError,
    promotionsLoading,
    promotionsError,
  };

  // Reset booking only once when component mounts

  // Reset booking only once when component mounts
  useEffect(() => {
    dispatch(resetBooking());
  }, [dispatch]);

  // Memoize format functions to avoid unnecessary re-renders
  const formatDate = useCallback((dateString) => {
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
  }, []);

  const formatDateRange = useCallback(
    (fromDate, toDate) => {
      if (!fromDate || !toDate) return "Coming Soon";
      return `${formatDate(fromDate)} - ${formatDate(toDate)}`;
    },
    [formatDate]
  );

  const formatRunningTime = useCallback((minutes) => {
    if (!minutes) return "N/A";
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  }, []);

  // Use useMemo for swiperBreakpoints to avoid recreating object
  const swiperBreakpoints = useMemo(
    () => ({
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
        spaceBetween: 50,
      },
      1024: {
        slidesPerView: 3,
        spaceBetween: 60,
      },
      1280: {
        slidesPerView: 4,
        spaceBetween: 60,
      },
    }),
    []
  );

  const handleClickMovie = useCallback(
    (movieTitle) => {
      const slug = slugify(movieTitle);
      navigate(`/${slug}`);
    },
    [navigate]
  );

  // Optimized trailer functions
  const handleOpenTrailer = useCallback((movie) => {
    setCurrentTrailerMovie(movie);
    setIsTrailerPopupOpen(true);

    setTimeout(() => {
      if (popupVideoRef.current && movie.TrailerUrl) {
        popupVideoRef.current.load();
        popupVideoRef.current.muted = false;
        popupVideoRef.current.play().catch(() => {});
      }
    }, 100);
  }, []);

  const handleCloseTrailer = useCallback(() => {
    if (popupVideoRef.current) {
      popupVideoRef.current.pause();
      popupVideoRef.current.currentTime = 0;
    }
    setIsTrailerPopupOpen(false);
    setCurrentTrailerMovie(null);
  }, []);

  // Mouse event handlers
  const handleMovieMouseEnter = useCallback((movieId) => {
    setHoveredMovie(movieId);
  }, []);

  const handleMovieMouseLeave = useCallback(() => {
    setHoveredMovie(null);
  }, []);

  const handleComingMovieMouseEnter = useCallback((movieId) => {
    setHoveredMovie(`coming-${movieId}`);
  }, []);

  const handleCopyPromotion = useCallback((item) => {
    navigator.clipboard.writeText(item.Title || item.title || "");
    toast.success("Copy successful!");
  }, []);

  return (
    <div className="w-full select-none landingPage">
      {/* HERO SECTION - Load immediately */}
      <MovieHeroSwiper movieData={heroMovies} />

      {/* Screen 3D Effect - Enhanced for Mobile/Tablet only */}
      <div className="w-full mt-10 px-4">
        <div className="w-full h-[40px] relative overflow-hidden group">
          {/* SVG for gradient curve */}
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 800 40"
            className="absolute inset-0 transition-transform duration-500 
                       group-hover:scale-110
                       animate-pulse lg:animate-none"
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

              {/* Mobile animation gradients */}
              <linearGradient
                id="purpleGlowMobile"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
              >
                <stop offset="0%" stopColor="#b0a8ff" stopOpacity="0.2">
                  <animate
                    attributeName="stop-opacity"
                    values="0.2;0.8;0.2"
                    dur="3s"
                    repeatCount="indefinite"
                  />
                </stop>
                <stop offset="25%" stopColor="#b0a8ff" stopOpacity="0.6">
                  <animate
                    attributeName="stop-opacity"
                    values="0.6;1;0.6"
                    dur="3s"
                    repeatCount="indefinite"
                  />
                </stop>
                <stop offset="50%" stopColor="#c9c2ff" stopOpacity="1">
                  <animate
                    attributeName="stop-opacity"
                    values="1;0.8;1"
                    dur="3s"
                    repeatCount="indefinite"
                  />
                </stop>
                <stop offset="75%" stopColor="#b0a8ff" stopOpacity="0.6">
                  <animate
                    attributeName="stop-opacity"
                    values="0.6;1;0.6"
                    dur="3s"
                    repeatCount="indefinite"
                  />
                </stop>
                <stop offset="100%" stopColor="#b0a8ff" stopOpacity="0.2">
                  <animate
                    attributeName="stop-opacity"
                    values="0.2;0.8;0.2"
                    dur="3s"
                    repeatCount="indefinite"
                  />
                </stop>
              </linearGradient>
            </defs>

            {/* Curve with glow effect - Mobile/tablet shows enhanced glow */}
            <path
              d="M 0 20 Q 400 0 800 20"
              stroke="url(#purpleGlow)"
              strokeWidth="6"
              strokeLinecap="round"
              fill="none"
              className="blur-[1px] transition-all duration-500 
                         group-hover:blur-[0px] group-hover:stroke-[7px] group-hover:[stroke:url(#purpleGlowHover)]
                         lg:blur-[1px] lg:[stroke:url(#purpleGlow)]
                         md:blur-[0px] md:stroke-[7px] md:[stroke:url(#purpleGlowMobile)]"
            />

            {/* Main curve - Enhanced for mobile/tablet only */}
            <path
              d="M 0 20 Q 400 0 800 20"
              stroke="url(#purpleGradient)"
              strokeWidth="4"
              strokeLinecap="round"
              fill="none"
              className="transition-all duration-500 
                         group-hover:stroke-[6px] group-hover:[stroke:url(#purpleGradientHover)]
                         lg:stroke-[4px] lg:[stroke:url(#purpleGradient)]
                         md:stroke-[5px] md:[stroke:url(#purpleGradientHover)]"
            />

            {/* Soft light below - Mobile/tablet always visible, desktop on hover */}
            <path
              d="M 0 25 Q 400 5 800 25"
              stroke="url(#lightGlowBelow)"
              strokeWidth="12"
              strokeLinecap="round"
              fill="none"
              className="blur-[2px] transition-opacity duration-500 
                         group-hover:opacity-100
                         lg:opacity-0
                         md:opacity-60 sm:opacity-40"
            />

            {/* Mobile/tablet-only animated stroke */}
            <path
              d="M 0 20 Q 400 0 800 20"
              stroke="url(#purpleGlowMobile)"
              strokeWidth="3"
              strokeLinecap="round"
              fill="none"
              className="lg:hidden blur-[0.5px]"
            />
          </svg>
        </div>
      </div>

      {/* Stats Section - Use hero movies */}
      {heroMovies.length > 0 && (
        <StatsSection
          movieData={heroMovies}
          currentMovies={currentMovies}
          upcomingMovies={upcomingMovies}
        />
      )}

      {/* Trending Section - Use hero movies */}
      {heroMovies.length > 0 && (
        <TrendingSection
          movieData={heroMovies}
          onClickMovie={handleClickMovie}
          onOpenTrailer={handleOpenTrailer}
          formatDateRange={formatDateRange}
          formatRunningTime={formatRunningTime}
        />
      )}

      {/* Error handling for hero section */}
      {heroError && (
        <div className="w-full px-[30px] py-4">
          <div className="bg-red-600/20 border border-red-600 rounded-lg p-4 text-red-200 text-center">
            An error occurred while loading hero data. Please try again later.
          </div>
        </div>
      )}

      {/* Loading state for hero */}
      {heroLoading && <SkeletonLoader />}

      {/* NOW SHOWING - Lazy load */}
      <div ref={currentMoviesRef} className="w-full">
        {shouldLoadCurrentMovies && currentMovies.length > 0 && (
          <div className="w-full px-4 md:px-[30px] pt-[30px] md:pt-[40px] space-y-3">
            <div className="flex justify-center items-center text-white">
              <p className="font-bold pb-[30px] text-center text-[30px]">
                Now Showing
              </p>
            </div>
            <div className="flex items-center justify-center mt-[20px]">
              <Swiper
                breakpoints={swiperBreakpoints}
                slidesPerView={5}
                spaceBetween={50}
                navigation={true}
                modules={[Navigation, lazy]}
                className="mySwiper"
                lazy={true}
                style={{ height: "auto" }}
              >
                {currentMovies.map((item) => (
                  <SwiperSlide key={item.idMovie} className="h-auto">
                    <MovieCard
                      item={item}
                      isHovered={hoveredMovie === item.MovieId}
                      onMouseEnter={handleMovieMouseEnter}
                      onMouseLeave={handleMovieMouseLeave}
                      onClickMovie={handleClickMovie}
                      onOpenTrailer={handleOpenTrailer}
                      formatDateRange={formatDateRange}
                      formatRunningTime={formatRunningTime}
                      showBookButton={true}
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
        )}

        {/* Loading state for current movies */}
        {shouldLoadCurrentMovies && currentLoading && (
          <SectionLoadingSkeleton title="Now Showing" itemCount={4} />
        )}
      </div>

      {/* COMING SOON SECTION - Lazy load */}
      <div ref={upcomingMoviesRef} className="w-full">
        {shouldLoadUpcomingMovies && upcomingMovies.length > 0 && (
          <div className="landingPage-commingSoon w-full px-4 md:px-[30px] pt-[30px] md:pt-[40px] space-y-3">
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
                navigation={true}
                modules={[Navigation, lazy]}
                className="mySwiper"
                lazy={true}
                style={{ height: "auto" }}
              >
                {upcomingMovies.map((item) => (
                  <SwiperSlide key={item.MovieId} className="h-auto">
                    <MovieCard
                      item={item}
                      isHovered={hoveredMovie === `coming-${item.MovieId}`}
                      onMouseEnter={handleComingMovieMouseEnter}
                      onMouseLeave={handleMovieMouseLeave}
                      onClickMovie={handleClickMovie}
                      onOpenTrailer={handleOpenTrailer}
                      formatDateRange={formatDateRange}
                      formatRunningTime={formatRunningTime}
                      showBookButton={false}
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
        )}

        {/* Loading state for upcoming movies */}
        {shouldLoadUpcomingMovies && upcomingLoading && (
          <SectionLoadingSkeleton title="Coming Soon" itemCount={4} />
        )}
      </div>

      {/* PROMOTION SECTION - Lazy load */}
      <div ref={promotionsRef} className="w-full">
        {shouldLoadPromotions && promotionData.length > 0 && (
          <div className="landingPage-promotion py-[30px] md:py-[40px] px-4 md:px-[30px] w-full space-y-8">
            <div className="flex justify-center items-center text-white">
              <p className="font-bold pb-[30px] text-center text-[30px]">
                Promotions
              </p>
            </div>

            <div className="flex w-full items-center justify-center mt-[15px] md:mt-[20px]">
              <Swiper
                breakpoints={swiperBreakpoints}
                pagination={{ clickable: true }}
                navigation={true}
                modules={[Pagination, Navigation, lazy]}
                className="mySwiper"
                lazy={true}
              >
                {promotionData.map((item) => (
                  <SwiperSlide key={item.PromotionId}>
                    <PromotionCard
                      item={item}
                      isHovered={hoveredPromotion === item.PromotionId}
                      onMouseEnter={setHoveredPromotion}
                      onMouseLeave={() => setHoveredPromotion(null)}
                      onCopyPromotion={handleCopyPromotion}
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
        )}

        {/* Loading state for promotions */}
        {shouldLoadPromotions && promotionsLoading && (
          <SectionLoadingSkeleton title="Promotions" itemCount={3} />
        )}
      </div>

      {/* Trailer Popup Modal */}
      {isTrailerPopupOpen && currentTrailerMovie && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="relative w-full max-w-4xl mx-auto">
            {/* Close Button */}
            <button
              onClick={handleCloseTrailer}
              className="absolute -top-12 right-0 hover:bg-white/10 text-white bg-black/50 p-2 rounded-full transition-all duration-300 hover:scale-110 z-60"
              aria-label="Close trailer"
            >
              <X size={24} />
            </button>
            {/* Trailer Content */}
            <div className="bg-black rounded-2xl overflow-hidden shadow-2xl">
              {currentTrailerMovie.IframeUrl ? (
                <iframe
                  src={currentTrailerMovie.IframeUrl}
                  title={`${currentTrailerMovie.NameOfEnglish} Trailer`}
                  allow="autoplay; encrypted-media; fullscreen"
                  allowFullScreen
                  className="w-full aspect-video"
                />
              ) : currentTrailerMovie.TrailerUrl ? (
                <video
                  ref={popupVideoRef}
                  className="w-full aspect-video"
                  controls
                  autoPlay
                  preload="metadata"
                >
                  <source
                    src={currentTrailerMovie.TrailerUrl}
                    type="video/mp4"
                  />
                  Your browser does not support the video tag.
                </video>
              ) : (
                <div className="w-full aspect-video flex items-center justify-center bg-slate-800 text-white">
                  <div className="text-center">
                    <FaRegCirclePlay
                      size={48}
                      className="mx-auto mb-4 text-[#6a57f5]"
                    />
                    <p className="text-lg">Trailer not available</p>
                  </div>
                </div>
              )}
            </div>
            {/* Movie Info Below Video */}
            <div className="mt-6 text-white">
              <h3 className="text-2xl font-bold mb-2">
                {currentTrailerMovie.NameOfEnglish}
              </h3>
              <div className="flex items-center gap-4 text-sm text-gray-300">
                {currentTrailerMovie.AverageRating && (
                  <div className="flex items-center gap-1">
                    <FaStar className="text-yellow-400" />
                    <span>
                      {parseFloat(currentTrailerMovie.AverageRating).toFixed(1)}
                    </span>
                  </div>
                )}
                {currentTrailerMovie.RunningTime && (
                  <div className="flex items-center gap-1">
                    <GoClockFill />
                    <span>
                      {formatRunningTime(currentTrailerMovie.RunningTime)}
                    </span>
                  </div>
                )}
                {currentTrailerMovie.Genres && (
                  <div className="flex items-center gap-1">
                    <IoMdBookmark />
                    <span>{currentTrailerMovie.Genres}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingPage;
