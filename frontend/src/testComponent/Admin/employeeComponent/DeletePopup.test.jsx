/* eslint-disable no-undef */
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import DeletePopup from "../../../layouts/Admin/employeeComponent/DeletePopup";
// Mock react-icons/md
jest.mock("react-icons/md", () => ({
  MdDeleteForever: ({ size, className }) => (
    <div data-testid="delete-icon" data-size={size} className={className}>
      Delete Icon
    </div>
  ),
}));

describe("DeletePopup Component", () => {
  const mockProps = {
    confirmDelete: jest.fn(),
    setShowDeletePopup: jest.fn(),
    selectedEmployee: {
      FullName: "John Doe",
      id: 1,
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the popup with correct structure", () => {
    const { container } = render(<DeletePopup {...mockProps} />);

    // Check if main popup container exists
    const popup = container.firstChild;
    expect(popup).toBeInTheDocument();
    expect(popup).toHaveClass("fixed", "inset-0", "bg-black/30");

    // Check if delete icon is rendered
    const deleteIcon = screen.getByTestId("delete-icon");
    expect(deleteIcon).toBeInTheDocument();
    expect(deleteIcon).toHaveAttribute("data-size", "24");
    expect(deleteIcon).toHaveClass("text-red-500");
  });

  it("displays the correct title and confirmation message", () => {
    render(<DeletePopup {...mockProps} />);

    // Check title
    expect(screen.getByText("Delete Employee")).toBeInTheDocument();

    // Check confirmation message with employee name
    expect(
      screen.getByText(/Are you sure you want to delete/)
    ).toBeInTheDocument();
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(
      screen.getByText(/This action cannot be undone/)
    ).toBeInTheDocument();
  });

  it("renders Cancel and Delete buttons", () => {
    render(<DeletePopup {...mockProps} />);

    const cancelButton = screen.getByRole("button", { name: /cancel/i });
    const deleteButton = screen.getByRole("button", { name: /delete/i });

    expect(cancelButton).toBeInTheDocument();
    expect(deleteButton).toBeInTheDocument();

    // Check button styling classes
    expect(cancelButton).toHaveClass("bg-gray-300", "text-gray-700");
    expect(deleteButton).toHaveClass("bg-red-500", "text-white");
  });

  it("calls setShowDeletePopup(false) when Cancel button is clicked", () => {
    render(<DeletePopup {...mockProps} />);

    const cancelButton = screen.getByRole("button", { name: /cancel/i });
    fireEvent.click(cancelButton);

    expect(mockProps.setShowDeletePopup).toHaveBeenCalledTimes(1);
    expect(mockProps.setShowDeletePopup).toHaveBeenCalledWith(false);
  });

  it("calls confirmDelete when Delete button is clicked", () => {
    render(<DeletePopup {...mockProps} />);

    const deleteButton = screen.getByRole("button", { name: /delete/i });
    fireEvent.click(deleteButton);

    expect(mockProps.confirmDelete).toHaveBeenCalledTimes(1);
  });

  it("handles missing selectedEmployee gracefully", () => {
    const propsWithoutEmployee = {
      ...mockProps,
      selectedEmployee: null,
    };

    render(<DeletePopup {...propsWithoutEmployee} />);

    // Should still render the popup structure
    expect(screen.getByText("Delete Employee")).toBeInTheDocument();
    expect(
      screen.getByText(/Are you sure you want to delete/)
    ).toBeInTheDocument();

    // Employee name should not be present
    expect(screen.queryByText("John Doe")).not.toBeInTheDocument();
  });

  it("handles undefined selectedEmployee.FullName", () => {
    const propsWithUndefinedName = {
      ...mockProps,
      selectedEmployee: { id: 1 }, // No FullName property
    };

    render(<DeletePopup {...propsWithUndefinedName} />);

    expect(screen.getByText("Delete Employee")).toBeInTheDocument();
    expect(
      screen.getByText(/Are you sure you want to delete/)
    ).toBeInTheDocument();
  });

  it("applies correct CSS classes for styling", () => {
    const { container } = render(<DeletePopup {...mockProps} />);

    // Check backdrop overlay
    const backdrop = container.firstChild;
    expect(backdrop).toHaveClass(
      "fixed",
      "inset-0",
      "bg-black/30",
      "bg-opacity-50",
      "flex",
      "items-center",
      "justify-center",
      "z-50"
    );

    // Check popup container
    const popupContent = backdrop.firstChild;
    expect(popupContent).toHaveClass(
      "bg-white",
      "rounded-lg",
      "p-6",
      "w-[400px]"
    );
  });

  it("displays employee name in bold", () => {
    render(<DeletePopup {...mockProps} />);

    const employeeName = screen.getByText("John Doe");
    expect(employeeName.tagName).toBe("STRONG");
  });

  it("has proper z-index for modal overlay", () => {
    const { container } = render(<DeletePopup {...mockProps} />);

    const backdrop = container.firstChild;
    expect(backdrop).toHaveClass("z-50");
  });

  it("does not call any functions on initial render", () => {
    render(<DeletePopup {...mockProps} />);

    expect(mockProps.confirmDelete).not.toHaveBeenCalled();
    expect(mockProps.setShowDeletePopup).not.toHaveBeenCalled();
  });

  // Test for keyboard accessibility (optional enhancement)
  it("maintains focus within the popup", () => {
    render(<DeletePopup {...mockProps} />);

    const cancelButton = screen.getByRole("button", { name: /cancel/i });
    const deleteButton = screen.getByRole("button", { name: /delete/i });

    // Both buttons should be focusable
    expect(cancelButton).not.toHaveAttribute("disabled");
    expect(deleteButton).not.toHaveAttribute("disabled");
  });

  // Test different employee names
  it("handles special characters in employee name", () => {
    const propsWithSpecialName = {
      ...mockProps,
      selectedEmployee: {
        FullName: "O'Connor, Mary-Jane",
        id: 2,
      },
    };

    render(<DeletePopup {...propsWithSpecialName} />);

    expect(screen.getByText("O'Connor, Mary-Jane")).toBeInTheDocument();
  });

  // Test for empty string name
  it("handles empty employee name", () => {
    const propsWithEmptyName = {
      ...mockProps,
      selectedEmployee: {
        FullName: "",
        id: 3,
      },
    };

    render(<DeletePopup {...propsWithEmptyName} />);

    expect(screen.getByText("Delete Employee")).toBeInTheDocument();
  });
});
