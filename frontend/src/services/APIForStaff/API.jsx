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
    console.log("Token gửi lên:", token);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Xử lý lỗi chung
const handleError = (error) => {
  if (error.response) {
    // Lỗi từ server (4xx, 5xx)
    throw new Error(error.response.data.message || "Something went wrong");
  } else if (error.request) {
    // Không nhận được phản hồi
    throw new Error("No response from server");
  } else {
    // Lỗi khác
    throw new Error(error.message);
  }
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
    const response = await api.get(`/movie/search?name=${encodeURIComponent(name)}`);
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