import React from "react";
import { MdMovie } from "react-icons/md";
import { FaCalendarAlt, FaClock } from "react-icons/fa";
import { PiChartLineDownBold } from "react-icons/pi";

const HeaderStats = ({ totalMovies, upcomingMovies, movies }) => {
  return (
    <div className="flex items-center justify-between w-full">
      <div className="bg-white rounded-md p-3 w-[23%] shadow-sm">
        <div className="flex items-center justify-between">
          <p className="text-slate-500">Total Views</p>
          <div className="p-2 bg-sky-100 rounded-full">
            <MdMovie size={20} className="text-blue-500" />
          </div>
        </div>
        <div className="font-bold text-[19px]">{totalMovies}</div>
      </div>
      <div className="bg-white rounded-md p-3 w-[23%] shadow-sm">
        <div className="flex items-center justify-between">
          <p className="text-slate-500 text-[14px]">Upcoming Releases</p>
          <div className="p-2 bg-rose-50 rounded-full">
            <FaCalendarAlt size={20} className="text-red-500" />
          </div>
        </div>
        <div className="font-bold text-[19px]">{upcomingMovies.length}</div>
      </div>
      <div className="bg-white rounded-md p-3 w-[23%] shadow-sm">
        <div className="flex items-center justify-between">
          <p className="text-slate-500">Expired Movies</p>
          <div className="p-2 bg-sky-100 rounded-full">
            <PiChartLineDownBold size={20} className="text-blue-500" />
          </div>
        </div>
        {movies.filter((movie) => movie.isDeleted === 1).length}
      </div>
      <div className="bg-white rounded-md p-3 w-[23%] shadow-sm">
        <div className="flex items-center justify-between">
          <p className="text-slate-500">Average Duration</p>
          <div className="p-2 bg-rose-50 rounded-full">
            <FaClock size={20} className="text-red-500" />
          </div>
        </div>
        {movies.length
          ? Math.round(
              movies.reduce((sum, movie) => sum + (movie.RunningTime || 0), 0) /
                movies.length
            )
          : 0}
      </div>
    </div>
  );
};

export default HeaderStats;
