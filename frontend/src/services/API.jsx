// src/services/API.jsx
import axios from "axios";

// Lấy baseURL từ biến môi trường .env
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Tạo instance của Axios với cấu hình mặc định
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

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

// API cho Auth
export const login = async (credentials) => {
  try {
    const response = await api.post("/auth/login", credentials);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const register = async (userData) => {
  try {
    const response = await api.post("/auth/register", userData);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const logout = async () => {
  try {
    await api.post("/auth/logout");
    localStorage.removeItem("token");
    return { message: "Logged out successfully" };
  } catch (error) {
    handleError(error);
  }
};

// API cho User
export const getUser = async (id) => {
  try {
    const response = await api.get(`/auth/user/${id}`);

    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const updateAccount = async (updateData) => {
  try {
    console.log("Update data:", updateData);
    const { id, ...userData } = updateData;
    console.log("id:", id);
    console.log("userData:", userData);
    const response = await api.put(`/auth/profile/${id}`, userData);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// API cho Movie

export const getMovies = async () => {
  try {
    const response = await api.get("/movie");
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const getCurrentMovies = async (params) => {
  try {
    const response = await api.get("/movie/current", { params });

    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const getUpcomingMovies = async (params) => {
  try {
    const response = await api.get("/movie/upcoming", { params });

    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const createMovie = async (movieData) => {
  try {
    const response = await api.post("/movie/create", movieData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    console.log("createMovie response:", response.data);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const editMovie = async (movieData) => {
  const formData = new FormData();
  Object.keys(movieData).forEach((key) => {
    formData.append(key, movieData[key] ?? "");
  });
  try {
    const response = await api.put(`/movie/${movieData.idMovie}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export default api;



//API cho Booking FLow

export const getShowtimeByMovieId = async (movieId) => {
  try {
    const response = await api.get(`/movie/${movieId}/showtimes`);
    console.log(response.data)
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy showtime theo movieId:", error);
    throw error;
  }
};

export const getTimeByDay = async (movieId, day) => {
  try {
    const response = await api.get(`/showtimes/filter`, {
      params: {
        movieId: movieId,
        day: day,
      },
    });

    console.log(response.data)
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy showtime theo movieId va Day:", error);
    throw error;
  }
};