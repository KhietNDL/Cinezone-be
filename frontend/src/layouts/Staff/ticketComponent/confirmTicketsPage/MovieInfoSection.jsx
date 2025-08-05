import React from "react";
import { RiFilmAiFill } from "react-icons/ri";
import { FaCalendarDays, FaLocationDot, FaCouch, FaStar } from "react-icons/fa6";
import { IoTime } from "react-icons/io5";
import VersionCard from "../../component/VersionCard";

const MovieInfoSection = ({ movieInfo, bookingData }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden h-full flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 px-6 py-4 border-b border-gray-200">
        <h2 className="text-xl font-bold flex items-center gap-3 text-gray-800">
          <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
            <RiFilmAiFill className="text-purple-600 text-lg" />
          </div>
          Ticket Information
        </h2>
      </div>

      <div className="p-6 flex-1">
        {/* Top Section: Movie Poster + Movie Details */}
        <div className="flex flex-col lg:flex-row gap-6 mb-6">
          {/* Movie Poster */}
          <div className="flex-shrink-0">
            <div className="relative group">
              <img
                src={movieInfo.PosterImage}
                alt={movieInfo.NameOfEnglish}
                className="w-full lg:w-52 h-98 object-cover rounded-xl shadow-lg border border-gray-200 group-hover:shadow-xl transition-shadow duration-300"
                onError={(e) => (e.target.src = "/placeholder-poster.jpg")}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              {/* Movie Status Badge on Image */}
              <div className="absolute top-3 left-3">
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-500 text-white shadow-lg">
                  ● Now Showing
                </span>
              </div>
              {/* Version Badge */}
              <div className="absolute top-3 right-3">
                <VersionCard
                  version={bookingData.selectedVersion}
                  readonly={true}
                  className="text-xs"
                />
              </div>
            </div>
          </div>

          {/* Movie Information Details */}
          <div className="flex-1 space-y-4">
            {/* Movie Title */}
            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-gray-900 leading-tight">
                {movieInfo.NameOfEnglish}
              </h3>
              <p className="text-lg text-gray-600 font-medium">
                ({movieInfo.NameOfVietnamese})
              </p>
            </div>

            {/* Movie Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Director */}
              <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg p-4 border border-purple-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <span className="text-purple-600 font-bold text-sm">🎬</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Director</p>
                    <p className="font-bold text-gray-900">
                      {movieInfo.Director || "N/A"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Duration */}
              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-4 border border-blue-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <IoTime className="text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Duration</p>
                    <p className="font-bold text-gray-900">
                      {movieInfo.RunningTime || "N/A"} minutes
                    </p>
                  </div>
                </div>
              </div>

              {/* Genre */}
              <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-lg p-4 border border-emerald-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                    <span className="text-emerald-600 font-bold text-sm">🎭</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 mb-2">Genre</p>
                    <div className="flex flex-wrap gap-1">
                      {(movieInfo.Genre || "Action")
                        .split(",")
                        .map((genre, index) => (
                          <span
                            key={index}
                            className="font-bold text-gray-900"
                          >
                            {genre.trim()}
                          </span>
                        ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Age Rating */}
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-4 border border-yellow-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <FaStar className="text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Rating</p>
                    <p className="font-bold text-gray-900">
                      {movieInfo.AverageRating || "General"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Synopsis */}
            {movieInfo.ContentSynopsis && (
              <div className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-lg p-4 border border-gray-100">
                <h5 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                  <span className="text-gray-600">📝</span>
                  Synopsis
                </h5>
                <p className="text-gray-700 text-sm leading-relaxed line-clamp-3">
                  {movieInfo.ContentSynopsis}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Section: Booking Information */}
        <div className="mt-10">
          <h4 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <FaCalendarDays className="text-blue-600" />
            </div>
            Booking Information
          </h4>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Date Card */}
            <div className="bg-white rounded-lg p-4 border border-blue-100 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FaCalendarDays className="text-blue-600 text-sm" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Date</p>
                  <p className="font-semibold text-gray-900">
                    {bookingData.selectedDay}
                  </p>
                </div>
              </div>
            </div>

            {/* Time Card */}
            <div className="bg-white rounded-lg p-4 border border-purple-100 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <IoTime className="text-purple-600 text-sm" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Time</p>
                  <p className="font-semibold text-gray-900">
                    {bookingData.selectedTime}
                  </p>
                </div>
              </div>
            </div>

            {/* Room Card */}
            <div className="bg-white rounded-lg p-4 border border-emerald-100 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <FaLocationDot className="text-emerald-600 text-sm" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Room</p>
                  <p className="font-semibold text-gray-900">
                    {bookingData.room}
                  </p>
                </div>
              </div>
            </div>

            {/* Tickets Card */}
            <div className="bg-white rounded-lg p-4 border border-orange-100 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                  <FaCouch className="text-orange-600 text-sm" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Tickets</p>
                  <p className="font-semibold text-gray-900">
                    {bookingData.selectedSeats.length} seats
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieInfoSection; 