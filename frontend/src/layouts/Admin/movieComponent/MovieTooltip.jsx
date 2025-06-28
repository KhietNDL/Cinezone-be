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
      <div className="bg-white rounded-2xl shadow-2xl p-6 w-[650px] h-[calc(100vh_-_4rem)] overflow-y-auto transform transition-all duration-300 scale-100">
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900 mb-1">
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
            className="p-2 rounded-2xl hover:bg-slate-100 active:bg-slate-200 transition-all duration-200 hover:scale-110 active:scale-95"
          >
            <IoClose size={24} className="text-gray-600" />
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
            <div className="flex items-center p-3 bg-blue-50 rounded-lg border border-blue-100">
              <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full mr-3">
                <IoCalendarOutline size={20} className="text-blue-600" />
              </div>
              <div>
                <span className="text-sm font-medium text-blue-800 block">
                  Release Date
                </span>
                <span className="text-sm text-blue-600 font-semibold">
                  {formatDateRange(movie.FromDate, movie.ToDate)}
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center p-3 w-[49%] bg-green-50 rounded-lg border border-green-100">
                <div className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-full mr-3">
                  <IoTimeOutline size={20} className="text-green-600" />
                </div>
                <div>
                  <span className="text-sm font-medium text-green-800 block">
                    Duration
                  </span>
                  <span className="text-sm text-green-600 font-semibold">
                    {movie.RunningTime ? `${movie.RunningTime} min` : "TBA"}
                  </span>
                </div>
              </div>
              <div className="flex items-center p-3 bg-teal-50 rounded-lg border border-teal-100">
                <div className="flex items-center justify-center w-10 h-10 bg-teal-100 rounded-full mr-3">
                  <IoMapOutline size={20} className="text-teal-600" />
                </div>
                <div>
                  <span className="text-sm font-medium text-teal-800 block">
                    Cinema Room
                  </span>
                  <span className="text-sm text-teal-600 font-semibold">
                    {movie.cinemaRoom || "N/A"}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center p-3 bg-yellow-50 rounded-lg border border-yellow-100">
              <div className="flex items-center justify-center w-10 h-10 bg-yellow-100 rounded-full mr-3">
                <IoPersonOutline size={20} className="text-yellow-600" />
              </div>
              <div>
                <span className="text-sm font-medium text-yellow-800 block">
                  Actors
                </span>
                <span className="text-sm text-yellow-600 font-semibold">
                  {movie.Actors}
                </span>
              </div>
            </div>
            <div className="flex items-center p-3 bg-red-50 rounded-lg border border-red-100">
              <div className="flex items-center justify-center w-10 h-10 bg-red-100 rounded-full mr-3">
                <IoVideocamOutline size={20} className="text-red-600" />
              </div>
              <div>
                <span className="text-sm font-medium text-red-800 block">
                  Director
                </span>
                <span className="text-sm text-red-600 font-semibold">
                  {movie.Director}
                </span>
              </div>
            </div>
            <div className="flex items-center p-3 bg-purple-50 rounded-lg border border-purple-100">
              <div className="flex items-center justify-center w-10 h-10 bg-purple-100 rounded-full mr-3">
                <IoFilmOutline size={20} className="text-purple-600" />
              </div>
              <div>
                <span className="text-sm font-medium text-purple-800 block">
                  Version
                </span>
                <span className="text-sm text-purple-600 font-semibold">
                  {Array.isArray(movie.versions) && movie.versions.length > 0
                    ? movie.versions.map((v, idx) => (
                        <span key={idx} className="inline-block mr-2">
                          {v.VersionType}
                          {v.Language ? ` - ${v.Language}` : ""}
                        </span>
                      ))
                    : "N/A"}
                </span>
              </div>
            </div>
            <div className="flex items-center p-3 bg-indigo-50 rounded-lg border border-indigo-100">
              <div className="flex items-center justify-center w-10 h-10 bg-indigo-100 rounded-full mr-3">
                <IoBookmarkOutline size={20} className="text-indigo-600" />
              </div>
              <div>
                <span className="text-sm font-medium text-indigo-800 block">
                  Genres
                </span>
                <span className="text-sm text-indigo-600 font-semibold">
                  {movie.Genres}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Synopsis</h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            {movie.ContentSynopsis}
          </p>
        </div>
      </div>
    </div>
  );
};

export default MovieTooltip;
