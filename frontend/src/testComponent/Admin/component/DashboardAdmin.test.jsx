/* eslint-disable no-undef */
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";

import DashboardAdmin from "../../../layouts/Admin/component/DashboardAdmin";
// Mock các services API
jest.mock("../../../services/API", () => ({
  getRevenueByMonth: jest.fn(),
  getRevenueByQuarter: jest.fn(),
  getRevenueThisMonth: jest.fn(),
  getRevenueThisWeek: jest.fn(),
  getRevenueThisQuarter: jest.fn(),
}));
jest.mock("../../../config", () => ({
  API_BASE_URL: "https://mock-api.com",
}));

// Mock các icons
jest.mock("react-icons/fa6", () => ({
  FaTicket: () => <div data-testid="ticket-icon">Ticket Icon</div>,
}));

jest.mock("react-icons/io5", () => ({
  IoCalendar: () => <div data-testid="calendar-icon">Calendar Icon</div>,
}));

jest.mock("react-icons/ri", () => ({
  RiMoneyDollarCircleFill: () => <div data-testid="money-icon">Money Icon</div>,
}));

jest.mock("react-icons/md", () => ({
  MdMovieFilter: () => <div data-testid="movie-icon">Movie Icon</div>,
}));

// Mock Recharts components
jest.mock("recharts", () => ({
  LineChart: ({ children }) => <div data-testid="line-chart">{children}</div>,
  Line: () => <div data-testid="line" />,
  XAxis: ({ dataKey }) => <div data-testid="x-axis" data-key={dataKey} />,
  YAxis: () => <div data-testid="y-axis" />,
  CartesianGrid: () => <div data-testid="cartesian-grid" />,
  Tooltip: () => <div data-testid="tooltip" />,
  ResponsiveContainer: ({ children }) => (
    <div data-testid="responsive-container">{children}</div>
  ),
  AreaChart: ({ children }) => <div data-testid="area-chart">{children}</div>,
  Area: () => <div data-testid="area" />,
  PieChart: ({ children }) => <div data-testid="pie-chart">{children}</div>,
  Pie: ({ children }) => <div data-testid="pie">{children}</div>,
  Cell: () => <div data-testid="cell" />,
  Legend: () => <div data-testid="legend" />,
}));

// Mock images
jest.mock("../../../assets/DeadPoolPoster.jpg", () => "deadpool-poster.jpg");
jest.mock("../../../assets/TheEndPoster.jpg", () => "the-end-poster.jpg");
jest.mock(
  "../../../assets/DoctorStrangePoster.jpg",
  () => "doctor-strange-poster.jpg"
);
jest.mock("../../../assets/SpiderManPoster.jpg", () => "spiderman-poster.jpg");
jest.mock("../../../assets/imageMovie5.jpg", () => "movie5-poster.jpg");

const mockAPI = require("../../../services/API");

