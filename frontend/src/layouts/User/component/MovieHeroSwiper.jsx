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
      console.log("Attempting to auto-play video");
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
      console.log("Scroll position:", scrollPosition);

      if (scrollPosition > 300) {
        // Scroll xuống - chỉ pause video, không reset
        if (isVideoPlaying && !pausedByScroll) {
          console.log("Pausing video due to scroll");
          pauseVideo();
          setPausedByScroll(true);
        }
      } else if (scrollPosition <= 300) {
        // Scroll lên - resume video từ vị trí hiện tại
        if (pausedByScroll && !isVideoPlaying && !isPopupOpen) {
          console.log("Resuming video on scroll up");
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

      {/* Content */}
      <div className="absolute inset-0 flex items-center z-10 px-[30px]">
        <div className="w-full flex items-center justify-between p-5 md:p-8">
          {/* Left Content */}
          <div className="md:w-[50%] w-full flex flex-col items-start space-y-5">
            {/* Genre Tags */}
            {currentMovie.Genres && (
              <div className="flex items-center space-x-3">
                {currentMovie.Genres.split(", ").map((genre, index) => (
                  <span
                    key={index}
                    className="bg-black/70 backdrop-blur-sm text-white px-4 py-2 rounded-xl text-sm font-medium"
                  >
                    {genre}
                  </span>
                ))}
              </div>
            )}
            {/* Title */}
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
              {currentMovie.NameOfEnglish}
            </h1>

            {/* Description */}
            <p className="text-white/90 text-base md:text-lg max-w-2xl leading-relaxed">
              {currentMovie.ContentSynopsis}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <div
                role="button"
                onClick={() => handleClickMovie(currentMovie.NameOfEnglish)}
                className="bg-[#6a57f5] hover:bg-[#5a47e5] text-white px-8 py-3 rounded-full font-semibold transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg shadow-[#6a57f5]/30"
              >
                Book Now
              </div>

              <div
                role="button"
                onClick={handleOpenPopup}
                className="bg-transparent border-2 border-white/30 hover:border-white/60 hover:bg-white/10 text-white px-8 py-3 rounded-full font-semibold transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center backdrop-blur-sm"
              >
                <Play size={20} className="mr-2" />
                Watch Trailer
              </div>
            </div>
          </div>

          {/* Movie Poster - Hidden on mobile */}
          <div className="hidden md:flex w-1/2 justify-end items-end">
            <div className="relative">
              <img
                src={currentMovie.PosterImage}
                alt={currentMovie.NameOfEnglish}
                loading="lazy"
                className="w-[200px] lg:w-[250px] rounded-2xl shadow-2xl transform transition-all duration-500 hover:scale-105"
              />
              {/* Poster Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#6a57f5]/20 to-transparent rounded-2xl" />
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
        <div className="fixed inset-0 bg-black/30  flex items-center justify-center z-50">
          <div className="relative w-full max-w-4xl rounded-2xl">
            <video
              ref={popupVideoRef}
              className="w-full h-auto rounded-2xl"
              controls
              autoPlay
            >
              <source src={currentMovie.TrailerUrl} type="video/mp4" />
            </video>
            <div
              role="button"
              onClick={handleClosePopup}
              className="absolute top-4 right-4  hover:bg-slate-800  active:scale-[1.1]  text-white bg-black/50  p-2 rounded-full"
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
