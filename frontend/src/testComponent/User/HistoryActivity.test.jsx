/* eslint-disable */
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import HistoryActivity from "../../layouts/User/component/HistoryActivity";
import * as api from "../../services/API";
import * as AuthContext from "../../context/AuthContext";

// Mock API
jest.mock("../../services/API", () => ({
  getBookingHistory: jest.fn(),
  getScoreHistoryByMemberId: jest.fn(),
}));

// Mock AuthContext
const mockUser = { userId: "1", fullName: "Test User" };
jest.spyOn(AuthContext, "useAuth").mockReturnValue({ user: mockUser });

const bookingData = [
  {
    id: 1,
    BookingId: "B001",
    movieNameEnglish: "Avengers",
    BookingDate: "2024-06-01T10:00:00Z",
    seats: ["A1", "A2"],
    totalAmount: 200,
    buyerName: "Test User",
    status: 2,
    showDate: "01/06/2024",
    showTime: "17:00",
    room: "Room 1",
    userId: "1", // THÊM userId nếu component filter theo user
  },
];
const scoreData = [
  {
    ScoreHistoryId: 1,
    ChangeDate: "2024-06-01T10:00:00Z",
    ScoreValue: 10,
    RelatedBookingId: "B001",
    ChangeType: 4,
  },
];

describe("HistoryActivity", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    api.getBookingHistory.mockResolvedValue({ data: bookingData });
    api.getScoreHistoryByMemberId.mockResolvedValue(scoreData);
    // Thêm log
    console.log("Mock bookingData:", bookingData);
  });

  it("renders loading state", () => {
    render(<HistoryActivity />);
    // Chỉ kiểm tra spinner loading xuất hiện
    expect(document.querySelector(".animate-spin")).toBeInTheDocument();
  });

  it("renders booking history after loading", async () => {
    render(<HistoryActivity />);
    await waitFor(() => {
      // In ra DOM để debug
      // eslint-disable-next-line no-console
      console.log(screen.debug());
      expect(screen.getAllByText(/booking history/i).length).toBeGreaterThan(0);
      expect(
        screen.getByText((content) => content.includes("Avengers"))
      ).toBeInTheDocument();
      expect(
        screen.getByText((content) => content.includes("Test User"))
      ).toBeInTheDocument();
    });
  });

  it("switches to points tab and shows points data", async () => {
    render(<HistoryActivity />);
    await waitFor(() =>
      expect(screen.getAllByText(/booking history/i).length).toBeGreaterThan(0)
    );
    fireEvent.click(screen.getByRole("button", { name: /points activity/i }));
    await waitFor(() => {
      expect(screen.getAllByText(/points activity/i).length).toBeGreaterThan(0);
      expect(screen.getByText(/B001/i)).toBeInTheDocument();
      expect(screen.getAllByText(/\+10/).length).toBeGreaterThan(0);
    });
  });

  it("shows empty state when no booking data", async () => {
    api.getBookingHistory.mockResolvedValue({ data: [] });
    render(<HistoryActivity />);
    await waitFor(() => {
      expect(screen.getByText(/no booking history/i)).toBeInTheDocument();
    });
  });

  it("shows empty state when no points data", async () => {
    api.getScoreHistoryByMemberId.mockResolvedValue([]);
    render(<HistoryActivity />);
    // Đợi cho tab button xuất hiện
    await waitFor(() =>
      expect(
        screen.getByRole("button", { name: /points activity/i })
      ).toBeInTheDocument()
    );
    fireEvent.click(screen.getByRole("button", { name: /points activity/i }));
    await waitFor(() => {
      expect(screen.getByText(/no points activity/i)).toBeInTheDocument();
    });
  });

  it("can filter booking by movie name", async () => {
    render(<HistoryActivity />);
    await waitFor(() =>
      expect(screen.getByText(/Avengers/i)).toBeInTheDocument()
    );
    fireEvent.change(screen.getByPlaceholderText(/enter movie name/i), {
      target: { value: "Nonexistent" },
    });
    expect(screen.getByText(/no results found/i)).toBeInTheDocument();
  });

  it("shows detail modal when clicking Detail", async () => {
    render(<HistoryActivity />);
    await waitFor(() =>
      expect(screen.getByText(/Avengers/i)).toBeInTheDocument()
    );
    fireEvent.click(screen.getByRole("button", { name: /detail/i }));
    expect(screen.getByText(/cinezone ticket/i)).toBeInTheDocument();
    expect(screen.getByText(/close ticket/i)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /close ticket/i }));
    expect(screen.queryByText(/cinezone ticket/i)).not.toBeInTheDocument();
  });
});
