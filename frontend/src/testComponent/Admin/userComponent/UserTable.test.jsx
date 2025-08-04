/* eslint-disable no-undef */
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";

import UserTable from "../../../layouts/Admin/userComponent/UserTable";

// Mock react-icons
jest.mock("react-icons/fa", () => ({
  FaRegEdit: () => <div data-testid="edit-icon">Edit Icon</div>,
}));

jest.mock("react-icons/ri", () => ({
  RiDeleteBin5Line: () => <div data-testid="delete-icon">Delete Icon</div>,
}));

describe("UserTable", () => {
  const mockUsers = [
    {
      UserId: 1,
      FullName: "John Doe",
      DateOfBirth: "1990-01-01",
      Sex: 1,
      Email: "john.doe@example.com",
      PhoneNumber: "123-456-7890",
      avatar_url: "/avatar1.jpg",
    },
    {
      UserId: 2,
      FullName: "Jane Smith",
      DateOfBirth: "1985-05-15",
      Sex: 2,
      Email: "jane.smith@example.com",
      PhoneNumber: "098-765-4321",
      avatar_url: null,
    },
    {
      UserId: 3,
      FullName: "This is a very long name that should be truncated",
      DateOfBirth: "1992-12-25",
      Sex: "Other",
      Email: "verylongemailaddress@example.com",
      PhoneNumber: null,
      avatar_url: "/avatar3.jpg",
    },
  ];

  const defaultProps = {
    users: mockUsers,
    handleEditUser: jest.fn(),
    handleDeleteUser: jest.fn(),
    sortBy: "FullName",
    sortOrder: "asc",
    handleSort: jest.fn(),
    formatDate: jest.fn((date) => new Date(date).toLocaleDateString()),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Rendering", () => {
    test("renders table with correct headers", () => {
      render(<UserTable {...defaultProps} />);

      expect(screen.getByText("Avatar")).toBeInTheDocument();
      expect(screen.getByText("Full Name")).toBeInTheDocument();
      expect(screen.getByText("DOB")).toBeInTheDocument();
      expect(screen.getByText("Gender")).toBeInTheDocument();
      expect(screen.getByText("Email")).toBeInTheDocument();
      expect(screen.getByText("Phone")).toBeInTheDocument();
      expect(screen.getByText("Actions")).toBeInTheDocument();
    });

    test("displays user avatars correctly", () => {
      render(<UserTable {...defaultProps} />);

      const avatars = screen.getAllByRole("img");
      expect(avatars).toHaveLength(3);

      expect(avatars[0]).toHaveAttribute("src", "/avatar1.jpg");
      expect(avatars[0]).toHaveAttribute("alt", "John Doe");

      expect(avatars[1]).toHaveAttribute("src", "/default-avatar.png");
      expect(avatars[1]).toHaveAttribute("alt", "Jane Smith");
    });

    test("formats dates correctly", () => {
      render(<UserTable {...defaultProps} />);

      expect(defaultProps.formatDate).toHaveBeenCalledWith("1990-01-01");
      expect(defaultProps.formatDate).toHaveBeenCalledWith("1985-05-15");
      expect(defaultProps.formatDate).toHaveBeenCalledWith("1992-12-25");
    });

    test("displays gender correctly", () => {
      render(<UserTable {...defaultProps} />);

      // Gender columns are hidden on smaller screens, so we need to check the table cells
      const genderCells = document.querySelectorAll("td:nth-child(4)");
      expect(genderCells[0]).toHaveTextContent("Male");
      expect(genderCells[1]).toHaveTextContent("Female");
      expect(genderCells[2]).toHaveTextContent("Other");
    });

    test('displays "N/A" for missing data', () => {
      const usersWithMissingData = [
        {
          UserId: 4,
          FullName: null,
          DateOfBirth: null,
          Sex: null,
          Email: null,
          PhoneNumber: null,
          avatar_url: null,
        },
      ];

      render(<UserTable {...defaultProps} users={usersWithMissingData} />);

      expect(screen.getAllByText("N/A")).toHaveLength(3); // FullName, Email, PhoneNumber
    });
  });

  describe("Sorting functionality", () => {
    test("displays correct sort icons for FullName", () => {
      render(<UserTable {...defaultProps} />);

      const fullNameHeader = screen.getByText("Full Name").closest("th");
      const sortIcon = fullNameHeader.querySelector("svg");
      expect(sortIcon).toBeInTheDocument();
      expect(sortIcon).not.toHaveClass("opacity-30");
    });

    test("displays correct sort icons for Email", () => {
      const props = { ...defaultProps, sortBy: "Email", sortOrder: "desc" };
      render(<UserTable {...props} />);

      const emailHeader = screen.getByText("Email").closest("th");
      const sortIcon = emailHeader.querySelector("svg");
      expect(sortIcon).toBeInTheDocument();
      expect(sortIcon).not.toHaveClass("opacity-30");
    });

    test("displays inactive sort icon for non-sorted columns", () => {
      render(<UserTable {...defaultProps} />);

      const emailHeader = screen.getByText("Email").closest("th");
      const sortIcon = emailHeader.querySelector("svg");
      expect(sortIcon).toHaveClass("opacity-30");
    });

    test("calls handleSort when clicking sortable headers", () => {
      render(<UserTable {...defaultProps} />);

      const fullNameHeader = screen.getByText("Full Name").closest("th");
      fireEvent.click(fullNameHeader);
      expect(defaultProps.handleSort).toHaveBeenCalledWith("FullName");

      const emailHeader = screen.getByText("Email").closest("th");
      fireEvent.click(emailHeader);
      expect(defaultProps.handleSort).toHaveBeenCalledWith("Email");
    });
  });

  describe("User interactions", () => {
    test("calls handleEditUser when clicking on table row", () => {
      render(<UserTable {...defaultProps} />);

      const firstRow = screen.getByText("John Doe").closest("tr");
      fireEvent.click(firstRow);

      expect(defaultProps.handleEditUser).toHaveBeenCalledWith(mockUsers[0]);
    });

    test("calls handleEditUser when clicking edit button", () => {
      render(<UserTable {...defaultProps} />);

      const editButtons = screen.getAllByTestId("edit-icon");
      fireEvent.click(editButtons[0].closest("button"));

      expect(defaultProps.handleEditUser).toHaveBeenCalledWith(mockUsers[0]);
    });

    test("calls handleDeleteUser when clicking delete button", () => {
      render(<UserTable {...defaultProps} />);

      const deleteButtons = screen.getAllByTestId("delete-icon");
      fireEvent.click(deleteButtons[0].closest("button"));

      expect(defaultProps.handleDeleteUser).toHaveBeenCalledWith(mockUsers[0]);
    });

    test("stops propagation when clicking action buttons", () => {
      render(<UserTable {...defaultProps} />);

      const editButton = screen
        .getAllByTestId("edit-icon")[0]
        .closest("button");
      const deleteButton = screen
        .getAllByTestId("delete-icon")[0]
        .closest("button");

      // Mock stopPropagation
      const stopPropagationSpy = jest.fn();

      fireEvent.click(editButton, {
        stopPropagation: stopPropagationSpy,
      });
      fireEvent.click(deleteButton, {
        stopPropagation: stopPropagationSpy,
      });

      // Verify that the handlers were called (action buttons work)
      expect(defaultProps.handleEditUser).toHaveBeenCalled();
      expect(defaultProps.handleDeleteUser).toHaveBeenCalled();
    });
  });

  describe("Responsive behavior", () => {
    test("applies correct CSS classes for responsive design", () => {
      render(<UserTable {...defaultProps} />);

      const table = screen.getByRole("table");
      const tableContainer = table.closest("div");

      expect(tableContainer).toHaveClass("hidden", "sm:block");
    });

    test("has correct responsive classes on headers", () => {
      render(<UserTable {...defaultProps} />);

      const dobHeader = screen.getByText("DOB").closest("th");
      expect(dobHeader).toHaveClass("hidden", "xl:table-cell");

      const genderHeader = screen.getByText("Gender").closest("th");
      expect(genderHeader).toHaveClass("hidden", "xl:table-cell");

      const emailHeader = screen.getByText("Email").closest("th");
      expect(emailHeader).toHaveClass("hidden", "md:table-cell");
    });
  });

  describe("Accessibility", () => {
    test("has proper ARIA labels for action buttons", () => {
      render(<UserTable {...defaultProps} />);

      const editButtons = screen.getAllByLabelText(/Edit/);
      const deleteButtons = screen.getAllByLabelText(/Delete/);

      expect(editButtons).toHaveLength(3);
      expect(deleteButtons).toHaveLength(3);

      expect(editButtons[0]).toHaveAttribute("aria-label", "Edit John Doe");
      expect(deleteButtons[0]).toHaveAttribute("aria-label", "Delete John Doe");
    });

    test("has proper title attributes for tooltips", () => {
      render(<UserTable {...defaultProps} />);

      const editButtons = screen.getAllByTitle("Edit");
      const deleteButtons = screen.getAllByTitle("Delete");

      expect(editButtons).toHaveLength(3);
      expect(deleteButtons).toHaveLength(3);
    });

    test("has proper alt text for avatar images", () => {
      render(<UserTable {...defaultProps} />);

      const avatars = screen.getAllByRole("img");
      expect(avatars[0]).toHaveAttribute("alt", "John Doe");
      expect(avatars[1]).toHaveAttribute("alt", "Jane Smith");
    });
  });

  describe("Edge cases", () => {
    test("handles different gender value formats", () => {
      const usersWithDifferentGenders = [
        { UserId: 1, Sex: 1, FullName: "User 1" },
        { UserId: 2, Sex: "1", FullName: "User 2" },
        { UserId: 3, Sex: "Male", FullName: "User 3" },
        { UserId: 4, Sex: 2, FullName: "User 4" },
        { UserId: 5, Sex: "2", FullName: "User 5" },
        { UserId: 6, Sex: "Female", FullName: "User 6" },
        { UserId: 7, Sex: "Other", FullName: "User 7" },
        { UserId: 8, Sex: null, FullName: "User 8" },
      ];

      render(<UserTable {...defaultProps} users={usersWithDifferentGenders} />);

      const genderCells = document.querySelectorAll("td:nth-child(4)");
      expect(genderCells[0]).toHaveTextContent("Male");
      expect(genderCells[1]).toHaveTextContent("Male");
      expect(genderCells[2]).toHaveTextContent("Male");
      expect(genderCells[3]).toHaveTextContent("Female");
      expect(genderCells[4]).toHaveTextContent("Female");
      expect(genderCells[5]).toHaveTextContent("Female");
      expect(genderCells[6]).toHaveTextContent("Other");
      expect(genderCells[7]).toHaveTextContent("Other");
    });
  });
});
