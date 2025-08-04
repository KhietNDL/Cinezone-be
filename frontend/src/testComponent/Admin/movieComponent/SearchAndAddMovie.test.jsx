/* eslint-disable no-undef */
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import SearchAndAdd from "../../../layouts/Admin/movieComponent/SearchAndAdd";

// Mock react-icons
jest.mock("react-icons/io5", () => ({
  IoSearchOutline: () => <div data-testid="search-icon">Search</div>,
}));

jest.mock("react-icons/go", () => ({
  GoPlus: () => <div data-testid="plus-icon">Plus</div>,
}));

describe("SearchAndAdd", () => {
  const mockSetSearchMovie = jest.fn();
  const mockSetShowAddForm = jest.fn();

  const defaultProps = {
    searchMovie: "",
    setSearchMovie: mockSetSearchMovie,
    setShowAddForm: mockSetShowAddForm,
    showEditForm: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Basic Rendering", () => {
    it("renders the search and add component with correct structure", () => {
      render(<SearchAndAdd {...defaultProps} />);

      expect(screen.getByTestId("search-icon")).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText("Search by movie name (ENG or VN)")
      ).toBeInTheDocument();
      expect(screen.getByText("Add Movie")).toBeInTheDocument();
    });

    it("renders search input with correct attributes", () => {
      render(<SearchAndAdd {...defaultProps} />);

      const searchInput = screen.getByPlaceholderText(
        "Search by movie name (ENG or VN)"
      );
      expect(searchInput).toHaveAttribute("type", "text");
      expect(searchInput).toHaveAttribute("value", "");
    });

    it("renders add movie button with correct text and icon", () => {
      render(<SearchAndAdd {...defaultProps} />);

      expect(screen.getByText("Add Movie")).toBeInTheDocument();
      expect(screen.getByTestId("plus-icon")).toBeInTheDocument();
    });

    it("applies correct CSS classes to container", () => {
      render(<SearchAndAdd {...defaultProps} />);

      const container = document.querySelector(".flex.flex-col");
      expect(container).toHaveClass(
        "sm:flex-row",
        "items-center",
        "justify-between",
        "mb-4",
        "gap-2",
        "w-full"
      );
    });

    it("applies correct CSS classes to search container", () => {
      render(<SearchAndAdd {...defaultProps} />);

      const searchContainer = document.querySelector(".flex.items-center.p-1");
      expect(searchContainer).toHaveClass(
        "px-2",
        "w-full",
        "max-w-[400px]",
        "rounded-xl",
        "bg-white",
        "shadow-sm"
      );
    });
  });

  describe("Search Functionality", () => {
    it("displays current search value in input", () => {
      render(<SearchAndAdd {...defaultProps} searchMovie="Avengers" />);

      const searchInput = screen.getByPlaceholderText(
        "Search by movie name (ENG or VN)"
      );
      expect(searchInput).toHaveValue("Avengers");
    });

    it("calls setSearchMovie when input value changes", () => {
      render(<SearchAndAdd {...defaultProps} />);

      const searchInput = screen.getByPlaceholderText(
        "Search by movie name (ENG or VN)"
      );
      fireEvent.change(searchInput, { target: { value: "Spider-Man" } });

      expect(mockSetSearchMovie).toHaveBeenCalledWith("Spider-Man");
      expect(mockSetSearchMovie).toHaveBeenCalledTimes(1);
    });

    it("calls setSearchMovie with empty string when input is cleared", () => {
      render(<SearchAndAdd {...defaultProps} searchMovie="Initial search" />);

      const searchInput = screen.getByPlaceholderText(
        "Search by movie name (ENG or VN)"
      );
      fireEvent.change(searchInput, { target: { value: "" } });

      expect(mockSetSearchMovie).toHaveBeenCalledWith("");
    });

    it("handles multiple rapid input changes", () => {
      render(<SearchAndAdd {...defaultProps} />);

      const searchInput = screen.getByPlaceholderText(
        "Search by movie name (ENG or VN)"
      );

      fireEvent.change(searchInput, { target: { value: "A" } });
      fireEvent.change(searchInput, { target: { value: "Av" } });
      fireEvent.change(searchInput, { target: { value: "Ave" } });

      expect(mockSetSearchMovie).toHaveBeenCalledTimes(3);
      expect(mockSetSearchMovie).toHaveBeenNthCalledWith(1, "A");
      expect(mockSetSearchMovie).toHaveBeenNthCalledWith(2, "Av");
      expect(mockSetSearchMovie).toHaveBeenNthCalledWith(3, "Ave");
    });

    it("handles special characters in search input", () => {
      render(<SearchAndAdd {...defaultProps} />);

      const searchInput = screen.getByPlaceholderText(
        "Search by movie name (ENG or VN)"
      );
      fireEvent.change(searchInput, {
        target: { value: "Movie: Title (2023)" },
      });

      expect(mockSetSearchMovie).toHaveBeenCalledWith("Movie: Title (2023)");
    });

    it("handles unicode characters in search input", () => {
      render(<SearchAndAdd {...defaultProps} />);

      const searchInput = screen.getByPlaceholderText(
        "Search by movie name (ENG or VN)"
      );
      fireEvent.change(searchInput, {
        target: { value: "Biệt đội siêu anh hùng" },
      });

      expect(mockSetSearchMovie).toHaveBeenCalledWith("Biệt đội siêu anh hùng");
    });
  });

  describe("Add Movie Button", () => {
    it("calls setShowAddForm when add movie button is clicked", () => {
      render(<SearchAndAdd {...defaultProps} />);

      const addButton = screen.getByText("Add Movie");
      fireEvent.click(addButton);

      expect(mockSetShowAddForm).toHaveBeenCalledWith(true);
      expect(mockSetShowAddForm).toHaveBeenCalledTimes(1);
    });

    it("applies correct CSS classes to add movie button", () => {
      render(<SearchAndAdd {...defaultProps} />);

      const addButton = screen.getByText("Add Movie");
      expect(addButton).toHaveClass(
        "flex",
        "items-center",
        "text-[#6051F3]",
        "hover:bg-slate-50",
        "p-2",
        "rounded-md",
        "active:bg-slate-100",
        "bg-white",
        "shadow-sm",
        "w-full",
        "sm:w-auto",
        "text-sm",
        "sm:text-base"
      );
    });
  });

  describe("Conditional Rendering", () => {
    it("shows add movie button when showEditForm is false", () => {
      render(<SearchAndAdd {...defaultProps} showEditForm={false} />);

      expect(screen.getByText("Add Movie")).toBeInTheDocument();
    });

    it("hides add movie button when showEditForm is true", () => {
      render(<SearchAndAdd {...defaultProps} showEditForm={true} />);

      expect(screen.queryByText("Add Movie")).not.toBeInTheDocument();
    });

    it("always shows search input regardless of showEditForm value", () => {
      const { rerender } = render(
        <SearchAndAdd {...defaultProps} showEditForm={false} />
      );
      expect(
        screen.getByPlaceholderText("Search by movie name (ENG or VN)")
      ).toBeInTheDocument();

      rerender(<SearchAndAdd {...defaultProps} showEditForm={true} />);
      expect(
        screen.getByPlaceholderText("Search by movie name (ENG or VN)")
      ).toBeInTheDocument();
    });
  });

  describe("Input Focus and Interaction", () => {
    it("allows input to receive focus", () => {
      render(<SearchAndAdd {...defaultProps} />);

      const searchInput = screen.getByPlaceholderText(
        "Search by movie name (ENG or VN)"
      );
      searchInput.focus();

      expect(searchInput).toHaveFocus();
    });

    it("applies focus:outline-none class to input", () => {
      render(<SearchAndAdd {...defaultProps} />);

      const searchInput = screen.getByPlaceholderText(
        "Search by movie name (ENG or VN)"
      );
      expect(searchInput).toHaveClass("focus:outline-none");
    });

    it("maintains input value during focus/blur cycles", () => {
      render(<SearchAndAdd {...defaultProps} searchMovie="Test Movie" />);

      const searchInput = screen.getByPlaceholderText(
        "Search by movie name (ENG or VN)"
      );

      searchInput.focus();
      expect(searchInput).toHaveValue("Test Movie");

      searchInput.blur();
      expect(searchInput).toHaveValue("Test Movie");
    });
  });

  describe("Responsive Design", () => {
    it("applies responsive classes to main container", () => {
      render(<SearchAndAdd {...defaultProps} />);

      const container = document.querySelector(".flex-col.sm\\:flex-row");
      expect(container).toBeTruthy();
    });

    it("applies responsive classes to search input", () => {
      render(<SearchAndAdd {...defaultProps} />);

      const searchInput = screen.getByPlaceholderText(
        "Search by movie name (ENG or VN)"
      );
      expect(searchInput).toHaveClass(
        "p-1",
        "sm:p-2",
        "text-sm",
        "sm:text-base"
      );
    });

    it("applies responsive classes to add button", () => {
      render(<SearchAndAdd {...defaultProps} />);

      const addButton = screen.getByText("Add Movie");
      expect(addButton).toHaveClass(
        "w-full",
        "sm:w-auto",
        "text-sm",
        "sm:text-base"
      );
    });
  });

  describe("Button Interactions", () => {
    it("handles multiple clicks on add movie button", () => {
      render(<SearchAndAdd {...defaultProps} />);

      const addButton = screen.getByText("Add Movie");

      fireEvent.click(addButton);
      fireEvent.click(addButton);
      fireEvent.click(addButton);

      expect(mockSetShowAddForm).toHaveBeenCalledTimes(3);
      expect(mockSetShowAddForm).toHaveBeenCalledWith(true);
    });

    it("supports keyboard interaction on add movie button", () => {
      render(<SearchAndAdd {...defaultProps} />);

      const addButton = screen.getByText("Add Movie");

      addButton.focus();
      expect(addButton).toHaveFocus();

      fireEvent.keyDown(addButton, { key: "Enter" });
      // Note: This test assumes standard button behavior for keyboard events
    });
  });

  describe("Props Validation", () => {
    it("handles undefined searchMovie prop gracefully", () => {
      const propsWithoutSearchMovie = {
        setSearchMovie: mockSetSearchMovie,
        setShowAddForm: mockSetShowAddForm,
        showEditForm: false,
      };

      render(<SearchAndAdd {...propsWithoutSearchMovie} />);

      const searchInput = screen.getByPlaceholderText(
        "Search by movie name (ENG or VN)"
      );
      expect(searchInput).toHaveValue("");
    });

    it("handles null searchMovie prop gracefully", () => {
      render(<SearchAndAdd {...defaultProps} searchMovie={null} />);

      const searchInput = screen.getByPlaceholderText(
        "Search by movie name (ENG or VN)"
      );
      expect(searchInput).toHaveValue("");
    });
  });

  describe("Edge Cases", () => {
    it("handles very long search strings", () => {
      const longSearchString = "A".repeat(1000);
      render(<SearchAndAdd {...defaultProps} />);

      const searchInput = screen.getByPlaceholderText(
        "Search by movie name (ENG or VN)"
      );
      fireEvent.change(searchInput, { target: { value: longSearchString } });

      expect(mockSetSearchMovie).toHaveBeenCalledWith(longSearchString);
    });

    it("handles search input with only whitespace", () => {
      render(<SearchAndAdd {...defaultProps} />);

      const searchInput = screen.getByPlaceholderText(
        "Search by movie name (ENG or VN)"
      );
      fireEvent.change(searchInput, { target: { value: "   " } });

      expect(mockSetSearchMovie).toHaveBeenCalledWith("   ");
    });
  });

  describe("Icon Rendering", () => {
    it("renders search icon correctly", () => {
      render(<SearchAndAdd {...defaultProps} />);

      expect(screen.getByTestId("search-icon")).toBeInTheDocument();
    });

    it("renders plus icon correctly when add button is visible", () => {
      render(<SearchAndAdd {...defaultProps} showEditForm={false} />);

      expect(screen.getByTestId("plus-icon")).toBeInTheDocument();
    });

    it("does not render plus icon when add button is hidden", () => {
      render(<SearchAndAdd {...defaultProps} showEditForm={true} />);

      expect(screen.queryByTestId("plus-icon")).not.toBeInTheDocument();
    });
  });
});
