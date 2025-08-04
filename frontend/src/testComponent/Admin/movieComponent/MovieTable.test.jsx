/* eslint-disable no-undef */
import React from "react";
import { render, screen, fireEvent, within } from "@testing-library/react";
import "@testing-library/jest-dom";
import MovieTable from "../../../layouts/Admin/movieComponent/MovieTable";

// Mock react-icons
jest.mock("react-icons/io5", () => ({
  IoEyeOutline: () => <div data-testid="eye-icon">Eye</div>,
}));

jest.mock("react-icons/fa", () => ({
  FaRegEdit: () => <div data-testid="edit-icon">Edit</div>,
}));

jest.mock("react-icons/ri", () => ({
  RiDeleteBin5Line: () => <div data-testid="delete-icon">Delete</div>,
}));

jest.mock("react-icons/md", () => ({
  MdOutlineArrowDropDown: ({ className }) => (
    <div data-testid="arrow-down" className={className}>
      ↓
    </div>
  ),
  MdArrowDropUp: ({ className }) => (
    <div data-testid="arrow-up" className={className}>
      ↑
    </div>
  ),
}));

describe("MovieTable", () => {
  const mockMovies = [
    {
      MovieId: 1,
      NameOfEnglish: "Avengers: Endgame",
      NameOfVietnamese: "Biệt đội siêu anh hùng: Hồi kết",
      FromDate: "2023-12-01",
      ToDate: "2023-12-31",
      RunningTime: 181,
      PosterImage: "https://example.com/poster1.jpg",
      versions: [
        { VersionType: "2D", Language: "English" },
        { VersionType: "3D", Language: "Vietnamese" },
      ],
    },
    {
      MovieId: 2,
      NameOfEnglish:
        "Spider-Man: No Way Home with a very long title that exceeds thirty characters",
      NameOfVietnamese: "Người nhện: Không còn đường về với tiêu đề rất dài",
      FromDate: "2023-11-15",
      ToDate: "2023-12-15",
      RunningTime: 148,
      PosterImage: "https://example.com/poster2.jpg",
      Version: JSON.stringify([{ VersionType: "IMAX", Language: "English" }]),
    },
    {
      MovieId: 3,
      NameOfEnglish: "The Batman",
      NameOfVietnamese: "Người dơi",
      FromDate: "2023-10-01",
      ToDate: "2023-11-30",
      RunningTime: 176,
      PosterImage: "https://example.com/poster3.jpg",
      Version: "Standard",
    },
  ];

  const defaultProps = {
    movies: mockMovies,
    handleSort: jest.fn(),
    sortBy: "NameOfEnglish",
    sortOrder: "asc",
    handleEdit: jest.fn(),
    handleDelete: jest.fn(),
    handleRowClick: jest.fn(),
    formatDate: jest.fn((date) => new Date(date).toLocaleDateString()),
    openAddShowtimePopup: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Rendering", () => {
    it("renders the movie table with correct structure", () => {
      render(<MovieTable {...defaultProps} />);

      expect(screen.getByRole("table")).toBeInTheDocument();
      expect(screen.getByText("Name Movie (ENG)")).toBeInTheDocument();
      expect(screen.getByText("From Date")).toBeInTheDocument();
      expect(screen.getByText("To Date")).toBeInTheDocument();
      expect(screen.getByText("Duration")).toBeInTheDocument();
      expect(screen.getByText("Action")).toBeInTheDocument();
    });

    it("renders all movies in the table", () => {
      render(<MovieTable {...defaultProps} />);

      expect(screen.getByText("Avengers: Endgame")).toBeInTheDocument();
      expect(
        screen.getByText("Spider-Man: No Way Home with a...")
      ).toBeInTheDocument();
      expect(screen.getByText("The Batman")).toBeInTheDocument();
    });

    it("truncates long English movie names", () => {
      render(<MovieTable {...defaultProps} />);

      expect(
        screen.getByText("Spider-Man: No Way Home with a...")
      ).toBeInTheDocument();
    });

    it("displays formatted dates", () => {
      render(<MovieTable {...defaultProps} />);

      expect(defaultProps.formatDate).toHaveBeenCalledWith("2023-12-01");
      expect(defaultProps.formatDate).toHaveBeenCalledWith("2023-12-31");
    });

    it('displays movie duration with "mins" suffix', () => {
      render(<MovieTable {...defaultProps} />);

      expect(screen.getByText("181 mins")).toBeInTheDocument();
      expect(screen.getByText("148 mins")).toBeInTheDocument();
      expect(screen.getByText("176 mins")).toBeInTheDocument();
    });
  });

  describe("Sorting functionality", () => {
    it("calls handleSort when clicking on sortable headers", () => {
      render(<MovieTable {...defaultProps} />);

      fireEvent.click(screen.getByText("Name Movie (ENG)"));
      expect(defaultProps.handleSort).toHaveBeenCalledWith("NameOfEnglish");

      fireEvent.click(screen.getByText("From Date"));
      expect(defaultProps.handleSort).toHaveBeenCalledWith("FromDate");

      fireEvent.click(screen.getByText("To Date"));
      expect(defaultProps.handleSort).toHaveBeenCalledWith("ToDate");
    });

    it("displays correct sort arrow for ascending order", () => {
      render(
        <MovieTable {...defaultProps} sortBy="NameOfEnglish" sortOrder="asc" />
      );

      const nameHeader = screen.getByText("Name Movie (ENG)").closest("th");
      expect(within(nameHeader).getByTestId("arrow-down")).toBeInTheDocument();
    });

    it("displays correct sort arrow for descending order", () => {
      render(
        <MovieTable {...defaultProps} sortBy="NameOfEnglish" sortOrder="desc" />
      );

      const nameHeader = screen.getByText("Name Movie (ENG)").closest("th");
      expect(within(nameHeader).getByTestId("arrow-up")).toBeInTheDocument();
    });

    it("displays default arrow for non-sorted columns", () => {
      render(
        <MovieTable {...defaultProps} sortBy="NameOfEnglish" sortOrder="asc" />
      );

      const fromDateHeader = screen.getByText("From Date").closest("th");
      const defaultArrow = within(fromDateHeader).getByTestId("arrow-down");
      expect(defaultArrow).toHaveClass("text-gray-300");
    });
  });

  describe("Action buttons", () => {
    it("renders all action buttons for each movie row", () => {
      render(<MovieTable {...defaultProps} />);

      expect(screen.getAllByTestId("eye-icon")).toHaveLength(3);
      expect(screen.getAllByTestId("edit-icon")).toHaveLength(3);
      expect(screen.getAllByTestId("delete-icon")).toHaveLength(3);
      expect(screen.getAllByTitle("Add Showtime")).toHaveLength(3);
    });

    it("calls handleEdit when edit button is clicked", () => {
      render(<MovieTable {...defaultProps} />);

      const editButtons = screen.getAllByTestId("edit-icon");
      fireEvent.click(editButtons[0]);

      expect(defaultProps.handleEdit).toHaveBeenCalledWith(mockMovies[0]);
    });

    it("calls handleDelete when delete button is clicked", () => {
      render(<MovieTable {...defaultProps} />);

      const deleteButtons = screen.getAllByTestId("delete-icon");
      fireEvent.click(deleteButtons[0]);

      expect(defaultProps.handleDelete).toHaveBeenCalledWith(mockMovies[0]);
    });

    it("calls openAddShowtimePopup when add showtime button is clicked", () => {
      render(<MovieTable {...defaultProps} />);

      const addShowtimeButtons = screen.getAllByTitle("Add Showtime");
      fireEvent.click(addShowtimeButtons[0]);

      expect(defaultProps.openAddShowtimePopup).toHaveBeenCalledWith(
        mockMovies[0]
      );
    });

    it("prevents row click when action buttons are clicked", () => {
      render(<MovieTable {...defaultProps} />);

      const editButtons = screen.getAllByTestId("edit-icon");
      fireEvent.click(editButtons[0]);

      expect(defaultProps.handleRowClick).not.toHaveBeenCalled();
    });
  });

  describe("Row interactions", () => {
    it("calls handleRowClick when a row is clicked", () => {
      render(<MovieTable {...defaultProps} />);

      const firstRow = screen.getByText("Avengers: Endgame").closest("tr");
      fireEvent.click(firstRow);

      expect(defaultProps.handleRowClick).toHaveBeenCalledWith(
        mockMovies[0],
        expect.any(Object)
      );
    });

    it("applies hover class to rows", () => {
      render(<MovieTable {...defaultProps} />);

      const rows = screen.getAllByRole("row");
      const dataRows = rows.slice(1); // Skip header row

      dataRows.forEach((row) => {
        expect(row).toHaveClass("hover:bg-slate-100");
      });
    });
  });

  describe("Version display", () => {
    it("displays versions from JSON string in Version field", () => {
      render(<MovieTable {...defaultProps} />);

      // Should display IMAX version for second movie
      expect(screen.getByText("IMAX - English")).toBeInTheDocument();
    });

    it("displays raw Version field when it is not JSON", () => {
      render(<MovieTable {...defaultProps} />);

      // Should display "Standard" for third movie
      expect(screen.getByText("Standard")).toBeInTheDocument();
    });

    it("displays N/A when no version information is available", () => {
      const moviesWithoutVersion = [
        {
          ...mockMovies[0],
          versions: null,
          Version: null,
        },
      ];

      render(<MovieTable {...defaultProps} movies={moviesWithoutVersion} />);

      expect(screen.getByText("N/A")).toBeInTheDocument();
    });
  });

  describe("Responsive behavior", () => {
    it("hides Vietnamese name column on smaller screens", () => {
      render(<MovieTable {...defaultProps} />);

      const vnHeader = screen.getByText("Name Movie (VN)");
      expect(vnHeader.closest("th")).toHaveClass("hidden", "xl:table-cell");
    });

    it("hides Version column on smaller screens", () => {
      render(<MovieTable {...defaultProps} />);

      const versionHeader = screen.getByText("Version");
      expect(versionHeader.closest("th")).toHaveClass(
        "hidden",
        "xl:table-cell"
      );
    });
  });

  describe("Edge cases", () => {
    it("handles empty movies array", () => {
      render(<MovieTable {...defaultProps} movies={[]} />);

      expect(screen.getByRole("table")).toBeInTheDocument();
      expect(screen.queryByTestId("eye-icon")).not.toBeInTheDocument();
    });

    it("handles movies with missing fields", () => {
      const incompleteMovie = [
        {
          MovieId: 999,
          NameOfEnglish: null,
          NameOfVietnamese: null,
          FromDate: null,
          ToDate: null,
          RunningTime: null,
          PosterImage: null,
        },
      ];

      render(<MovieTable {...defaultProps} movies={incompleteMovie} />);

      expect(screen.getByRole("table")).toBeInTheDocument();
    });

    it("handles invalid JSON in Version field gracefully", () => {
      const movieWithInvalidJSON = [
        {
          ...mockMovies[0],
          versions: null,
          Version: "invalid json {",
        },
      ];

      render(<MovieTable {...defaultProps} movies={movieWithInvalidJSON} />);

      expect(screen.getByText("invalid json {")).toBeInTheDocument();
    });
  });
});
