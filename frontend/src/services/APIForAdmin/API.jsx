// src/services/API.jsx
import axios from "axios";
import { toast } from "react-toastify";

// Lấy baseURL từ biến môi trường .env
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Tạo instance của Axios với cấu hình mặc định
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
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

export const getUserAdmin = async () => {
  try {
    const response = await api.get("/user");
    return response.data;
  } catch (error) {
    handleError(error);
  }
};
export const createUserAdmin = async (user) => {
  try {
    const response = await api.post("user/create", user);
    return response.data;
  } catch (error) {
    toast.error(error.response.data);
  }
};

export const updateUserAdmin = async ({ userId, user }) => {
  try {
    const response = await api.put(`user/update/${userId}`, user);
    return response.data;
  } catch (error) {
    toast.error(error.response.data);
  }
};
export const deleteUserAdmin = async (userId) => {
  try {
    const response = await api.delete(`user/delete/${userId}`);
    return response.data;
  } catch (error) {
    toast.error(error.response.data);
    return null;
  }
};
