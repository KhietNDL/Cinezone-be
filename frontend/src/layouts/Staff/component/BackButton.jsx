import React from "react";
import { useNavigate } from "react-router-dom";
import { IoMdArrowRoundBack } from "react-icons/io";

function BackButton() {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <button
      onClick={handleBack}
      className="group relative flex items-center gap-3 px-5 py-3 bg-white/90 backdrop-blur-sm border border-gray-200/50 hover:border-purple-300/70 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 active:scale-95"
    >
      {/* Background gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-blue-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

      {/* Icon with enhanced styling */}
      <div className="relative z-10 p-1 rounded-lg bg-gradient-to-r from-gray-100 to-gray-50 group-hover:from-purple-100 group-hover:to-blue-100 transition-all duration-300">
        <IoMdArrowRoundBack className="text-lg text-gray-600 group-hover:text-purple-600 transition-all duration-300 group-hover:transform group-hover:-translate-x-1" />
      </div>

      {/* Text with improved typography */}
      <span className="relative z-10 font-semibold text-sm text-gray-700 group-hover:text-purple-700 transition-colors duration-300">
        Back
      </span>

      {/* Subtle shine effect */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 group-hover:animate-pulse"></div>
    </button>
  );
}

export default BackButton;
