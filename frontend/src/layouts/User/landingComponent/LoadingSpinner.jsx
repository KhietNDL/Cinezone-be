// LoadingSpinner.jsx - Component loading đơn giản
import React from "react";

const LoadingSpinner = () => {
  return (
    <div className="flex justify-center items-center py-20">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6a57f5]"></div>
    </div>
  );
};

export default LoadingSpinner;
