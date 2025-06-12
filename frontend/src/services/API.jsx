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

// Interceptor để thêm token vào header (nếu có)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // Giả sử token được lưu trong localStorage
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

// API cho Auth
export const login = async (credentials) => {
  try {
    const response = await api.post("/auth/login", credentials);
    return response.data; // Giả sử trả về { token, user }
  } catch (error) {
    handleError(error);
  }
};

export const register = async (userData) => {
  try {
    const response = await api.post("/auth/register", userData);
    return response.data; // Giả sử trả về { message, user }
  } catch (error) {
    handleError(error);
  }
};

export const logout = async () => {
  try {
    await api.post("/auth/logout");
    localStorage.removeItem("token"); // Xóa token khi logout
    return { message: "Logged out successfully" };
  } catch (error) {
    handleError(error);
  }
};

// API cho User
export const getUser = async (id) => {
  try {
    const response = await api.get(`/auth/user/${id}`);

    return response.data; // Giả sử trả về thông tin user
  } catch (error) {
    handleError(error);
  }
};

export const updateAccount = async ({ id, userData }) => {
  try {
    const response = await api.put(`/auth/user/${id}`, userData);
    return response.data; // Giả sử trả về thông tin user đã cập nhật
  } catch (error) {
    handleError(error);
  }
};

export default api;
