import React, { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, Play, X } from "lucide-react";

const MovieHeroSwiper = ({ movieData }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [videoProgress, setVideoProgress] = useState(0);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [pausedByScroll, setPausedByScroll] = useState(false);
  const videoRef = useRef(null);
  const popupVideoRef = useRef(null);
  const progressInterval = useRef(null);

  const currentMovie = movieData[currentSlide];

  // Handle slide navigation
  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % movieData.length);
    resetVideoState();
  };

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + movieData.length) % movieData.length);
    resetVideoState();
  };

  const resetVideoState = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
    setIsVideoPlaying(false);
    setVideoProgress(0);
  };

  // Auto-play video when slide changes
  useEffect(() => {
    if (videoRef.current && !isPopupOpen) {
      videoRef.current.load();
      videoRef.current
        .play()
        .then(() => {
          setIsVideoPlaying(true);
          setVideoProgress(0);
        })
        .catch((error) => {
          console.error("Video playback failed:", error);
        });
    }
  }, [currentSlide, currentMovie.trailerUrl, isPopupOpen]);

  // Auto-slide after 10 seconds or when video ends
  useEffect(() => {
    let timeoutId;
    if (isVideoPlaying && !isPopupOpen) {
      timeoutId = setTimeout(() => {
        setCurrentSlide((prev) => (prev + 1) % movieData.length);
        resetVideoState();
      }, 10000);
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [isVideoPlaying, movieData.length, isPopupOpen]);

  // Video progress tracking
  useEffect(() => {
    if (isVideoPlaying && videoRef.current && !isPopupOpen) {
      progressInterval.current = setInterval(() => {
        const video = videoRef.current;
        if (video && video.duration) {
          const progress = (video.currentTime / video.duration) * 100;
          setVideoProgress(progress);

          if (video.currentTime >= video.duration) {
            resetVideoState();
            setCurrentSlide((prev) => (prev + 1) % movieData.length);
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
  }, [isVideoPlaying, movieData.length, isPopupOpen]);

  // Pause video when scrolling down
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      if (scrollPosition > 100 && isVideoPlaying) {
        resetVideoState();
        setPausedByScroll(true);
      } else if (
        scrollPosition <= 100 &&
        pausedByScroll &&
        !isVideoPlaying &&
        !isPopupOpen
      ) {
        if (videoRef.current) {
          videoRef.current.load();
          videoRef.current
            .play()
            .then(() => {
              setIsVideoPlaying(true);
              setVideoProgress(0);
              setPausedByScroll(false);
            })
            .catch((error) => {
              console.error("Video playback failed on scroll up:", error);
            });
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isVideoPlaying, pausedByScroll, isPopupOpen]);

  const handleStopVideo = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
    setIsVideoPlaying(false);
    setVideoProgress(0);
  };

  const handleOpenPopup = () => {
    setIsPopupOpen(true);
    resetVideoState(); // Pause background video
    if (popupVideoRef.current) {
      popupVideoRef.current.load();
      popupVideoRef.current.play().catch((error) => {
        console.error("Popup video playback failed:", error);
      });
    }
  };

  const handleClosePopup = () => {
    if (popupVideoRef.current) {
      popupVideoRef.current.pause();
      popupVideoRef.current.currentTime = 0;
    }
    setIsPopupOpen(false);
  };

  return (
    <div className="relative h-[500px] md:h-[600px] lg:h-[700px] w-full ">
      {/* Background Image/Video */}
      <div className="absolute inset-0">
        <div className="relative w-full h-full">
          <video
            key={currentMovie.trailerUrl}
            ref={videoRef}
            className="w-full h-full object-cover"
            playsInline
            onEnded={handleStopVideo}
          >
            <source src={currentMovie.trailerUrl} type="video/mp4" />
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
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/80 " />

      {/* Navigation Arrows */}
      <div
        role="button"
        onClick={handlePrevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-3 rounded-full transition-all duration-300 backdrop-blur-sm z-10"
      >
        <ChevronLeft size={24} />
      </div>

      <div
        role="button"
        onClick={handleNextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-3 rounded-full transition-all duration-300 backdrop-blur-sm z-10"
      >
        <ChevronRight size={24} />
      </div>

      {/* Content */}
      <div className="absolute inset-0 flex items-center bg-gradient-to-b from-transparent to-black/100">
        <div className="w-full flex items-center justify-between p-5 md:p-8">
          {/* Left Content */}
          <div className="md:w-[50%] w-full flex flex-col items-start space-y-5">
            {/* Genre Tags */}
            <div className="flex items-center space-x-3">
              {currentMovie.category?.map((cat, index) => (
                <span
                  key={index}
                  className="bg-black/70 backdrop-blur-sm text-white px-4 py-2 rounded-xl text-sm font-medium"
                >
                  {cat.title}
                </span>
              ))}
              <span className="bg-black/70 backdrop-blur-sm text-white px-4 py-2 rounded-xl text-sm font-medium">
                {currentMovie.sub}
              </span>
            </div>
            {/* Title */}
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
              {currentMovie.nameMovie}
            </h1>

            {/* Description */}
            <p className="text-white/90 text-base md:text-lg max-w-2xl leading-relaxed">
              Experience the ultimate cinematic adventure with stunning visuals
              and captivating storylines that will keep you on the edge of your
              seat.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <div
                role="button"
                className="bg-[#6a57f5] hover:bg-[#5a47e5] text-white px-8 py-3 rounded-4xl font-semibold transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg shadow-[#6a57f5]/30"
              >
                Book Now
              </div>

              <div
                role="button"
                onClick={isVideoPlaying ? handleStopVideo : handleOpenPopup}
                className="bg-transparent border-2 border-white/30 hover:border-white/60 hover:bg-white/10 text-white px-8 py-3 rounded-4xl font-semibold transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center backdrop-blur-sm"
              >
                <Play size={20} className="mr-2" />
                {isVideoPlaying ? "Stop Trailer" : "Watch Trailer"}
              </div>
            </div>
          </div>

          {/* Movie Poster - Hidden on mobile */}
          <div className="hidden md:flex w-1/2 justify-end items-end">
            <div className="relative">
              <img
                src={currentMovie.imgUrl}
                alt={currentMovie.nameMovie}
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
              <source src={currentMovie.trailerUrl} type="video/mp4" />
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
