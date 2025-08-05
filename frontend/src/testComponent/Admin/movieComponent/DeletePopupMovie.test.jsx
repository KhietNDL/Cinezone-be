/* eslint-disable no-undef */
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import DeletePopup from "../../../layouts/Admin/movieComponent/DeletePopup";

// Mock react-icons
jest.mock("react-icons/md", () => ({
  MdDeleteForever: ({ className, size }) => (
    <div data-testid="delete-icon" className={className} data-size={size} />
  ),
}));

describe("DeletePopup Component", () => {
  const mockSelectedMovie = {
    id: 1,
    NameOfEnglish: "The Avengers",
    genre: "Action",
  };

  const defaultProps = {
    confirmDelete: jest.fn(),
    setShowDeletePopup: jest.fn(),
    selectedMovie: mockSelectedMovie,
  };

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  describe("Rendering", () => {
    test("renders the popup with correct structure", () => {
      render(<DeletePopup {...defaultProps} />);

      // Check for overlay
      const overlay = screen
        .getByRole("button", { name: /cancel/i })
        .closest(".fixed");
      expect(overlay).toHaveClass(
        "fixed",
        "inset-0",
        "bg-black/30",
        "bg-opacity-50"
      );

      // Check for popup container
      const popup = screen.getByText("Delete Movie").closest(".bg-white");
      expect(popup).toHaveClass("bg-white", "rounded-lg", "p-6", "w-[400px]");
    });

    test("renders delete icon with correct props", () => {
      render(<DeletePopup {...defaultProps} />);

      const deleteIcon = screen.getByTestId("delete-icon");
      expect(deleteIcon).toBeInTheDocument();
      expect(deleteIcon).toHaveClass("text-red-500");
      expect(deleteIcon).toHaveAttribute("data-size", "24");
    });

    test("renders title correctly", () => {
      render(<DeletePopup {...defaultProps} />);

      const title = screen.getByText("Delete Movie");
      expect(title).toBeInTheDocument();
      expect(title).toHaveClass("text-lg", "font-semibold", "mb-2");
    });

    test("renders confirmation message with movie name", () => {
      render(<DeletePopup {...defaultProps} />);

      const message = screen.getByText(/Are you sure you want to delete/);
      expect(message).toBeInTheDocument();

      const movieName = screen.getByText("The Avengers");
      expect(movieName).toBeInTheDocument();
      expect(movieName.tagName).toBe("STRONG");
    });

    test("renders warning text", () => {
      render(<DeletePopup {...defaultProps} />);

      const warningText = screen.getByText(/This action cannot be undone/);
      expect(warningText).toBeInTheDocument();
    });

    test("renders Cancel button with correct styling", () => {
      render(<DeletePopup {...defaultProps} />);

      const cancelButton = screen.getByRole("button", { name: /cancel/i });
      expect(cancelButton).toBeInTheDocument();
      expect(cancelButton).toHaveClass(
        "px-4",
        "py-2",
        "bg-gray-300",
        "text-gray-700",
        "rounded",
        "hover:bg-gray-400"
      );
    });

    test("renders Delete button with correct styling", () => {
      render(<DeletePopup {...defaultProps} />);

      const deleteButton = screen.getByRole("button", { name: /delete/i });
      expect(deleteButton).toBeInTheDocument();
      expect(deleteButton).toHaveClass(
        "px-4",
        "py-2",
        "bg-red-500",
        "text-white",
        "rounded",
        "hover:bg-red-600"
      );
    });
  });

  describe("Movie Data Handling", () => {
    test("displays movie name when selectedMovie is provided", () => {
      render(<DeletePopup {...defaultProps} />);

      const movieName = screen.getByText("The Avengers");
      expect(movieName).toBeInTheDocument();
    });

    test("handles selectedMovie with different name", () => {
      const differentMovie = {
        id: 2,
        NameOfEnglish: "Inception",
      };

      render(<DeletePopup {...defaultProps} selectedMovie={differentMovie} />);

      const movieName = screen.getByText("Inception");
      expect(movieName).toBeInTheDocument();
    });

    test("handles case when selectedMovie is null", () => {
      render(<DeletePopup {...defaultProps} selectedMovie={null} />);

      // Should still render the component without crashing
      const title = screen.getByText("Delete Movie");
      expect(title).toBeInTheDocument();

      // Movie name should not be present
      expect(screen.queryByText("The Avengers")).not.toBeInTheDocument();
    });

    test("handles case when selectedMovie is undefined", () => {
      render(<DeletePopup {...defaultProps} selectedMovie={undefined} />);

      const title = screen.getByText("Delete Movie");
      expect(title).toBeInTheDocument();
    });

    test("handles case when NameOfEnglish is empty string", () => {
      const movieWithEmptyName = {
        id: 3,
        NameOfEnglish: "",
      };

      render(
        <DeletePopup {...defaultProps} selectedMovie={movieWithEmptyName} />
      );

      const title = screen.getByText("Delete Movie");
      expect(title).toBeInTheDocument();
    });
  });

  describe("Button Functionality", () => {
    test("calls setShowDeletePopup(false) when Cancel button is clicked", () => {
      const setShowDeletePopup = jest.fn();

      render(
        <DeletePopup
          {...defaultProps}
          setShowDeletePopup={setShowDeletePopup}
        />
      );

      const cancelButton = screen.getByRole("button", { name: /cancel/i });
      fireEvent.click(cancelButton);

      expect(setShowDeletePopup).toHaveBeenCalledWith(false);
      expect(setShowDeletePopup).toHaveBeenCalledTimes(1);
    });

    test("calls confirmDelete when Delete button is clicked", () => {
      const confirmDelete = jest.fn();

      render(<DeletePopup {...defaultProps} confirmDelete={confirmDelete} />);

      const deleteButton = screen.getByRole("button", { name: /delete/i });
      fireEvent.click(deleteButton);

      expect(confirmDelete).toHaveBeenCalledTimes(1);
    });

    test("does not call confirmDelete when Cancel button is clicked", () => {
      const confirmDelete = jest.fn();

      render(<DeletePopup {...defaultProps} confirmDelete={confirmDelete} />);

      const cancelButton = screen.getByRole("button", { name: /cancel/i });
      fireEvent.click(cancelButton);

      expect(confirmDelete).not.toHaveBeenCalled();
    });

    test("does not call setShowDeletePopup when Delete button is clicked", () => {
      const setShowDeletePopup = jest.fn();

      render(
        <DeletePopup
          {...defaultProps}
          setShowDeletePopup={setShowDeletePopup}
        />
      );

      const deleteButton = screen.getByRole("button", { name: /delete/i });
      fireEvent.click(deleteButton);

      expect(setShowDeletePopup).not.toHaveBeenCalled();
    });
  });

  describe("Component Structure and Styling", () => {
    test("has correct overlay structure", () => {
      const { container } = render(<DeletePopup {...defaultProps} />);

      const overlay = container.firstChild;
      expect(overlay).toHaveClass(
        "fixed",
        "inset-0",
        "bg-black/30",
        "bg-opacity-50",
        "flex",
        "items-center",
        "justify-center",
        "z-50"
      );
    });

    test("has correct popup container structure", () => {
      render(<DeletePopup {...defaultProps} />);

      const popup = screen.getByText("Delete Movie").closest(".bg-white");
      expect(popup).toHaveClass("bg-white", "rounded-lg", "p-6", "w-[400px]");
    });

    test("has correct icon container styling", () => {
      render(<DeletePopup {...defaultProps} />);

      const iconContainer = screen.getByTestId("delete-icon").closest(".w-12");
      expect(iconContainer).toHaveClass(
        "mx-auto",
        "w-12",
        "h-12",
        "bg-red-100",
        "rounded-full",
        "flex",
        "items-center",
        "justify-center",
        "mb-4"
      );
    });

    test("has correct button container styling", () => {
      render(<DeletePopup {...defaultProps} />);

      const cancelButton = screen.getByRole("button", { name: /cancel/i });
      const buttonContainer = cancelButton.parentElement;

      expect(buttonContainer).toHaveClass(
        "flex",
        "justify-center",
        "space-x-3"
      );
    });

    test("has correct text styling", () => {
      render(<DeletePopup {...defaultProps} />);

      const description = screen
        .getByText(/Are you sure you want to delete/)
        .closest("p");
      expect(description).toHaveClass("text-gray-600", "mb-6");
    });
  });

  describe("Accessibility", () => {
    test("buttons are accessible by role and name", () => {
      render(<DeletePopup {...defaultProps} />);

      const cancelButton = screen.getByRole("button", { name: /cancel/i });
      const deleteButton = screen.getByRole("button", { name: /delete/i });

      expect(cancelButton).toBeInTheDocument();
      expect(deleteButton).toBeInTheDocument();
    });

    test("has proper heading structure", () => {
      render(<DeletePopup {...defaultProps} />);

      const heading = screen.getByRole("heading", { name: /delete movie/i });
      expect(heading).toBeInTheDocument();
      expect(heading.tagName).toBe("H3");
    });

    test("has proper focus management", () => {
      render(<DeletePopup {...defaultProps} />);

      const cancelButton = screen.getByRole("button", { name: /cancel/i });
      const deleteButton = screen.getByRole("button", { name: /delete/i });

      cancelButton.focus();
      expect(cancelButton).toHaveFocus();

      deleteButton.focus();
      expect(deleteButton).toHaveFocus();
    });
  });

  describe("Integration Tests", () => {
    test("complete cancel flow works correctly", () => {
      const mockProps = {
        confirmDelete: jest.fn(),
        setShowDeletePopup: jest.fn(),
        selectedMovie: mockSelectedMovie,
      };

      render(<DeletePopup {...mockProps} />);

      // Verify movie name is displayed
      expect(screen.getByText("The Avengers")).toBeInTheDocument();

      // Click cancel
      const cancelButton = screen.getByRole("button", { name: /cancel/i });
      fireEvent.click(cancelButton);

      // Verify only setShowDeletePopup was called
      expect(mockProps.setShowDeletePopup).toHaveBeenCalledWith(false);
      expect(mockProps.confirmDelete).not.toHaveBeenCalled();
    });

    test("complete delete flow works correctly", () => {
      const mockProps = {
        confirmDelete: jest.fn(),
        setShowDeletePopup: jest.fn(),
        selectedMovie: mockSelectedMovie,
      };

      render(<DeletePopup {...mockProps} />);

      // Verify movie name is displayed
      expect(screen.getByText("The Avengers")).toBeInTheDocument();

      // Click delete
      const deleteButton = screen.getByRole("button", { name: /delete/i });
      fireEvent.click(deleteButton);

      // Verify only confirmDelete was called
      expect(mockProps.confirmDelete).toHaveBeenCalledTimes(1);
      expect(mockProps.setShowDeletePopup).not.toHaveBeenCalled();
    });

    test("popup renders correctly with all elements", () => {
      render(<DeletePopup {...defaultProps} />);

      // Check all main elements are present
      expect(screen.getByTestId("delete-icon")).toBeInTheDocument();
      expect(screen.getByText("Delete Movie")).toBeInTheDocument();
      expect(
        screen.getByText(/Are you sure you want to delete/)
      ).toBeInTheDocument();
      expect(screen.getByText("The Avengers")).toBeInTheDocument();
      expect(
        screen.getByText(/This action cannot be undone/)
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /cancel/i })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /delete/i })
      ).toBeInTheDocument();
    });
  });
});
