/* eslint-disable no-undef */
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";

import PromotionCards from "../../../layouts/Admin/promotionComponent/PromotionCards";
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

describe("PromotionCards", () => {
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
      DiscountValue: 25.5,
      StartTime: "2023-01-01T00:00:00Z",
      EndTime: "2023-12-31T23:59:59Z",
    },
    {
      PromotionId: 3,
      Title: "Future Promotion",
      Detail: "Coming soon",
      Image: "https://example.com/image3.jpg",
      DiscountValue: 30,
      StartTime: "2025-01-01T00:00:00Z",
      EndTime: "2025-12-31T23:59:59Z",
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    mockFormatDate.mockImplementation((date) =>
      new Date(date).toLocaleDateString()
    );
  });

  describe("Rendering", () => {
    test("renders promotion cards correctly", () => {
      render(<PromotionCards {...defaultProps} promotions={mockPromotions} />);

      expect(screen.getByText("Summer Sale")).toBeInTheDocument();
      expect(screen.getByText("Winter Special")).toBeInTheDocument();
      expect(screen.getByText("Future Promotion")).toBeInTheDocument();
    });

    test("displays promotion details correctly", () => {
      render(
        <PromotionCards {...defaultProps} promotions={[mockPromotions[0]]} />
      );

      expect(screen.getByText("Summer Sale")).toBeInTheDocument();
      expect(screen.getByText("50% off on all items")).toBeInTheDocument();
      expect(screen.getByText("50%")).toBeInTheDocument();
    });

    test("renders image when provided", () => {
      render(
        <PromotionCards {...defaultProps} promotions={[mockPromotions[0]]} />
      );

      const image = screen.getByAltText("Summer Sale");
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute("src", "https://example.com/image1.jpg");
      expect(image).toHaveClass("w-20", "h-20", "object-cover", "rounded");
    });

    test('shows "No image" when image is not provided', () => {
      render(
        <PromotionCards {...defaultProps} promotions={[mockPromotions[1]]} />
      );

      expect(screen.getByText("No image")).toBeInTheDocument();
      expect(screen.getByText("No image")).toHaveClass(
        "text-gray-400",
        "italic"
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
        <PromotionCards {...defaultProps} promotions={[activePromotion]} />
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
        <PromotionCards {...defaultProps} promotions={[expiredPromotion]} />
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
        <PromotionCards {...defaultProps} promotions={[upcomingPromotion]} />
      );

      const statusElement = screen.getByText("Upcoming");
      expect(statusElement).toBeInTheDocument();
      expect(statusElement).toHaveClass("bg-yellow-100", "text-yellow-700");
    });

    test("handles alternative field names (startTime/endTime)", () => {
      const promotionWithAltFields = {
        ...mockPromotions[0],
        startTime: "2024-05-01T00:00:00Z",
        endTime: "2024-07-01T23:59:59Z",
      };

      render(
        <PromotionCards
          {...defaultProps}
          promotions={[promotionWithAltFields]}
        />
      );

      expect(screen.getByText("Active")).toBeInTheDocument();
    });
  });

  describe("Discount Value Formatting", () => {
    test("formats whole number discount values correctly", () => {
      const promotion = { ...mockPromotions[0], DiscountValue: 50 };
      render(<PromotionCards {...defaultProps} promotions={[promotion]} />);

      expect(screen.getByText("50%")).toBeInTheDocument();
    });

    test("removes trailing zeros from decimal values", () => {
      const promotion = { ...mockPromotions[0], DiscountValue: 25.0 };
      render(<PromotionCards {...defaultProps} promotions={[promotion]} />);

      expect(screen.getByText("25%")).toBeInTheDocument();
    });

    test("handles missing discount value", () => {
      const promotion = { ...mockPromotions[0], DiscountValue: null };
      render(<PromotionCards {...defaultProps} promotions={[promotion]} />);

      // Should not crash and show empty value
      expect(screen.getByText("Value:")).toBeInTheDocument();
    });
  });

  describe("Date Formatting", () => {
    test("calls formatDate function with correct dates", () => {
      render(
        <PromotionCards {...defaultProps} promotions={[mockPromotions[0]]} />
      );

      expect(mockFormatDate).toHaveBeenCalledWith("2024-01-01T00:00:00Z");
      expect(mockFormatDate).toHaveBeenCalledWith("2024-12-31T23:59:59Z");
    });

    test("displays formatted dates", () => {
      mockFormatDate
        .mockReturnValueOnce("1/1/2024")
        .mockReturnValueOnce("12/31/2024");

      render(
        <PromotionCards {...defaultProps} promotions={[mockPromotions[0]]} />
      );

      expect(screen.getByText("1/1/2024")).toBeInTheDocument();
      expect(screen.getByText("12/31/2024")).toBeInTheDocument();
    });
  });

  describe("User Interactions", () => {
    test("calls handleEdit when edit button is clicked", () => {
      render(
        <PromotionCards {...defaultProps} promotions={[mockPromotions[0]]} />
      );

      const editButton = screen.getByLabelText("Edit promotion");
      fireEvent.click(editButton);

      expect(mockHandleEdit).toHaveBeenCalledWith(mockPromotions[0]);
    });

    test("calls delete functions when delete button is clicked", () => {
      render(
        <PromotionCards {...defaultProps} promotions={[mockPromotions[0]]} />
      );

      const deleteButton = screen.getByLabelText("Delete promotion");
      fireEvent.click(deleteButton);

      expect(mockSetSelectedPromotion).toHaveBeenCalledWith(mockPromotions[0]);
      expect(mockSetShowDeletePopup).toHaveBeenCalledWith(true);
    });

    test("edit button has correct styling and accessibility", () => {
      render(
        <PromotionCards {...defaultProps} promotions={[mockPromotions[0]]} />
      );

      const editButton = screen.getByLabelText("Edit promotion");
      expect(editButton).toHaveClass("text-blue-500", "hover:text-blue-700");
      expect(editButton).toHaveAttribute("aria-label", "Edit promotion");
    });

    test("delete button has correct styling and accessibility", () => {
      render(
        <PromotionCards {...defaultProps} promotions={[mockPromotions[0]]} />
      );

      const deleteButton = screen.getByLabelText("Delete promotion");
      expect(deleteButton).toHaveClass("text-red-400", "hover:text-red-600");
      expect(deleteButton).toHaveAttribute("aria-label", "Delete promotion");
    });
  });

  describe("Icons", () => {
    test("renders edit and delete icons with correct size", () => {
      render(
        <PromotionCards {...defaultProps} promotions={[mockPromotions[0]]} />
      );

      const editIcon = screen.getByTestId("edit-icon");
      const deleteIcon = screen.getByTestId("delete-icon");

      expect(editIcon).toBeInTheDocument();
      expect(deleteIcon).toBeInTheDocument();
      expect(editIcon).toHaveAttribute("data-size", "16");
      expect(deleteIcon).toHaveAttribute("data-size", "16");
    });
  });

  describe("Multiple Promotions", () => {
    test("renders multiple promotion cards", () => {
      render(<PromotionCards {...defaultProps} promotions={mockPromotions} />);

      expect(screen.getAllByRole("article")).toHaveLength(3);
    });

    test("each promotion card has unique key", () => {
      const { container } = render(
        <PromotionCards {...defaultProps} promotions={mockPromotions} />
      );

      const articles = container.querySelectorAll("article");
      expect(articles).toHaveLength(3);
    });
  });

  describe("Responsive Design", () => {
    test("has correct responsive classes", () => {
      const { container } = render(<PromotionCards {...defaultProps} />);

      const mainContainer = container.firstChild;
      expect(mainContainer).toHaveClass("block", "sm:hidden", "space-y-4");
    });

    test("promotion cards have correct styling classes", () => {
      render(
        <PromotionCards {...defaultProps} promotions={[mockPromotions[0]]} />
      );

      const article = screen.getByRole("article");
      expect(article).toHaveClass(
        "bg-white",
        "p-4",
        "rounded-lg",
        "shadow-sm",
        "border",
        "border-slate-200"
      );
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
          <PromotionCards {...defaultProps} promotions={[minimalPromotion]} />
        );
      }).not.toThrow();
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
          <PromotionCards
            {...defaultProps}
            promotions={[emptyStringPromotion]}
          />
        );
      }).not.toThrow();
    });
  });
});
