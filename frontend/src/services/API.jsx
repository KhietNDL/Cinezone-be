// src/services/API.jsx
import axios from "axios";
import SessionManager from "../utils/sessionManager";

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
export const forgot = async (credentials) => {
  try {
    const response = await api.post("/auth/forgot-password", credentials);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};
export const verification = async (credentials) => {
  try {
    const response = await api.post("/auth/verify-otp", credentials);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};
export const resetPassword = async (credentials) => {
  try {
    const response = await api.post("/auth/reset-password", credentials);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};
// Trong file API service
// API cho reset password - đã fix
// export const resetPassword = async (credentials) => {
//   try {
//     const response = await api.post("/auth/reset-password", credentials, {
//       withCredentials: true, // Quan trọng: gửi cookies/session
//       headers: {
//         "Content-Type": "application/json",
//       },
//     });
//     return response.data;
//   } catch (error) {
//     handleError(error);
//   }
// };

// API cho User
export const getUser = async (id) => {
  try {
    const response = await api.get(`/auth/user/${id}`);

    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const updateAccount = async (id, formData) => {
  try {
    console.log("User ID:", id);
    console.log("FormData content:");

    // Debug FormData contents
    for (let [key, value] of formData.entries()) {
      if (key === "avatar" && value instanceof File) {
        console.log(
          `${key}:`,
          `File - ${value.name} (${value.size} bytes, ${value.type})`
        );
      } else {
        console.log(`${key}:`, value);
      }
    }

    const response = await api.put(`/auth/profile/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      timeout: 30000, // 30 second timeout for file uploads
    });

    console.log("API Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("updateAccount API Error:", error);

    // More detailed error handling
    if (error.response) {
      console.error("Error Response Status:", error.response.status);
      console.error("Error Response Data:", error.response.data);
      console.error("Error Response Headers:", error.response.headers);

      // Check if it's a server error with specific code
      if (error.response.data?.code) {
        const serverError = new Error(
          error.response.data.error || error.response.data.message
        );
        serverError.code = error.response.data.code;
        throw serverError;
      }
    } else if (error.request) {
      console.error("No response received:", error.request);
      throw new Error("No response from server. Please check your connection.");
    } else {
      console.error("Request setup error:", error.message);
      throw new Error("Failed to setup request: " + error.message);
    }

    // Re-throw the original error if no specific handling
    throw error;
  }
};
// API Promotion
export const getPromotion = async () => {
  try {
    const response = await api.get("/promotions/getAll");
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
  try {
    const movieId = movieData.get("MovieId");
    if (!movieId) {
      throw new Error("MovieId is required");
    }
    const response = await api.put(`/movie/${movieId}`, movieData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const deleteMovie = async (movieId) => {
  try {
    if (!movieId) {
      throw new Error("Movie ID is undefined");
    }
    const response = await api.delete(`/movie/${movieId}`);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const searchMovies = async (params) => {
  return api.get("/movie/search", { params });
};

export const getEmployee = async () => {
  try {
    const response = await api.get("/employee");
    return response.data;
  } catch (error) {
    handleError(error);
  }
};
export const createEmployee = async (employeeData) => {
  try {
    const response = await api.post("/employee/create", employeeData, {
      headers: {
        "Content-Type": "application/json", // Explicitly set to JSON
      },
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};
export const deleteEmployee = async (userId) => {
  try {
    const response = await api.delete(`/employee/delete/${userId}`);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const updateEmployee = async (employeeId, employeeData) => {
  try {
    if (!employeeId) {
      throw new Error("EmployeeId is required");
    }

    const response = await api.put(
      `/employee/update/${employeeId}`,
      employeeData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    // console.error("API Error:", error.response?.data || error.message); // Log detailed error
    handleError(error);
    throw error; // Propagate error to caller for better handling
  }
};
export const searchEmployees = async (name) => {
  try {
    if (!name || typeof name !== "string" || name.trim() === "") {
      throw new Error("Name is required and must be a non-empty string");
    }
    const response = await api.get(`/employee/searchByName`, {
      params: { name: name.trim() },
    });
    return response.data;
  } catch (error) {
    handleError(error);
    throw error;
  }
};
export default api;

//API cho Booking FLow

export const getShowtimeByMovieName = async (movieName) => {
  try {
    const response = await api.get(`/showtimes/movie-name/${movieName}/showtimes`);
    console.log(response.data)
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy showtime theo movieId:", error);
    throw error;
  }
};

export const getTimeByDay = async (movieName, day) => {
  try {
    const response = await api.get(`/showtimes/time/${movieName}/day`, {
      params: {
        movieName: movieName,
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
