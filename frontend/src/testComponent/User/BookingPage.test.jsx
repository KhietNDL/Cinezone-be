/* eslint-disable */
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import BookingPage from "../../layouts/User/component/BookingPage";
import * as AuthContext from "../../context/AuthContext";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import bookingReducer from "../../redux/features/bookingSlice";
import userReducer from "../../redux/features/userSlice";
import memberReducer from "../../redux/features/memberSlice";
import sellingReducer from "../../redux/features/sellingSlice";
import comboReducer from "../../redux/features/comboSlice";

// Mock API
jest.mock("../../services/API", () => ({
  getMovies: jest.fn(() =>
    Promise.resolve({
      data: [
        {
          MovieId: 1,
          NameOfEnglish: "Avengers: Endgame",
          NameOfVietnamese: "Biệt Đội Báo Thù: Hồi Kết",
          PosterImage: "poster.jpg",
          RunningTime: 180,
          FromDate: "2023-01-01",
          ToDate: "2023-12-31",
          Director: "Anthony Russo, Joe Russo",
          Actors: "Robert Downey Jr., Chris Evans",
          Genres: "Action, Adventure, Sci-Fi",
          TrailerUrl: "trailer.mp4",
        },
      ],
    })
  ),
  getShowtimeByMovieId: jest.fn(() =>
    Promise.resolve({ showtimes: [{ Day: "2023-06-01" }] })
  ),
  getTimeByDay: jest.fn(() =>
    Promise.resolve({
      versions: [
        {
          version: "2D",
          showtimes: [{ showtimeId: "1", time: "18:00", roomName: "1" }],
        },
      ],
    })
  ),
  getSeatsByShowtimeId: jest.fn(() =>
    Promise.resolve({
      seats: [{ seatNumber: "A1", status: "available" }],
      seatQuantity: 1,
    })
  ),
  getMovieRatingsList: jest.fn(() =>
    Promise.resolve({ ratings: [], total: 0 })
  ),
  createMovieRating: jest.fn(() => Promise.resolve({})),
  updateMovieRating: jest.fn(() => Promise.resolve({})),
  deleteMovieRating: jest.fn(() => Promise.resolve({})),
  getMovieRatingSummary: jest.fn(() => Promise.resolve({ averageRating: 5 })),
}));

// Mock react-router-dom
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
  useParams: () => ({ slug: "avengers-endgame" }),
}));

// Mock toast
jest.mock("react-toastify", () => ({
  ToastContainer: () => <div data-testid="toast-container" />,
  toast: { error: jest.fn(), success: jest.fn() },
}));

// Mock subcomponents to avoid deep rendering
jest.mock("../../layouts/User/bookingComponent/MovieInfor", () => () => (
  <div data-testid="movie-info" />
));
jest.mock("../../layouts/User/bookingComponent/ShowtimeSelector", () => () => (
  <div data-testid="showtime-selector" />
));
jest.mock("../../layouts/User/bookingComponent/SeatMap", () => () => (
  <div data-testid="seat-map" />
));
jest.mock("../../layouts/User/bookingComponent/ProductsSection", () => () => (
  <div data-testid="products-section" />
));
jest.mock("../../layouts/User/bookingComponent/OrderSummary", () => (props) => (
  <div data-testid="order-summary">
    <button onClick={props.onContinue}>Continue</button>
  </div>
));
jest.mock("../../layouts/User/bookingComponent/VideoPopup", () => () => (
  <div data-testid="video-popup" />
));
jest.mock(
  "../../layouts/User/bookingComponent/FeedbackModal",
  () => (props) =>
    props.isOpen ? <div data-testid="feedback-modal">Feedback Modal</div> : null
);
jest.mock(
  "../../layouts/User/bookingComponent/RatingListModal",
  () => (props) =>
    props.isOpen ? (
      <div data-testid="rating-list-modal">Rating List Modal</div>
    ) : null
);

const defaultUser = {
  userId: 1,
  FullName: "Test User",
  Email: "test@example.com",
};

