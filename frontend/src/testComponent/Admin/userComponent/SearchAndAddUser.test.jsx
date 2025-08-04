import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import SearchAndAdd from "../../../layouts/Admin/promotionComponent/SearchAndAdd";

// Mock the react-icons since they're not essential for testing
jest.mock("react-icons/io5", () => ({
  IoSearchOutline: () => <div data-testid="search-icon" />,
}));

jest.mock("react-icons/go", () => ({
  GoPlus: () => <div data-testid="plus-icon" />,
}));

describe("SearchAndAdd Component", () => {
  const defaultProps = {
    searchTerm: "",
    setSearchTerm: jest.fn(),
    showEditModal: false,
    setShowAddModal: jest.fn(),
    resetForm: jest.fn(),
    setCurrentPage: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Rendering", () => {
    it("renders the component with all elements", () => {
      render(<SearchAndAdd {...defaultProps} />);

      expect(screen.getByTestId("search-icon")).toBeInTheDocument();
      expect(screen.getByPlaceholderText("Search by name")).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /add promotion/i })
      ).toBeInTheDocument();
      expect(screen.getByTestId("plus-icon")).toBeInTheDocument();
    });

    it("displays the search input with correct placeholder", () => {
      render(<SearchAndAdd {...defaultProps} />);

      const searchInput = screen.getByPlaceholderText("Search by name");
      expect(searchInput).toBeInTheDocument();
      expect(searchInput).toHaveAttribute("type", "text");
    });

    it("displays the current search term in input", () => {
      const props = { ...defaultProps, searchTerm: "test search" };
      render(<SearchAndAdd {...props} />);

      const searchInput = screen.getByDisplayValue("test search");
      expect(searchInput).toBeInTheDocument();
    });
  });

  describe("Search Functionality", () => {
    it("calls setSearchTerm when typing in search input", () => {
      render(<SearchAndAdd {...defaultProps} />);

      const searchInput = screen.getByPlaceholderText("Search by name");
      fireEvent.change(searchInput, { target: { value: "john doe" } });

      expect(defaultProps.setSearchTerm).toHaveBeenCalledWith("john doe");
    });
  });

  describe("Add Promotion Button", () => {
    it("renders Add Promotion button when showEditModal is false", () => {
      const props = { ...defaultProps, showEditModal: false };
      render(<SearchAndAdd {...props} />);

      expect(
        screen.getByRole("button", { name: /add promotion/i })
      ).toBeInTheDocument();
    });
  });

  describe("CSS Classes and Styling", () => {
    it("applies correct CSS classes to main container", () => {
      const { container } = render(<SearchAndAdd {...defaultProps} />);

      const mainDiv = container.firstChild;
      expect(mainDiv).toHaveClass(
        "flex",
        "flex-col",
        "sm:flex-row",
        "items-center",
        "justify-between",
        "mb-4",
        "gap-2",
        "w-full"
      );
    });

    it("applies correct CSS classes to search input", () => {
      render(<SearchAndAdd {...defaultProps} />);

      const searchInput = screen.getByPlaceholderText("Search by name");
      expect(searchInput).toHaveClass(
        "p-1",
        "sm:p-2",
        "focus:outline-none",
        "w-full",
        "text-sm",
        "sm:text-base"
      );
    });

    it("applies correct CSS classes to Add Promotion button", () => {
      render(<SearchAndAdd {...defaultProps} />);

      const addButton = screen.getByRole("button", { name: /add promotion/i });
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

  describe("Accessibility", () => {
    it("has accessible button text", () => {
      render(<SearchAndAdd {...defaultProps} />);

      expect(
        screen.getByRole("button", { name: /add promotion/i })
      ).toBeInTheDocument();
    });
  });

  describe("Props Integration", () => {
    it("works with all props provided", () => {
      const props = {
        searchTerm: "initial search",
        setSearchTerm: jest.fn(),
        showEditModal: false,
        setShowAddModal: jest.fn(),
        resetForm: jest.fn(),
        setCurrentPage: jest.fn(),
      };

      render(<SearchAndAdd {...props} />);

      expect(screen.getByDisplayValue("initial search")).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /add promotion/i })
      ).toBeInTheDocument();
    });

    it("handles missing optional interactions gracefully", () => {
      // Test that component doesn't break if functions are undefined
      const props = {
        searchTerm: "",
        setSearchTerm: undefined,
        showEditModal: false,
        setShowAddModal: undefined,
        resetForm: undefined,
        setCurrentPage: undefined,
      };

      expect(() => render(<SearchAndAdd {...props} />)).not.toThrow();
    });
  });
});
