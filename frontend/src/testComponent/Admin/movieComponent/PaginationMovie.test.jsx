/* eslint-disable no-undef */
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import Pagination from "../../../layouts/Admin/movieComponent/Pagination";

// Mock window.innerWidth for responsive testing
Object.defineProperty(window, "innerWidth", {
  writable: true,
  configurable: true,
  value: 1024,
});

describe("Pagination", () => {
  const mockHandlePageChange = jest.fn();

  const defaultProps = {
    currentPage: 1,
    totalPages: 10,
    handlePageChange: mockHandlePageChange,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Basic Rendering", () => {
    it("renders pagination component with correct structure", () => {
      render(<Pagination {...defaultProps} />);

      expect(screen.getByText("Previous")).toBeInTheDocument();
      expect(screen.getByText("Next")).toBeInTheDocument();
      expect(screen.getByText("1")).toBeInTheDocument();
    });

    it("renders previous and next buttons with correct labels", () => {
      render(<Pagination {...defaultProps} />);

      const prevButton = screen.getByLabelText("Previous page");
      const nextButton = screen.getByLabelText("Next page");

      expect(prevButton).toBeInTheDocument();
      expect(nextButton).toBeInTheDocument();
    });

    it("renders page numbers with correct aria-labels", () => {
      render(<Pagination {...defaultProps} />);

      const page1Button = screen.getByLabelText("Page 1");
      expect(page1Button).toBeInTheDocument();
    });

    it("sets aria-current for current page", () => {
      render(<Pagination {...defaultProps} currentPage={3} />);

      const currentPageButton = screen.getByLabelText("Page 3");
      expect(currentPageButton).toHaveAttribute("aria-current", "true");
    });
  });

  describe("Page Navigation", () => {
    it("calls handlePageChange when clicking on a page number", () => {
      render(<Pagination {...defaultProps} />);

      const page2Button = screen.getByText("2");
      fireEvent.click(page2Button);

      expect(mockHandlePageChange).toHaveBeenCalledWith(2);
    });

    it("calls handlePageChange with previous page when clicking Previous button", () => {
      render(<Pagination {...defaultProps} currentPage={5} />);

      const prevButton = screen.getByText("Previous");
      fireEvent.click(prevButton);

      expect(mockHandlePageChange).toHaveBeenCalledWith(4);
    });

    it("calls handlePageChange with next page when clicking Next button", () => {
      render(<Pagination {...defaultProps} currentPage={5} />);

      const nextButton = screen.getByText("Next");
      fireEvent.click(nextButton);

      expect(mockHandlePageChange).toHaveBeenCalledWith(6);
    });

    it("does not call handlePageChange when Previous button is disabled", () => {
      render(<Pagination {...defaultProps} currentPage={1} />);

      const prevButton = screen.getByText("Previous");
      fireEvent.click(prevButton);

      expect(mockHandlePageChange).not.toHaveBeenCalled();
    });

    it("does not call handlePageChange when Next button is disabled", () => {
      render(<Pagination {...defaultProps} currentPage={10} totalPages={10} />);

      const nextButton = screen.getByText("Next");
      fireEvent.click(nextButton);

      expect(mockHandlePageChange).not.toHaveBeenCalled();
    });
  });

  describe("Button States", () => {
    it("disables Previous button on first page", () => {
      render(<Pagination {...defaultProps} currentPage={1} />);

      const prevButton = screen.getByText("Previous");
      expect(prevButton).toBeDisabled();
      expect(prevButton).toHaveClass(
        "disabled:opacity-50",
        "disabled:cursor-not-allowed"
      );
    });

    it("disables Next button on last page", () => {
      render(<Pagination {...defaultProps} currentPage={10} totalPages={10} />);

      const nextButton = screen.getByText("Next");
      expect(nextButton).toBeDisabled();
      expect(nextButton).toHaveClass(
        "disabled:opacity-50",
        "disabled:cursor-not-allowed"
      );
    });

    it("enables Previous button when not on first page", () => {
      render(<Pagination {...defaultProps} currentPage={5} />);

      const prevButton = screen.getByText("Previous");
      expect(prevButton).not.toBeDisabled();
    });

    it("enables Next button when not on last page", () => {
      render(<Pagination {...defaultProps} currentPage={5} />);

      const nextButton = screen.getByText("Next");
      expect(nextButton).not.toBeDisabled();
    });
  });

  describe("Current Page Highlighting", () => {
    it("highlights current page with correct styling", () => {
      render(<Pagination {...defaultProps} currentPage={3} />);

      const currentPageButton = screen.getByText("3");
      expect(currentPageButton).toHaveClass("bg-indigo-600", "text-white");
    });

    it("applies default styling to non-current pages", () => {
      render(<Pagination {...defaultProps} currentPage={3} />);

      const otherPageButton = screen.getByText("2");
      expect(otherPageButton).toHaveClass(
        "bg-white",
        "text-gray-700",
        "border-gray-200"
      );
    });
  });

  describe("Page Range Display", () => {
    it("displays correct pages when current page is at the beginning", () => {
      render(<Pagination {...defaultProps} currentPage={1} totalPages={10} />);

      expect(screen.getByText("1")).toBeInTheDocument();
      expect(screen.getByText("2")).toBeInTheDocument();
      expect(screen.getByText("3")).toBeInTheDocument();
      expect(screen.getByText("4")).toBeInTheDocument();
      expect(screen.getByText("5")).toBeInTheDocument();
      expect(screen.getByText("...")).toBeInTheDocument();
      expect(screen.getByText("10")).toBeInTheDocument();
    });

    it("displays correct pages when current page is in the middle", () => {
      render(<Pagination {...defaultProps} currentPage={5} totalPages={10} />);

      expect(screen.getByText("1")).toBeInTheDocument();
      expect(screen.getAllByText("...")).toHaveLength(2);
      expect(screen.getByText("3")).toBeInTheDocument();
      expect(screen.getByText("4")).toBeInTheDocument();
      expect(screen.getByText("5")).toBeInTheDocument();
      expect(screen.getByText("6")).toBeInTheDocument();
      expect(screen.getByText("7")).toBeInTheDocument();
      expect(screen.getByText("10")).toBeInTheDocument();
    });

    it("displays correct pages when current page is at the end", () => {
      render(<Pagination {...defaultProps} currentPage={10} totalPages={10} />);

      expect(screen.getByText("1")).toBeInTheDocument();
      expect(screen.getByText("...")).toBeInTheDocument();
      expect(screen.getByText("6")).toBeInTheDocument();
      expect(screen.getByText("7")).toBeInTheDocument();
      expect(screen.getByText("8")).toBeInTheDocument();
      expect(screen.getByText("9")).toBeInTheDocument();
      expect(screen.getByText("10")).toBeInTheDocument();
    });

    it("displays all pages when total pages is small", () => {
      render(<Pagination {...defaultProps} currentPage={2} totalPages={3} />);

      expect(screen.getByText("1")).toBeInTheDocument();
      expect(screen.getByText("2")).toBeInTheDocument();
      expect(screen.getByText("3")).toBeInTheDocument();
      expect(screen.queryByText("...")).not.toBeInTheDocument();
    });

    it("displays all pages when total pages equals max visible buttons", () => {
      render(<Pagination {...defaultProps} currentPage={3} totalPages={5} />);

      expect(screen.getByText("1")).toBeInTheDocument();
      expect(screen.getByText("2")).toBeInTheDocument();
      expect(screen.getByText("3")).toBeInTheDocument();
      expect(screen.getByText("4")).toBeInTheDocument();
      expect(screen.getByText("5")).toBeInTheDocument();
      expect(screen.queryByText("...")).not.toBeInTheDocument();
    });
  });

  describe("Responsive Behavior", () => {
    beforeEach(() => {
      // Reset window.innerWidth
      window.innerWidth = 1024;
    });

    it("shows 5 page buttons on larger screens", () => {
      window.innerWidth = 1024;
      render(<Pagination {...defaultProps} currentPage={5} totalPages={10} />);

      // Should show pages 3, 4, 5, 6, 7 plus 1 and 10
      expect(screen.getByText("3")).toBeInTheDocument();
      expect(screen.getByText("4")).toBeInTheDocument();
      expect(screen.getByText("5")).toBeInTheDocument();
      expect(screen.getByText("6")).toBeInTheDocument();
      expect(screen.getByText("7")).toBeInTheDocument();
    });

    it("shows 3 page buttons on mobile screens", () => {
      window.innerWidth = 500; // Mobile width
      render(<Pagination {...defaultProps} currentPage={5} totalPages={10} />);

      // Should show pages 4, 5, 6 plus 1 and 10
      expect(screen.getByText("4")).toBeInTheDocument();
      expect(screen.getByText("5")).toBeInTheDocument();
      expect(screen.getByText("6")).toBeInTheDocument();
      expect(screen.queryByText("3")).not.toBeInTheDocument();
      expect(screen.queryByText("7")).not.toBeInTheDocument();
    });

    it("applies responsive CSS classes", () => {
      render(<Pagination {...defaultProps} />);

      const container = document.querySelector(".flex.select-none");
      expect(container).toHaveClass(
        "flex-col",
        "sm:flex-row",
        "space-y-2",
        "sm:space-y-0",
        "sm:space-x-2"
      );
    });
  });

  describe("Edge Cases", () => {
    it("handles single page correctly", () => {
      render(<Pagination {...defaultProps} currentPage={1} totalPages={1} />);

      expect(screen.getByText("1")).toBeInTheDocument();
      expect(screen.getByText("Previous")).toBeDisabled();
      expect(screen.getByText("Next")).toBeDisabled();
      expect(screen.queryByText("...")).not.toBeInTheDocument();
    });

    it("handles zero total pages", () => {
      render(<Pagination {...defaultProps} currentPage={1} totalPages={0} />);

      expect(screen.getByText("No pages to display")).toBeInTheDocument();
      expect(screen.getByText("Previous")).toBeDisabled();
      // Next button is not disabled when totalPages is 0 because currentPage (1) !== totalPages (0)
      expect(screen.getByText("Next")).not.toBeDisabled();
    });

    it("handles negative total pages", () => {
      render(<Pagination {...defaultProps} currentPage={1} totalPages={-1} />);

      expect(screen.getByText("No pages to display")).toBeInTheDocument();
      expect(screen.getByText("Previous")).toBeDisabled();
      // Next button is not disabled when totalPages is -1 because currentPage (1) !== totalPages (-1)
      expect(screen.getByText("Next")).not.toBeDisabled();
    });

    it("handles current page greater than total pages", () => {
      render(<Pagination {...defaultProps} currentPage={15} totalPages={10} />);

      // Should still render but might have unexpected behavior
      expect(screen.getByText("Previous")).toBeInTheDocument();
      expect(screen.getByText("Next")).toBeInTheDocument();
    });

    it("handles current page less than 1", () => {
      render(<Pagination {...defaultProps} currentPage={0} totalPages={10} />);

      expect(screen.getByText("Previous")).toBeInTheDocument();
      expect(screen.getByText("Next")).toBeInTheDocument();
    });
  });

  describe("Ellipsis Display", () => {
    it("shows start ellipsis when current page is far from beginning", () => {
      render(<Pagination {...defaultProps} currentPage={8} totalPages={10} />);

      const ellipses = screen.getAllByText("...");
      expect(ellipses.length).toBeGreaterThan(0);
    });

    it("shows end ellipsis when current page is far from end", () => {
      render(<Pagination {...defaultProps} currentPage={3} totalPages={10} />);

      const ellipses = screen.getAllByText("...");
      expect(ellipses.length).toBeGreaterThan(0);
    });

    it("shows both ellipses when current page is in middle of large range", () => {
      render(<Pagination {...defaultProps} currentPage={5} totalPages={15} />);

      const ellipses = screen.getAllByText("...");
      expect(ellipses).toHaveLength(2);
    });

    it("does not show ellipses when not needed", () => {
      render(<Pagination {...defaultProps} currentPage={2} totalPages={5} />);

      expect(screen.queryByText("...")).not.toBeInTheDocument();
    });
  });

  describe("First and Last Page Buttons", () => {
    it("always shows first page button when there are ellipses at start", () => {
      render(<Pagination {...defaultProps} currentPage={8} totalPages={10} />);

      expect(screen.getByText("1")).toBeInTheDocument();
    });

    it("always shows last page button when there are ellipses at end", () => {
      render(<Pagination {...defaultProps} currentPage={3} totalPages={10} />);

      expect(screen.getByText("10")).toBeInTheDocument();
    });

    it("clicking first page button calls handlePageChange with 1", () => {
      render(<Pagination {...defaultProps} currentPage={8} totalPages={10} />);

      const firstPageButton = screen.getByLabelText("Page 1");
      fireEvent.click(firstPageButton);

      expect(mockHandlePageChange).toHaveBeenCalledWith(1);
    });

    it("clicking last page button calls handlePageChange with totalPages", () => {
      render(<Pagination {...defaultProps} currentPage={3} totalPages={10} />);

      const lastPageButton = screen.getByLabelText("Page 10");
      fireEvent.click(lastPageButton);

      expect(mockHandlePageChange).toHaveBeenCalledWith(10);
    });
  });

  describe("CSS Classes and Styling", () => {
    it("applies correct hover and active classes to buttons", () => {
      render(<Pagination {...defaultProps} />);

      const prevButton = screen.getByText("Previous");
      expect(prevButton).toHaveClass(
        "hover:bg-slate-100",
        "active:bg-slate-200"
      );

      const pageButton = screen.getByText("2");
      expect(pageButton).toHaveClass(
        "hover:bg-slate-100",
        "active:bg-slate-200"
      );
    });

    it("applies correct transition classes", () => {
      render(<Pagination {...defaultProps} />);

      const buttons = screen.getAllByRole("button");
      buttons.forEach((button) => {
        expect(button).toHaveClass("transition-colors");
      });
    });

    it("applies correct responsive text and padding classes", () => {
      render(<Pagination {...defaultProps} />);

      const pageButton = screen.getByText("1");
      expect(pageButton).toHaveClass(
        "px-2",
        "sm:px-3",
        "py-1",
        "sm:py-2",
        "text-sm",
        "sm:text-base"
      );
    });
  });
});
