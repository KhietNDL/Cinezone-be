import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import HeaderStats from "../../../layouts/Admin/movieComponent/HeaderStats";

// Mock react-icons
jest.mock("react-icons/md", () => ({
  MdMovie: ({ size, className }) => (
    <div data-testid="movie-icon" data-size={size} className={className} />
  ),
}));

jest.mock("react-icons/fa", () => ({
  FaCalendarAlt: ({ size, className }) => (
    <div data-testid="calendar-icon" data-size={size} className={className} />
  ),
  FaClock: ({ size, className }) => (
    <div data-testid="clock-icon" data-size={size} className={className} />
  ),
}));

jest.mock("react-icons/pi", () => ({
  PiChartLineDownBold: ({ size, className }) => (
    <div data-testid="chart-icon" data-size={size} className={className} />
  ),
}));

describe("HeaderStats Component", () => {
  const mockMovies = [
    {
      id: 1,
      NameOfEnglish: "Movie 1",
      RunningTime: 120,
      isDeleted: 0,
    },
    {
      id: 2,
      NameOfEnglish: "Movie 2",
      RunningTime: 90,
      isDeleted: 1,
    },
    {
      id: 3,
      NameOfEnglish: "Movie 3",
      RunningTime: 150,
      isDeleted: 0,
    },
    {
      id: 4,
      NameOfEnglish: "Movie 4",
      RunningTime: null,
      isDeleted: 1,
    },
  ];

  const mockUpcomingMovies = [
    { id: 5, NameOfEnglish: "Upcoming Movie 1" },
    { id: 6, NameOfEnglish: "Upcoming Movie 2" },
  ];

  const defaultProps = {
    totalMovies: 10,
    upcomingMovies: mockUpcomingMovies,
    movies: mockMovies,
  };

  describe("Rendering", () => {
    test("renders all four stat cards", () => {
      render(<HeaderStats {...defaultProps} />);

      expect(screen.getByText("Total Movies")).toBeInTheDocument();
      expect(screen.getByText("Upcoming Releases")).toBeInTheDocument();
      expect(screen.getByText("Expired Movies")).toBeInTheDocument();
      expect(screen.getByText("Average Duration")).toBeInTheDocument();
    });

    test("renders main container with correct grid classes", () => {
      const { container } = render(<HeaderStats {...defaultProps} />);

      const gridContainer = container.firstChild;
      expect(gridContainer).toHaveClass(
        "grid",
        "grid-cols-2",
        "sm:grid-cols-2",
        "lg:grid-cols-4",
        "gap-2",
        "lg:gap-4",
        "w-full"
      );
    });

    test("renders all stat cards with correct styling", () => {
      render(<HeaderStats {...defaultProps} />);

      const statCards = screen.getAllByText(
        /Total Movies|Upcoming Releases|Expired Movies|Average Duration/
      );

      statCards.forEach((card) => {
        const cardElement = card.closest(".bg-white");
        expect(cardElement).toHaveClass(
          "bg-white",
          "rounded-md",
          "p-2",
          "sm:p-3",
          "flex-1",
          "shadow-sm"
        );
      });
    });
  });

  describe("Icons", () => {
    test("renders movie icon with correct styling", () => {
      render(<HeaderStats {...defaultProps} />);

      const movieIcon = screen.getByTestId("movie-icon");
      expect(movieIcon).toBeInTheDocument();
      expect(movieIcon).toHaveAttribute("data-size", "20");
      expect(movieIcon).toHaveClass("text-blue-500");
    });

    test("renders calendar icon with correct styling", () => {
      render(<HeaderStats {...defaultProps} />);

      const calendarIcon = screen.getByTestId("calendar-icon");
      expect(calendarIcon).toBeInTheDocument();
      expect(calendarIcon).toHaveAttribute("data-size", "20");
      expect(calendarIcon).toHaveClass("text-green-500");
    });

    test("renders chart icon with correct styling", () => {
      render(<HeaderStats {...defaultProps} />);

      const chartIcon = screen.getByTestId("chart-icon");
      expect(chartIcon).toBeInTheDocument();
      expect(chartIcon).toHaveAttribute("data-size", "20");
      expect(chartIcon).toHaveClass("text-red-500");
    });

    test("renders clock icon with correct styling", () => {
      render(<HeaderStats {...defaultProps} />);

      const clockIcon = screen.getByTestId("clock-icon");
      expect(clockIcon).toBeInTheDocument();
      expect(clockIcon).toHaveAttribute("data-size", "20");
      expect(clockIcon).toHaveClass("text-yellow-500");
    });

    test("icon containers have correct background colors", () => {
      render(<HeaderStats {...defaultProps} />);

      const movieIconContainer = screen
        .getByTestId("movie-icon")
        .closest(".bg-blue-100");
      const calendarIconContainer = screen
        .getByTestId("calendar-icon")
        .closest(".bg-green-100");
      const chartIconContainer = screen
        .getByTestId("chart-icon")
        .closest(".bg-red-100");
      const clockIconContainer = screen
        .getByTestId("clock-icon")
        .closest(".bg-yellow-100");

      expect(movieIconContainer).toHaveClass(
        "p-1",
        "sm:p-2",
        "bg-blue-100",
        "rounded-lg"
      );
      expect(calendarIconContainer).toHaveClass(
        "p-1",
        "sm:p-2",
        "bg-green-100",
        "rounded-lg"
      );
      expect(chartIconContainer).toHaveClass(
        "p-1",
        "sm:p-2",
        "bg-red-100",
        "rounded-lg"
      );
      expect(clockIconContainer).toHaveClass(
        "p-1",
        "sm:p-2",
        "bg-yellow-100",
        "rounded-lg"
      );
    });
  });

  describe("Total Movies Stat", () => {
    test("displays correct total movies count", () => {
      render(<HeaderStats {...defaultProps} />);

      const totalMoviesValue = screen.getByText("10");
      expect(totalMoviesValue).toBeInTheDocument();
      expect(totalMoviesValue).toHaveClass(
        "font-bold",
        "text-base",
        "sm:text-[19px]"
      );
    });

    test("displays zero when totalMovies is 0", () => {
      render(<HeaderStats {...defaultProps} totalMovies={0} />);

      // Find the Total Movies section specifically
      const totalMoviesSection = screen
        .getByText("Total Movies")
        .closest(".bg-white");
      const totalMoviesValue = totalMoviesSection.querySelector(".font-bold");
      expect(totalMoviesValue).toHaveTextContent("0");
    });

    test("displays large numbers correctly", () => {
      render(<HeaderStats {...defaultProps} totalMovies={1000} />);

      expect(screen.getByText("1000")).toBeInTheDocument();
    });
  });

  describe("Average Duration Stat", () => {
    test("calculates and displays correct average duration", () => {
      render(<HeaderStats {...defaultProps} />);

      // RunningTimes: 120, 90, 150, null (treated as 0)
      // Average: (120 + 90 + 150 + 0) / 4 = 90
      const averageValue = screen.getByText("90 mins");
      expect(averageValue).toBeInTheDocument();
      expect(averageValue).toHaveClass(
        "font-bold",
        "text-base",
        "sm:text-[19px]"
      );
    });

    test("displays 0 when no movies", () => {
      render(<HeaderStats {...defaultProps} movies={[]} />);

      expect(screen.getByText("0 mins")).toBeInTheDocument();
    });

    test("handles movies with null/undefined RunningTime", () => {
      const moviesWithNullTimes = [
        { id: 1, RunningTime: null },
        { id: 2, RunningTime: undefined },
        { id: 3, RunningTime: 120 },
      ];

      render(<HeaderStats {...defaultProps} movies={moviesWithNullTimes} />);

      // Average: (0 + 0 + 120) / 3 = 40
      expect(screen.getByText("40 mins")).toBeInTheDocument();
    });

    test("handles all movies with null RunningTime", () => {
      const moviesWithAllNullTimes = [
        { id: 1, RunningTime: null },
        { id: 2, RunningTime: null },
      ];

      render(<HeaderStats {...defaultProps} movies={moviesWithAllNullTimes} />);

      expect(screen.getByText("0 mins")).toBeInTheDocument();
    });

    test("rounds average duration correctly", () => {
      const moviesWithDecimalAverage = [
        { id: 1, RunningTime: 100 },
        { id: 2, RunningTime: 110 },
        { id: 3, RunningTime: 105 },
      ];

      render(
        <HeaderStats {...defaultProps} movies={moviesWithDecimalAverage} />
      );

      // Average: (100 + 110 + 105) / 3 = 105
      expect(screen.getByText("105 mins")).toBeInTheDocument();
    });

    test("handles fractional averages", () => {
      const moviesWithFractionalAverage = [
        { id: 1, RunningTime: 100 },
        { id: 2, RunningTime: 101 },
      ];

      render(
        <HeaderStats {...defaultProps} movies={moviesWithFractionalAverage} />
      );

      // Average: (100 + 101) / 2 = 100.5, rounded = 101
      expect(screen.getByText("101 mins")).toBeInTheDocument();
    });
  });

  describe("Component Structure", () => {
    test("each stat card has correct header structure", () => {
      render(<HeaderStats {...defaultProps} />);

      const headers = screen.getAllByText(
        /Total Movies|Upcoming Releases|Expired Movies|Average Duration/
      );

      headers.forEach((header) => {
        const headerContainer = header.closest(
          ".flex.items-center.justify-between"
        );
        expect(headerContainer).toBeInTheDocument();
        expect(header).toHaveClass("text-slate-500", "text-sm", "sm:text-base");
      });
    });
  });

  describe("Edge Cases", () => {
    test("handles empty props gracefully", () => {
      render(<HeaderStats totalMovies={0} upcomingMovies={[]} movies={[]} />);

      expect(screen.getByText("Total Movies")).toBeInTheDocument();
      expect(screen.getByText("Upcoming Releases")).toBeInTheDocument();
      expect(screen.getByText("Expired Movies")).toBeInTheDocument();
      expect(screen.getByText("Average Duration")).toBeInTheDocument();
    });

    test("handles negative RunningTime values", () => {
      const moviesWithNegativeTime = [
        { id: 1, RunningTime: -50 },
        { id: 2, RunningTime: 100 },
      ];

      render(<HeaderStats {...defaultProps} movies={moviesWithNegativeTime} />);

      // Average: (-50 + 100) / 2 = 25
      expect(screen.getByText("25 mins")).toBeInTheDocument();
    });

    test("handles very large numbers", () => {
      render(<HeaderStats {...defaultProps} totalMovies={999999} />);

      expect(screen.getByText("999999")).toBeInTheDocument();
    });
  });

  describe("Integration Tests", () => {
    test("all stats display correctly with real data", () => {
      const realMovies = [
        { id: 1, RunningTime: 120, isDeleted: 0 },
        { id: 2, RunningTime: 90, isDeleted: 1 },
        { id: 3, RunningTime: 150, isDeleted: 0 },
        { id: 4, RunningTime: 100, isDeleted: 1 },
      ];

      const realUpcomingMovies = [
        { id: 5, name: "Upcoming 1" },
        { id: 6, name: "Upcoming 2" },
        { id: 7, name: "Upcoming 3" },
      ];

      render(
        <HeaderStats
          totalMovies={25}
          upcomingMovies={realUpcomingMovies}
          movies={realMovies}
        />
      );

      expect(screen.getByText("25")).toBeInTheDocument(); // Total movies
      expect(screen.getByText("3")).toBeInTheDocument(); // Upcoming movies
      expect(screen.getByText("2")).toBeInTheDocument(); // Expired movies (isDeleted = 1)
      expect(screen.getByText("115 mins")).toBeInTheDocument(); // Average: (120+90+150+100)/4 = 115
    });

    test("component renders without crashing with minimal props", () => {
      render(<HeaderStats totalMovies={0} upcomingMovies={[]} movies={[]} />);

      // Check for multiple "0" values using getAllByText
      const zeroValues = screen.getAllByText("0");
      expect(zeroValues).toHaveLength(3); // Total Movies, Upcoming Releases, Expired Movies

      // Check for "0 mins" specifically
      expect(screen.getByText("0 mins")).toBeInTheDocument();
    });
  });
});
