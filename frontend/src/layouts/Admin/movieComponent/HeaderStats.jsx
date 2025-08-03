import React from "react";
import { MdMovie } from "react-icons/md";
import { FaCalendarAlt, FaClock } from "react-icons/fa";
import { PiChartLineDownBold } from "react-icons/pi";

const HeaderStats = ({ totalMovies, upcomingMovies, movies }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 w-full">
      <div className="bg-white rounded-xl p-3 sm:p-4 flex-1 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 text-xs sm:text-sm font-medium mb-1">
              Total Movies
            </p>
            <p className="font-bold text-lg sm:text-xl text-gray-800">
              {totalMovies}
            </p>
          </div>
          <div className="p-2 sm:p-3 bg-gradient-to-r from-purple-100 to-purple-200 rounded-lg flex items-center justify-center">
            <MdMovie size={20} className="text-purple-600" />
          </div>
        </div>
      </div>
      <div className="bg-white rounded-xl p-3 sm:p-4 flex-1 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 text-xs sm:text-sm font-medium mb-1">
              Upcoming Releases
            </p>
            <p className="font-bold text-lg sm:text-xl text-gray-800">
              {upcomingMovies.length}
            </p>
          </div>
          <div className="p-2 sm:p-3 bg-gradient-to-r from-green-100 to-green-200 rounded-lg flex items-center justify-center">
            <FaCalendarAlt size={20} className="text-green-600" />
          </div>
        </div>
      </div>
      <div className="bg-white rounded-xl p-3 sm:p-4 flex-1 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 text-xs sm:text-sm font-medium mb-1">
              Expired Movies
            </p>
            <p className="font-bold text-lg sm:text-xl text-gray-800">
              {movies.filter((movie) => movie.isDeleted === 1).length}
            </p>
          </div>
          <div className="p-2 sm:p-3 bg-gradient-to-r from-red-100 to-red-200 rounded-lg flex items-center justify-center">
            <PiChartLineDownBold size={20} className="text-red-600" />
          </div>
        </div>
      </div>
      <div className="bg-white rounded-xl p-3 sm:p-4 flex-1 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 text-xs sm:text-sm font-medium mb-1">
              Average Duration
            </p>
            <p className="font-bold text-lg sm:text-xl text-gray-800">
              {movies.length
                ? Math.round(
                    movies.reduce(
                      (sum, movie) => sum + (movie.RunningTime || 0),
                      0
                    ) / movies.length
                  )
                : 0}{" "}
              <span className="text-sm font-medium text-gray-600">mins</span>
            </p>
          </div>
          <div className="p-2 sm:p-3 bg-gradient-to-r from-yellow-100 to-yellow-200 rounded-lg flex items-center justify-center">
            <FaClock size={20} className="text-yellow-600" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeaderStats;
