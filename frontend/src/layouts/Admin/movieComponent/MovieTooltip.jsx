import React from "react";
import {
  IoClose,
  IoCalendarOutline,
  IoTimeOutline,
  IoMapOutline,
  IoPersonOutline,
  IoVideocamOutline,
  IoFilmOutline,
  IoBookmarkOutline,
} from "react-icons/io5";
import { formatDateRange } from "../../../utils/dateUtils";

const MovieTooltip = ({ movie, onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50">
      <div className="bg-white rounded-2xl shadow-2xl p-6 w-[650px] h-[calc(100vh_-_4rem)] overflow-y-auto transform transition-all duration-300 scale-100 border border-gray-200">
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-purple-700 bg-clip-text text-transparent mb-1">
              {movie.NameOfEnglish}
            </h2>
            <p className="text-sm text-gray-500 font-medium">
              {movie.NameOfVietnamese}
            </p>
            <p className="text-sm text-gray-600 font-medium mt-1">
              {movie.ProductionCompany}
            </p>
          </div>
          <div
            onClick={onClose}
            role="button"
            className="p-2 rounded-xl hover:bg-purple-50 active:bg-purple-100 transition-all duration-200 hover:scale-110 active:scale-95 group"
          >
            <IoClose
              size={24}
              className="text-gray-600 group-hover:text-purple-600 transition-colors duration-200"
            />
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-shrink-0">
            <div className="relative group">
              <img
                src={movie.PosterImage}
                alt={movie.NameOfEnglish}
                className="w-48 h-72 rounded-xl object-cover shadow-lg border border-gray-200 group-hover:shadow-xl transition-shadow duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          </div>
          <div className="flex-1 space-y-4">
            <div className="flex items-center p-3 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg border border-purple-200">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-purple-100 to-purple-200 rounded-full mr-3">
                <IoCalendarOutline size={20} className="text-purple-700" />
              </div>
              <div>
                <span className="text-sm font-semibold text-purple-800 block">
                  Release Date
                </span>
                <span className="text-sm text-purple-600 font-medium">
                  {formatDateRange(movie.FromDate, movie.ToDate)}
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center p-3 flex-1 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-green-100 to-green-200 rounded-full mr-3">
                  <IoTimeOutline size={20} className="text-green-700" />
                </div>
                <div>
                  <span className="text-sm font-semibold text-green-800 block">
                    Duration
                  </span>
                  <span className="text-sm text-green-600 font-medium">
                    {movie.RunningTime ? `${movie.RunningTime} min` : "TBA"}
                  </span>
                </div>
              </div>
              <div className="flex items-center p-3 flex-1 bg-gradient-to-r from-teal-50 to-cyan-50 rounded-lg border border-teal-200">
                <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-teal-100 to-teal-200 rounded-full mr-3">
                  <IoMapOutline size={20} className="text-teal-700" />
                </div>
                <div>
                  <span className="text-sm font-semibold text-teal-800 block">
                    Cinema Room
                  </span>
                  <span className="text-sm text-teal-600 font-medium">
                    {movie.cinemaRoom || "N/A"}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center p-3 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-lg border border-amber-200">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-amber-100 to-amber-200 rounded-full mr-3">
                <IoPersonOutline size={20} className="text-amber-700" />
              </div>
              <div>
                <span className="text-sm font-semibold text-amber-800 block">
                  Actors
                </span>
                <span className="text-sm text-amber-600 font-medium">
                  {movie.Actors}
                </span>
              </div>
            </div>
            <div className="flex items-center p-3 bg-gradient-to-r from-rose-50 to-pink-50 rounded-lg border border-rose-200">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-rose-100 to-rose-200 rounded-full mr-3">
                <IoVideocamOutline size={20} className="text-rose-700" />
              </div>
              <div>
                <span className="text-sm font-semibold text-rose-800 block">
                  Director
                </span>
                <span className="text-sm text-rose-600 font-medium">
                  {movie.Director}
                </span>
              </div>
            </div>
            <div className="flex items-center p-3 bg-gradient-to-r from-violet-50 to-purple-50 rounded-lg border border-violet-200">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-violet-100 to-violet-200 rounded-full mr-3">
                <IoFilmOutline size={20} className="text-violet-700" />
              </div>
              <div>
                <span className="text-sm font-semibold text-violet-800 block">
                  Version
                </span>
                <span className="text-sm text-violet-600 font-medium">
                  {Array.isArray(movie.versions) && movie.versions.length > 0
                    ? movie.versions.map((v, idx) => (
                        <span
                          key={idx}
                          className="inline-block mr-2 bg-violet-100 px-2 py-1 rounded-md text-xs"
                        >
                          {v.VersionType}
                          {v.Language ? ` - ${v.Language}` : ""}
                        </span>
                      ))
                    : "N/A"}
                </span>
              </div>
            </div>
            <div className="flex items-center p-3 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg border border-indigo-200">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-indigo-100 to-indigo-200 rounded-full mr-3">
                <IoBookmarkOutline size={20} className="text-indigo-700" />
              </div>
              <div>
                <span className="text-sm font-semibold text-indigo-800 block">
                  Genres
                </span>
                <span className="text-sm text-indigo-600 font-medium">
                  {movie.Genres}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-6 p-4 bg-gradient-to-r from-gray-50 to-purple-50/30 rounded-xl border border-gray-200">
          <h3 className="text-lg font-semibold bg-gradient-to-r from-purple-600 to-purple-700 bg-clip-text text-transparent mb-3 flex items-center">
            <IoBookmarkOutline size={20} className="text-purple-600 mr-2" />
            Synopsis
          </h3>
          <p className="text-sm text-gray-700 leading-relaxed">
            {movie.ContentSynopsis}
          </p>
        </div>
      </div>
    </div>
  );
};

export default MovieTooltip;
