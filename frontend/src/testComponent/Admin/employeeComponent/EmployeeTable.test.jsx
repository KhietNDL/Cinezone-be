/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import React from "react";
import { render, screen, fireEvent, within } from "@testing-library/react";
import "@testing-library/jest-dom";
import EmployeeTable from "../../../layouts/Admin/employeeComponent/EmployeeTable";

// Mock react-icons
jest.mock("react-icons/io5", () => ({
  IoEyeOutline: ({ size, ...props }) => (
    <span data-testid="eye-icon" {...props} />
  ),
}));

jest.mock("react-icons/fa", () => ({
  FaRegEdit: ({ size, ...props }) => (
    <span data-testid="edit-icon" {...props} />
  ),
}));

jest.mock("react-icons/ri", () => ({
  RiDeleteBin5Line: ({ size, ...props }) => (
    <span data-testid="delete-icon" {...props} />
  ),
}));

jest.mock("react-icons/md", () => ({
  MdOutlineArrowDropDown: ({ size, className, ...props }) => (
    <span data-testid="arrow-down" className={className} {...props} />
  ),
  MdArrowDropUp: ({ size, className, ...props }) => (
    <span data-testid="arrow-up" className={className} {...props} />
  ),
}));

describe("EmployeeTable", () => {
  // Mock data
  const mockEmployees = [
    {
      UserId: 1,
      FullName: "John Doe",
      DateOfBirth: "1990-01-15",
      Sex: 1,
      Email: "john.doe@example.com",
      PhoneNumber: "123-456-7890",
      CreatedAt: "2023-01-01",
      avatar_url: "/avatar1.jpg",
    },
    {
      UserId: 2,
      FullName: "Jane Smith",
      DateOfBirth: "1985-05-20",
      Sex: 2,
      Email: "jane.smith@example.com",
      PhoneNumber: "098-765-4321",
      CreatedAt: "2023-02-01",
      avatar_url: "/avatar2.jpg",
    },
    {
      UserId: 3,
      FullName: "Alex Johnson",
      DateOfBirth: "1992-12-10",
      Sex: 3,
      Email: "alex.johnson@example.com",
      PhoneNumber: "555-123-4567",
      CreatedAt: "2023-03-01",
      avatar_url: null,
    },
  ];

  // Mock functions
  const mockProps = {
    employees: mockEmployees,
    page: 1,
    itemsPerPage: 10,
    handleEdit: jest.fn(),
    handleDelete: jest.fn(),
    handleRowClick: jest.fn(),
    formatDate: jest.fn((date) =>
      date ? new Date(date).toLocaleDateString() : ""
    ),
    sortBy: "FullName",
    sortOrder: "asc",
    handleSort: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Rendering", () => {
    it("should render the table with correct structure", () => {
      render(<EmployeeTable {...mockProps} />);

      expect(screen.getByRole("table")).toBeInTheDocument();
      expect(screen.getByText("Avatar")).toBeInTheDocument();
      expect(screen.getByText("Full Name")).toBeInTheDocument();
      expect(screen.getByText("Gender")).toBeInTheDocument();
      expect(screen.getByText("Phone")).toBeInTheDocument();
      expect(screen.getByText("Action")).toBeInTheDocument();
    });

    it("should render all employee rows", () => {
      render(<EmployeeTable {...mockProps} />);

      expect(screen.getByText("John Doe")).toBeInTheDocument();
      expect(screen.getByText("Jane Smith")).toBeInTheDocument();
      expect(screen.getByText("Alex Johnson")).toBeInTheDocument();
    });

    it("should render employee avatars correctly", () => {
      render(<EmployeeTable {...mockProps} />);

      const avatars = screen.getAllByRole("img");
      expect(avatars).toHaveLength(3);

      expect(avatars[0]).toHaveAttribute("src", "/avatar1.jpg");
      expect(avatars[0]).toHaveAttribute("alt", "John Doe");

      expect(avatars[2]).toHaveAttribute("src", "/default-avatar.png");
      expect(avatars[2]).toHaveAttribute("alt", "Alex Johnson");
    });

    it("should display gender correctly", () => {
      render(<EmployeeTable {...mockProps} />);

      expect(screen.getByText("Male")).toBeInTheDocument(); // Sex: 1
      expect(screen.getByText("Female")).toBeInTheDocument(); // Sex: 2
      expect(screen.getByText("Other")).toBeInTheDocument(); // Sex: 3
    });
  });

<<<<<<< HEAD
=======
  describe("Pagination", () => {
    it("should display correct items based on page and itemsPerPage", () => {
      const propsWithPagination = {
        ...mockProps,
        page: 1,
        itemsPerPage: 2,
      };

      render(<EmployeeTable {...propsWithPagination} />);

      expect(screen.getByText("John Doe")).toBeInTheDocument();
      expect(screen.getByText("Jane Smith")).toBeInTheDocument();
      expect(screen.queryByText("Alex Johnson")).not.toBeInTheDocument();
    });

    it("should display second page items correctly", () => {
      const propsWithPagination = {
        ...mockProps,
        page: 2,
        itemsPerPage: 2,
      };

      render(<EmployeeTable {...propsWithPagination} />);

      expect(screen.queryByText("John Doe")).not.toBeInTheDocument();
      expect(screen.queryByText("Jane Smith")).not.toBeInTheDocument();
      expect(screen.getByText("Alex Johnson")).toBeInTheDocument();
    });
  });

>>>>>>> 0c3447e1c5e836117713ba79b7a4ee6fcef57307
  describe("Sorting", () => {
    it("should display correct sort arrows for FullName", () => {
      render(<EmployeeTable {...mockProps} />);

      const fullNameHeader = screen.getByText("Full Name").closest("th");
      expect(
        within(fullNameHeader).getByTestId("arrow-down")
      ).toBeInTheDocument();
    });

    it("should display up arrow when sort order is desc", () => {
      const propsWithDescSort = {
        ...mockProps,
        sortOrder: "desc",
      };

      render(<EmployeeTable {...propsWithDescSort} />);

      const fullNameHeader = screen.getByText("Full Name").closest("th");
      expect(
        within(fullNameHeader).getByTestId("arrow-up")
      ).toBeInTheDocument();
    });

    it("should call handleSort when clicking sortable headers", () => {
      render(<EmployeeTable {...mockProps} />);

      fireEvent.click(screen.getByText("Full Name"));
      expect(mockProps.handleSort).toHaveBeenCalledWith("FullName");

      fireEvent.click(screen.getByText("Email"));
      expect(mockProps.handleSort).toHaveBeenCalledWith("Email");
    });
  });

  describe("Action Buttons", () => {
    it("should render all action buttons for each row", () => {
      render(<EmployeeTable {...mockProps} />);

      const viewButtons = screen.getAllByTestId("eye-icon");
      const editButtons = screen.getAllByTestId("edit-icon");
      const deleteButtons = screen.getAllByTestId("delete-icon");

      expect(viewButtons).toHaveLength(3);
      expect(editButtons).toHaveLength(3);
      expect(deleteButtons).toHaveLength(3);
    });

    it("should call handleRowClick when view button is clicked", () => {
      render(<EmployeeTable {...mockProps} />);

      const viewButtons = screen.getAllByTestId("eye-icon");
      fireEvent.click(viewButtons[0]);

      expect(mockProps.handleRowClick).toHaveBeenCalledWith(
        mockEmployees[0],
        expect.any(Object)
      );
    });

    it("should call handleEdit when edit button is clicked", () => {
      render(<EmployeeTable {...mockProps} />);

      const editButtons = screen.getAllByTestId("edit-icon");
      fireEvent.click(editButtons[0]);

      expect(mockProps.handleEdit).toHaveBeenCalledWith(mockEmployees[0]);
    });

    it("should call handleDelete when delete button is clicked", () => {
      render(<EmployeeTable {...mockProps} />);

      const deleteButtons = screen.getAllByTestId("delete-icon");
      fireEvent.click(deleteButtons[0]);

      expect(mockProps.handleDelete).toHaveBeenCalledWith(mockEmployees[0]);
    });

    it("should stop event propagation for action buttons", () => {
      render(<EmployeeTable {...mockProps} />);

      const editButtons = screen.getAllByTestId("edit-icon");
      const mockStopPropagation = jest.fn();

      const mockEvent = {
        stopPropagation: mockStopPropagation,
      };

      fireEvent.click(editButtons[0], mockEvent);

      expect(mockProps.handleEdit).toHaveBeenCalledWith(mockEmployees[0]);
    });
  });

  describe("Row Click Handling", () => {
    it("should call handleRowClick when clicking on a row", () => {
      render(<EmployeeTable {...mockProps} />);

      const firstRow = screen.getByText("John Doe").closest("tr");
      fireEvent.click(firstRow);

      expect(mockProps.handleRowClick).toHaveBeenCalledWith(
        mockEmployees[0],
        expect.any(Object)
      );
    });
  });

  describe("Text Truncation", () => {
    it("should truncate long emails and show full email in title", () => {
      const employeeWithLongEmail = {
        ...mockEmployees[0],
        Email: "this.is.a.very.long.email.address@example.com",
      };

      const propsWithLongEmail = {
        ...mockProps,
        employees: [employeeWithLongEmail],
      };

      render(<EmployeeTable {...propsWithLongEmail} />);

      const emailElement = screen.getByTitle(
        "this.is.a.very.long.email.address@example.com"
      );
      expect(emailElement).toBeInTheDocument();
      expect(emailElement).toHaveTextContent("this.is.a.very.long...");
    });
  });

  describe("Date Formatting", () => {
    it("should call formatDate function for dates", () => {
      render(<EmployeeTable {...mockProps} />);

      expect(mockProps.formatDate).toHaveBeenCalledWith("1990-01-15");
      expect(mockProps.formatDate).toHaveBeenCalledWith("2023-01-01");
    });
  });

  describe("Empty State", () => {
    it("should render empty table when no employees", () => {
      const emptyProps = {
        ...mockProps,
        employees: [],
      };

      render(<EmployeeTable {...emptyProps} />);

      expect(screen.getByRole("table")).toBeInTheDocument();
      expect(screen.queryByText("John Doe")).not.toBeInTheDocument();
    });
  });

  describe("Responsive Behavior", () => {
    it("should have responsive classes for different screen sizes", () => {
      render(<EmployeeTable {...mockProps} />);

      const dobHeader = screen.getByText("DOB");
      expect(dobHeader.closest("th")).toHaveClass("hidden", "lg:table-cell");

      const emailHeader = screen.getByText("Email");
      expect(emailHeader.closest("th")).toHaveClass("hidden", "md:table-cell");
    });
  });

  describe("Accessibility", () => {
    it("should have proper aria-labels for action buttons", () => {
      render(<EmployeeTable {...mockProps} />);

      expect(screen.getByLabelText("View John Doe")).toBeInTheDocument();
      expect(screen.getByLabelText("Edit John Doe")).toBeInTheDocument();
      expect(screen.getByLabelText("Delete John Doe")).toBeInTheDocument();
    });

    it("should have proper title attributes for action buttons", () => {
      render(<EmployeeTable {...mockProps} />);

      const viewButton = screen.getAllByTitle("View")[0];
      const editButton = screen.getAllByTitle("Edit")[0];
      const deleteButton = screen.getAllByTitle("Delete")[0];

      expect(viewButton).toBeInTheDocument();
      expect(editButton).toBeInTheDocument();
      expect(deleteButton).toBeInTheDocument();
    });
  });
});