describe("DashboardAdmin Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Default mock responses
    mockAPI.getRevenueByMonth.mockResolvedValue({
      data: [
        { label: "January", total: 10000 },
        { label: "February", total: 15000 },
        { label: "March", total: 20000 },
      ],
    });

    mockAPI.getRevenueByQuarter.mockResolvedValue({
      data: [
        { total: 45000 },
        { total: 55000 },
        { total: 65000 },
        { total: 75000 },
      ],
    });

    mockAPI.getRevenueThisMonth.mockResolvedValue({ total: 25000 });
    mockAPI.getRevenueThisWeek.mockResolvedValue({ total: 8000 });
    mockAPI.getRevenueThisQuarter.mockResolvedValue({ total: 180000 });
  });

  test("renders dashboard with all main sections", () => {
    render(<DashboardAdmin />);

    // Check stats cards
    expect(screen.getByText("Total Tickets Sold")).toBeInTheDocument();
    expect(screen.getByText("Revenue")).toBeInTheDocument();
    expect(screen.getByText("Active Movies")).toBeInTheDocument();
    expect(screen.getByText("Upcoming Shows")).toBeInTheDocument();

    // Check charts
    expect(screen.getByText("Sales Overview")).toBeInTheDocument();
    expect(screen.getByText("Daily Ticket Sales")).toBeInTheDocument();
    expect(screen.getByText("Genre Distribution")).toBeInTheDocument();

    // Check top movies section
    expect(
      screen.getByText("Top 5 Movies by Ticket Sales")
    ).toBeInTheDocument();
  });

  test("displays correct stat values", () => {
    render(<DashboardAdmin />);

    // Check if stat values are displayed (3 cards have "25,340", 1 card has "$25,340")
    const statValues = screen.getAllByText("25,340");
    expect(statValues).toHaveLength(3); // 3 stats cards with value "25,340"

    const revenueValue = screen.getByText("$25,340");
    expect(revenueValue).toBeInTheDocument();

    // Verify all stat values are present
    expect(screen.getByText("Total Tickets Sold")).toBeInTheDocument();
    expect(screen.getByText("Revenue")).toBeInTheDocument();
    expect(screen.getByText("Active Movies")).toBeInTheDocument();
    expect(screen.getByText("Upcoming Shows")).toBeInTheDocument();
  });

  test("renders all icons in stats cards", () => {
    render(<DashboardAdmin />);

    expect(screen.getByTestId("ticket-icon")).toBeInTheDocument();
    expect(screen.getByTestId("money-icon")).toBeInTheDocument();
    expect(screen.getByTestId("movie-icon")).toBeInTheDocument();
    expect(screen.getByTestId("calendar-icon")).toBeInTheDocument();
  });

  test("displays top 5 movies with correct sorting", () => {
    render(<DashboardAdmin />);

    // Movies should be sorted by tickets in descending order
    const movieTitles = [
      "Spider-Man No Way Home", // 4520 tickets
      "Deadpools & Wolverine", // 3210 tickets
      "Phim hay quá...", // 3210 tickets
      "The End", // 2850 tickets
      "Doctor Strange", // 1980 tickets
    ];

    movieTitles.forEach((title) => {
      expect(screen.getByText(title)).toBeInTheDocument();
    });

    // Check ticket counts
    expect(screen.getByText("4,520")).toBeInTheDocument();
    expect(screen.getAllByText("3,210")).toHaveLength(2); // Two movies with same count
    expect(screen.getByText("2,850")).toBeInTheDocument();
    expect(screen.getByText("1,980")).toBeInTheDocument();
  });

  test("renders time filter dropdown with all options", () => {
    render(<DashboardAdmin />);

    const dropdown = screen.getByRole("combobox");
    expect(dropdown).toBeInTheDocument();
    expect(dropdown.value).toBe("This Month"); // Default value

    // Check all options exist
    const options = [
      "This Month",
      "Month",
      "This Week",
      "Quarter",
      "This Quarter",
    ];
    options.forEach((option) => {
      expect(screen.getByRole("option", { name: option })).toBeInTheDocument();
    });
  });

  test("calls correct API when time filter changes", async () => {
    render(<DashboardAdmin />);

    const dropdown = screen.getByRole("combobox");

    // Test Month filter
    fireEvent.change(dropdown, { target: { value: "Month" } });
    await waitFor(() => {
      expect(mockAPI.getRevenueByMonth).toHaveBeenCalledWith(
        new Date().getFullYear()
      );
    });

    // Test Quarter filter
    fireEvent.change(dropdown, { target: { value: "Quarter" } });
    await waitFor(() => {
      expect(mockAPI.getRevenueByQuarter).toHaveBeenCalledWith(
        new Date().getFullYear()
      );
    });

    // Test This Week filter
    fireEvent.change(dropdown, { target: { value: "This Week" } });
    await waitFor(() => {
      expect(mockAPI.getRevenueThisWeek).toHaveBeenCalled();
    });

    // Test This Quarter filter
    fireEvent.change(dropdown, { target: { value: "This Quarter" } });
    await waitFor(() => {
      expect(mockAPI.getRevenueThisQuarter).toHaveBeenCalled();
    });
  });

  test("renders charts components", () => {
    render(<DashboardAdmin />);

    // Check if chart components are rendered
    expect(screen.getByTestId("area-chart")).toBeInTheDocument();
    expect(screen.getByTestId("line-chart")).toBeInTheDocument();
    expect(screen.getByTestId("pie-chart")).toBeInTheDocument();

    // Check chart elements
    expect(screen.getAllByTestId("responsive-container")).toHaveLength(3);
    expect(screen.getAllByTestId("cartesian-grid")).toHaveLength(2); // Area and Line charts
    expect(screen.getAllByTestId("tooltip")).toHaveLength(3);
  });

  test("handles API errors gracefully", async () => {
    // Mock API to reject
    mockAPI.getRevenueThisMonth.mockRejectedValue(new Error("API Error"));

    render(<DashboardAdmin />);

    // Component should still render without crashing
    expect(screen.getByText("Sales Overview")).toBeInTheDocument();

    await waitFor(() => {
      expect(mockAPI.getRevenueThisMonth).toHaveBeenCalled();
    });
  });

  test("handles empty API responses", async () => {
    mockAPI.getRevenueThisMonth.mockResolvedValue(null);
    mockAPI.getRevenueByMonth.mockResolvedValue({ data: null });

    render(<DashboardAdmin />);

    await waitFor(() => {
      expect(mockAPI.getRevenueThisMonth).toHaveBeenCalled();
    });

    // Component should still render
    expect(screen.getByText("Sales Overview")).toBeInTheDocument();
  });

  test("movie images have correct alt text and src", () => {
    render(<DashboardAdmin />);

    const images = screen.getAllByRole("img");

    // Check if images have alt text
    images.forEach((img) => {
      expect(img).toHaveAttribute("alt");
      expect(img.getAttribute("alt")).toBeTruthy();
    });

    // Check specific movie images
    expect(screen.getByAltText("Spider-Man No Way Home")).toBeInTheDocument();
    expect(screen.getByAltText("Deadpools & Wolverine")).toBeInTheDocument();
    expect(screen.getByAltText("The End")).toBeInTheDocument();
    expect(screen.getByAltText("Doctor Strange")).toBeInTheDocument();
    expect(screen.getByAltText("Phim hay quá...")).toBeInTheDocument();
  });

  test("lazy loading is applied to images", () => {
    render(<DashboardAdmin />);

    const images = screen.getAllByRole("img");
    images.forEach((img) => {
      expect(img).toHaveAttribute("loading", "lazy");
    });
  });

  test("truncates long movie titles with title attribute", () => {
    render(<DashboardAdmin />);

    const movieElements = screen
      .getAllByTitle(/.*/)
      .filter(
        (el) =>
          el.textContent &&
          [
            "Spider-Man No Way Home",
            "Deadpools & Wolverine",
            "The End",
            "Doctor Strange",
            "Phim hay quá...",
          ].includes(el.textContent)
      );

    expect(movieElements.length).toBeGreaterThan(0);

    movieElements.forEach((element) => {
      expect(element).toHaveAttribute("title");
      expect(element.getAttribute("title")).toBeTruthy();
    });
  });
});
