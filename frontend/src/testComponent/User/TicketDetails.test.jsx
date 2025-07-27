/* eslint-disable no-undef */
import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import TicketDetails from "../../layouts/User/component/TicketDetails";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import bookingReducer from "../../redux/features/bookingSlice";
import userReducer from "../../redux/features/userSlice";

// Mock API
jest.mock("../../services/API", () => ({
  cancelBooking: jest.fn(),
  cancelProduct: jest.fn(),
  ConfirmBooking: jest.fn(),
  confirmProduct: jest.fn(),
  getBookingById: jest.fn(),
  getProductByOderProductId: jest.fn(),
}));

// Mock useSearchParams
const mockSearchParams = {
  get: jest.fn(),
};
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useSearchParams: () => [mockSearchParams],
}));

// Mock useDispatch, useSelector
const mockDispatch = jest.fn();
jest.mock("react-redux", () => ({
  ...jest.requireActual("react-redux"),
  useDispatch: () => mockDispatch,
  useSelector: (fn) => fn({ booking: { productDetail: null } }),
}));

function renderWithStore(bookingState = {}) {
  const store = configureStore({
    reducer: { booking: bookingReducer, user: userReducer },
    preloadedState: {
      booking: { ...bookingReducer(undefined, { type: "" }), ...bookingState },
      user: null,
    },
  });
  return render(
    <Provider store={store}>
      <TicketDetails />
    </Provider>
  );
}

describe("TicketDetails", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockSearchParams.get.mockReset();
  });

  it("renders cancelled UI if resultCode !== '0'", async () => {
    mockSearchParams.get.mockImplementation((key) => {
      if (key === "resultCode") return "1";
      if (key === "extraData")
        return encodeURIComponent(
          JSON.stringify({ bookingId: "B1", orderProductId: "O1" })
        );
      return null;
    });
    const { cancelBooking, cancelProduct } = require("../../services/API");
    cancelBooking.mockResolvedValue({});
    cancelProduct.mockResolvedValue({});
    renderWithStore();
    await waitFor(() => {
      expect(screen.getByText(/ticket cancelled/i)).toBeInTheDocument();
    });
    expect(cancelBooking).toHaveBeenCalledWith("B1");
    expect(cancelProduct).toHaveBeenCalledWith("O1");
  });

  it("renders error if no bookingId after parsing extraData", async () => {
    mockSearchParams.get.mockImplementation((key) => {
      if (key === "resultCode") return "0";
      if (key === "extraData") return encodeURIComponent(JSON.stringify({}));
      return null;
    });
    renderWithStore();
    // Sau đó mới xuất hiện error
    await waitFor(() => {
      expect(
        screen.getByText(/không có thông tin booking/i)
      ).toBeInTheDocument();
    });
  });

  it("renders error if API throws when fetching ticket", async () => {
    mockSearchParams.get.mockImplementation((key) => {
      if (key === "resultCode") return "0";
      if (key === "extraData")
        return encodeURIComponent(JSON.stringify({ bookingId: "B1" }));
      return null;
    });
    const { ConfirmBooking, getBookingById } = require("../../services/API");
    ConfirmBooking.mockResolvedValue({});
    getBookingById.mockRejectedValue(new Error("API error"));
    renderWithStore();
    await waitFor(() => {
      expect(
        screen.getByText(/không thể tải thông tin vé/i)
      ).toBeInTheDocument();
    });
  });

  it("renders not found if ticket is null after fetch", async () => {
    mockSearchParams.get.mockImplementation((key) => {
      if (key === "resultCode") return "0";
      if (key === "extraData")
        return encodeURIComponent(JSON.stringify({ bookingId: "B1" }));
      return null;
    });
    const { ConfirmBooking, getBookingById } = require("../../services/API");
    ConfirmBooking.mockResolvedValue({});
    getBookingById.mockResolvedValue(null);
    renderWithStore();
    await waitFor(() => {
      expect(screen.getByText(/không tìm thấy vé/i)).toBeInTheDocument();
    });
  });

  it("renders ticket details if ticket is fetched successfully", async () => {
    mockSearchParams.get.mockImplementation((key) => {
      if (key === "resultCode") return "0";
      if (key === "extraData")
        return encodeURIComponent(JSON.stringify({ bookingId: "B1" }));
      return null;
    });
    const { ConfirmBooking, getBookingById } = require("../../services/API");
    ConfirmBooking.mockResolvedValue({});
    getBookingById.mockResolvedValue({
      movieNameEnglish: "Avengers",
      showTime: "18:00",
      showDate: "2024-06-01T00:00:00.000Z",
      room: "1",
      seats: ["A1", "A2"],
      buyerName: "Tony Stark",
      buyerPhone: "0123456789",
    });
    renderWithStore();
    await waitFor(() => {
      expect(screen.getByText(/avengers/i)).toBeInTheDocument();
      expect(screen.getByText(/tony stark/i)).toBeInTheDocument();
      expect(screen.getByText(/0123456789/i)).toBeInTheDocument();
      expect(screen.getByText(/a1, a2/i)).toBeInTheDocument();
    });
  });

  it("renders product info if productDetail exists", async () => {
    mockSearchParams.get.mockImplementation((key) => {
      if (key === "resultCode") return "0";
      if (key === "extraData")
        return encodeURIComponent(
          JSON.stringify({ bookingId: "B1", orderProductId: "O1" })
        );
      return null;
    });
    const {
      ConfirmBooking,
      getBookingById,
      getProductByOderProductId,
    } = require("../../services/API");
    ConfirmBooking.mockResolvedValue({});
    getBookingById.mockResolvedValue({
      movieNameEnglish: "Avengers",
      showTime: "18:00",
      showDate: "2024-06-01T00:00:00.000Z",
      room: "1",
      seats: ["A1", "A2"],
      buyerName: "Tony Stark",
      buyerPhone: "0123456789",
    });
    getProductByOderProductId.mockResolvedValue([
      { productName: "Popcorn" },
      { productName: "Coke" },
    ]);
    // Mock useSelector trả về productDetail
    jest.spyOn(require("react-redux"), "useSelector").mockImplementation((fn) =>
      fn({
        booking: {
          productDetail: [{ productName: "Popcorn" }, { productName: "Coke" }],
        },
      })
    );
    renderWithStore({
      productDetail: [{ productName: "Popcorn" }, { productName: "Coke" }],
    });
    await waitFor(() => {
      expect(screen.getByText(/popcorn, coke/i)).toBeInTheDocument();
    });
  });
});
