/* eslint-disable no-undef */
import React from "react";
import { render, screen, waitFor, act } from "@testing-library/react";
import WaitingPayment from "../../layouts/User/component/WaitingPayment";
import * as API from "../../services/API";
// Removed unused import: import { useNavigate } from "react-router-dom";

// Mock payment APIs
jest.mock("../../services/API", () => ({
  createMomoPayment: jest.fn(),
  createVnpayPayment: jest.fn(),
  createZalopayPayment: jest.fn(),
}));

// Mock useNavigate and useLocation
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
  useLocation: jest.fn(),
}));

const defaultState = {
  selectedSeats: ["A1", "A2"],
  calculatedTotalPrice: 200000,
  comboPrice: 50000,
  discount: 0,
  paymentMethod: "2", // Momo
  selectedShowtimeId: "1",
  seatIds: [1, 2],
  promotionId: null,
  userId: 1,
  bookingId: "BKG123456",
  finalPrice: 250000,
  OrderProductId: "OP123456",
  products: [
    { ProductId: 1, ProductName: "Popcorn", Price: 50000, Quantity: 2 },
  ],
  productHoldResult: null,
};

function setup(stateOverrides = {}) {
  const state = { ...defaultState, ...stateOverrides };
  require("react-router-dom").useLocation.mockReturnValue({ state });
  return render(<WaitingPayment />);
}

describe("WaitingPayment", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    delete window.location;
    window.location = { origin: "http://localhost", href: "" };
  });

  //   it("renders waiting UI and calls createMomoPayment, then redirects", async () => {
  //     API.createMomoPayment.mockResolvedValue({
  //       data: { payUrl: "http://momo.com/pay" },
  //     });
  //     setup({ paymentMethod: "2" });
  //     expect(
  //       screen.getByText(/redirecting to payment gateway/i)
  //     ).toBeInTheDocument();
  //     await waitFor(() => {
  //       expect(API.createMomoPayment).toHaveBeenCalled();
  //       expect(window.location.href).toBe("http://momo.com/pay");
  //     });
  //   });

  //   it("renders waiting UI and calls createVnpayPayment, then redirects", async () => {
  //     API.createVnpayPayment.mockResolvedValue({
  //       data: { payUrl: "http://vnpay.com/pay" },
  //     });
  //     setup({ paymentMethod: "3" });
  //     expect(
  //       screen.getByText(/redirecting to payment gateway/i)
  //     ).toBeInTheDocument();
  //     await waitFor(() => {
  //       expect(API.createVnpayPayment).toHaveBeenCalled();
  //       expect(window.location.href).toBe("http://vnpay.com/pay");
  //     });
  //   });

  //   it("renders waiting UI and calls createZalopayPayment, then redirects", async () => {
  //     API.createZalopayPayment.mockResolvedValue({
  //       data: { payUrl: "http://zalopay.com/pay" },
  //     });
  //     setup({ paymentMethod: "4" });
  //     expect(
  //       screen.getByText(/redirecting to payment gateway/i)
  //     ).toBeInTheDocument();
  //     await waitFor(() => {
  //       expect(API.createZalopayPayment).toHaveBeenCalled();
  //       expect(window.location.href).toBe("http://zalopay.com/pay");
  //     });
  //   });

  it("shows failed UI if paymentMethod is missing", async () => {
    setup({ paymentMethod: undefined });
    await waitFor(() => {
      expect(screen.getByText(/payment failed/i)).toBeInTheDocument();
      expect(
        screen.getByText(/payment method not selected/i)
      ).toBeInTheDocument();
    });
  });

  it("shows failed UI if both bookingId and OrderProductId are missing", async () => {
    setup({ bookingId: undefined, OrderProductId: undefined });
    await waitFor(() => {
      expect(screen.getByText(/payment failed/i)).toBeInTheDocument();
      expect(
        screen.getByText(/no booking or product order found/i)
      ).toBeInTheDocument();
    });
  });

  it("shows failed UI if payment API throws error", async () => {
    API.createMomoPayment.mockRejectedValue(new Error("API error"));
    setup({ paymentMethod: "2" });
    await waitFor(() => {
      expect(screen.getByText(/payment failed/i)).toBeInTheDocument();
    });
  });

  it("shows failed UI if payment API returns no payUrl", async () => {
    API.createMomoPayment.mockResolvedValue({ data: {} });
    setup({ paymentMethod: "2" });
    await waitFor(() => {
      expect(screen.getByText(/payment failed/i)).toBeInTheDocument();
    });
  });

  it("shows correct payment summary for both seats and products", () => {
    setup();
    expect(screen.getByText(/both seats and products/i)).toBeInTheDocument();
    expect(screen.getByText(/seat booking id/i)).toBeInTheDocument();
    expect(screen.getByText(/product order id/i)).toBeInTheDocument();
    expect(screen.getByText(/seats:/i)).toBeInTheDocument();
    expect(screen.getByText(/products:/i)).toBeInTheDocument();
    expect(screen.getByText(/total amount/i)).toBeInTheDocument();
  });

  it("shows correct payment summary for seats only", () => {
    setup({ OrderProductId: undefined, products: [] });
    expect(screen.getByText(/seats only/i)).toBeInTheDocument();
    expect(screen.getByText(/seat booking id/i)).toBeInTheDocument();
    expect(screen.queryByText(/product order id/i)).not.toBeInTheDocument();
    expect(screen.getByText(/seats:/i)).toBeInTheDocument();
  });

  it("shows correct payment summary for products only", () => {
    setup({
      bookingId: undefined,
      selectedSeats: [],
      products: [{ ProductId: 1 }],
    });
    expect(screen.getByText(/products only/i)).toBeInTheDocument();
    expect(screen.getByText(/product order id/i)).toBeInTheDocument();
    expect(screen.queryByText(/seat booking id/i)).not.toBeInTheDocument();
    expect(screen.getByText(/products:/i)).toBeInTheDocument();
  });

  it("navigates back or home on error UI button click", async () => {
    setup({ paymentMethod: undefined });
    await waitFor(() => {
      expect(screen.getByText(/payment failed/i)).toBeInTheDocument();
    });
    act(() => {
      screen.getByRole("button", { name: /go back/i }).click();
    });
    expect(mockNavigate).toHaveBeenCalledWith(-1);
    act(() => {
      screen.getByRole("button", { name: /back to home/i }).click();
    });
    expect(mockNavigate).toHaveBeenCalledWith("/");
  });
});
