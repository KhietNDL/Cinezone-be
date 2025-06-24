 import api from "../API.jsx";

 const handleError = (error) => {
  console.error("API Error:", {
    status: error.response?.status,
    data: error.response?.data,
    message: error.message,
    request: error.request,
  });

  let errorMessage = error.message || "Unknown error";
  if (error.response) {
    // Try to parse response data
    if (typeof error.response.data === "string") {
      // Handle HTML or plain text responses
      if (error.response.data.includes("MulterError: Unexpected field")) {
        errorMessage =
          "Invalid file field names. Please check poster and trailer fields.";
      } else {
        errorMessage = "Server returned an unexpected response";
      }
    } else if (error.response.data?.message) {
      errorMessage = error.response.data.message;
    } else if (error.response.data?.errors) {
      // Preserve backend validation errors
      throw error.response.data; // Pass through for handleCreateMovie to process
    }
  } else if (error.request) {
    errorMessage = "No response from server";
  }

  throw new Error(errorMessage);
};


// show Current Movies
export const getCurrentMovies = async () => {
  try {
    const response = await api.get("/movie/current");
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// search movie bằng tên
export const searchMovies = async (name) => {
  try {
    const response = await api.get(
      `/movie/search?name=${encodeURIComponent(name)}`
    );
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// Lấy movie theo id
export const getMovieById = async (id) => {
  try {
    const response = await api.get(`/movie/${id}`);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// Lấy showtimes theo movieId (lấy version và ngày chiếu)
export const getShowtimesByMovieId = async (movieId) => {
  try {
    const response = await api.get(`/movie/${movieId}/showtimes`);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// Lấy showtimes theo movieId và day
export const getShowtimesByMovieAndDay = async (movieId, day) => {
  try {
    const response = await api.get(
      `/showtimes/filter?movieId=${movieId}&day=${day}`
    );
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// Lấy days theo tên phim
export const getDaysByMovieName = async (movieName) => {
  try {
    const response = await api.get(
      `/showtimes/movie-name/${encodeURIComponent(movieName)}/showtimes`
    );
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// Lấy versions & times theo tên phim và ngày
export const getVersionsAndTimesByMovieAndDay = async (movieName, day) => {
  try {
    const response = await api.get(
      `/showtimes/time/${encodeURIComponent(movieName)}/day?day=${day}`
    );
    return response.data;
  } catch (error) {
    handleError(error);
  }
};
