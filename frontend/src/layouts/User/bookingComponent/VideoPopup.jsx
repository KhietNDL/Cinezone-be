import { useEffect } from "react";

const VideoPopup = ({ isOpen, movie, popupVideoRef, onClose }) => {
  useEffect(() => {
    if (isOpen && popupVideoRef.current) {
      setTimeout(() => {
        popupVideoRef.current.load();
        popupVideoRef.current.muted = false;
        popupVideoRef.current.play().catch(console.error);
      }, 100);
    }
  }, [isOpen, popupVideoRef]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="relative w-full max-w-5xl">
        <video
          ref={popupVideoRef}
          controls
          className="w-full rounded-2xl shadow-2xl"
        >
          <source
            src={
              movie?.TrailerUrl ||
              "https://storage.googleapis.com/movie-c96b6.firebasestorage.app/trailers/1749720180325-The_Smurfs_2_-_How_Smurfette_Came_to_Be___Fandango_Family.mp4"
            }
            type="video/mp4"
          />
          Your browser does not support the video tag.
        </video>
        <button
          onClick={onClose}
          className="absolute -top-2 -right-2 md:-top-4 md:-right-4 text-white bg-red-500 hover:bg-red-600 w-10 h-10 md:w-12 md:h-12 rounded-full hover:scale-110 transition-all duration-200 shadow-xl text-sm md:text-base"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default VideoPopup;
