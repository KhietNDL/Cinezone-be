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

// Lấy day theo movieId
export const getShowtimesByMovieId = async (movieId) => {
  try {
    const response = await api.get(`showtimes/movie/${movieId}/day`);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// Lấy showtimes theo movieId và day (version and time)
export const getShowtimesByMovieIdAndDay = async (movieId, day) => {
  try {
    const response = await api.get(`/showtimes/movie/${movieId}/day/showtimes?day=${day}`);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// Lấy seats theo showtimeId
export const getSeatsByShowtimeId = async (showtimeId) => {
  try {
    const response = await api.get(`/showtimes/${showtimeId}/seats`)
    return response.data;
  } catch (error) {
    handleError(error);
  }
}

// Lấy user theo cccd
export const getUserByCCCD = async (cccd) => {
  try {
    const response = await api.get(`/user/cccd/${cccd}`)
    return response.data;
  } catch (error) {
    handleError(error);
  }
}

// Lấy user theo phone
export const getUserByPhone = async (phone) => {
  try {
    const response = await api.get(`/user/phone/${phone}`)
    return response.data;
  } catch (error) {
    handleError(error);
  }
}

// Lấy user theo email
export const getUserByEmail = async (email) => {
  try {
    const response = await api.get(`/user/email/${email}`)
    return response.data;
  } catch (error) {
    handleError(error);
  }
}

// Tạo booking hold (giữ chỗ)
export const createBookingHold = async (userId, showtimeId, seatIds, productIds = [], promotionTitle = "") => {
  try {
    const response = await api.post("/bookings/hold", {
      userId,
      showtimeId,
      seatIds,
      productIds,
      promotionTitle
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// Xác nhận booking
export const confirmBooking = async (bookingId) => {
  try {
    const response = await api.post(`/bookings/confirm/${bookingId}`);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// Thanh toán bằng tiền mặt
export const createCashPayment = async (bookingId, amount, reference) => {
  try {
    const response = await api.post("/payment/offline", {
      bookingId,
      amount,
      reference
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// Thanh toán bằng momo
export const createMomoPayment = async (bookingId, amount, returnUrl, userId) => {
  try {
    const response = await api.post("/payment/momo", {
      bookingId,
      amount,
      returnUrl,
      userId
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// Kiểm tra promotion
export const checkPromotion = async (promotionTitle) => {
  try {
    const response = await api.get(`/promotions/search?title=${encodeURIComponent(promotionTitle)}`);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// Kiểm tra booking
export const checkInfoBookingById = async (bookingId) => {
  try {
    const response = await api.get(`/bookings/detail/${encodeURIComponent(bookingId)}`);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};
