// src/services/API.jsx
import axios from "axios";

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

export const getAllUsers = async (params) => {
  try {
    const response = await api.get("/user", { params });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};
export const createUser = async (formData) => {
  try {
    const response = await api.post("/user/create", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const editUser = async (userId, formData) => {
  try {
    const response = await api.put(`/user/update/${userId}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};
export const deleteUser = async (userId) => {
  try {
    const response = await api.delete(`/user/delete/${userId}`);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const unbanUser = async (userId) => {
  try {
    const response = await api.post(`/user/unban/${userId}`);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const searchUserByInfo = async (searchInfo, params = {}) => {
  try {
    const response = await api.get("/user/search/info", {
      params: {
        ...searchInfo, // { email, cccd, phone, name }
        ...params, // { page, limit, sortBy, sortOrder }
      },
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const getUserAgeGroups = async () => {
  try {
    const response = await api.get("/analytics/user/age-groups");
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const getUsersByMembershipRank = async () => {
  try {
    const response = await api.get("/analytics/users/ranks");
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const getEmployeeAgeGroups = async () => {
  try {
    const response = await api.get("/analytics/user/age-groups-employees");
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const getEmployeeTenureStats = async () => {
  try {
    const response = await api.get("/analytics/employees/tenure");
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const getMovieGenreStats = async () => {
  try {
    const response = await api.get("/analytics/movies/genres");
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const getBookingStatusStats = async () => {
  try {
    const response = await api.get("/analytics/bookings/status");
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const getBookingPaymentMethodStats = async () => {
  try {
    const response = await api.get("/analytics/bookings/payment-methods");
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const getTopMoviesByTickets = async (limit = 10) => {
  try {
    const response = await api.get(
      `/analytics/movies/top-by-tickets?limit=${limit}`
    );
    return response.data;
  } catch (error) {
    handleError(error);
  }
};
