/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import HeaderStats from "../../../layouts/Admin/employeeComponent/HeaderStats";

// Mock react-icons
jest.mock("react-icons/md", () => ({
  MdPeopleAlt: ({ size, className, ...props }) => (
    <span data-testid="people-icon" className={className} {...props} />
  ),
}));

jest.mock("react-icons/io5", () => ({
  IoTime: ({ size, className, ...props }) => (
    <span data-testid="time-icon" className={className} {...props} />
  ),
  IoCloseSharp: ({ size, className, ...props }) => (
    <span data-testid="close-icon" className={className} {...props} />
  ),
}));

jest.mock("react-icons/io", () => ({
  IoMdPersonAdd: ({ size, className, ...props }) => (
    <span data-testid="person-add-icon" className={className} {...props} />
  ),
}));

describe("HeaderStats", () => {
  const defaultProps = {
    totalEmployees: 1500,
  };

  describe("Rendering", () => {
    it("should render all stat cards", () => {
      render(<HeaderStats {...defaultProps} />);

      // Check all stat labels
      expect(screen.getByText("Total Employees")).toBeInTheDocument();
      expect(screen.getByText("On Leave")).toBeInTheDocument();
      expect(screen.getByText("New Hires")).toBeInTheDocument();
      expect(screen.getByText("Resigned")).toBeInTheDocument();
    });

    it("should render all stat values", () => {
      render(<HeaderStats {...defaultProps} />);

      // Check stat values
      expect(screen.getByText("1500")).toBeInTheDocument(); // Total Employees (dynamic)
      expect(screen.getByText("2500")).toBeInTheDocument(); // On Leave (static)
      expect(screen.getByText("300")).toBeInTheDocument(); // New Hires (static)
      expect(screen.getByText("100")).toBeInTheDocument(); // Resigned (static)
    });

    it("should render all icons", () => {
      render(<HeaderStats {...defaultProps} />);

      expect(screen.getByTestId("people-icon")).toBeInTheDocument();
      expect(screen.getByTestId("time-icon")).toBeInTheDocument();
      expect(screen.getByTestId("person-add-icon")).toBeInTheDocument();
      expect(screen.getByTestId("close-icon")).toBeInTheDocument();
    });

    it("should have correct grid structure", () => {
      const { container } = render(<HeaderStats {...defaultProps} />);

      const gridContainer = container.querySelector(
        ".grid.grid-cols-2.sm\\:grid-cols-2.lg\\:grid-cols-4"
      );
      expect(gridContainer).toBeInTheDocument();
    });
  });

  describe("Props Handling", () => {
    it("should handle zero totalEmployees", () => {
      render(<HeaderStats totalEmployees={0} />);
      expect(screen.getByText("0")).toBeInTheDocument();
    });

    it("should handle large totalEmployees numbers", () => {
      render(<HeaderStats totalEmployees={999999} />);
      expect(screen.getByText("999999")).toBeInTheDocument();
    });

    it("should handle negative totalEmployees (edge case)", () => {
      render(<HeaderStats totalEmployees={-10} />);
      expect(screen.getByText("-10")).toBeInTheDocument();
    });

    it("should handle undefined totalEmployees", () => {
      render(<HeaderStats totalEmployees={undefined} />);
      // Should render empty or handle gracefully
      const totalEmployeesCard = screen
        .getByText("Total Employees")
        .closest("div");
      expect(totalEmployeesCard).toBeInTheDocument();
    });

    it("should handle null totalEmployees", () => {
      render(<HeaderStats totalEmployees={null} />);
      const totalEmployeesCard = screen
        .getByText("Total Employees")
        .closest("div");
      expect(totalEmployeesCard).toBeInTheDocument();
    });
  });

  describe("Static Values", () => {
    it("should always display correct static values regardless of props", () => {
      render(<HeaderStats totalEmployees={1000} />);

      expect(screen.getByText("2500")).toBeInTheDocument(); // On Leave
      expect(screen.getByText("300")).toBeInTheDocument(); // New Hires
      expect(screen.getByText("100")).toBeInTheDocument(); // Resigned
    });
  });

  describe("Layout and Styling", () => {
    it("should have correct CSS classes for responsive grid", () => {
      const { container } = render(<HeaderStats {...defaultProps} />);

      const gridContainer = container.firstChild;
      expect(gridContainer).toHaveClass(
        "grid",
        "grid-cols-2",
        "sm:grid-cols-2",
        "lg:grid-cols-4",
        "gap-2",
        "lg:gap-4",
        "w-full"
      );
    });

    it("should have correct styling for stat cards", () => {
      const { container } = render(<HeaderStats {...defaultProps} />);

      const statCards = container.querySelectorAll(".bg-white.rounded-lg");
      expect(statCards).toHaveLength(4);

      statCards.forEach((card) => {
        expect(card).toHaveClass(
          "bg-white",
          "rounded-lg",
          "shadow-sm",
          "flex-1"
        );
      });
    });

    it("should have correct icon container styling", () => {
      const { container } = render(<HeaderStats {...defaultProps} />);

      // Check blue icon containers (Total Employees & New Hires)
      const blueIconContainers = container.querySelectorAll(".bg-sky-100");
      expect(blueIconContainers).toHaveLength(2);

      // Check red icon containers (On Leave & Resigned)
      const redIconContainers = container.querySelectorAll(".bg-rose-50");
      expect(redIconContainers).toHaveLength(2);
    });

    it("should have correct text styling", () => {
      const { container } = render(<HeaderStats {...defaultProps} />);

      // Check label styling
      const labels = container.querySelectorAll(".text-slate-500");
      expect(labels).toHaveLength(4);

      // Check value styling
      const values = container.querySelectorAll(".font-bold");
      expect(values).toHaveLength(4);
    });
  });

  describe("Icon Styling", () => {
    it("should have correct icon colors", () => {
      render(<HeaderStats {...defaultProps} />);

      // Blue icons
      const peopleIcon = screen.getByTestId("people-icon");
      const personAddIcon = screen.getByTestId("person-add-icon");
      expect(peopleIcon).toHaveClass("text-blue-500");
      expect(personAddIcon).toHaveClass("text-blue-500");

      // Red icons
      const timeIcon = screen.getByTestId("time-icon");
      const closeIcon = screen.getByTestId("close-icon");
      expect(timeIcon).toHaveClass("text-red-500");
      expect(closeIcon).toHaveClass("text-red-500");
    });
  });

  describe("Content Verification", () => {
    it("should display correct labels and values in correct cards", () => {
      render(<HeaderStats totalEmployees={1234} />);

      // Find Total Employees card and verify its value
      const totalEmployeesLabel = screen.getByText("Total Employees");
      const totalEmployeesCard = totalEmployeesLabel.closest(".bg-white");
      expect(totalEmployeesCard).toHaveTextContent("1234");

      // Find On Leave card and verify its value
      const onLeaveLabel = screen.getByText("On Leave");
      const onLeaveCard = onLeaveLabel.closest(".bg-white");
      expect(onLeaveCard).toHaveTextContent("2500");

      // Find New Hires card and verify its value
      const newHiresLabel = screen.getByText("New Hires");
      const newHiresCard = newHiresLabel.closest(".bg-white");
      expect(newHiresCard).toHaveTextContent("300");

      // Find Resigned card and verify its value
      const resignedLabel = screen.getByText("Resigned");
      const resignedCard = resignedLabel.closest(".bg-white");
      expect(resignedCard).toHaveTextContent("100");
    });
  });

  describe("Responsive Design", () => {
    it("should have responsive text sizing", () => {
      const { container } = render(<HeaderStats {...defaultProps} />);

      // Check responsive text classes for labels
      const labels = container.querySelectorAll(".text-sm.sm\\:text-base");
      expect(labels).toHaveLength(4);

      // Check responsive text classes for values
      const values = container.querySelectorAll(
        ".text-base.sm\\:text-\\[19px\\]"
      );
      expect(values).toHaveLength(4);
    });

    it("should have responsive padding", () => {
      const { container } = render(<HeaderStats {...defaultProps} />);

      // Check responsive padding for cards
      const cards = container.querySelectorAll(".p-2.sm\\:p-3");
      expect(cards).toHaveLength(4);

      // Check responsive padding for icon containers
      const iconContainers = container.querySelectorAll(".p-1.sm\\:p-2");
      expect(iconContainers).toHaveLength(4);
    });
  });

  describe("Edge Cases", () => {
    it("should handle string numbers for totalEmployees", () => {
      render(<HeaderStats totalEmployees="1500" />);
      expect(screen.getByText("1500")).toBeInTheDocument();
    });

    it("should handle float numbers for totalEmployees", () => {
      render(<HeaderStats totalEmployees={1500.5} />);
      expect(screen.getByText("1500.5")).toBeInTheDocument();
    });

    it("should render without totalEmployees prop", () => {
      render(<HeaderStats />);

      // Should still render other static values
      expect(screen.getByText("On Leave")).toBeInTheDocument();
      expect(screen.getByText("2500")).toBeInTheDocument();
      expect(screen.getByText("New Hires")).toBeInTheDocument();
      expect(screen.getByText("300")).toBeInTheDocument();
      expect(screen.getByText("Resigned")).toBeInTheDocument();
      expect(screen.getByText("100")).toBeInTheDocument();
    });
  });

  describe("Component Structure", () => {
    it("should maintain proper component structure", () => {
      const { container } = render(<HeaderStats {...defaultProps} />);

      // Should have 4 stat cards
      const statCards = container.querySelectorAll(
        ".bg-white.rounded-lg.shadow-sm"
      );
      expect(statCards).toHaveLength(4);

      // Each card should have proper internal structure
      statCards.forEach((card) => {
        const flexContainer = card.querySelector(
          ".flex.items-center.justify-between"
        );
        expect(flexContainer).toBeInTheDocument();

        const iconContainer = card.querySelector(
          ".rounded-lg.flex.items-center.justify-center"
        );
        expect(iconContainer).toBeInTheDocument();

        const valueElement = card.querySelector(".font-bold");
        expect(valueElement).toBeInTheDocument();
      });
    });
  });
});
