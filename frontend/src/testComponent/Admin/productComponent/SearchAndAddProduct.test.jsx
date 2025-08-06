/* eslint-disable no-undef */
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import SearchAndAdd from "../../../layouts/Admin/productComponent/SearchAndAdd";

// Mock các icon components
jest.mock("react-icons/io5", () => ({
  IoSearchOutline: () => <div data-testid="search-icon">Search</div>,
}));

jest.mock("react-icons/go", () => ({
  GoPlus: () => <div data-testid="plus-icon">Plus</div>,
}));

describe("SearchAndAdd", () => {
  // Mock functions
  const mockSetSearchTerm = jest.fn();
  const mockSetShowFormPopup = jest.fn();
  const mockResetForm = jest.fn();

  const defaultProps = {
    searchTerm: "",
    setSearchTerm: mockSetSearchTerm,
    isEdit: false,
    setShowFormPopup: mockSetShowFormPopup,
    resetForm: mockResetForm,
  };

  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
  });

  describe("Rendering", () => {
    test("renders search input with placeholder", () => {
      render(<SearchAndAdd {...defaultProps} />);

      const searchInput = screen.getByPlaceholderText("Search by product name");
      expect(searchInput).toBeInTheDocument();
      expect(searchInput).toHaveAttribute("type", "text");
    });

    test("renders search icon", () => {
      render(<SearchAndAdd {...defaultProps} />);

      expect(screen.getByTestId("search-icon")).toBeInTheDocument();
    });

    test("renders add product button when not in edit mode", () => {
      render(<SearchAndAdd {...defaultProps} />);

      const addButton = screen.getByRole("button", { name: /add product/i });
      expect(addButton).toBeInTheDocument();
      expect(screen.getByTestId("plus-icon")).toBeInTheDocument();
    });

    test("does not render add product button when in edit mode", () => {
      render(<SearchAndAdd {...defaultProps} isEdit={true} />);

      const addButton = screen.queryByRole("button", { name: /add product/i });
      expect(addButton).not.toBeInTheDocument();
    });

    test("displays current search term value", () => {
      const searchTerm = "test product";
      render(<SearchAndAdd {...defaultProps} searchTerm={searchTerm} />);

      const searchInput = screen.getByDisplayValue(searchTerm);
      expect(searchInput).toBeInTheDocument();
    });
  });

  describe("Search Functionality", () => {
    test("calls setSearchTerm when typing in search input", async () => {
      const user = userEvent.setup();
      render(<SearchAndAdd {...defaultProps} />);

      const searchInput = screen.getByPlaceholderText("Search by product name");
      await user.type(searchInput, "test");

      // Should be called for each character typed
      expect(mockSetSearchTerm).toHaveBeenCalledTimes(4);
      expect(mockSetSearchTerm).toHaveBeenCalledWith("t");
      expect(mockSetSearchTerm).toHaveBeenCalledWith("e");
      expect(mockSetSearchTerm).toHaveBeenCalledWith("s");
      expect(mockSetSearchTerm).toHaveBeenCalledWith("t");
    });

    test("calls setSearchTerm with correct value on input change", () => {
      render(<SearchAndAdd {...defaultProps} />);

      const searchInput = screen.getByPlaceholderText("Search by product name");
      fireEvent.change(searchInput, { target: { value: "new search term" } });

      expect(mockSetSearchTerm).toHaveBeenCalledWith("new search term");
      expect(mockSetSearchTerm).toHaveBeenCalledTimes(1);
    });

    test("handles empty search input", () => {
      render(<SearchAndAdd {...defaultProps} searchTerm="existing text" />);

      const searchInput = screen.getByDisplayValue("existing text");
      fireEvent.change(searchInput, { target: { value: "" } });

      expect(mockSetSearchTerm).toHaveBeenCalledWith("");
    });

    test("handles special characters in search input", () => {
      render(<SearchAndAdd {...defaultProps} />);

      const searchInput = screen.getByPlaceholderText("Search by product name");
      const specialText = "!@#$%^&*()";
      fireEvent.change(searchInput, { target: { value: specialText } });

      expect(mockSetSearchTerm).toHaveBeenCalledWith(specialText);
    });
  });

  describe("Add Product Button", () => {
    test("calls resetForm and setShowFormPopup when add button is clicked", () => {
      render(<SearchAndAdd {...defaultProps} />);

      const addButton = screen.getByRole("button", { name: /add product/i });
      fireEvent.click(addButton);

      expect(mockResetForm).toHaveBeenCalledTimes(1);
      expect(mockSetShowFormPopup).toHaveBeenCalledWith(true);
      expect(mockSetShowFormPopup).toHaveBeenCalledTimes(1);
    });

    test("add button has correct styling classes", () => {
      render(<SearchAndAdd {...defaultProps} />);

      const addButton = screen.getByRole("button", { name: /add product/i });
      expect(addButton).toHaveClass(
        "flex",
        "items-center",
        "text-[#6051F3]",
        "hover:bg-slate-50",
        "p-2",
        "rounded-md",
        "active:bg-slate-100",
        "bg-white",
        "shadow-sm"
      );
    });
  });

  describe("Component Structure and Styling", () => {
    test("has correct container structure and classes", () => {
      const { container } = render(<SearchAndAdd {...defaultProps} />);

      const mainContainer = container.firstChild;
      expect(mainContainer).toHaveClass(
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

    test("search container has correct styling", () => {
      render(<SearchAndAdd {...defaultProps} />);

      const searchInput = screen.getByPlaceholderText("Search by product name");
      const searchContainer = searchInput.parentElement;

      expect(searchContainer).toHaveClass(
        "flex",
        "items-center",
        "p-1",
        "px-2",
        "w-full",
        "max-w-[400px]",
        "rounded-xl",
        "bg-white",
        "shadow-sm"
      );
    });

    test("search input has correct styling", () => {
      render(<SearchAndAdd {...defaultProps} />);

      const searchInput = screen.getByPlaceholderText("Search by product name");
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

  describe("Conditional Rendering Based on Props", () => {
    test("shows different states based on isEdit prop", () => {
      const { rerender } = render(
        <SearchAndAdd {...defaultProps} isEdit={false} />
      );

      // Should show add button when not editing
      expect(
        screen.getByRole("button", { name: /add product/i })
      ).toBeInTheDocument();

      // Rerender with edit mode
      rerender(<SearchAndAdd {...defaultProps} isEdit={true} />);

      // Should not show add button when editing
      expect(
        screen.queryByRole("button", { name: /add product/i })
      ).not.toBeInTheDocument();
    });

    test("handles different searchTerm values correctly", () => {
      const { rerender } = render(
        <SearchAndAdd {...defaultProps} searchTerm="" />
      );

      let searchInput = screen.getByPlaceholderText("Search by product name");
      expect(searchInput).toHaveValue("");

      rerender(<SearchAndAdd {...defaultProps} searchTerm="test search" />);

      searchInput = screen.getByPlaceholderText("Search by product name");
      expect(searchInput).toHaveValue("test search");
    });
  });

  describe("Accessibility", () => {
    test("search input is accessible via label/placeholder", () => {
      render(<SearchAndAdd {...defaultProps} />);

      const searchInput = screen.getByPlaceholderText("Search by product name");
      expect(searchInput).toBeInTheDocument();
      expect(searchInput).toHaveAttribute(
        "placeholder",
        "Search by product name"
      );
    });

    test("add button is accessible and has proper text content", () => {
      render(<SearchAndAdd {...defaultProps} />);

      const addButton = screen.getByRole("button", { name: /add product/i });
      expect(addButton).toBeInTheDocument();
      expect(addButton).toHaveTextContent("Add Product");
    });

    test("component maintains focus behavior", () => {
      render(<SearchAndAdd {...defaultProps} />);

      const searchInput = screen.getByPlaceholderText("Search by product name");
      searchInput.focus();

      expect(searchInput).toHaveFocus();
    });
  });

  describe("Edge Cases", () => {
    test("handles undefined or null searchTerm gracefully", () => {
      render(<SearchAndAdd {...defaultProps} searchTerm={null} />);

      const searchInput = screen.getByPlaceholderText("Search by product name");
      expect(searchInput).toHaveValue("");
    });

    test("handles missing callback functions gracefully", () => {
      const propsWithoutCallbacks = {
        searchTerm: "",
        setSearchTerm: undefined,
        isEdit: false,
        setShowFormPopup: undefined,
        resetForm: undefined,
      };

      // Should not throw error when rendering
      expect(() => {
        render(<SearchAndAdd {...propsWithoutCallbacks} />);
      }).not.toThrow();
    });
  });

  describe("Integration Tests", () => {
    test("complete user workflow - search and add", async () => {
      const user = userEvent.setup();
      render(<SearchAndAdd {...defaultProps} />);

      // User types in search
      const searchInput = screen.getByPlaceholderText("Search by product name");
      await user.type(searchInput, "test");

      // User clicks add button
      const addButton = screen.getByRole("button", { name: /add product/i });
      await user.click(addButton);

      // Verify all expected functions were called
      expect(mockSetSearchTerm).toHaveBeenCalled();
      expect(mockResetForm).toHaveBeenCalledTimes(1);
      expect(mockSetShowFormPopup).toHaveBeenCalledWith(true);
    });
  });
});
