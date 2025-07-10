import React from "react";
import { MdMovie } from "react-icons/md";
import { FaCalendarAlt, FaClock } from "react-icons/fa";
import { PiChartLineDownBold } from "react-icons/pi";

const HeaderStats = ({ totalMovies, upcomingMovies, movies }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 lg:gap-4 w-full">
      <div className="bg-white rounded-md p-2 sm:p-3 flex-1 shadow-sm">
        <div className="flex items-center justify-between">
          <p className="text-slate-500 text-sm sm:text-base">Total Movies</p>
          <div className="p-1 sm:p-2 bg-blue-100 rounded-lg flex items-center justify-center">
            <MdMovie size={20} className="text-blue-500" />
          </div>
        </div>
        <p className="font-bold text-base sm:text-[19px]">{totalMovies}</p>
      </div>
      <div className="bg-white rounded-md p-2 sm:p-3 flex-1 shadow-sm">
        <div className="flex items-center justify-between">
          <p className="text-slate-500 text-sm sm:text-base">
            Upcoming Releases
          </p>
          <div className="p-1 sm:p-2 bg-green-100 rounded-lg flex items-center justify-center">
            <FaCalendarAlt size={20} className="text-green-500" />
          </div>
        </div>
        <p className="font-bold text-base sm:text-[19px]">
          {upcomingMovies.length}
        </p>
      </div>
      <div className="bg-white rounded-md p-2 sm:p-3 flex-1 shadow-sm">
        <div className="flex items-center justify-between">
          <p className="text-slate-500 text-sm sm:text-base">Expired Movies</p>
          <div className="p-1 sm:p-2 bg-red-100 rounded-lg flex items-center justify-center">
            <PiChartLineDownBold size={20} className="text-red-500" />
          </div>
        </div>
        <p className="font-bold text-base sm:text-[19px]">
          {movies.filter((movie) => movie.isDeleted === 1).length}
        </p>
      </div>
      <div className="bg-white rounded-md p-2 sm:p-3 flex-1 shadow-sm">
        <div className="flex items-center justify-between">
          <p className="text-slate-500 text-sm sm:text-base">
            Average Duration
          </p>
          <div className="p-1 sm:p-2 bg-yellow-100 rounded-lg flex items-center justify-center">
            <FaClock size={20} className="text-yellow-500" />
          </div>
        </div>
        <p className="font-bold text-base sm:text-[19px]">
          {movies.length
            ? Math.round(
                movies.reduce(
                  (sum, movie) => sum + (movie.RunningTime || 0),
                  0
                ) / movies.length
              )
            : 0}{" "}
          mins
        </p>
      </div>
    </div>
  );
};

export default HeaderStats;
