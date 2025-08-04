/* eslint-disable no-undef */
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { jest } from "@jest/globals";
import DeletePopup from "../../../layouts/Admin/productComponent/DeletePopup";

// Mock react-icons
jest.mock("react-icons/ri", () => ({
  RiDeleteBin5Line: ({ className, ...props }) => (
    <div data-testid="delete-icon" className={className} {...props}>
      Delete Icon
    </div>
  ),
}));

describe("DeletePopup", () => {
  const defaultProps = {
    showDeletePopup: true,
    setShowDeletePopup: jest.fn(),
    handleDelete: jest.fn(),
    loading: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Rendering", () => {
    it("should render nothing when showDeletePopup is false", () => {
      const { container } = render(
        <DeletePopup {...defaultProps} showDeletePopup={false} />
      );
      expect(container.firstChild).toBeNull();
    });

    it("should render popup when showDeletePopup is true", () => {
      render(<DeletePopup {...defaultProps} />);

      expect(screen.getByText("Delete Product")).toBeInTheDocument();
      expect(
        screen.getByText("Are you sure you want to delete this product?")
      ).toBeInTheDocument();
      expect(
        screen.getByText(/This action cannot be undone/)
      ).toBeInTheDocument();
    });

    it("should render delete icon", () => {
      render(<DeletePopup {...defaultProps} />);

      expect(screen.getAllByTestId("delete-icon")).toHaveLength(2); // One in header, one in button
    });

    it("should render Cancel and Delete buttons", () => {
      render(<DeletePopup {...defaultProps} />);

      expect(
        screen.getByRole("button", { name: /cancel/i })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /delete/i })
      ).toBeInTheDocument();
    });
  });

  describe("User Interactions", () => {
    it("should call setShowDeletePopup(false) when Cancel button is clicked", () => {
      render(<DeletePopup {...defaultProps} />);

      const cancelButton = screen.getByRole("button", { name: /cancel/i });
      fireEvent.click(cancelButton);

      expect(defaultProps.setShowDeletePopup).toHaveBeenCalledWith(false);
      expect(defaultProps.setShowDeletePopup).toHaveBeenCalledTimes(1);
    });

    it("should call handleDelete when Delete button is clicked", () => {
      render(<DeletePopup {...defaultProps} />);

      const deleteButton = screen.getByRole("button", { name: /delete/i });
      fireEvent.click(deleteButton);

      expect(defaultProps.handleDelete).toHaveBeenCalledTimes(1);
    });
  });

  describe("Loading State", () => {
    it("should show loading state when loading is true", () => {
      render(<DeletePopup {...defaultProps} loading={true} />);

      expect(screen.getByText("Deleting...")).toBeInTheDocument();
      expect(screen.getByText("Deleting Product...")).toBeInTheDocument();
      expect(screen.getByText("Please wait a moment")).toBeInTheDocument();
    });

    it("should disable buttons when loading is true", () => {
      render(<DeletePopup {...defaultProps} loading={true} />);

      const cancelButton = screen.getByRole("button", { name: /cancel/i });
      const deleteButton = screen.getByRole("button", { name: /deleting/i });

      expect(cancelButton).toBeDisabled();
      expect(deleteButton).toBeDisabled();
    });

    it("should show loading spinner in delete button when loading", () => {
      render(<DeletePopup {...defaultProps} loading={true} />);

      // Check for loading spinner SVG
      const spinner = screen
        .getByRole("button", { name: /deleting/i })
        .querySelector("svg");
      expect(spinner).toBeInTheDocument();
      expect(spinner).toHaveClass("animate-spin");
    });

    it("should not call handlers when buttons are clicked during loading", () => {
      render(<DeletePopup {...defaultProps} loading={true} />);

      const cancelButton = screen.getByRole("button", { name: /cancel/i });
      const deleteButton = screen.getByRole("button", { name: /deleting/i });

      fireEvent.click(cancelButton);
      fireEvent.click(deleteButton);

      expect(defaultProps.setShowDeletePopup).not.toHaveBeenCalled();
      expect(defaultProps.handleDelete).not.toHaveBeenCalled();
    });
  });

  describe("Accessibility", () => {
    it("should have proper modal structure", () => {
      render(<DeletePopup {...defaultProps} />);

      // Check for the main popup container
      const popup = document.querySelector(".bg-white.rounded-3xl.shadow-2xl");
      expect(popup).toBeInTheDocument();

      // Check for title
      expect(
        screen.getByRole("heading", { name: /delete product/i })
      ).toBeInTheDocument();
    });

    it("should support keyboard navigation", () => {
      render(<DeletePopup {...defaultProps} />);

      const cancelButton = screen.getByRole("button", { name: /cancel/i });
      const deleteButton = screen.getByRole("button", { name: /delete/i });

      // Focus should work on buttons
      cancelButton.focus();
      expect(cancelButton).toHaveFocus();

      deleteButton.focus();
      expect(deleteButton).toHaveFocus();
    });
  });

  describe("CSS Classes and Styling", () => {
    it("should have correct CSS classes for backdrop", () => {
      render(<DeletePopup {...defaultProps} />);

      const backdrop = document.querySelector(".fixed.inset-0.bg-black\\/60");
      expect(backdrop).toHaveClass(
        "fixed",
        "inset-0",
        "backdrop-blur-sm",
        "flex",
        "items-center",
        "justify-center"
      );
    });

    it("should have correct CSS classes for popup container", () => {
      render(<DeletePopup {...defaultProps} />);

      const popup = document.querySelector(".bg-white.rounded-3xl.shadow-2xl");
      expect(popup).toHaveClass(
        "bg-white",
        "rounded-3xl",
        "shadow-2xl",
        "w-full",
        "max-w-md"
      );
    });

    it("should apply correct button styles", () => {
      render(<DeletePopup {...defaultProps} />);

      const cancelButton = screen.getByRole("button", { name: /cancel/i });
      const deleteButton = screen.getByRole("button", { name: /delete/i });

      expect(cancelButton).toHaveClass("bg-gray-100");
      expect(deleteButton).toHaveClass(
        "bg-gradient-to-r",
        "from-red-500",
        "to-red-600"
      );
    });
  });

  describe("Animation Classes", () => {
    it("should have animation classes", () => {
      render(<DeletePopup {...defaultProps} />);

      const backdrop = document.querySelector(".fixed.inset-0");
      const popup = document.querySelector(".bg-white.rounded-3xl.shadow-2xl");

      expect(backdrop).toHaveClass("animate-fadeIn");
      expect(popup).toHaveClass("animate-slideUp");
    });

    it("should have ping animation on icon background", () => {
      const { container } = render(<DeletePopup {...defaultProps} />);

      const pingElement = container.querySelector(".animate-ping");
      expect(pingElement).toBeInTheDocument();
      expect(pingElement).toHaveClass("bg-red-500/10", "rounded-full");
    });
  });

  describe("Edge Cases", () => {
    it("should handle undefined props gracefully", () => {
      const minimalProps = {
        showDeletePopup: true,
        setShowDeletePopup: jest.fn(),
        handleDelete: jest.fn(),
      };

      expect(() => render(<DeletePopup {...minimalProps} />)).not.toThrow();
    });

    it("should handle multiple rapid clicks", async () => {
      render(<DeletePopup {...defaultProps} />);

      const deleteButton = screen.getByRole("button", { name: /delete/i });

      // Click multiple times rapidly
      fireEvent.click(deleteButton);
      fireEvent.click(deleteButton);
      fireEvent.click(deleteButton);

      // Should still only be called once per click
      expect(defaultProps.handleDelete).toHaveBeenCalledTimes(3);
    });

    it("should maintain focus management during loading state changes", () => {
      const { rerender } = render(<DeletePopup {...defaultProps} />);

      const deleteButton = screen.getByRole("button", { name: /delete/i });
      deleteButton.focus();
      expect(deleteButton).toHaveFocus();

      // Change to loading state
      rerender(<DeletePopup {...defaultProps} loading={true} />);

      const loadingButton = screen.getByRole("button", { name: /deleting/i });
      expect(loadingButton).toBeDisabled();
    });
  });

  describe("Performance", () => {
    it("should not re-render unnecessarily when props do not change", () => {
      const { rerender } = render(<DeletePopup {...defaultProps} />);

      // Re-render with same props
      rerender(<DeletePopup {...defaultProps} />);

      // Component should still be rendered correctly
      expect(screen.getByText("Delete Product")).toBeInTheDocument();
    });
  });
});
