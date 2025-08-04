/* eslint-disable no-undef */
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import MovieTooltip from "../../../layouts/Admin/movieComponent/MovieTooltip";

// Mock react-icons
jest.mock("react-icons/io5", () => ({
  IoClose: () => <div data-testid="close-icon">Close</div>,
  IoCalendarOutline: () => <div data-testid="calendar-icon">Calendar</div>,
  IoTimeOutline: () => <div data-testid="time-icon">Time</div>,
  IoMapOutline: () => <div data-testid="map-icon">Map</div>,
  IoPersonOutline: () => <div data-testid="person-icon">Person</div>,
  IoVideocamOutline: () => <div data-testid="videocam-icon">Videocam</div>,
  IoFilmOutline: () => <div data-testid="film-icon">Film</div>,
  IoBookmarkOutline: () => <div data-testid="bookmark-icon">Bookmark</div>,
}));

// Mock dateUtils
jest.mock("../../../utils/dateUtils", () => ({
  formatDateRange: jest.fn((fromDate, toDate) => `${fromDate} - ${toDate}`),
}));

import { formatDateRange } from "../../../utils/dateUtils";

describe("MovieTooltip", () => {
  const mockMovie = {
    NameOfEnglish: "Avengers: Endgame",
    NameOfVietnamese: "Biệt đội siêu anh hùng: Hồi kết",
    ProductionCompany: "Marvel Studios",
    PosterImage: "https://example.com/poster.jpg",
    FromDate: "2023-12-01",
    ToDate: "2023-12-31",
    RunningTime: 181,
    cinemaRoom: "Room A1",
    Actors: "Robert Downey Jr., Chris Evans, Mark Ruffalo",
    Director: "Anthony Russo, Joe Russo",
    Genres: "Action, Adventure, Drama",
    ContentSynopsis:
      "After the devastating events of Avengers: Infinity War, the universe is in ruins...",
    versions: [
      { VersionType: "2D", Language: "English" },
      { VersionType: "3D", Language: "Vietnamese" },
    ],
  };

  const mockOnClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    // Clean up any remaining modals
    document.body.innerHTML = "";
  });

  describe("Rendering", () => {
    it("renders the movie tooltip modal with correct structure", () => {
      render(<MovieTooltip movie={mockMovie} onClose={mockOnClose} />);

      // Check if modal backdrop is rendered
      expect(screen.getByRole("button")).toBeInTheDocument();

      // Check if main content container exists
      const modal = document.querySelector(".bg-white.rounded-2xl");
      expect(modal).toBeInTheDocument();
    });

    it("displays movie basic information correctly", () => {
      render(<MovieTooltip movie={mockMovie} onClose={mockOnClose} />);

      expect(screen.getByText("Avengers: Endgame")).toBeInTheDocument();
      expect(
        screen.getByText("Biệt đội siêu anh hùng: Hồi kết")
      ).toBeInTheDocument();
      expect(screen.getByText("Marvel Studios")).toBeInTheDocument();
    });

    it("displays movie poster with correct attributes", () => {
      render(<MovieTooltip movie={mockMovie} onClose={mockOnClose} />);

      const poster = screen.getByAltText("Avengers: Endgame");
      expect(poster).toBeInTheDocument();
      expect(poster).toHaveAttribute("src", "https://example.com/poster.jpg");
    });

    it("displays all information sections with correct icons", () => {
      render(<MovieTooltip movie={mockMovie} onClose={mockOnClose} />);

      expect(screen.getByTestId("calendar-icon")).toBeInTheDocument();
      expect(screen.getByTestId("time-icon")).toBeInTheDocument();
      expect(screen.getByTestId("map-icon")).toBeInTheDocument();
      expect(screen.getByTestId("person-icon")).toBeInTheDocument();
      expect(screen.getByTestId("videocam-icon")).toBeInTheDocument();
      expect(screen.getByTestId("film-icon")).toBeInTheDocument();
      expect(screen.getByTestId("bookmark-icon")).toBeInTheDocument();
    });

    it("displays all section labels correctly", () => {
      render(<MovieTooltip movie={mockMovie} onClose={mockOnClose} />);

      expect(screen.getByText("Release Date")).toBeInTheDocument();
      expect(screen.getByText("Duration")).toBeInTheDocument();
      expect(screen.getByText("Cinema Room")).toBeInTheDocument();
      expect(screen.getByText("Actors")).toBeInTheDocument();
      expect(screen.getByText("Director")).toBeInTheDocument();
      expect(screen.getByText("Version")).toBeInTheDocument();
      expect(screen.getByText("Genres")).toBeInTheDocument();
      expect(screen.getByText("Synopsis")).toBeInTheDocument();
    });
  });

  describe("Movie Information Display", () => {
    it("formats and displays release date range", () => {
      render(<MovieTooltip movie={mockMovie} onClose={mockOnClose} />);

      expect(formatDateRange).toHaveBeenCalledWith("2023-12-01", "2023-12-31");
      expect(screen.getByText("2023-12-01 - 2023-12-31")).toBeInTheDocument();
    });

    it("displays running time with minutes suffix", () => {
      render(<MovieTooltip movie={mockMovie} onClose={mockOnClose} />);

      expect(screen.getByText("181 min")).toBeInTheDocument();
    });

    it("displays TBA when running time is not available", () => {
      const movieWithoutRuntime = { ...mockMovie, RunningTime: null };
      render(
        <MovieTooltip movie={movieWithoutRuntime} onClose={mockOnClose} />
      );

      expect(screen.getByText("TBA")).toBeInTheDocument();
    });

    it("displays cinema room information", () => {
      render(<MovieTooltip movie={mockMovie} onClose={mockOnClose} />);

      expect(screen.getByText("Room A1")).toBeInTheDocument();
    });

    it("displays N/A when cinema room is not available", () => {
      const movieWithoutRoom = { ...mockMovie, cinemaRoom: null };
      render(<MovieTooltip movie={movieWithoutRoom} onClose={mockOnClose} />);

      expect(screen.getByText("N/A")).toBeInTheDocument();
    });

    it("displays actors information", () => {
      render(<MovieTooltip movie={mockMovie} onClose={mockOnClose} />);

      expect(
        screen.getByText("Robert Downey Jr., Chris Evans, Mark Ruffalo")
      ).toBeInTheDocument();
    });

    it("displays director information", () => {
      render(<MovieTooltip movie={mockMovie} onClose={mockOnClose} />);

      expect(screen.getByText("Anthony Russo, Joe Russo")).toBeInTheDocument();
    });

    it("displays genres information", () => {
      render(<MovieTooltip movie={mockMovie} onClose={mockOnClose} />);

      expect(screen.getByText("Action, Adventure, Drama")).toBeInTheDocument();
    });

    it("displays synopsis content", () => {
      render(<MovieTooltip movie={mockMovie} onClose={mockOnClose} />);

      expect(
        screen.getByText(
          /After the devastating events of Avengers: Infinity War/
        )
      ).toBeInTheDocument();
    });
  });

  describe("Version Information", () => {
    it("displays versions when versions array is available", () => {
      render(<MovieTooltip movie={mockMovie} onClose={mockOnClose} />);

      expect(screen.getByText("2D - English")).toBeInTheDocument();
      expect(screen.getByText("3D - Vietnamese")).toBeInTheDocument();
    });

    it("displays version without language when language is not provided", () => {
      const movieWithVersionsNoLang = {
        ...mockMovie,
        versions: [{ VersionType: "2D" }, { VersionType: "IMAX" }],
      };
      render(
        <MovieTooltip movie={movieWithVersionsNoLang} onClose={mockOnClose} />
      );

      expect(screen.getByText("2D")).toBeInTheDocument();
      expect(screen.getByText("IMAX")).toBeInTheDocument();
    });

    it("displays N/A when versions array is empty", () => {
      const movieWithEmptyVersions = { ...mockMovie, versions: [] };
      render(
        <MovieTooltip movie={movieWithEmptyVersions} onClose={mockOnClose} />
      );

      expect(screen.getByText("N/A")).toBeInTheDocument();
    });

    it("displays N/A when versions is not an array", () => {
      const movieWithoutVersions = { ...mockMovie, versions: null };
      render(
        <MovieTooltip movie={movieWithoutVersions} onClose={mockOnClose} />
      );

      expect(screen.getByText("N/A")).toBeInTheDocument();
    });
  });

  describe("Close Functionality", () => {
    it("renders close button", () => {
      render(<MovieTooltip movie={mockMovie} onClose={mockOnClose} />);

      expect(screen.getByTestId("close-icon")).toBeInTheDocument();
    });

    it("calls onClose when close button is clicked", () => {
      render(<MovieTooltip movie={mockMovie} onClose={mockOnClose} />);

      const closeButton = screen
        .getByTestId("close-icon")
        .closest('[role="button"]');
      fireEvent.click(closeButton);

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it("applies correct hover and active styles to close button", () => {
      render(<MovieTooltip movie={mockMovie} onClose={mockOnClose} />);

      const closeButton = screen
        .getByTestId("close-icon")
        .closest('[role="button"]');
      expect(closeButton).toHaveClass(
        "hover:bg-slate-100",
        "active:bg-slate-200",
        "hover:scale-110",
        "active:scale-95"
      );
    });
  });

  describe("Modal Styling and Layout", () => {
    it("applies correct backdrop styling", () => {
      render(<MovieTooltip movie={mockMovie} onClose={mockOnClose} />);

      const backdrop = document.querySelector(".fixed.inset-0");
      expect(backdrop).toHaveClass("bg-black/60", "backdrop-blur-sm", "z-50");
    });

    it("applies correct modal container styling", () => {
      render(<MovieTooltip movie={mockMovie} onClose={mockOnClose} />);

      const modal = document.querySelector(".bg-white.rounded-2xl");
      expect(modal).toHaveClass("shadow-2xl", "w-[650px]", "overflow-y-auto");
    });

    it("applies correct color schemes to different sections", () => {
      render(<MovieTooltip movie={mockMovie} onClose={mockOnClose} />);

      // Check if different sections have their respective color schemes
      expect(document.querySelector(".bg-blue-50")).toBeInTheDocument();
      expect(document.querySelector(".bg-green-50")).toBeInTheDocument();
      expect(document.querySelector(".bg-teal-50")).toBeInTheDocument();
      expect(document.querySelector(".bg-yellow-50")).toBeInTheDocument();
      expect(document.querySelector(".bg-red-50")).toBeInTheDocument();
      expect(document.querySelector(".bg-purple-50")).toBeInTheDocument();
      expect(document.querySelector(".bg-indigo-50")).toBeInTheDocument();
    });
  });

  describe("Edge Cases", () => {
    it("handles empty strings gracefully", () => {
      const movieWithEmptyStrings = {
        ...mockMovie,
        NameOfVietnamese: "",
        ProductionCompany: "",
        Actors: "",
        Director: "",
        Genres: "",
        ContentSynopsis: "",
      };

      render(
        <MovieTooltip movie={movieWithEmptyStrings} onClose={mockOnClose} />
      );

      expect(screen.getByText("Avengers: Endgame")).toBeInTheDocument();
    });

    it("handles very long text content", () => {
      const movieWithLongContent = {
        ...mockMovie,
        NameOfEnglish: "A".repeat(100),
        ContentSynopsis: "B".repeat(1000),
      };

      render(
        <MovieTooltip movie={movieWithLongContent} onClose={mockOnClose} />
      );

      expect(screen.getByText("A".repeat(100))).toBeInTheDocument();
      expect(screen.getByText("B".repeat(1000))).toBeInTheDocument();
    });

    it("handles multiple versions correctly", () => {
      const movieWithManyVersions = {
        ...mockMovie,
        versions: [
          { VersionType: "2D", Language: "English" },
          { VersionType: "3D", Language: "Vietnamese" },
          { VersionType: "IMAX", Language: "English" },
          { VersionType: "4DX" },
        ],
      };

      render(
        <MovieTooltip movie={movieWithManyVersions} onClose={mockOnClose} />
      );

      expect(screen.getByText("2D - English")).toBeInTheDocument();
      expect(screen.getByText("3D - Vietnamese")).toBeInTheDocument();
      expect(screen.getByText("IMAX - English")).toBeInTheDocument();
      expect(screen.getByText("4DX")).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("has proper role attributes", () => {
      render(<MovieTooltip movie={mockMovie} onClose={mockOnClose} />);

      expect(screen.getByRole("button")).toBeInTheDocument();
    });

    it("has proper alt text for poster image", () => {
      render(<MovieTooltip movie={mockMovie} onClose={mockOnClose} />);

      const image = screen.getByRole("img");
      expect(image).toHaveAttribute("alt", "Avengers: Endgame");
    });
  });
});
