import React from "react";

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
  trailerPreview,
  versions,
  iframeUrl,
  posterUploadRef,
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
  setTrailerFileName,
  setTrailerPreview,
  loading,
}) => {
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[95vh] overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">
                {showEditForm ? "Edit Movie" : "Add New Movie"}
              </h2>
              <p className="text-blue-100 text-sm mt-1">
                {showEditForm
                  ? "Update the details below to edit the movie entry"
                  : "Fill in the details below to add a movie entry"}
              </p>
            </div>
            <button
              onClick={handleCloseMovieForm}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <svg
                className="w-6 h-6"
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
        <div className="p-6 overflow-y-auto max-h-[calc(95vh-170px)]">
          <div className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <svg
                  className="w-5 h-5 mr-2 text-blue-600"
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
                Movie Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Movie Name (English) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="English movie name"
                    value={nameOfEnglish}
                    onChange={(e) =>
                      handleInputChange("NameOfEnglish", e.target.value)
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <svg
                  className="w-5 h-5 mr-2 text-green-600"
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
                Screening Period
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    From Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={fromDate || ""}
                    onChange={(e) =>
                      handleInputChange("FromDate", e.target.value)
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    To Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={toDate || ""}
                    onChange={(e) =>
                      handleInputChange("ToDate", e.target.value)
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <svg
                  className="w-5 h-5 mr-2 text-purple-600"
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
                Production Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Main Actors <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Actor 1, Actor 2, Actor 3..."
                    value={actors || ""}
                    onChange={(e) =>
                      handleInputChange("Actors", e.target.value)
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Production Company <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Studio name"
                    value={productionCompany || ""}
                    onChange={(e) =>
                      handleInputChange("ProductionCompany", e.target.value)
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Director <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Director name"
                    value={director || ""}
                    onChange={(e) =>
                      handleInputChange("Director", e.target.value)
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Duration (minutes) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    placeholder="120"
                    value={runningTime || ""}
                    onChange={(e) =>
                      handleInputChange("RunningTime", e.target.value)
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>
              <div className="w-full mt-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Genres <span className="text-red-500">*</span>
                </label>
                <div className="flex flex-wrap gap-2 w-full">
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
                        className={`px-3 py-1 rounded-full border text-sm transition ${
                          selected
                            ? "bg-blue-600 text-white border-blue-600"
                            : "bg-white text-gray-700 border-gray-300 hover:bg-blue-50"
                        }`}
                      >
                        {genre}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <svg
                  className="w-5 h-5 mr-2 text-orange-600"
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
                Technical Specifications
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Version <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={versions[0]?.VersionType}
                    onChange={(e) =>
                      handleVersionChange(0, "VersionType", e.target.value)
                    }
                    className="custom-select w-full px-2 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  >
                    <option value="">Select version</option>
                    {["2D", "3D", "IMAX"]
                      .filter(
                        (v) =>
                          !versions.some(
                            (ver, idx) => ver.VersionType === v && idx !== 0
                          )
                      )
                      .map((v) => (
                        <option key={v} value={v}>
                          {v}
                        </option>
                      ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Language <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={versions[0]?.Language}
                    onChange={(e) =>
                      handleVersionChange(0, "Language", e.target.value)
                    }
                    className="custom-select w-full px-2 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  >
                    <option value="">Select language</option>
                    <option value="VN">VN</option>
                    <option value="ENG">ENG</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end mt-4">
                <button
                  onClick={addVersion}
                  disabled={versions.length >= 3}
                  className={`px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all ${
                    versions.length >= 3 ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  Add Another Version
                </button>
              </div>
              {versions.length > 1 && (
                <div className="mt-4">
                  {versions.slice(1).map((version, idx) => (
                    <div
                      key={idx}
                      className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4"
                    >
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Version
                        </label>
                        <select
                          value={version.VersionType}
                          onChange={(e) =>
                            handleVersionChange(
                              idx + 1,
                              "VersionType",
                              e.target.value
                            )
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        >
                          <option value="">Select version</option>
                          {["2D", "3D", "IMAX"]
                            .filter(
                              (v) =>
                                !versions.some(
                                  (ver, i) =>
                                    ver.VersionType === v && i !== idx + 1
                                )
                            )
                            .map((v) => (
                              <option key={v} value={v}>
                                {v}
                              </option>
                            ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Language
                        </label>
                        <select
                          value={version.Language}
                          onChange={(e) =>
                            handleVersionChange(
                              idx + 1,
                              "Language",
                              e.target.value
                            )
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        >
                          <option value="">Select language</option>
                          <option value="VN">VN</option>
                          <option value="ENG">ENG</option>
                        </select>
                      </div>
                      <div className="flex items-center justify-end">
                        <button
                          onClick={() => removeVersion(idx + 1)}
                          className="text-red-500 hover:text-red-700"
                          title="Remove version"
                        >
                          <svg
                            className="w-5 h-5"
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
                  ))}
                </div>
              )}
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Trailer Iframe URL
              </label>
              <input
                type="text"
                placeholder="YouTube embed link"
                value={iframeUrl}
                onChange={(e) => handleInputChange("IframeUrl", e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <svg
                  className="w-5 h-5 mr-2 text-red-600"
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
                Content & Media
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Movie Synopsis <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    placeholder="Enter a compelling movie description..."
                    value={contentSynopsis || ""}
                    onChange={(e) =>
                      handleInputChange("ContentSynopsis", e.target.value)
                    }
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Poster Image <span className="text-red-500">*</span>
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                    {posterPreview ? (
                      <div className="relative">
                        <img
                          src={posterPreview}
                          alt="Poster Preview"
                          className="w-full h-48 object-cover rounded-lg"
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
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 transition-colors"
                        >
                          ✕
                        </button>
                      </div>
                    ) : (
                      <div>
                        <svg
                          className="mx-auto h-12 w-12 text-gray-400 mb-4"
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
                          className="text-blue-600 hover:text-blue-800 font-semibold cursor-pointer"
                        >
                          Click to upload poster
                        </label>
                        <p className="text-xs text-gray-500 mt-2">
                          PNG, JPG up to 10MB
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <svg
                  className="w-5 h-5 mr-2 text-indigo-600"
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
                Movie Trailer
              </h3>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                {trailerPreview ? (
                  <div className="relative">
                    <video
                      src={trailerPreview}
                      controls
                      className="w-full h-48 object-cover rounded-lg"
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
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 transition-colors"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <div>
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400 mb-4"
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
                      className="text-blue-600 hover:text-blue-800 font-semibold cursor-pointer"
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
        <div className="bg-gray-50 px-6 py-4 border-slate-300 border-t flex justify-end space-x-3">
          <button
            onClick={handleCloseMovieForm}
            className="px-6 py-3 text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            disabled={loading}
            onClick={showEditForm ? handleEditMovie : handleCreateMovie}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg font-medium transition-all shadow-md hover:shadow-lg"
          >
            {showEditForm ? "Save Changes" : "Create Movie"}
          </button>
        </div>
      </div>
      {loading && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 flex flex-col items-center shadow-xl">
            <svg
              className="animate-spin h-8 w-8 text-blue-600 mb-4"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8z"
              />
            </svg>
            <div className="font-semibold text-lg text-blue-700">
              {showEditForm
                ? "Đang cập nhật phim, vui lòng chờ..."
                : "Đang thêm phim, vui lòng chờ..."}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieForm;
