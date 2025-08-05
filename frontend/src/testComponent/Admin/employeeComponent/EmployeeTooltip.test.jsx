/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import EmployeeTooltip from "../../../layouts/Admin/employeeComponent/EmployeeTooltip";

// Mock react-icons
jest.mock("react-icons/io5", () => ({
  // eslint-disable-next-line no-unused-vars
  IoClose: ({ size, className, ...props }) => (
    <span data-testid="close-icon" className={className} {...props} />
  ),
  IoCalendarOutline: ({ size, className, ...props }) => (
    <span data-testid="calendar-icon" className={className} {...props} />
  ),
  IoPersonOutline: ({ size, className, ...props }) => (
    <span data-testid="person-icon" className={className} {...props} />
  ),
  IoMailOutline: ({ size, className, ...props }) => (
    <span data-testid="mail-icon" className={className} {...props} />
  ),
  IoCallOutline: ({ size, className, ...props }) => (
    <span data-testid="call-icon" className={className} {...props} />
  ),
  IoCardOutline: ({ size, className, ...props }) => (
    <span data-testid="card-icon" className={className} {...props} />
  ),
  IoTimeOutline: ({ size, className, ...props }) => (
    <span data-testid="time-icon" className={className} {...props} />
  ),
  IoLocationOutline: ({ size, className, ...props }) => (
    <span data-testid="location-icon" className={className} {...props} />
  ),
}));

