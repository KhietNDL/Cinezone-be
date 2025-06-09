import React from "react";
import { FaUpload } from "react-icons/fa";

const MovieForm = ({
  isEdit = false,
  onClose,
  handleInputChange,
  formData,
  handleTypeChange,
  handleScheduleChange,
  handleSave,
}) => {
  return (
    <div className="fixed inset-0 bg-black/30 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-[600px] max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              {isEdit ? "Edit Movie" : "Add New Movie"}
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              Fill in the details below to add a new movie entry.
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="space-y-4">
          {/* Movie Names Row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Movie name (ENG) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Enter movie name in English"
                value={formData.movieNameEn}
                onChange={(e) =>
                  handleInputChange("movieNameEn", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Movie name (VN) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Enter movie name in Vietnamese"
                value={formData.movieNameVn}
                onChange={(e) =>
                  handleInputChange("movieNameVn", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Dates Row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                From date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={formData.fromDate}
                onChange={(e) => handleInputChange("fromDate", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                To date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={formData.toDate}
                onChange={(e) => handleInputChange("toDate", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Actor and Production Company Row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Actor <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Enter main actors"
                value={formData.actor}
                onChange={(e) => handleInputChange("actor", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Movie Production Company <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Enter production company"
                value={formData.productionCompany}
                onChange={(e) =>
                  handleInputChange("productionCompany", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Director and Duration Row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Director <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Enter director"
                value={formData.director}
                onChange={(e) => handleInputChange("director", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Duration (minutes) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                placeholder="e.g. 120"
                value={formData.duration}
                onChange={(e) => handleInputChange("duration", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Version and Type Row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Version <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.version}
                onChange={(e) => handleInputChange("version", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="2D">2D</option>
                <option value="3D">3D</option>
                <option value="IMAX">IMAX</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Type <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-2 mt-1">
                {[
                  "Action",
                  "Comedy",
                  "Horror",
                  "Sci-fi",
                  "Romance",
                  "Animation",
                ].map((type) => (
                  <label key={type} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.type.includes(type)}
                      onChange={() => handleTypeChange(type)}
                      className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="text-sm text-gray-700">{type}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Cinema Room and Schedule Row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cinema room <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.cinemaRoom}
                onChange={(e) =>
                  handleInputChange("cinemaRoom", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select room</option>
                <option value="Room 1">Room 1</option>
                <option value="Room 2">Room 2</option>
                <option value="Room 3">Room 3</option>
                <option value="Room 4">Room 4</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Schedule <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-3 gap-2 mt-1">
                {[
                  "08:00",
                  "09:00",
                  "11:00",
                  "13:30",
                  "15:00",
                  "17:00",
                  "18:30",
                  "19:00",
                  "21:00",
                ].map((time) => (
                  <label key={time} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.schedule.includes(time)}
                      onChange={() => handleScheduleChange(time)}
                      className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="text-sm text-gray-700">{time}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Content and Image Row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Content <span className="text-red-500">*</span>
              </label>
              <textarea
                placeholder="Enter movie synopsis or description"
                value={formData.content}
                onChange={(e) => handleInputChange("content", e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Image <span className="text-red-500">*</span>
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center">
                <FaUpload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                <button
                  type="button"
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  Upload image
                </button>
                <p className="text-xs text-gray-500 mt-1">
                  PNG, JPG up to 10MB
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="flex justify-end space-x-3 mt-6 pt-4 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md font-medium"
          >
            Back
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default MovieForm;
