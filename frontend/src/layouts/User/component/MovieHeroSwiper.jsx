import React, { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, Play, X } from "lucide-react";

const MovieHeroSwiper = ({ movieData }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [autoSlideEnabled, setAutoSlideEnabled] = useState(true);
  const [isVideoPaused, setIsVideoPaused] = useState(false);
  const autoSlideTimeoutRef = useRef(null);
  const iframeRef = useRef(null);

  const currentMovie = movieData[currentSlide];

  // Convert YouTube URL to embed format with API enablement
  const getYouTubeEmbedUrl = (url, enableApi = false, forPopup = false) => {
    if (!url) return "";

    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);

    if (match && match[2].length === 11) {
      const videoId = match[2];

      if (forPopup) {
        // For popup: with controls and sound
        return `https://www.youtube.com/embed/${videoId}?autoplay=1&controls=1&showinfo=0&rel=0&modestbranding=1&enablejsapi=1&origin=${window.location.origin}`;
      } else {
        // For background: start with sound (remove mute=1)
        const baseParams = `autoplay=1&loop=1&playlist=${videoId}&controls=1&showinfo=0&rel=0&modestbranding=1&iv_load_policy=3`;
        const apiParams = enableApi
          ? `&enablejsapi=1&origin=${window.location.origin}`
          : "";
        return `https://www.youtube.com/embed/${videoId}?${baseParams}${apiParams}`;
      }
    }

    return url;
  };
  // YouTube API commands
  const pauseVideo = () => {
    if (iframeRef.current) {
      iframeRef.current.contentWindow.postMessage(
        '{"event":"command","func":"pauseVideo","args":""}',
        "*"
      );
    }
  };

  const playVideo = () => {
    if (iframeRef.current) {
      iframeRef.current.contentWindow.postMessage(
        '{"event":"command","func":"playVideo","args":""}',
        "*"
      );
    }
  };

  const unmuteVideo = () => {
    if (iframeRef.current) {
      iframeRef.current.contentWindow.postMessage(
        '{"event":"command","func":"unMute","args":""}',
        "*"
      );
      console.log("Sent unmute command");
    } else {
      console.log("Iframe not available");
    }
  };
  useEffect(() => {
    const handleUserInteraction = () => {
      unmuteVideo(); // Bật âm thanh khi người dùng tương tác
      // Có thể bỏ lắng nghe sự kiện sau khi bật âm thanh để tránh gọi nhiều lần
      window.removeEventListener("click", handleUserInteraction);
    };

    window.addEventListener("click", handleUserInteraction);
    return () => window.removeEventListener("click", handleUserInteraction);
  }, []);
  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % movieData.length);
    resetAutoSlide();
    unmuteVideo(); // Bật âm thanh khi người dùng tương tác
  };

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + movieData.length) % movieData.length);
    resetAutoSlide();
    unmuteVideo(); // Bật âm thanh khi người dùng tương tác
  };

  const resetAutoSlide = () => {
    if (autoSlideTimeoutRef.current) {
      clearTimeout(autoSlideTimeoutRef.current);
    }
    startAutoSlide();
  };

  const startAutoSlide = () => {
    if (autoSlideEnabled && !isPopupOpen && !isVideoPaused) {
      autoSlideTimeoutRef.current = setTimeout(() => {
        setCurrentSlide((prev) => (prev + 1) % movieData.length);
        startAutoSlide();
      }, 8000); // 8 seconds per slide
    }
  };

  // Auto-slide functionality
  useEffect(() => {
    startAutoSlide();

    return () => {
      if (autoSlideTimeoutRef.current) {
        clearTimeout(autoSlideTimeoutRef.current);
      }
    };
  }, [currentSlide, autoSlideEnabled, isPopupOpen, isVideoPaused]);

  // Handle scroll to pause/resume video and auto-slide
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const shouldPause = scrollPosition > 100;

      if (shouldPause && !isVideoPaused) {
        // Pause video when scrolling down
        pauseVideo();
        setIsVideoPaused(true);
        setAutoSlideEnabled(false);
      } else if (!shouldPause && isVideoPaused) {
        // Resume video when scrolling back to top
        playVideo();
        setIsVideoPaused(false);
        setAutoSlideEnabled(true);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isVideoPaused]);

  // Reset video state when slide changes
  useEffect(() => {
    if (!isVideoPaused && !isPopupOpen) {
      // Small delay to ensure iframe is loaded
      const timer = setTimeout(() => {
        playVideo();
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [currentSlide, isVideoPaused, isPopupOpen]);

  const handleOpenPopup = () => {
    setIsPopupOpen(true);
    setAutoSlideEnabled(false);
    pauseVideo();
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
    setAutoSlideEnabled(true);
    if (!isVideoPaused) {
      playVideo();
    }
  };

  const handleSlideClick = (index) => {
    setCurrentSlide(index);
    resetAutoSlide();
  };

  return (
    <div className="relative h-[500px] md:h-[600px] lg:h-[700px] w-full overflow-hidden">
      {/* Background Video/Image */}
      <div className="absolute inset-0">
        <div className="relative w-full h-full">
          <iframe
            ref={iframeRef}
            key={currentMovie.trailerUrl}
            src={getYouTubeEmbedUrl(currentMovie.trailerUrl, true)}
            className="w-full h-full object-cover "
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{
              transform: "scale(1.2)", // Zoom to hide YouTube controls
              transformOrigin: "center center",
            }}
          />
        </div>
      </div>
      <div className="absolute top-4 right-4 z-20">
        <button
          onClick={unmuteVideo}
          className="bg-[#6a57f5] text-white px-4 py-2 rounded-full"
        >
          Unmute
        </button>
      </div>
      {/* Pause Overlay when scrolled */}
      {isVideoPaused && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-5">
          <div className="bg-black/70 backdrop-blur-sm text-white px-6 py-3 rounded-full text-sm font-medium">
            Scroll to top to resume trailer
          </div>
        </div>
      )}

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/80" />

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
            <div className="flex items-center space-x-3 flex-wrap gap-2">
              {currentMovie.category?.map((cat, index) => (
                <span
                  key={index}
                  className="bg-black/70 backdrop-blur-sm text-white px-4 py-2 rounded-xl text-sm font-medium"
                >
                  {cat.title}
                </span>
              ))}
              {currentMovie.sub && (
                <span className="bg-black/70 backdrop-blur-sm text-white px-4 py-2 rounded-xl text-sm font-medium">
                  {currentMovie.sub}
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
              {currentMovie.nameMovie}
            </h1>

            {/* Description */}
            <p className="text-white/90 text-base md:text-lg max-w-2xl leading-relaxed">
              {currentMovie.description ||
                "Experience the ultimate cinematic adventure with stunning visuals and captivating storylines that will keep you on the edge of your seat."}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <div
                role="button"
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
            onClick={() => handleSlideClick(index)}
            className={`w-12 h-1 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? "bg-[#6a57f5] shadow-lg shadow-[#6a57f5]/50"
                : "bg-white/30 hover:bg-white/50"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Full-Screen Trailer Popup */}
      {isPopupOpen && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
          <div className="relative w-full max-w-4xl aspect-video">
            <iframe
              src={getYouTubeEmbedUrl(currentMovie.trailerUrl).replace(
                "autoplay=1&mute=1",
                "autoplay=1"
              )}
              className="w-full h-full rounded-2xl"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
            <div
              role="button"
              onClick={handleClosePopup}
              className="absolute -top-12 right-0 hover:bg-white/20 text-white bg-black/50 p-2 rounded-full transition-all duration-300 hover:scale-110"
              aria-label="Close trailer"
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
