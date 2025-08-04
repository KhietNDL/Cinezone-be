import React from "react";
import DatePicker from "./DatePicker";
import CustomSelect from "./CustomSelect";

const MovieForm = ({
  showEditForm,
  handleCloseMovieForm,
  nameOfVietnamese,
  nameOfEnglish,
  fromDate,
  toDate,
  actors,
  productionCompany,
  director,
  runningTime,
  genres,
  contentSynopsis,
  posterPreview,
  posterHorizontalPreview,
  trailerPreview,
  versions,
  iframeUrl,
  posterUploadRef,
  posterHorizontalUploadRef,
  trailerUploadRef,
  handleInputChange,
  handleVersionChange,
  addVersion,
  removeVersion,
  handleFileChange,
  handleCreateMovie,
  handleEditMovie,
  setPosterFileName,
  setPosterPreview,
  setPosterHorizontalFileName,
  setPosterHorizontalPreview,
  setTrailerFileName,
  setTrailerPreview,
  loading,
}) => {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[95vh] overflow-hidden border border-gray-100">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-4 sm:px-6 py-3 sm:py-4 text-white rounded-t-xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold">
                {showEditForm ? "Edit Movie" : "Add New Movie"}
              </h2>
              <p className="text-purple-100 text-xs sm:text-sm mt-1">
                {showEditForm
                  ? "Update the details below to edit the movie entry"
                  : "Fill in the details below to add a movie entry"}
              </p>
            </div>
            <button
              onClick={handleCloseMovieForm}
              className="p-2 hover:bg-purple-700 rounded-xl transition-all duration-200 hover:scale-110"
              aria-label="Close modal"
            >
              <svg
                className="w-5 sm:w-6 h-5 sm:h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 overflow-y-auto max-h-[calc(95vh-170px)]">
          <div className="space-y-4 sm:space-y-6">
            {/* Movie Information Section */}
            <div className="bg-gradient-to-br from-purple-50 to-indigo-50 p-4 sm:p-5 rounded-xl border border-purple-100">
              <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4 flex items-center">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-purple-700 rounded-lg flex items-center justify-center mr-3">
                  <svg
                    className="w-4 sm:w-5 h-4 sm:h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2h4a1 1 0 110 2h-1v12a2 2 0 01-2 2H6a2 2 0 01-2-2V6H3a1 1 0 110-2h4z"
                    />
                  </svg>
                </div>
                Movie Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                    Movie Name (Vietnamese){" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Tên phim tiếng Việt"
                    value={nameOfVietnamese}
                    onChange={(e) =>
                      handleInputChange("NameOfVietnamese", e.target.value)
                    }
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 hover:border-gray-300 shadow-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                    Movie Name (English) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="English movie name"
                    value={nameOfEnglish}
                    onChange={(e) =>
                      handleInputChange("NameOfEnglish", e.target.value)
                    }
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 hover:border-gray-300 shadow-sm"
                  />
                </div>
              </div>
            </div>

            {/* Screening Period Section */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 sm:p-5 rounded-xl border border-green-100">
              <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4 flex items-center">
                <div className="w-8 h-8 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg flex items-center justify-center mr-3">
                  <svg
                    className="w-4 sm:w-5 h-4 sm:h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                Screening Period
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <DatePicker
                    label="From Date"
                    value={fromDate}
                    onChange={(value) => handleInputChange("FromDate", value)}
                    placeholder="Select screening start date"
                    required
                  />
                </div>
                <div>
                  <DatePicker
                    label="To Date"
                    value={toDate}
                    onChange={(value) => handleInputChange("ToDate", value)}
                    placeholder="Select screening end date"
                    required
                    minDate={fromDate}
                  />
                </div>
              </div>
            </div>

            {/* Production Details Section */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 sm:p-5 rounded-xl border border-blue-100">
              <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4 flex items-center">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center mr-3">
                  <svg
                    className="w-4 sm:w-5 h-4 sm:h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
                Production Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                    Main Actors <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Actor 1, Actor 2, Actor 3..."
                    value={actors || ""}
                    onChange={(e) =>
                      handleInputChange("Actors", e.target.value)
                    }
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 hover:border-gray-300 shadow-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                    Production Company <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Studio name"
                    value={productionCompany || ""}
                    onChange={(e) =>
                      handleInputChange("ProductionCompany", e.target.value)
                    }
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 hover:border-gray-300 shadow-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                    Director <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Director name"
                    value={director || ""}
                    onChange={(e) =>
                      handleInputChange("Director", e.target.value)
                    }
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 hover:border-gray-300 shadow-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                    Duration (minutes) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    placeholder="120"
                    value={runningTime || ""}
                    onChange={(e) =>
                      handleInputChange("RunningTime", e.target.value)
                    }
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 hover:border-gray-300 shadow-sm"
                  />
                </div>
              </div>
              <div className="w-full mt-3 sm:mt-4">
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                  Genres <span className="text-red-500">*</span>
                </label>
                <div className="flex flex-wrap gap-1.5 sm:gap-2 w-full">
                  {[
                    "Action",
                    "Adventure",
                    "Animation",
                    "Comedy",
                    "Crime",
                    "Drama",
                    "Fantasy",
                    "Horror",
                    "Mystery",
                    "Romance",
                    "Sci-Fi",
                    "Thriller",
                    "War",
                    "Western",
                  ].map((genre) => {
                    const selected = genres.split(",").includes(genre);
                    return (
                      <button
                        type="button"
                        key={genre}
                        onClick={() => {
                          let arr = genres ? genres.split(",") : [];
                          if (selected) arr = arr.filter((g) => g !== genre);
                          else arr.push(genre);
                          handleInputChange("Genres", arr.join(","));
                        }}
                        className={`px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl border text-xs sm:text-sm font-medium transition-all duration-200 ${
                          selected
                            ? "bg-purple-600 text-white border-purple-600 shadow-md"
                            : "bg-white text-gray-700 border-gray-200 hover:bg-purple-50 hover:border-purple-300"
                        }`}
                      >
                        {genre}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Technical Specifications Section */}
            <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-4 sm:p-5 rounded-xl border border-orange-100">
              <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4 flex items-center">
                <div className="w-8 h-8 bg-gradient-to-r from-orange-600 to-amber-600 rounded-lg flex items-center justify-center mr-3">
                  <svg
                    className="w-4 sm:w-5 h-4 sm:h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                Technical Specifications
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <CustomSelect
                    label="Version"
                    value={versions[0]?.VersionType || ""}
                    onChange={(value) =>
                      handleVersionChange(0, "VersionType", value)
                    }
                    placeholder="Select version"
                    required
                    options={["2D", "3D", "IMAX"]
                      .filter(
                        (v) =>
                          !versions.some(
                            (ver, idx) => ver.VersionType === v && idx !== 0
                          )
                      )
                      .map((v) => ({
                        value: v,
                        label: v,
                      }))}
                  />
                </div>
                <div>
                  <CustomSelect
                    label="Language"
                    value={versions[0]?.Language || ""}
                    onChange={(value) =>
                      handleVersionChange(0, "Language", value)
                    }
                    placeholder="Select language"
                    required
                    options={[
                      { value: "VN", label: "VN" },
                      { value: "ENG", label: "ENG" },
                    ]}
                  />
                </div>
              </div>
              <div className="flex justify-end mt-3 sm:mt-4">
                <button
                  onClick={addVersion}
                  disabled={versions.length >= 3}
                  className={`px-3 sm:px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl font-medium text-sm hover:from-purple-700 hover:to-purple-800 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 ${
                    versions.length >= 3 ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  Add Another Version
                </button>
              </div>
              {versions.length > 1 && (
                <div className="mt-3 sm:mt-4">
                  {versions.slice(1).map((version, idx) => (
                    <div
                      key={idx}
                      className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 mb-3 sm:mb-4 p-3 bg-white/50 rounded-lg border border-orange-200"
                    >
                      <div>
                        <CustomSelect
                          label="Version"
                          value={version.VersionType || ""}
                          onChange={(value) =>
                            handleVersionChange(idx + 1, "VersionType", value)
                          }
                          placeholder="Select version"
                          options={["2D", "3D", "IMAX"]
                            .filter(
                              (v) =>
                                !versions.some(
                                  (ver, i) =>
                                    ver.VersionType === v && i !== idx + 1
                                )
                            )
                            .map((v) => ({
                              value: v,
                              label: v,
                            }))}
                        />
                      </div>
                      <div>
                        <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                          Language
                        </label>
                        <div className="flex gap-2">
                          <div className="flex-1">
                            <CustomSelect
                              value={version.Language || ""}
                              onChange={(value) =>
                                handleVersionChange(idx + 1, "Language", value)
                              }
                              placeholder="Select language"
                              options={[
                                { value: "VN", label: "VN" },
                                { value: "ENG", label: "ENG" },
                              ]}
                            />
                          </div>
                          <button
                            onClick={() => removeVersion(idx + 1)}
                            className="p-2.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-xl transition-all duration-200"
                            title="Remove version"
                          >
                            <svg
                              className="w-4 sm:w-5 h-4 sm:h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Trailer Iframe URL Section */}
            <div className="bg-gradient-to-br from-cyan-50 to-blue-50 p-4 sm:p-5 rounded-xl border border-cyan-100">
              <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4 flex items-center">
                <div className="w-8 h-8 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-lg flex items-center justify-center mr-3">
                  <svg
                    className="w-4 sm:w-5 h-4 sm:h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                Trailer Information
              </h3>
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                  Trailer Iframe URL
                </label>
                <input
                  type="text"
                  placeholder="YouTube embed link"
                  value={iframeUrl}
                  onChange={(e) =>
                    handleInputChange("IframeUrl", e.target.value)
                  }
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 hover:border-gray-300 shadow-sm"
                />
              </div>
            </div>
            {/* Content & Media Section */}
            <div className="bg-gradient-to-br from-red-50 to-pink-50 p-4 sm:p-5 rounded-xl border border-red-100">
              <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4 flex items-center">
                <div className="w-8 h-8 bg-gradient-to-r from-red-600 to-pink-600 rounded-lg flex items-center justify-center mr-3">
                  <svg
                    className="w-4 sm:w-5 h-4 sm:h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                Content & Media
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                    Movie Synopsis <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    placeholder="Enter a compelling movie description..."
                    value={contentSynopsis || ""}
                    onChange={(e) =>
                      handleInputChange("ContentSynopsis", e.target.value)
                    }
                    rows={6}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 resize-none transition-all duration-200 hover:border-gray-300 shadow-sm"
                  />
                </div>
                <div className="space-y-4 sm:space-y-6">
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                      Poster Image (Vertical){" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <div className="border-2 border-dashed border-gray-200 rounded-xl p-3 sm:p-4 text-center hover:border-purple-400 transition-colors bg-white/50">
                      {posterPreview ? (
                        <div className="relative">
                          <img
                            src={posterPreview}
                            alt="Poster Preview"
                            className="w-full h-24 sm:h-32 object-cover rounded-lg"
                          />
                          <button
                            onClick={() => {
                              handleFileChange("PosterImage", {
                                target: { files: [] },
                              });
                              setPosterFileName("");
                              setPosterPreview(null);
                              if (posterUploadRef.current)
                                posterUploadRef.current.value = "";
                            }}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 sm:w-6 h-5 sm:h-6 flex items-center justify-center hover:bg-red-600 transition-colors text-xs"
                          >
                            ✕
                          </button>
                        </div>
                      ) : (
                        <div>
                          <svg
                            className="mx-auto h-6 sm:h-8 w-6 sm:w-8 text-gray-400 mb-2"
                            stroke="currentColor"
                            fill="none"
                            viewBox="0 0 48 48"
                          >
                            <path
                              d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                              strokeWidth={2}
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                          <input
                            type="file"
                            accept="image/png, image/jpeg"
                            onChange={(e) => handleFileChange("PosterImage", e)}
                            className="hidden"
                            id="posterUpload"
                            ref={posterUploadRef}
                          />
                          <label
                            htmlFor="posterUpload"
                            className="text-purple-600 hover:text-purple-800 font-semibold cursor-pointer text-xs sm:text-sm"
                          >
                            Upload vertical poster
                          </label>
                          <p className="text-xs text-gray-500 mt-1">
                            PNG, JPG up to 10MB
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                      Poster Image (Horizontal){" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <div className="border-2 border-dashed border-gray-200 rounded-xl p-3 sm:p-4 text-center hover:border-purple-400 transition-colors bg-white/50">
                      {posterHorizontalPreview ? (
                        <div className="relative">
                          <img
                            src={posterHorizontalPreview}
                            alt="Horizontal Poster Preview"
                            className="w-full h-20 sm:h-24 object-cover rounded-lg"
                          />
                          <button
                            onClick={() => {
                              handleFileChange("PosterImageHorizontal", {
                                target: { files: [] },
                              });
                              setPosterHorizontalFileName("");
                              setPosterHorizontalPreview(null);
                              if (posterHorizontalUploadRef.current)
                                posterHorizontalUploadRef.current.value = "";
                            }}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 sm:w-6 h-5 sm:h-6 flex items-center justify-center hover:bg-red-600 transition-colors text-xs"
                          >
                            ✕
                          </button>
                        </div>
                      ) : (
                        <div>
                          <svg
                            className="mx-auto h-6 sm:h-8 w-6 sm:w-8 text-gray-400 mb-2"
                            stroke="currentColor"
                            fill="none"
                            viewBox="0 0 48 48"
                          >
                            <path
                              d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                              strokeWidth={2}
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                          <input
                            type="file"
                            accept="image/png, image/jpeg"
                            onChange={(e) =>
                              handleFileChange("PosterImageHorizontal", e)
                            }
                            className="hidden"
                            id="posterHorizontalUpload"
                            ref={posterHorizontalUploadRef}
                          />
                          <label
                            htmlFor="posterHorizontalUpload"
                            className="text-purple-600 hover:text-purple-800 font-semibold cursor-pointer text-xs sm:text-sm"
                          >
                            Upload horizontal poster
                          </label>
                          <p className="text-xs text-gray-500 mt-1">
                            PNG, JPG up to 10MB
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Movie Trailer Section */}
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-4 sm:p-5 rounded-xl border border-indigo-100">
              <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4 flex items-center">
                <div className="w-8 h-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center mr-3">
                  <svg
                    className="w-4 sm:w-5 h-4 sm:h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                Movie Trailer
              </h3>
              <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 sm:p-6 text-center hover:border-purple-400 transition-colors bg-white/50">
                {trailerPreview ? (
                  <div className="relative">
                    <video
                      src={trailerPreview}
                      controls
                      className="w-full h-36 sm:h-48 object-cover rounded-lg"
                    />
                    <button
                      onClick={() => {
                        handleFileChange("TrailerUrl", {
                          target: { files: [] },
                        });
                        setTrailerFileName("");
                        setTrailerPreview(null);
                        if (trailerUploadRef.current)
                          trailerUploadRef.current.value = "";
                      }}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 sm:w-8 h-6 sm:h-8 flex items-center justify-center hover:bg-red-600 transition-colors"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <div>
                    <svg
                      className="mx-auto h-8 sm:h-12 w-8 sm:w-12 text-gray-400 mb-3 sm:mb-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    </svg>
                    <input
                      type="file"
                      accept="video/*"
                      onChange={(e) => handleFileChange("TrailerUrl", e)}
                      className="hidden"
                      id="trailerUpload"
                      ref={trailerUploadRef}
                    />
                    <label
                      htmlFor="trailerUpload"
                      className="text-purple-600 hover:text-purple-800 font-semibold cursor-pointer text-sm sm:text-base"
                    >
                      Click to upload trailer
                    </label>
                    <p className="text-xs text-gray-500 mt-2">
                      Video files up to 50MB
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gradient-to-r from-gray-50 to-slate-50 px-4 sm:px-6 py-3 sm:py-4 border-t border-gray-200 rounded-b-xl flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3">
          <button
            onClick={handleCloseMovieForm}
            className="px-4 sm:px-6 py-2.5 sm:py-3 text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 hover:border-gray-400 rounded-xl font-medium text-sm transition-all duration-200 shadow-sm hover:shadow-md"
          >
            Cancel
          </button>
          <button
            disabled={loading}
            onClick={showEditForm ? handleEditMovie : handleCreateMovie}
            className="px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white rounded-xl font-medium text-sm transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {loading ? (
              <div className="flex items-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                {showEditForm ? "Saving..." : "Creating..."}
              </div>
            ) : showEditForm ? (
              "Save Changes"
            ) : (
              "Create Movie"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MovieForm;
