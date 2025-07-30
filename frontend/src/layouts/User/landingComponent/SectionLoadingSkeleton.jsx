import React from "react";

const SectionLoadingSkeleton = ({ title, itemCount = 4 }) => {
  return (
    <div className="w-full px-4 md:px-[30px] pt-[30px] md:pt-[40px] space-y-3">
      <div className="flex justify-center items-center text-white">
        <p className="font-bold pb-[30px] text-center text-[30px]">{title}</p>
      </div>

      <div className="flex items-center justify-center mt-[20px]">
        <div className="flex gap-6 overflow-hidden">
          {[...Array(itemCount)].map((_, index) => (
            <div
              key={index}
              className="flex-shrink-0 bg-slate-800/50 rounded-2xl overflow-hidden animate-pulse"
              style={{ width: "280px", height: "420px" }}
            >
              <div className="h-64 bg-slate-700/50"></div>
              <div className="p-4 space-y-3">
                <div className="h-4 bg-slate-700/50 rounded w-3/4"></div>
                <div className="h-3 bg-slate-700/50 rounded w-1/2"></div>
                <div className="h-3 bg-slate-700/50 rounded w-2/3"></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-center mt-4">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#6a57f5]"></div>
      </div>
    </div>
  );
};

export default SectionLoadingSkeleton;
