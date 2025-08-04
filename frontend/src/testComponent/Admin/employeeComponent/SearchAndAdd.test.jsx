/* eslint-disable no-undef */
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import SearchAndAdd from "../../../layouts/Admin/employeeComponent/SearchAndAdd";

// Mock react-icons
jest.mock("react-icons/io5", () => ({
  IoSearchOutline: ({ size }) => (
    <div data-testid="search-icon" data-size={size} />
  ),
}));

jest.mock("react-icons/go", () => ({
  GoPlus: ({ size, className }) => (
    <div data-testid="plus-icon" data-size={size} className={className} />
  ),
}));

describe("SearchAndAdd Component", () => {
  const defaultProps = {
    searchEmployee: "",
    setSearchEmployee: jest.fn(),
    setPage: jest.fn(),
    resetForm: jest.fn(),
    setShowAddForm: jest.fn(),
    showEditForm: false,
  };

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  describe("Rendering", () => {
    test("renders search input with correct placeholder", () => {
      render(<SearchAndAdd {...defaultProps} />);

      const searchInput = screen.getByPlaceholderText(
        "Search by name or email"
      );
      expect(searchInput).toBeInTheDocument();
      expect(searchInput).toHaveAttribute("type", "text");
    });

    test("renders search icon", () => {
      render(<SearchAndAdd {...defaultProps} />);

      const searchIcon = screen.getByTestId("search-icon");
      expect(searchIcon).toBeInTheDocument();
      expect(searchIcon).toHaveAttribute("data-size", "20");
    });

    test("renders Add Employee button when showEditForm is false", () => {
      render(<SearchAndAdd {...defaultProps} />);

      const addButton = screen.getByRole("button", { name: /add employee/i });
      expect(addButton).toBeInTheDocument();
    });

    test("does not render Add Employee button when showEditForm is true", () => {
      render(<SearchAndAdd {...defaultProps} showEditForm={true} />);

      const addButton = screen.queryByRole("button", { name: /add employee/i });
      expect(addButton).not.toBeInTheDocument();
    });

    test("renders plus icon in Add Employee button", () => {
      render(<SearchAndAdd {...defaultProps} />);

      const plusIcon = screen.getByTestId("plus-icon");
      expect(plusIcon).toBeInTheDocument();
      expect(plusIcon).toHaveAttribute("data-size", "18");
      expect(plusIcon).toHaveClass("mr-1", "sm:mr-2");
    });
  });

  describe("Search Functionality", () => {
    test("displays current search value in input", () => {
      const searchValue = "John Doe";
      render(<SearchAndAdd {...defaultProps} searchEmployee={searchValue} />);

      const searchInput = screen.getByDisplayValue(searchValue);
      expect(searchInput).toBeInTheDocument();
    });

    test("calls setSearchEmployee and setPage when typing in search input", () => {
      const setSearchEmployee = jest.fn();
      const setPage = jest.fn();

      render(
        <SearchAndAdd
          {...defaultProps}
          setSearchEmployee={setSearchEmployee}
          setPage={setPage}
        />
      );

      const searchInput = screen.getByPlaceholderText(
        "Search by name or email"
      );
      fireEvent.change(searchInput, { target: { value: "Jane Smith" } });

      expect(setSearchEmployee).toHaveBeenCalledWith("Jane Smith");
      expect(setPage).toHaveBeenCalledWith(1);
      expect(setSearchEmployee).toHaveBeenCalledTimes(1);
      expect(setPage).toHaveBeenCalledTimes(1);
    });

    test("calls setSearchEmployee with empty string when input is cleared", () => {
      const setSearchEmployee = jest.fn();
      const setPage = jest.fn();

      render(
        <SearchAndAdd
          {...defaultProps}
          searchEmployee="existing search"
          setSearchEmployee={setSearchEmployee}
          setPage={setPage}
        />
      );

      const searchInput = screen.getByDisplayValue("existing search");
      fireEvent.change(searchInput, { target: { value: "" } });

      expect(setSearchEmployee).toHaveBeenCalledWith("");
      expect(setPage).toHaveBeenCalledWith(1);
    });
  });

  describe("Add Employee Button Functionality", () => {
    test("calls resetForm and setShowAddForm when Add Employee button is clicked", () => {
      const resetForm = jest.fn();
      const setShowAddForm = jest.fn();

      render(
        <SearchAndAdd
          {...defaultProps}
          resetForm={resetForm}
          setShowAddForm={setShowAddForm}
        />
      );

      const addButton = screen.getByRole("button", { name: /add employee/i });
      fireEvent.click(addButton);

      expect(resetForm).toHaveBeenCalledTimes(1);
      expect(setShowAddForm).toHaveBeenCalledWith(true);
    });

    test("Add Employee button has correct styling classes", () => {
      render(<SearchAndAdd {...defaultProps} />);

      const addButton = screen.getByRole("button", { name: /add employee/i });
      expect(addButton).toHaveClass(
        "flex",
        "items-center",
        "text-indigo-600",
        "hover:bg-gray-50",
        "p-2",
        "rounded-lg",
        "active:bg-gray-100",
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
    test("shows Add Employee button when showEditForm is false", () => {
      render(<SearchAndAdd {...defaultProps} showEditForm={false} />);

      const addButton = screen.getByRole("button", { name: /add employee/i });
      expect(addButton).toBeInTheDocument();
    });

    test("hides Add Employee button when showEditForm is true", () => {
      render(<SearchAndAdd {...defaultProps} showEditForm={true} />);

      const addButton = screen.queryByRole("button", { name: /add employee/i });
      expect(addButton).not.toBeInTheDocument();
    });
  });

  describe("Component Structure", () => {
    test("has correct main container classes", () => {
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

    test("search container has correct classes", () => {
      render(<SearchAndAdd {...defaultProps} />);

      const searchInput = screen.getByPlaceholderText(
        "Search by name or email"
      );
      const searchContainer = searchInput.closest(".flex.items-center");

      expect(searchContainer).toHaveClass(
        "flex",
        "items-center",
        "p-1",
        "px-2",
        "w-full",
        "max-w-[400px]",
        "rounded-lg",
        "bg-white",
        "shadow-sm"
      );
    });

    test("search input has correct classes", () => {
      render(<SearchAndAdd {...defaultProps} />);

      const searchInput = screen.getByPlaceholderText(
        "Search by name or email"
      );
      expect(searchInput).toHaveClass(
        "p-1",
        "sm:p-2",
        "focus:outline-none",
        "w-full",
        "text-sm",
        "sm:text-base"
      );
    });
  });

  describe("Accessibility", () => {
    test("search input is accessible by placeholder text", () => {
      render(<SearchAndAdd {...defaultProps} />);

      const searchInput = screen.getByPlaceholderText(
        "Search by name or email"
      );
      expect(searchInput).toBeInTheDocument();
    });

    test("Add Employee button is accessible by role and name", () => {
      render(<SearchAndAdd {...defaultProps} />);

      const addButton = screen.getByRole("button", { name: /add employee/i });
      expect(addButton).toBeInTheDocument();
    });

    test("search input can receive focus", () => {
      render(<SearchAndAdd {...defaultProps} />);

      const searchInput = screen.getByPlaceholderText(
        "Search by name or email"
      );
      searchInput.focus();
      expect(searchInput).toHaveFocus();
    });
  });

  describe("Integration Tests", () => {
    test("complete search flow works correctly", () => {
      const mockProps = {
        searchEmployee: "",
        setSearchEmployee: jest.fn(),
        setPage: jest.fn(),
        resetForm: jest.fn(),
        setShowAddForm: jest.fn(),
        showEditForm: false,
      };

      render(<SearchAndAdd {...mockProps} />);

      const searchInput = screen.getByPlaceholderText(
        "Search by name or email"
      );

      // Type in search
      fireEvent.change(searchInput, { target: { value: "test search" } });

      // Verify both functions were called
      expect(mockProps.setSearchEmployee).toHaveBeenCalledWith("test search");
      expect(mockProps.setPage).toHaveBeenCalledWith(1);
    });

    test("complete add employee flow works correctly", () => {
      const mockProps = {
        searchEmployee: "",
        setSearchEmployee: jest.fn(),
        setPage: jest.fn(),
        resetForm: jest.fn(),
        setShowAddForm: jest.fn(),
        showEditForm: false,
      };

      render(<SearchAndAdd {...mockProps} />);

      const addButton = screen.getByRole("button", { name: /add employee/i });
      fireEvent.click(addButton);

      // Verify both functions were called
      expect(mockProps.resetForm).toHaveBeenCalledTimes(1);
      expect(mockProps.setShowAddForm).toHaveBeenCalledWith(true);
    });
  });
});
