/* eslint-disable no-undef */
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";

import PromotionTable from "../../../layouts/Admin/promotionComponent/PromotionTable";

// Mock react-icons
jest.mock("react-icons/fa", () => ({
  FaRegEdit: ({ size }) => (
    <div data-testid="edit-icon" data-size={size}>
      Edit Icon
    </div>
  ),
}));

jest.mock("react-icons/ri", () => ({
  RiDeleteBin5Line: ({ size }) => (
    <div data-testid="delete-icon" data-size={size}>
      Delete Icon
    </div>
  ),
}));

describe("PromotionTable", () => {
  const mockHandleEdit = jest.fn();
  const mockSetSelectedPromotion = jest.fn();
  const mockSetShowDeletePopup = jest.fn();
  const mockFormatDate = jest.fn();

  const defaultProps = {
    promotions: [],
    handleEdit: mockHandleEdit,
    setSelectedPromotion: mockSetSelectedPromotion,
    setShowDeletePopup: mockSetShowDeletePopup,
    formatDate: mockFormatDate,
  };

  const mockPromotions = [
    {
      PromotionId: 1,
      Title: "Summer Sale",
      Detail: "50% off on all items",
      Image: "https://example.com/image1.jpg",
      DiscountValue: 50,
      StartTime: "2024-01-01T00:00:00Z",
      EndTime: "2024-12-31T23:59:59Z",
    },
    {
      PromotionId: 2,
      Title: "Winter Special",
      Detail: "Limited time offer",
      Image: null,
      DiscountValue: 25.75,
      StartTime: "2023-01-01T00:00:00Z",
      EndTime: "2023-12-31T23:59:59Z",
    },
    {
      PromotionId: 3,
      Title: "Future Promotion",
      Detail: "Coming soon",
      Image: "https://example.com/image3.jpg",
      DiscountValue: 30.0,
      StartTime: "2025-01-01T00:00:00Z",
      EndTime: "2025-12-31T23:59:59Z",
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    mockFormatDate.mockImplementation((date) =>
      date ? new Date(date).toLocaleDateString() : ""
    );
  });

  describe("Table Structure", () => {
    test("renders table with correct structure", () => {
      render(<PromotionTable {...defaultProps} />);

      const table = screen.getByRole("table");
      expect(table).toBeInTheDocument();
      expect(table).toHaveClass("w-full", "table-auto", "border-collapse");
    });

    test("renders table headers correctly", () => {
      render(<PromotionTable {...defaultProps} />);

      expect(screen.getByText("Image")).toBeInTheDocument();
      expect(screen.getByText("Promotion Name")).toBeInTheDocument();
      expect(screen.getByText("Value")).toBeInTheDocument();
      expect(screen.getByText("Start Date")).toBeInTheDocument();
      expect(screen.getByText("End Date")).toBeInTheDocument();
      expect(screen.getByText("Status")).toBeInTheDocument();
      expect(screen.getByText("Actions")).toBeInTheDocument();
    });

    test("header row has correct styling", () => {
      render(<PromotionTable {...defaultProps} />);

      const headerRow = screen.getByRole("row");
      expect(headerRow).toHaveClass(
        "text-left",
        "text-slate-500",
        "text-sm",
        "border-b",
        "border-slate-200"
      );
    });

    test("table has responsive wrapper", () => {
      const { container } = render(<PromotionTable {...defaultProps} />);

      const wrapper = container.firstChild;
      expect(wrapper).toHaveClass("hidden", "sm:block");
    });
  });

  describe("Empty State", () => {
    test("renders table structure even with no promotions", () => {
      render(<PromotionTable {...defaultProps} />);

      const table = screen.getByRole("table");
      const tbody = table.querySelector("tbody");

      expect(table).toBeInTheDocument();
      expect(tbody).toBeInTheDocument();
      expect(tbody).toBeEmptyDOMElement();
    });
  });

  describe("Promotion Rows", () => {
    test("renders promotion rows correctly", () => {
      render(<PromotionTable {...defaultProps} promotions={mockPromotions} />);

      // Should have header row + 3 data rows
      const rows = screen.getAllByRole("row");
      expect(rows).toHaveLength(4);

      expect(screen.getByText("Summer Sale")).toBeInTheDocument();
      expect(screen.getByText("Winter Special")).toBeInTheDocument();
      expect(screen.getByText("Future Promotion")).toBeInTheDocument();
    });

    test("promotion rows have correct styling", () => {
      render(
        <PromotionTable {...defaultProps} promotions={[mockPromotions[0]]} />
      );

      const dataRows = screen.getAllByRole("row");
      const promotionRow = dataRows[1]; // First row is header

      expect(promotionRow).toHaveClass(
        "border-b",
        "border-slate-200",
        "hover:bg-slate-100",
        "hover:rounded-lg",
        "cursor-pointer",
        "text-sm"
      );
    });

    test("renders promotion details in correct cells", () => {
      render(
        <PromotionTable {...defaultProps} promotions={[mockPromotions[0]]} />
      );

      expect(screen.getByText("Summer Sale")).toBeInTheDocument();
      expect(screen.getByText("50% off on all items")).toBeInTheDocument();
      expect(screen.getByText("50%")).toBeInTheDocument();
    });
  });

  describe("Image Handling", () => {
    test("renders image when provided", () => {
      render(
        <PromotionTable {...defaultProps} promotions={[mockPromotions[0]]} />
      );

      const image = screen.getByAltText("Summer Sale");
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute("src", "https://example.com/image1.jpg");
      expect(image).toHaveClass(
        "w-30",
        "h-24",
        "object-cover",
        "rounded",
        "mx-auto"
      );
    });

    test('shows "No image" when image is not provided', () => {
      render(
        <PromotionTable {...defaultProps} promotions={[mockPromotions[1]]} />
      );

      const noImageText = screen.getByText("No image");
      expect(noImageText).toBeInTheDocument();
      expect(noImageText).toHaveClass("text-gray-400", "italic");
    });

    test("image cell has correct styling", () => {
      render(
        <PromotionTable {...defaultProps} promotions={[mockPromotions[0]]} />
      );

      const imageCells = screen.getAllByRole("cell");
      const imageCell = imageCells.find(
        (cell) => cell.textContent === "" && cell.querySelector("img")
      );

      expect(imageCell).toHaveClass(
        "py-2",
        "text-center",
        "w-[200px]",
        "shrink-0"
      );
    });
  });

  describe("Promotion Details Cell", () => {
    test("renders title and detail correctly", () => {
      render(
        <PromotionTable {...defaultProps} promotions={[mockPromotions[0]]} />
      );

      const title = screen.getByText("Summer Sale");
      const detail = screen.getByText("50% off on all items");

      expect(title).toHaveClass("text-sm", "font-medium", "text-gray-900");
      expect(detail).toHaveClass("text-sm", "text-gray-500");
    });

    test("promotion name cell has correct structure and styling", () => {
      const { container } = render(
        <PromotionTable {...defaultProps} promotions={[mockPromotions[0]]} />
      );

      const nameCell = container.querySelector(
        "td.px-2.py-2.whitespace-nowrap"
      );
      expect(nameCell).toBeInTheDocument();
      expect(nameCell).toHaveClass("w-[200px]", "shrink-0");
    });
  });

  describe("Discount Value Formatting", () => {
    test("formats whole number discount values correctly", () => {
      const promotion = { ...mockPromotions[0], DiscountValue: 50 };
      render(<PromotionTable {...defaultProps} promotions={[promotion]} />);

      expect(screen.getByText("50%")).toBeInTheDocument();
    });

    test("formats decimal discount values correctly", () => {
      const promotion = { ...mockPromotions[0], DiscountValue: 25.75 };
      render(<PromotionTable {...defaultProps} promotions={[promotion]} />);

      expect(screen.getByText("25.75%")).toBeInTheDocument();
    });

    test("removes trailing zeros from decimal values", () => {
      const promotion = { ...mockPromotions[0], DiscountValue: 30.0 };
      render(<PromotionTable {...defaultProps} promotions={[promotion]} />);

      expect(screen.getByText("30%")).toBeInTheDocument();
    });

    test("handles missing discount value", () => {
      const promotion = { ...mockPromotions[0], DiscountValue: null };
      render(<PromotionTable {...defaultProps} promotions={[promotion]} />);

      const valueCells = screen.getAllByRole("cell");
      const valueCell = valueCells.find(
        (cell) =>
          cell.classList.contains("text-center") &&
          cell.classList.contains("w-[150px]")
      );

      expect(valueCell).toHaveTextContent("");
    });

    test("discount value cell has correct styling", () => {
      render(
        <PromotionTable {...defaultProps} promotions={[mockPromotions[0]]} />
      );

      const valueCells = screen.getAllByRole("cell");
      const valueCell = valueCells.find((cell) => cell.textContent === "50%");

      expect(valueCell).toHaveClass(
        "py-2",
        "text-center",
        "w-[150px]",
        "shrink-0"
      );
    });
  });

  describe("Status Logic", () => {
    beforeEach(() => {
      // Mock current date to 2024-06-01
      jest.useFakeTimers();
      jest.setSystemTime(new Date("2024-06-01"));
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    test('shows "Active" status for current promotions', () => {
      const activePromotion = {
        ...mockPromotions[0],
        StartTime: "2024-05-01T00:00:00Z",
        EndTime: "2024-07-01T23:59:59Z",
      };

      render(
        <PromotionTable {...defaultProps} promotions={[activePromotion]} />
      );

      const statusElement = screen.getByText("Active");
      expect(statusElement).toBeInTheDocument();
      expect(statusElement).toHaveClass("bg-green-100", "text-green-700");
    });

    test('shows "Expired" status for past promotions', () => {
      const expiredPromotion = {
        ...mockPromotions[0],
        StartTime: "2024-01-01T00:00:00Z",
        EndTime: "2024-05-01T23:59:59Z",
      };

      render(
        <PromotionTable {...defaultProps} promotions={[expiredPromotion]} />
      );

      const statusElement = screen.getByText("Expired");
      expect(statusElement).toBeInTheDocument();
      expect(statusElement).toHaveClass("bg-rose-200", "text-red-700");
    });

    test('shows "Upcoming" status for future promotions', () => {
      const upcomingPromotion = {
        ...mockPromotions[0],
        StartTime: "2024-07-01T00:00:00Z",
        EndTime: "2024-08-01T23:59:59Z",
      };

      render(
        <PromotionTable {...defaultProps} promotions={[upcomingPromotion]} />
      );

      const statusElement = screen.getByText("Upcoming");
      expect(statusElement).toBeInTheDocument();
      expect(statusElement).toHaveClass("bg-yellow-100", "text-yellow-700");
    });

    test("status element has correct styling", () => {
      const activePromotion = {
        ...mockPromotions[0],
        StartTime: "2024-05-01T00:00:00Z",
        EndTime: "2024-07-01T23:59:59Z",
      };

      render(
        <PromotionTable {...defaultProps} promotions={[activePromotion]} />
      );

      const statusElement = screen.getByText("Active");
      expect(statusElement).toHaveClass(
        "px-3",
        "py-1",
        "rounded-full",
        "font-semibold",
        "text-xs"
      );
    });

    test("handles alternative field names (startTime/endTime)", () => {
      const promotionWithAltFields = {
        ...mockPromotions[0],
        startTime: "2024-05-01T00:00:00Z",
        endTime: "2024-07-01T23:59:59Z",
      };

      render(
        <PromotionTable
          {...defaultProps}
          promotions={[promotionWithAltFields]}
        />
      );

      expect(screen.getByText("Active")).toBeInTheDocument();
    });
  });

  describe("Action Buttons", () => {
    test("renders edit and delete buttons", () => {
      render(
        <PromotionTable {...defaultProps} promotions={[mockPromotions[0]]} />
      );

      const editButton = screen.getByLabelText("Edit promotion");
      const deleteButton = screen.getByLabelText("Delete promotion");

      expect(editButton).toBeInTheDocument();
      expect(deleteButton).toBeInTheDocument();
    });

    test("edit button has correct styling and attributes", () => {
      render(
        <PromotionTable {...defaultProps} promotions={[mockPromotions[0]]} />
      );

      const editButton = screen.getByLabelText("Edit promotion");

      expect(editButton).toHaveClass(
        "text-blue-500",
        "hover:text-blue-700",
        "cursor-pointer"
      );
      expect(editButton).toHaveAttribute("title", "Edit");
      expect(editButton).toHaveAttribute("aria-label", "Edit promotion");
    });

    test("delete button has correct styling and attributes", () => {
      render(
        <PromotionTable {...defaultProps} promotions={[mockPromotions[0]]} />
      );

      const deleteButton = screen.getByLabelText("Delete promotion");

      expect(deleteButton).toHaveClass(
        "text-red-400",
        "hover:text-red-600",
        "cursor-pointer"
      );
      expect(deleteButton).toHaveAttribute("title", "Delete");
      expect(deleteButton).toHaveAttribute("aria-label", "Delete promotion");
    });

    test("action buttons container has correct styling", () => {
      const { container } = render(
        <PromotionTable {...defaultProps} promotions={[mockPromotions[0]]} />
      );

      const actionsCell = container.querySelector(
        "td.px-6.py-2.text-sm.font-medium"
      );
      const buttonContainer = actionsCell.querySelector("div");

      expect(actionsCell).toHaveClass("w-[100px]", "shrink-0");
      expect(buttonContainer).toHaveClass(
        "flex",
        "items-center",
        "justify-center",
        "gap-2"
      );
    });

    test("calls handleEdit when edit button is clicked", () => {
      render(
        <PromotionTable {...defaultProps} promotions={[mockPromotions[0]]} />
      );

      const editButton = screen.getByLabelText("Edit promotion");
      fireEvent.click(editButton);

      expect(mockHandleEdit).toHaveBeenCalledWith(mockPromotions[0]);
      expect(mockHandleEdit).toHaveBeenCalledTimes(1);
    });

    test("calls delete functions when delete button is clicked", () => {
      render(
        <PromotionTable {...defaultProps} promotions={[mockPromotions[0]]} />
      );

      const deleteButton = screen.getByLabelText("Delete promotion");
      fireEvent.click(deleteButton);

      expect(mockSetSelectedPromotion).toHaveBeenCalledWith(mockPromotions[0]);
      expect(mockSetShowDeletePopup).toHaveBeenCalledWith(true);
      expect(mockSetSelectedPromotion).toHaveBeenCalledTimes(1);
      expect(mockSetShowDeletePopup).toHaveBeenCalledTimes(1);
    });
  });

  describe("Icons", () => {
    test("renders edit and delete icons with correct size", () => {
      render(
        <PromotionTable {...defaultProps} promotions={[mockPromotions[0]]} />
      );

      const editIcon = screen.getByTestId("edit-icon");
      const deleteIcon = screen.getByTestId("delete-icon");

      expect(editIcon).toBeInTheDocument();
      expect(deleteIcon).toBeInTheDocument();
      expect(editIcon).toHaveAttribute("data-size", "20");
      expect(deleteIcon).toHaveAttribute("data-size", "20");
    });
  });

  describe("Multiple Promotions", () => {
    test("renders multiple promotion rows", () => {
      render(<PromotionTable {...defaultProps} promotions={mockPromotions} />);

      const rows = screen.getAllByRole("row");
      expect(rows).toHaveLength(4); // 1 header + 3 data rows

      // Check all promotions are rendered
      expect(screen.getByText("Summer Sale")).toBeInTheDocument();
      expect(screen.getByText("Winter Special")).toBeInTheDocument();
      expect(screen.getByText("Future Promotion")).toBeInTheDocument();
    });

    test("each promotion row has unique key and correct data", () => {
      render(<PromotionTable {...defaultProps} promotions={mockPromotions} />);

      // Check specific promotion details
      expect(screen.getByText("50% off on all items")).toBeInTheDocument();
      expect(screen.getByText("Limited time offer")).toBeInTheDocument();
      expect(screen.getByText("Coming soon")).toBeInTheDocument();
    });
  });

  describe("Responsive Design", () => {
    test("table wrapper has responsive classes", () => {
      const { container } = render(<PromotionTable {...defaultProps} />);

      const wrapper = container.firstChild;
      expect(wrapper).toHaveClass("hidden", "sm:block");
    });

    test("headers have responsive width classes", () => {
      render(<PromotionTable {...defaultProps} />);

      const headers = screen.getAllByRole("columnheader");

      // Check specific width classes exist
      expect(headers[0]).toHaveClass("w-[200px]", "shrink-0"); // Image
      expect(headers[1]).toHaveClass("w-[200px]", "shrink-0"); // Name
      expect(headers[2]).toHaveClass("w-[150px]", "shrink-0"); // Value
      expect(headers[3]).toHaveClass("w-[60px]", "md:w-[100px]", "shrink-0"); // Start Date
      expect(headers[4]).toHaveClass("w-[60px]", "md:w-[100px]", "shrink-0"); // End Date
      expect(headers[5]).toHaveClass("w-[100px]", "shrink-0"); // Status
    });
  });

  describe("Edge Cases", () => {
    test("handles promotion with minimal data", () => {
      const minimalPromotion = {
        PromotionId: 999,
        Title: "Test",
        Detail: "Test detail",
      };

      expect(() => {
        render(
          <PromotionTable {...defaultProps} promotions={[minimalPromotion]} />
        );
      }).not.toThrow();

      expect(screen.getByText("Test")).toBeInTheDocument();
    });

    test("handles empty strings in promotion data", () => {
      const emptyStringPromotion = {
        PromotionId: 999,
        Title: "",
        Detail: "",
        Image: "",
        DiscountValue: 0,
      };

      expect(() => {
        render(
          <PromotionTable
            {...defaultProps}
            promotions={[emptyStringPromotion]}
          />
        );
      }).not.toThrow();
    });

    test("handles undefined/null dates", () => {
      const promotionWithNullDates = {
        PromotionId: 999,
        Title: "Test",
        Detail: "Test",
        StartTime: null,
        EndTime: null,
      };

      expect(() => {
        render(
          <PromotionTable
            {...defaultProps}
            promotions={[promotionWithNullDates]}
          />
        );
      }).not.toThrow();
    });
  });

  describe("Accessibility", () => {
    test("table has proper table structure", () => {
      render(<PromotionTable {...defaultProps} promotions={mockPromotions} />);

      const table = screen.getByRole("table");
      const headers = screen.getAllByRole("columnheader");
      const rows = screen.getAllByRole("row");

      expect(table).toBeInTheDocument();
      expect(headers).toHaveLength(7);
      expect(rows).toHaveLength(4); // 1 header + 3 data rows
    });

    test("buttons have proper aria-labels", () => {
      render(
        <PromotionTable {...defaultProps} promotions={[mockPromotions[0]]} />
      );

      const editButton = screen.getByLabelText("Edit promotion");
      const deleteButton = screen.getByLabelText("Delete promotion");

      expect(editButton).toHaveAttribute("aria-label", "Edit promotion");
      expect(deleteButton).toHaveAttribute("aria-label", "Delete promotion");
    });

    test("images have proper alt text", () => {
      render(
        <PromotionTable {...defaultProps} promotions={[mockPromotions[0]]} />
      );

      const image = screen.getByAltText("Summer Sale");
      expect(image).toBeInTheDocument();
    });
  });
});
