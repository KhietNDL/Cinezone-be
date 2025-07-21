/* eslint-disable no-undef */
import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  within,
} from "@testing-library/react";
import "@testing-library/jest-dom";
import TicketBookingManagement from "../../../layouts/Admin/component/TicketBookingMangement";
import * as api from "../../../services/API";
import { MemoryRouter } from "react-router-dom";

// Mock the API module
jest.mock("../../../services/API", () => ({
  getAllBookings: jest.fn(),
  getBookingById: jest.fn(),
  searchBookingsByUser: jest.fn(),
}));

const mockBookings = {
  data: [
    {
      BookingId: "1",
      BookingDate: "2023-01-01T10:00:00Z",
      status: 2,
    },
    {
      BookingId: "2",
      BookingDate: "2023-01-02T11:00:00Z",
      status: 1,
    },
  ],
  pagination: {
    total: 2,
    totalPages: 1,
  },
};

const mockBookingDetails = {
  1: {
    BookingId: "1",
    buyerName: "John Doe",
    buyerPhone: "123456789",
    movieNameEnglish: "Test Movie 1",
    showTime: "10:00 AM",
    seats: ["A1", "A2"],
    room: "Room 1",
    duration: "120 min",
    totalPrice: 200000,
    TotalAmount: 200000,
    status: 2,
  },
  2: {
    BookingId: "2",
    buyerName: "Jane Smith",
    buyerPhone: "987654321",
    movieNameEnglish: "Test Movie 2",
    showTime: "11:00 AM",
    seats: ["B1"],
    room: "Room 2",
    duration: "90 min",
    totalPrice: 100000,
    TotalAmount: 100000,
    status: 1,
  },
};

const renderComponent = () =>
  render(
    <MemoryRouter>
      <TicketBookingManagement />
    </MemoryRouter>
  );

describe("TicketBookingManagement", () => {
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
    api.getAllBookings.mockResolvedValue(mockBookings);
    api.getBookingById.mockImplementation((id) =>
      Promise.resolve(mockBookingDetails[id])
    );
    api.searchBookingsByUser.mockResolvedValue({
      data: [mockBookings.data[0]],
      pagination: { total: 1, totalPages: 1 },
    });
  });

  test("renders the component and fetches initial bookings", async () => {
    renderComponent();
    expect(screen.getByText("Total Bookings")).toBeInTheDocument();
    expect(api.getAllBookings).toHaveBeenCalledWith({
      page: 1,
      limit: 5,
      sortBy: "CreatedAt",
      sortOrder: "desc",
    });

    await waitFor(() => {
      expect(screen.getByText("John Doe")).toBeInTheDocument();
      expect(screen.getByText("Jane Smith")).toBeInTheDocument();
    });
  });

  test("displays booking details when a row is clicked", async () => {
    renderComponent();

    await waitFor(() => {
      expect(screen.getByText("John Doe")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("John Doe"));

    await waitFor(() => {
      const modal = screen.getByTestId("booking-modal");
      expect(api.getBookingById).toHaveBeenCalledWith("1");
      expect(within(modal).getByText("Booking Details")).toBeInTheDocument();
      expect(within(modal).getByText("Test Movie 1")).toBeInTheDocument();
    });
  });

  test("searches for bookings when search term is entered", async () => {
    renderComponent();
    const searchInput = screen.getByPlaceholderText("Search by name or movie");

    fireEvent.change(searchInput, { target: { value: "John" } });

    await waitFor(
      () => {
        expect(api.searchBookingsByUser).toHaveBeenCalledWith("John");
      },
      { timeout: 500 }
    ); // wait for debounce

    await waitFor(() => {
      expect(screen.queryByText("Jane Smith")).not.toBeInTheDocument();
    });
  });

  test("handles pagination correctly", async () => {
    api.getAllBookings.mockResolvedValue({
      data: mockBookings.data,
      pagination: { total: 10, totalPages: 2 },
    });

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText("John Doe")).toBeInTheDocument();
    });

    const nextPageButton = screen.getByLabelText("Next page");
    fireEvent.click(nextPageButton);

    await waitFor(() => {
      expect(api.getAllBookings).toHaveBeenCalledWith({
        page: 2,
        limit: 5,
        sortBy: "CreatedAt",
        sortOrder: "desc",
      });
    });
  });

  test("closes the modal when close button is clicked", async () => {
    renderComponent();
    await waitFor(() => {
      expect(screen.getByText("John Doe")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("John Doe"));

    await waitFor(() => {
      expect(screen.getByText("Booking Details")).toBeInTheDocument();
    });

    const closeButton = screen.getByLabelText("Close");
    fireEvent.click(closeButton);

    await waitFor(() => {
      expect(screen.queryByText("Booking Details")).not.toBeInTheDocument();
    });
  });
});