describe("EmployeeTooltip", () => {
  // Complete mock employee data
  const mockEmployee = {
    FullName: "John Doe",
    DateOfBirth: "1990-01-15T00:00:00Z",
    Sex: 1,
    Email: "john.doe@example.com",
    PhoneNumber: "123-456-7890",
    CCCD: "123456789012",
    CreatedAt: "2023-01-01T10:30:00Z",
    Address: "123 Main Street, City, Country",
    avatar_url: "/avatar.jpg",
  };

  const mockOnClose = jest.fn();

  const defaultProps = {
    employee: mockEmployee,
    onClose: mockOnClose,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Rendering", () => {
    it("should render the tooltip with all employee information", () => {
      render(<EmployeeTooltip {...defaultProps} />);

      // Check if main elements are rendered
      expect(screen.getByText("John Doe")).toBeInTheDocument();
      expect(screen.getByText("Active Employee")).toBeInTheDocument();
      expect(screen.getByRole("img", { name: "Employee" })).toBeInTheDocument();
    });

    it("should render employee avatar with correct src", () => {
      render(<EmployeeTooltip {...defaultProps} />);

      const avatar = screen.getByRole("img", { name: "Employee" });
      expect(avatar).toHaveAttribute("src", "/avatar.jpg");
      expect(avatar).toHaveAttribute("loading", "lazy");
    });

    it("should render all information sections", () => {
      render(<EmployeeTooltip {...defaultProps} />);

      expect(screen.getByText("Date of Birth")).toBeInTheDocument();
      expect(screen.getByText("Gender")).toBeInTheDocument();
      expect(screen.getByText("Email Address")).toBeInTheDocument();
      expect(screen.getByText("Phone Number")).toBeInTheDocument();
      expect(screen.getByText("ID Card")).toBeInTheDocument();
      expect(screen.getByText("Register Date")).toBeInTheDocument();
      expect(screen.getByText("Address")).toBeInTheDocument();
    });

    it("should render all icons", () => {
      render(<EmployeeTooltip {...defaultProps} />);

      expect(screen.getByTestId("close-icon")).toBeInTheDocument();
      expect(screen.getByTestId("calendar-icon")).toBeInTheDocument();
      expect(screen.getByTestId("person-icon")).toBeInTheDocument();
      expect(screen.getByTestId("mail-icon")).toBeInTheDocument();
      expect(screen.getByTestId("call-icon")).toBeInTheDocument();
      expect(screen.getByTestId("card-icon")).toBeInTheDocument();
      expect(screen.getByTestId("time-icon")).toBeInTheDocument();
      expect(screen.getByTestId("location-icon")).toBeInTheDocument();
    });
  });

  describe("Date Formatting", () => {
    it("should format dates correctly by removing time part", () => {
      render(<EmployeeTooltip {...defaultProps} />);

      expect(screen.getByText("1990-01-15")).toBeInTheDocument();
      expect(screen.getByText("2023-01-01")).toBeInTheDocument();
    });

    it("should handle null/undefined dates", () => {
      const employeeWithNullDate = {
        ...mockEmployee,
        DateOfBirth: null,
      };

      render(
        <EmployeeTooltip
          employee={employeeWithNullDate}
          onClose={mockOnClose}
        />
      );

      expect(screen.getByText("Not provided")).toBeInTheDocument();
    });

    it("should handle empty string dates", () => {
      const employeeWithEmptyDate = {
        ...mockEmployee,
        DateOfBirth: "",
      };

      render(
        <EmployeeTooltip
          employee={employeeWithEmptyDate}
          onClose={mockOnClose}
        />
      );

      expect(screen.getByText("Not provided")).toBeInTheDocument();
    });
  });

  describe("Gender Display", () => {
    it('should display "Male" for Sex = 1', () => {
      render(<EmployeeTooltip {...defaultProps} />);
      expect(screen.getByText("Male")).toBeInTheDocument();
    });

    it('should display "Female" for Sex = 2', () => {
      const femaleEmployee = { ...mockEmployee, Sex: 2 };
      render(
        <EmployeeTooltip employee={femaleEmployee} onClose={mockOnClose} />
      );
      expect(screen.getByText("Female")).toBeInTheDocument();
    });

    it('should display "Other" for Sex = 3 or any other value', () => {
      const otherEmployee = { ...mockEmployee, Sex: 3 };
      render(
        <EmployeeTooltip employee={otherEmployee} onClose={mockOnClose} />
      );
      expect(screen.getByText("Other")).toBeInTheDocument();
    });

    it('should display "Other" for undefined Sex', () => {
      const undefinedSexEmployee = { ...mockEmployee, Sex: undefined };
      render(
        <EmployeeTooltip
          employee={undefinedSexEmployee}
          onClose={mockOnClose}
        />
      );
      expect(screen.getByText("Other")).toBeInTheDocument();
    });
  });

  describe("Optional Fields Handling", () => {
    it('should display "Not provided" for missing email', () => {
      const employeeWithoutEmail = { ...mockEmployee, Email: null };
      render(
        <EmployeeTooltip
          employee={employeeWithoutEmail}
          onClose={mockOnClose}
        />
      );

      const emailSection = screen.getByText("Email Address").closest("div");
      expect(emailSection).toHaveTextContent("Not provided");
    });

    it('should display "Not provided" for missing phone number', () => {
      const employeeWithoutPhone = { ...mockEmployee, PhoneNumber: null };
      render(
        <EmployeeTooltip
          employee={employeeWithoutPhone}
          onClose={mockOnClose}
        />
      );

      const phoneSection = screen.getByText("Phone Number").closest("div");
      expect(phoneSection).toHaveTextContent("Not provided");
    });

    it('should display "Not provided" for missing CCCD', () => {
      const employeeWithoutCCCD = { ...mockEmployee, CCCD: null };
      render(
        <EmployeeTooltip employee={employeeWithoutCCCD} onClose={mockOnClose} />
      );

      const cccdSection = screen.getByText("ID Card").closest("div");
      expect(cccdSection).toHaveTextContent("Not provided");
    });

    it('should display "Address not provided" for missing address', () => {
      const employeeWithoutAddress = { ...mockEmployee, Address: null };
      render(
        <EmployeeTooltip
          employee={employeeWithoutAddress}
          onClose={mockOnClose}
        />
      );

      expect(screen.getByText("Address not provided")).toBeInTheDocument();
    });

    it("should display empty string values correctly", () => {
      const employeeWithEmptyFields = {
        ...mockEmployee,
        Email: "",
        PhoneNumber: "",
        CCCD: "",
        Address: "",
      };
      render(
        <EmployeeTooltip
          employee={employeeWithEmptyFields}
          onClose={mockOnClose}
        />
      );

      const emailSection = screen.getByText("Email Address").closest("div");
      const phoneSection = screen.getByText("Phone Number").closest("div");
      const cccdSection = screen.getByText("ID Card").closest("div");

      expect(emailSection).toHaveTextContent("Not provided");
      expect(phoneSection).toHaveTextContent("Not provided");
      expect(cccdSection).toHaveTextContent("Not provided");
      expect(screen.getByText("Address not provided")).toBeInTheDocument();
    });
  });

  describe("User Interactions", () => {
    it("should call onClose when close button is clicked", () => {
      render(<EmployeeTooltip {...defaultProps} />);

      const closeButton = screen.getByRole("button");
      fireEvent.click(closeButton);

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it("should have correct role attribute on close button", () => {
      render(<EmployeeTooltip {...defaultProps} />);

      const closeButton = screen.getByRole("button");
      expect(closeButton).toBeInTheDocument();
    });
  });

  describe("Styling and Layout", () => {
    it("should have backdrop blur overlay", () => {
      const { container } = render(<EmployeeTooltip {...defaultProps} />);

      const overlay = container.querySelector(".backdrop-blur-sm");
      expect(overlay).toBeInTheDocument();
      expect(overlay).toHaveClass("absolute", "inset-0", "z-50");
    });

    it("should have proper grid layout for information cards", () => {
      const { container } = render(<EmployeeTooltip {...defaultProps} />);

      const gridContainer = container.querySelector(
        ".grid.grid-cols-1.md\\:grid-cols-2"
      );
      expect(gridContainer).toBeInTheDocument();
    });

    it("should have responsive modal sizing", () => {
      const { container } = render(<EmployeeTooltip {...defaultProps} />);

      const modal = container.querySelector(".w-\\[600px\\].max-w-\\[90vw\\]");
      expect(modal).toBeInTheDocument();
    });
  });

  describe("Content Display", () => {
    it("should display all provided employee data correctly", () => {
      render(<EmployeeTooltip {...defaultProps} />);

      expect(screen.getByText("John Doe")).toBeInTheDocument();
      expect(screen.getByText("john.doe@example.com")).toBeInTheDocument();
      expect(screen.getByText("123-456-7890")).toBeInTheDocument();
      expect(screen.getByText("123456789012")).toBeInTheDocument();
      expect(
        screen.getByText("123 Main Street, City, Country")
      ).toBeInTheDocument();
    });

    it("should have green status indicator dot", () => {
      const { container } = render(<EmployeeTooltip {...defaultProps} />);

      const statusDot = container.querySelector(
        ".bg-green-500.border-2.border-white.rounded-full"
      );
      expect(statusDot).toBeInTheDocument();
    });

    it('should have "Active Employee" badge', () => {
      render(<EmployeeTooltip {...defaultProps} />);

      const badge = screen.getByText("Active Employee");
      expect(badge).toHaveClass("bg-blue-100", "text-blue-800");
    });
  });

  describe("Accessibility", () => {
    it("should have proper alt text for avatar image", () => {
      render(<EmployeeTooltip {...defaultProps} />);

      const avatar = screen.getByRole("img", { name: "Employee" });
      expect(avatar).toHaveAttribute("alt", "Employee");
    });

    it("should have proper semantic structure with headings", () => {
      render(<EmployeeTooltip {...defaultProps} />);

      const heading = screen.getByRole("heading", { name: "John Doe" });
      expect(heading).toBeInTheDocument();
      expect(heading.tagName).toBe("H2");
    });
  });

  describe("Edge Cases", () => {
    it("should handle completely empty employee object", () => {
      const emptyEmployee = {};
      render(
        <EmployeeTooltip employee={emptyEmployee} onClose={mockOnClose} />
      );

      // Check that multiple "Not provided" texts exist
      const notProvidedElements = screen.getAllByText("Not provided");
      expect(notProvidedElements.length).toBeGreaterThan(0);

      // Check specific fields that should show "Not provided"
      expect(screen.getByText("Address not provided")).toBeInTheDocument();
      expect(screen.getByText("Other")).toBeInTheDocument(); // Gender should be "Other" for undefined Sex
    });

    it("should handle very long employee name", () => {
      const employeeWithLongName = {
        ...mockEmployee,
        FullName:
          "This is a very long employee name that might cause layout issues if not handled properly",
      };
      render(
        <EmployeeTooltip
          employee={employeeWithLongName}
          onClose={mockOnClose}
        />
      );

      expect(
        screen.getByText(
          "This is a very long employee name that might cause layout issues if not handled properly"
        )
      ).toBeInTheDocument();
    });

    it("should handle very long email addresses", () => {
      const employeeWithLongEmail = {
        ...mockEmployee,
        Email:
          "this.is.a.very.long.email.address.that.might.overflow@verylongdomainname.com",
      };
      render(
        <EmployeeTooltip
          employee={employeeWithLongEmail}
          onClose={mockOnClose}
        />
      );

      const emailElement = screen.getByText(
        "this.is.a.very.long.email.address.that.might.overflow@verylongdomainname.com"
      );
      expect(emailElement).toHaveClass("truncate");
    });

    it("should handle missing avatar_url", () => {
      const employeeWithoutAvatar = { ...mockEmployee, avatar_url: null };
      render(
        <EmployeeTooltip
          employee={employeeWithoutAvatar}
          onClose={mockOnClose}
        />
      );

      const avatar = screen.getByRole("img", { name: "Employee" });
      expect(avatar.getAttribute("src")).toBeNull();
    });
  });
});
