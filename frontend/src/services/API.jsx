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
    const response = await api.post("/api/auth/logout");
    return response.data;
  } catch (error) {
    handleError(error);
  }
};
export const forgot = async (credentials) => {
  try {
    // Defensive check: Ensure the body is an object with an email key.
    const body =
      typeof credentials === "string" ? { email: credentials } : credentials;
    const response = await api.post("/auth/forgot-password", body);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};
export const verification = async (credentials) => {
  try {
    const response = await api.post("/auth/verify-otp", credentials, {
      withCredentials: true,
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const resetPassword = async (credentials) => {
  try {
    const response = await api.post("/auth/reset-password", credentials, {
      withCredentials: true, // Quan trọng: gửi cookies/session
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
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

export const updateAccount = async (id, formData) => {
  try {
    const response = await api.put(`/auth/profile/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      timeout: 30000,
    });
    return response.data;
  } catch (error) {
    console.error("updateAccount API Error:", error);
  }
};
// API Promotion
export const getPromotion = async (params) => {
  try {
    const response = await api.get("/promotions/getAll", { params });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const createPromotion = async (formData) => {
  try {
    const response = await api.post("/promotions/create", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};
export const deletePromotion = async (id) => {
  try {
    const response = await api.delete(`/promotions/delete/${id}`);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};
export const updatePromotion = async (id, formData) => {
  try {
    const response = await api.put(`/promotions/update/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};
export const searchPromotion = async (title) => {
  try {
    const response = await api.get("/promotions/search", {
      params: { title },
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};
// API cho Movie

export const getMovies = async (params) => {
  try {
    const response = await api.get("/movie", { params });
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

// API cho Employee

export const getEmployee = async (params) => {
  try {
    const response = await api.get("/employee", { params });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};
export const createEmployee = async (employeeData) => {
  try {
    const response = await api.post("/employee/create", employeeData, {
      headers: {
        "Content-Type": "multipart/form-data",
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
export const updateEmployee = async (userId, employeeData) => {
  try {
    const response = await api.put(`/employee/update/${userId}`, employeeData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    handleError(error);
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

//API cho RoomManagement
export const createCinemaRoom = async (roomData) => {
  try {
    const response = await api.post("/cinema-rooms/create", roomData);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};
export const getCinemaRooms = async (params) => {
  try {
    const response = await api.get("/cinema-rooms", { params });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};
export const searchCinemaRooms = async (name) => {
  try {
    const response = await api.get("/cinema-rooms/search", {
      params: { name },
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};
export const updateCinemaRoom = async (id, roomData) => {
  try {
    const response = await api.put(`/cinema-rooms/update/${id}`, roomData);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};
export const deleteCinemaRoom = async (id) => {
  try {
    const response = await api.delete(`/cinema-rooms/delete/${id}`);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};
//API cho Booking FLow

export const getShowtimeByMovieId = async (movieId) => {
  try {
    const response = await api.get(`/showtimes/movie/${movieId}/day`);

    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy showtime theo movieId:", error);
    throw error;
  }
};

export const getTimeByDay = async (movieId, day) => {
  try {
    const response = await api.get(
      `/showtimes/movie/${movieId}/day/showtimes`,
      {
        params: {
          movieId: movieId,
          day: day,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy showtime theo movieId va Day:", error);
    throw error;
  }
};

export const getSeatsByShowtimeId = async (showtimeId) => {
  try {
    const response = await api.get(`/showtimes/${showtimeId}/seats`);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy seats theo showtimeID:", error);
    throw error;
  }
};

export const HoldingSeats = async (
  userId,
  showtimeId,
  seatIds,
  productIds,
  promotionCode,
  PointsToUse
) => {
  try {
    const response = await api.post("/bookings/hold", {
      userId: userId,
      showtimeId: showtimeId,
      seatIds: seatIds,
      productIds: productIds || [],
      promotionCode: promotionCode || "",
      PointsToUse: PointsToUse,
    });
    console.log("HoldingSeats Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi HodingSeats :", error);
    handleError(error);
    throw error;
  }
};

export const getAllMethodsPayment = async () => {
  try {
    const response = await api.get("/payment/methods");
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy phương thức thanh toán:", error);
    handleError(error);
    throw error;
  }
};

export const createMomoPayment = async (data) => {
  const res = await api.post("/payment/momo", data);
  return res.data;
};

export const createVnpayPayment = async (data) => {
  const res = await api.post("/payment/vnpay", data);
  return res.data;
};

export const createZalopayPayment = async (data) => {
  const res = await api.post("/payment/zalopay", data);
  return res.data;
};

export const getPromotionByTitle = async (code) => {
  try {
    const response = await api.get("/promotions/search", {
      params: { code },
    });
    return response.data;
  } catch (error) {
    console.error("Lỗi khi tìm kiếm khuyến mãi:", error);
    handleError(error);
    throw error;
  }
};

export const ConfirmBooking = async (bookingId) => {
  try {
    const response = await api.post(`/bookings/confirm/${bookingId}`);
    console.log("Confirm Booking Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi Confirm Booking :", error);
    handleError(error);
    throw error;
  }
};
export const getAllBookings = async (params = {}) => {
  try {
    const response = await api.get("/bookings", { params });
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy tất cả booking:", error);
    handleError(error);
    throw error;
  }
};
export const getBookingInfoById = async (bookingId) => {
  try {
    const response = await api.get(`/bookings/${bookingId}`);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy booking theo ID:", error);
    handleError(error);
    throw error;
  }
};
export const getBookingById = async (bookingId) => {
  try {
    const response = await api.get(`/bookings/detail/${bookingId}`);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy thông tin đặt vé:", error);
    handleError(error);
    throw error;
  }
};
export const searchBookingsByUser = async (searchTerm) => {
  try {
    const response = await api.get("/bookings/search/user", {
      params: {
        [searchTerm.includes("@")
          ? "email"
          : searchTerm.length === 12
          ? "cccd"
          : "phone"]: searchTerm,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Lỗi khi tìm kiếm booking theo người dùng:", error);
    handleError(error);
    throw error;
  }
};
export const cancelBooking = async (bookingId) => {
  try {
    const response = await api.post(`/bookings/cancel/${bookingId}`);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi huỷ đặt vé:", error);
    handleError(error);
    throw error;
  }
};

export const getBookingHistory = async (memberId) => {
  try {
    const response = await api.get(`/bookings/member/${memberId}`);
    console.log("Booking History:", response.data);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy lịch sử đặt vé:", error);
    handleError(error);
    throw error;
  }
};

export const getAllProducts = async (params) => {
  try {
    const response = await api.get("/products", { params });
    return response.data;
    console.log("DATA PRODCUT",response.data)
  } catch (error) {
    console.error("Lỗi khi lấy danh sách sản phẩm owr API:", error);
    handleError(error);
    throw error;
  }
};

export const createProduct = async (productData) => {
  try {
    const response = await api.post("/products/create", productData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Lỗi khi tạo sản phẩm:", error);
    handleError(error);
    throw error;
  }
};

export const updateProduct = async (productId, productData) => {
  try {
    const response = await api.put(`/products/${productId}`, productData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Lỗi khi cập nhật sản phẩm:", error);
    handleError(error);
    throw error;
  }
};

export const deleteProduct = async (productId) => {
  try {
    const response = await api.delete(`/products/${productId}`);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi xóa sản phẩm:", error);
    handleError(error);
    throw error;
  }
};

export const holdProducts = async (memberId, products, notes = "") => {
  try {
    const response = await api.post("/order-products/hold", {
      MemberId: memberId,
      products: products,
      Notes: notes,
    });

    return response.data;
  } catch (error) {
    console.error(
      "❌ Lỗi gọi holdOrderProducts:",
      error?.response?.data || error.message
    );
    throw error;
  }
};

export const confirmProduct = async (id) => {
  try {
    const response = await api.post(`/order-products/confirm/${id}`);
    console.log("confirm product:", response.data);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi confirm product:", error);
    handleError(error);
    throw error;
  }
};

export const getProductByOderProductId = async (orderProductId) => {
  try {
    const response = await api.get(`/order-products/${orderProductId}/detail`);
    return response.data.data.products;
  } catch (error) {
    console.error("Lỗi khi lấy thông tin product đã thanh toán", error);
    handleError(error);
    throw error;
  }
};

export const cancelProduct = async (id) => {
  try {
    const response = await api.post(`/order-products/cancel/${id}`);
    console.log("cancal product:", response.data);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi cancel product:", error);
    handleError(error);
    throw error;
  }
};

export const createShowtime = async (showtimeData) => {
  try {
    const response = await api.post("/showtimes/create", showtimeData, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const getScoreHistoryByMemberId = async (MemberId) => {
  try {
    const response = await api.get(`/scorehistory/member/${MemberId}`);
    return response.data.scoreHistory;
  } catch (error) {
    handleError(error);
  }
};



// API Analytics
export const getRevenueByMonth = async (year) => {
  try {
    const response = await api.get("/analytics/revenue/month", {
      params: { year },
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};



export const getRevenueByQuarter = async (year) => {
  try {
    const response = await api.get("/analytics/revenue/quarter", {
      params: { year },
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const getRevenueThisMonth = async () => {
  try {
    const response = await api.get("/analytics/revenue/this-month");
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const getRevenueThisWeek = async () => {
  try {
    const response = await api.get("/analytics/revenue/this-week");
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const getRevenueThisQuarter = async () => {
  try {
    const response = await api.get("/analytics/revenue/this-quarter");
    return response.data;
  } catch (error) {
    handleError(error);
  }
};
// API cho Rating
export const createMovieRating = async ({ movieId, rating, comment }) => {
  try {
    const response = await api.post("/ratings", {
      movieId,
      rating,
      comment,
    });
    return response.data;
  } catch (error) {
    handleError(error);
    throw error;
  }
};

export const getMovieRatingSummary = async (movieId) => {
  try {
    const response = await api.get(`/ratings/summary/${movieId}`);
    return response.data;
  } catch (error) {
    handleError(error);
    throw error;
  }
};

export const getMovieRatingsList = async (
  movieId,
  { page = 1, limit = 10, sortBy = "newest" } = {}
) => {
  try {
    const response = await api.get(`/ratings/movie/${movieId}`, {
      params: { page, limit, sortBy },
    });
    return response.data;
  } catch (error) {
    handleError(error);
    throw error;
  }
};

export const updateMovieRating = async (ratingId, { rating, comment }) => {
  try {
    const response = await api.put(`/ratings/${ratingId}`, { rating, comment });
    return response.data;
  } catch (error) {
    handleError(error);
    throw error;
  }
};

export const deleteMovieRating = async (ratingId) => {
  try {
    const response = await api.delete(`/ratings/${ratingId}`);
    return response.data;
  } catch (error) {
    handleError(error);
    throw error;
  }
};

export const createComboProduct = async (comboProductData) => {
  try {
    const response = await api.post("/combo-products/create", comboProductData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Lỗi khi tạo combo product:", error);
    handleError(error);
    throw error;
  }
};