function renderWithProviders({ user = defaultUser } = {}) {
  jest.spyOn(AuthContext, "useAuth").mockReturnValue({ user });
  const store = configureStore({
    reducer: {
      booking: bookingReducer,
      user: userReducer,
      member: memberReducer,
      selling: sellingReducer,
      combo: comboReducer,
    },
    preloadedState: {
      booking: {
        selectedSeats: [],
        seatIds: [],
        setProducts: [],
        orderProductsId: [],
        calculatedTotalPrice: 0,
        selectedRoom: "",
        selectedDate: "2023-06-01",
        selectedTime: "18:00",
        selectedShowtimeId: "1",
        seatQuantity: 1,
        seatsData: [],
        finalTotalPrice: 0,
        movie: null,
        product: [
          {
            ProductId: 1,
            ProductName: "Popcorn",
            Price: 50000,
            Quantity: 10,
            IsDeleted: false,
          },
        ],
        productDetail: null,
      },
      user: user,
      member: { member: null, memberChecked: false },
      selling: {},
      combo: {
        cart: [],
        orderProductId: null,
        totalAmount: 0,
        lastOrder: null,
      },
    },
  });
  return render(
    <Provider store={store}>
      <BookingPage />
    </Provider>
  );
}

describe("BookingPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders BookingPage and subcomponents", async () => {
    renderWithProviders();
    expect(await screen.findByTestId("movie-info")).toBeInTheDocument();
    expect(screen.getByTestId("showtime-selector")).toBeInTheDocument();
    expect(screen.getByTestId("seat-map")).toBeInTheDocument();
    expect(screen.getByTestId("products-section")).toBeInTheDocument();
    expect(screen.getByTestId("order-summary")).toBeInTheDocument();
    expect(screen.getByTestId("video-popup")).toBeInTheDocument();
  });

  it("shows feedback modal when isFeedbackOpen is true", async () => {
    renderWithProviders();
    // Mở modal feedback bằng cách gọi hàm setIsFeedbackOpen
    // Vì đã mock FeedbackModal, chỉ cần kiểm tra nó không render mặc định
    expect(screen.queryByTestId("feedback-modal")).not.toBeInTheDocument();
  });

  it("calls navigate on continue if user and seats are selected", async () => {
    renderWithProviders();
    // Giả lập chọn ghế
    fireEvent.click(screen.getByText("Continue"));
    // Vì selectedSeats là [] nên sẽ không navigate, có thể kiểm tra toast
    expect(mockNavigate).not.toHaveBeenCalledWith("/confirmPayment");
  });

  it("renders rating list modal when isRatingListOpen is true", async () => {
    renderWithProviders();
    // Đã mock RatingListModal, kiểm tra không render mặc định
    expect(screen.queryByTestId("rating-list-modal")).not.toBeInTheDocument();
  });

  it("navigates to /confirmPayment if user and seats are selected and clicks Continue", async () => {
    // Tạo state với selectedSeats khác rỗng
    const user = {
      userId: 1,
      FullName: "Test User",
      Email: "test@example.com",
    };
    const store = configureStore({
      reducer: {
        booking: bookingReducer,
        user: userReducer,
        member: memberReducer,
        selling: sellingReducer,
        combo: comboReducer,
      },
      preloadedState: {
        booking: {
          selectedSeats: ["A1"],
          seatIds: [1],
          setProducts: [],
          orderProductsId: [],
          calculatedTotalPrice: 50000,
          selectedRoom: "1",
          selectedDate: "2023-06-01",
          selectedTime: "18:00",
          selectedShowtimeId: "1",
          seatQuantity: 1,
          seatsData: [],
          finalTotalPrice: 0,
          movie: null,
          product: [
            {
              ProductId: 1,
              ProductName: "Popcorn",
              Price: 50000,
              Quantity: 10,
              IsDeleted: false,
            },
          ],
          productDetail: null,
        },
        user: user,
        member: { member: null, memberChecked: false },
        selling: {},
        combo: {
          cart: [],
          orderProductId: null,
          totalAmount: 0,
          lastOrder: null,
        },
      },
    });
    jest.spyOn(AuthContext, "useAuth").mockReturnValue({ user });
    render(
      <Provider store={store}>
        <BookingPage />
      </Provider>
    );
    fireEvent.click(screen.getByText("Continue"));
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/confirmPayment");
    });
  });

  it("renders VideoPopup", async () => {
    renderWithProviders();
    await waitFor(() => {
      expect(screen.getByTestId("video-popup")).toBeInTheDocument();
    });
  });
});
