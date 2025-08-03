/* eslint-disable no-undef */
import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import SelectSeatsPage from "./SelectSeatsPage";
import sellingReducer from "../../../redux/features/sellingSlice";
import memberReducer from "../../../redux/features/memberSlice";

// Mock all dependencies
const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

jest.mock("../../../services/APIForStaff/API", () => ({
  getMovieById: jest.fn(),
  getSeatsByShowtimeId: jest.fn(),
}));

jest.mock("../../../component/LayoutSelectSeat", () => {
  return function MockLayoutSelectSeat() {
    return <div data-testid="layout-select-seat">LayoutSelectSeat</div>;
  };
});

jest.mock("../component/VersionCard", () => {
  return function MockVersionCard() {
    return <div data-testid="version-card">VersionCard</div>;
  };
});

jest.mock("../component/BackButton", () => {
  return function MockBackButton() {
    return <div data-testid="back-button">BackButton</div>;
  };
});

jest.mock("antd", () => ({
  ...jest.requireActual("antd"),
  message: {
    error: jest.fn(),
    warning: jest.fn(),
  },
  Button: ({ children, onClick, disabled, type, icon, className, danger }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      data-testid={`button-${type || "default"}`}
      className={className}
      data-danger={danger}
    >
      {icon}
      {children}
    </button>
  ),
  Tag: ({ children, color }) => (
    <span data-testid="tag" data-color={color}>
      {children}
    </span>
  ),
  Spin: ({ size, children }) => (
    <div data-testid="spin" data-size={size}>
      {children || "Loading..."}
    </div>
  ),
}));

jest.mock("react-icons/fa6", () => ({
  FaCalendarDays: () => <div data-testid="fa-calendar-days" />,
  FaClock: () => <div data-testid="fa-clock" />,
  FaCouch: () => <div data-testid="fa-couch" />,
  FaLocationDot: () => <div data-testid="fa-location-dot" />,
}));

jest.mock("@ant-design/icons", () => ({
  CheckOutlined: () => <div data-testid="check-outlined" />,
  CloseOutlined: () => <div data-testid="close-outlined" />,
}));

// Sample data
const sampleMovie = {
  MovieId: "movie1",
  NameOfEnglish: "Avengers Endgame",
  NameOfVietnamese: "Biệt Đội Siêu Anh Hùng: Hồi Kết",
  PosterImage: "https://example.com/poster.jpg",
};

const sampleSeats = [
  { seatNumber: "A1", price: 75000, status: "available" },
  { seatNumber: "A2", price: 75000, status: "taken" },
  { seatNumber: "B1", price: 85000, status: "available" },
];

const sampleBookingData = {
  selectedMovie: sampleMovie,
  showtimeId: "showtime1",
  selectedDay: "2024-01-15",
  selectedTime: "14:30",
  room: "Room A",
  selectedVersion: "2D",
  seatData: sampleSeats,
  selectedSeats: [],
  totalPrice: 0,
};

// Create test store
const createTestStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      selling: sellingReducer,
      member: memberReducer,
    },
    preloadedState: {
      selling: {
        ...sampleBookingData,
        ...initialState,
      },
      member: {
        memberInfo: null,
        points: 0,
      },
    },
  });
};

// Test wrapper component
const renderWithProviders = (ui, { initialState = {}, ...renderOptions } = {}) => {
  const store = createTestStore(initialState);
  const Wrapper = ({ children }) => (
    <Provider store={store}>
      <BrowserRouter>{children}</BrowserRouter>
    </Provider>
  );
  return {
    store,
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
  };
};

describe("SelectSeatsPage", () => {
  let mockGetMovieById;
  let mockGetSeatsByShowtimeId;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "error").mockImplementation(() => {});

    mockGetMovieById = jest.fn();
    mockGetSeatsByShowtimeId = jest.fn();

    // Mock API functions
    const api = require("../../../services/APIForStaff/API");
    api.getMovieById = mockGetMovieById;
    api.getSeatsByShowtimeId = mockGetSeatsByShowtimeId;
  });

  afterEach(() => {
    console.error.mockRestore();
  });

  // 1. Test initial render with loading state
  it("shows loading spinner initially", () => {
    mockGetMovieById.mockResolvedValue({ data: sampleMovie });
    mockGetSeatsByShowtimeId.mockResolvedValue({ seats: sampleSeats });

    renderWithProviders(<SelectSeatsPage />);
    expect(screen.getByTestId("spin")).toBeInTheDocument();
  });

  // 2. Test missing booking data
  it("redirects when no booking data is found", async () => {
    renderWithProviders(<SelectSeatsPage />, {
      initialState: { selectedMovie: null, showtimeId: null },
    });

    await waitFor(() => {
      const { message } = require("antd");
      expect(message.error).toHaveBeenCalledWith("No booking data found");
      expect(mockNavigate).toHaveBeenCalledWith("/staff/ticket-selling");
    });
  });

 
}); 