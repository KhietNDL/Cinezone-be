import React, { useState, useEffect, useRef } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Play,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { slugify } from "./Slug";

const MovieHeroSwiper = ({ movieData }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [videoProgress, setVideoProgress] = useState(0);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [pausedByScroll, setPausedByScroll] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [isMuted, setIsMuted] = useState(true); // Bắt đầu với muted = true
  const [userInteracted, setUserInteracted] = useState(false); // Theo dõi user interaction
  const videoRef = useRef(null);
  const popupVideoRef = useRef(null);
  const progressInterval = useRef(null);

  // Sử dụng movieData từ props
  const movies = movieData || [];
  const currentMovie = movies[currentSlide] || {};

  // Xử lý user interaction để enable autoplay với sound
  const handleUserInteraction = () => {
    if (!userInteracted) {
      setUserInteracted(true);
    }
  };

  // Handle slide navigation
  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % movies.length);
    resetVideoState();
  };

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + movies.length) % movies.length);
    resetVideoState();
  };

  const resetVideoState = () => {
    if (videoRef.current) {
      try {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      } catch (error) {
        console.error("Error pausing video:", error);
      }
    }
    setIsVideoPlaying(false);
    setVideoProgress(0);
    setPausedByScroll(false); // Reset pause state
  };

  // Pause video without resetting
  const pauseVideo = () => {
    if (videoRef.current && isVideoPlaying) {
      try {
        videoRef.current.pause();
        setIsVideoPlaying(false);
      } catch (error) {
        console.error("Error pausing video:", error);
      }
    }
  };

  // Resume video from current position
  const resumeVideo = () => {
    if (videoRef.current && !isVideoPlaying) {
      try {
        if (userInteracted) {
          videoRef.current.muted = false;
          setIsMuted(false);
        } else {
          videoRef.current.muted = true;
          setIsMuted(true);
        }

        videoRef.current
          .play()
          .then(() => {
            setIsVideoPlaying(true);
          })
          .catch((error) => {
            console.error("Error resuming video:", error);
          });
      } catch (error) {
        console.error("Error resuming video:", error);
      }
    }
  };

  // Bắt đầu phát video với âm thanh
  const startVideoWithSound = async () => {
    if (videoRef.current) {
      try {
        videoRef.current.muted = false; // Unmute video
        setIsMuted(false);
        await videoRef.current.play();
        setIsVideoPlaying(true);
        handleUserInteraction();
      } catch (error) {
        console.error("Không thể phát video với âm thanh:", error);
        // Fallback: phát video muted
        try {
          videoRef.current.muted = true;
          setIsMuted(true);
          await videoRef.current.play();
          setIsVideoPlaying(true);
        } catch (mutedError) {
          console.error("Không thể phát video ngay cả khi muted:", mutedError);
        }
      }
    }
  };

  useEffect(() => {
    const video = videoRef.current;
    if (video && currentMovie.TrailerUrl) {
      video.load();

      const handleCanPlay = () => {
        console.log("Video can play");
        if (userInteracted) {
          startVideoWithSound();
        } else {
          video.muted = true;
          setIsMuted(true);
          video
            .play()
            .then(() => {
              setIsVideoPlaying(true);
            })
            .catch((error) => {
              console.error("Autoplay failed:", error);
            });
        }
      };

      video.addEventListener("canplay", handleCanPlay);

      return () => {
        video.removeEventListener("canplay", handleCanPlay);
      };
    }
  }, [currentSlide, currentMovie.TrailerUrl, userInteracted]);

  // Auto-slide sau 15 giây
  useEffect(() => {
    let timeoutId;
    if (isVideoPlaying && !isPopupOpen && !pausedByScroll) {
      timeoutId = setTimeout(() => {
        setCurrentSlide((prev) => (prev + 1) % movies.length);
        resetVideoState();
      }, 15000);
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [isVideoPlaying, movies.length, isPopupOpen, pausedByScroll]);

  // Theo dõi tiến độ video
  useEffect(() => {
    if (isVideoPlaying && videoRef.current && !isPopupOpen) {
      progressInterval.current = setInterval(() => {
        const video = videoRef.current;
        if (video && video.duration) {
          const progress = (video.currentTime / video.duration) * 100;
          setVideoProgress(progress);

          if (video.currentTime >= video.duration) {
            resetVideoState();
            setCurrentSlide((prev) => (prev + 1) % movies.length);
          }
        }
      }, 100);
    } else {
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    }

    return () => {
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    };
  }, [isVideoPlaying, movies.length, isPopupOpen]);

  // Fixed scroll handling
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;

      if (scrollPosition > 300) {
        // Scroll xuống - chỉ pause video, không reset
        if (isVideoPlaying && !pausedByScroll) {
          pauseVideo();
          setPausedByScroll(true);
        }
      } else if (scrollPosition <= 300) {
        // Scroll lên - resume video từ vị trí hiện tại
        if (pausedByScroll && !isVideoPlaying && !isPopupOpen) {
          resumeVideo();
          setPausedByScroll(false);
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isVideoPlaying, pausedByScroll, isPopupOpen, userInteracted]);

  const handleStopVideo = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
    setIsVideoPlaying(false);
    setVideoProgress(0);
  };

  const handleOpenPopup = () => {
    // Pause video bên ngoài khi mở popup
    pauseVideo();
    setIsPopupOpen(true);
    handleUserInteraction();

    setTimeout(() => {
      if (popupVideoRef.current) {
        popupVideoRef.current.load();
        popupVideoRef.current.muted = false; // Popup video luôn có âm thanh
        popupVideoRef.current.play().catch((error) => {
          console.error("Popup video playback failed:", error);
        });
      }
    }, 100);
  };

  const handleClosePopup = () => {
    if (popupVideoRef.current) {
      popupVideoRef.current.pause();
      popupVideoRef.current.currentTime = 0;
    }
    setIsPopupOpen(false);

    // Resume video bên ngoài nếu không bị pause bởi scroll
    if (!pausedByScroll) {
      setTimeout(() => {
        resumeVideo();
      }, 100);
    }
  };

  // Thêm event listeners cho các tương tác của user
  useEffect(() => {
    const handleClick = () => handleUserInteraction();
    const handleKeyDown = () => handleUserInteraction();
    const handleTouch = () => handleUserInteraction();

    document.addEventListener("click", handleClick);
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("touchstart", handleTouch);

    return () => {
      document.removeEventListener("click", handleClick);
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("touchstart", handleTouch);
    };
  }, []);

  const navigate = useNavigate();
  const handleClickMovie = (movieTitle) => {
    const slug = slugify(movieTitle);
    navigate(`/${slug}`);
  };

  return (
    <div className="relative h-[500px] md:h-[600px] lg:h-[700px] w-full ">
      {/* Background Image/Video */}
      <div className="absolute inset-0">
        <div className="relative w-full h-full">
          <video
            key={currentMovie.TrailerUrl}
            ref={videoRef}
            className="w-full h-full object-cover"
            playsInline
            muted
            onEnded={handleStopVideo}
          >
            <source src={currentMovie.TrailerUrl} type="video/mp4" />
          </video>

          {/* Video Progress Bar */}
          <div className="absolute bottom-0 left-0 w-full h-1 bg-black/70">
            <div
              className="h-full bg-[#6a57f5] transition-all duration-100"
              style={{ width: `${videoProgress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black" />

      {/* Navigation Arrows */}
      <div
        role="button"
        onClick={handlePrevSlide}
        className="absolute left-1 top-1/2 -translate-y-1/2 hover:text-[#6a57f5] text-white p-3 rounded-full transition-all duration-300 z-20 hover:scale-110"
        aria-label="Previous slide"
      >
        <ChevronLeft size={50} />
      </div>

      <div
        role="button"
        onClick={handleNextSlide}
        className="absolute right-1 top-1/2 -translate-y-1/2 hover:text-[#6a57f5] text-white p-3 rounded-full transition-all duration-300 z-20 hover:scale-110"
        aria-label="Next slide"
      >
        <ChevronRight size={50} />
      </div>

      <div className="absolute inset-0 flex items-center justify-center h-full w-full z-10 p-4 md:p-8 ">
        <div className="flex flex-col md:flex-row items-center  h-full w-full max-w-7xl mx-auto gap-6 md:gap-8">
          {/* Movie Poster - Optimized for all screens */}
          <div className="flex-shrink-0 w-[150px] sm:w-[150px] md:w-[200px] lg:w-[250px]">
            <div className="relative group">
              <img
                src={currentMovie.PosterImage}
                alt={`${currentMovie.NameOfEnglish} poster`}
                loading="lazy"
                className="w-full h-[350px] rounded-2xl shadow-2xl transform transition-all duration-500 group-hover:scale-105"
              />
              {/* Enhanced Poster Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#6a57f5]/30 to-transparent rounded-2xl opacity-75 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          </div>

          {/* Left Content - Optimized for readability and spacing */}
          <div className="flex flex-col justify-center space-y-6 md:w-1/2 lg:w-3/5">
            {/* Genre Tags - Improved styling */}
            {currentMovie.Genres && (
              <div className="flex flex-wrap gap-2">
                {currentMovie.Genres.split(", ").map((genre, index) => (
                  <span
                    key={index}
                    className="bg-black/60 backdrop-blur-md text-white px-3 py-1.5 rounded-full text-sm font-medium tracking-wide transition-colors hover:bg-black/80"
                  >
                    {genre}
                  </span>
                ))}
              </div>
            )}

            {/* Title - Enhanced typography */}
            <h1 className="text-2xl sm:text-4xl  font-extrabold text-white leading-tight tracking-tight">
              {currentMovie.NameOfEnglish}
            </h1>

            {/* Description - Improved readability */}
            <p className="text-white/85 text-sm sm:text-base md:text-[18px] max-w-xl leading-relaxed line-clamp-4">
              {currentMovie.ContentSynopsis}
            </p>

            {/* Action Buttons - Modernized and responsive */}
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <button
                onClick={() => handleClickMovie(currentMovie.NameOfEnglish)}
                className="bg-[#6a57f5] hover:bg-[#5a47e5] text-white px-6 py-2.5 rounded-full font-semibold text-sm sm:text-base transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg shadow-[#6a57f5]/40 focus:outline-none focus:ring-2 focus:ring-[#6a57f5]/50"
                aria-label={`Book tickets for ${currentMovie.NameOfEnglish}`}
              >
                Book Now
              </button>

              <button
                onClick={handleOpenPopup}
                className="bg-transparent border-2 border-white/40 hover:border-white/70 hover:bg-white/10 text-white px-6 py-2.5 rounded-full font-semibold text-sm sm:text-base transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-white/50"
                aria-label={`Watch trailer for ${currentMovie.NameOfEnglish}`}
              >
                <Play size={18} className="mr-2" />
                Watch Trailer
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
        {movieData.map((_, index) => (
          <div
            role="button"
            key={index}
            onClick={() => {
              setCurrentSlide(index);
              resetVideoState();
            }}
            className={`w-12 h-1 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? "bg-[#6a57f5] shadow-lg shadow-[#6a57f5]/50"
                : "bg-white/30 hover:bg-white/50"
            }`}
          />
        ))}
      </div>

      {/* Full-Screen Trailer Popup */}
      {isPopupOpen && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="relative w-full max-w-4xl rounded-2xl">
            {currentMovie.IframeUrl ? (
              <iframe
                src={currentMovie.IframeUrl}
                title="Trailer"
                allow="autoplay; encrypted-media"
                allowFullScreen
                className="w-full aspect-video rounded-2xl"
              />
            ) : (
              <video
                ref={popupVideoRef}
                className="w-full h-auto rounded-2xl"
                controls
                autoPlay
              >
                <source src={currentMovie.TrailerUrl} type="video/mp4" />
              </video>
            )}
            <div
              role="button"
              onClick={handleClosePopup}
              className="absolute top-4 right-4 hover:bg-slate-800 active:scale-[1.1] text-white bg-black/50 p-2 rounded-full"
            >
              <X size={24} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieHeroSwiper;
