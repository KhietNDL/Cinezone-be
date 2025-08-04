/* eslint-disable no-undef */
import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import StatsCards from "../../../layouts/Admin/productComponent/StatsCards";

describe("StatsCards", () => {
  // Sample test data
  const mockProductsData = [
    { ProductId: 1, ProductName: "Product 1", Quantity: 50 }, // In Stock
    { ProductId: 2, ProductName: "Product 2", Quantity: 15 }, // In Stock
    { ProductId: 3, ProductName: "Product 3", Quantity: 8 }, // Low Stock
    { ProductId: 4, ProductName: "Product 4", Quantity: 5 }, // Low Stock
    { ProductId: 5, ProductName: "Product 5", Quantity: 0 }, // Out of Stock
    { ProductId: 6, ProductName: "Product 6", Quantity: 0 }, // Out of Stock
    { ProductId: 7, ProductName: "Product 7", Quantity: 1 }, // Low Stock
  ];

  const defaultProps = {
    totalProducts: mockProductsData.length,
    products: mockProductsData,
  };

  describe("Rendering", () => {
    test("renders all four stat cards", () => {
      render(<StatsCards {...defaultProps} />);

      expect(screen.getByText("Total Products")).toBeInTheDocument();
      expect(screen.getByText("In Stock")).toBeInTheDocument();
      expect(screen.getByText("Low Stock")).toBeInTheDocument();
      expect(screen.getByText("Out of Stock")).toBeInTheDocument();
    });

    test("has correct grid structure and styling", () => {
      const { container } = render(<StatsCards {...defaultProps} />);

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

    test("each card has correct styling", () => {
      const { container } = render(<StatsCards {...defaultProps} />);

      const cards = container.querySelectorAll(".bg-white");
      expect(cards).toHaveLength(4);

      cards.forEach((card) => {
        expect(card).toHaveClass(
          "bg-white",
          "rounded-md",
          "p-2",
          "sm:p-3",
          "flex-1",
          "shadow-sm"
        );
      });
    });

    test("renders colored indicators for each card", () => {
      const { container } = render(<StatsCards {...defaultProps} />);

      // Blue indicator for Total Products
      const blueIndicator = container.querySelector(".bg-blue-500");
      expect(blueIndicator).toBeInTheDocument();

      // Green indicator for In Stock
      const greenIndicator = container.querySelector(".bg-green-500");
      expect(greenIndicator).toBeInTheDocument();

      // Yellow indicator for Low Stock
      const yellowIndicator = container.querySelector(".bg-yellow-500");
      expect(yellowIndicator).toBeInTheDocument();

      // Red indicator for Out of Stock
      const redIndicator = container.querySelector(".bg-red-500");
      expect(redIndicator).toBeInTheDocument();
    });
  });

  describe("Statistics Calculations", () => {
    test("displays correct total products count", () => {
      render(<StatsCards {...defaultProps} />);

      const totalProductsValue = screen.getByText("7");
      expect(totalProductsValue).toBeInTheDocument();
    });

    test("calculates in stock products correctly (Quantity > 10)", () => {
      render(<StatsCards {...defaultProps} />);

      // Products with Quantity > 10: Product 1 (50), Product 2 (15) = 2 products
      const inStockCards = screen.getAllByText("2");
      expect(inStockCards.length).toBeGreaterThan(0);
    });

    test("calculates low stock products correctly (0 < Quantity <= 10)", () => {
      render(<StatsCards {...defaultProps} />);

      // Products with 0 < Quantity <= 10: Product 3 (8), Product 4 (5), Product 7 (1) = 3 products
      const lowStockValue = screen.getByText("3");
      expect(lowStockValue).toBeInTheDocument();
    });

    test("calculates out of stock products correctly (Quantity === 0)", () => {
      render(<StatsCards {...defaultProps} />);

      // Products with Quantity === 0: Product 5 (0), Product 6 (0) = 2 products
      const outOfStockCards = screen.getAllByText("2");
      expect(outOfStockCards.length).toBeGreaterThan(0);
    });
  });

  describe("Edge Cases", () => {
    test("handles empty products array", () => {
      const emptyProps = {
        totalProducts: 0,
        products: [],
      };

      render(<StatsCards {...emptyProps} />);

      expect(screen.getByText("Total Products")).toBeInTheDocument();
      expect(screen.getAllByText("0")).toHaveLength(4); // All stats should be 0
    });

    test("handles missing quantity property gracefully", () => {
      const productsWithMissingQuantity = [
        { ProductId: 1, ProductName: "Product 1", Quantity: 5 },
        { ProductId: 2, ProductName: "Product 2" }, // Missing Quantity
        { ProductId: 3, ProductName: "Product 3", Quantity: null }, // Null Quantity
        { ProductId: 4, ProductName: "Product 4", Quantity: undefined }, // Undefined Quantity
      ];

      const props = {
        totalProducts: 4,
        products: productsWithMissingQuantity,
      };

      // Should not throw error
      expect(() => {
        render(<StatsCards {...props} />);
      }).not.toThrow();
    });

    test("handles negative quantities", () => {
      const productsWithNegativeQuantity = [
        { ProductId: 1, ProductName: "Product 1", Quantity: -5 },
        { ProductId: 2, ProductName: "Product 2", Quantity: 15 },
      ];

      const props = {
        totalProducts: 2,
        products: productsWithNegativeQuantity,
      };

      render(<StatsCards {...props} />);

      // Negative quantities should not be counted in any positive category
      expect(screen.getByText("2")).toBeInTheDocument(); // Total
      expect(screen.getByText("1")).toBeInTheDocument(); // In Stock (only Product 2)
    });
  });

  describe("Props Validation", () => {
    test("displays totalProducts prop value correctly", () => {
      const customProps = {
        totalProducts: 42,
        products: [],
      };

      render(<StatsCards {...customProps} />);

      expect(screen.getByText("42")).toBeInTheDocument();
    });

    test("totalProducts can differ from actual products array length", () => {
      const props = {
        totalProducts: 10, // Different from actual array length
        products: [{ ProductId: 1, ProductName: "Product 1", Quantity: 5 }],
      };

      render(<StatsCards {...props} />);

      expect(screen.getByText("10")).toBeInTheDocument(); // Shows totalProducts prop
      expect(screen.getByText("1")).toBeInTheDocument(); // Low Stock based on actual array
    });
  });

  describe("Visual Elements", () => {
    test("renders indicator backgrounds with correct colors", () => {
      const { container } = render(<StatsCards {...defaultProps} />);

      expect(container.querySelector(".bg-blue-100")).toBeInTheDocument();
      expect(container.querySelector(".bg-green-100")).toBeInTheDocument();
      expect(container.querySelector(".bg-yellow-100")).toBeInTheDocument();
      expect(container.querySelector(".bg-red-100")).toBeInTheDocument();
    });

    test("stat values have correct typography classes", () => {
      const { container } = render(<StatsCards {...defaultProps} />);

      const statValues = container.querySelectorAll(".font-bold");
      expect(statValues).toHaveLength(4);

      statValues.forEach((value) => {
        expect(value).toHaveClass("font-bold", "text-base", "sm:text-[19px]");
      });
    });

    test("labels have correct styling", () => {
      const { container } = render(<StatsCards {...defaultProps} />);

      const labels = container.querySelectorAll(".text-slate-500");
      expect(labels).toHaveLength(4);

      // Most labels should have responsive text sizing
      const responsiveLabels = container.querySelectorAll(
        ".text-sm.sm\\:text-base"
      );
      expect(responsiveLabels).toHaveLength(3); // Total Products, In Stock, Out of Stock

      // Low Stock label has different styling
      const lowStockLabel = screen.getByText("Low Stock");
      expect(lowStockLabel).toHaveClass("text-slate-500", "text-sm");
    });
  });

  describe("Responsive Design", () => {
    test("has responsive grid classes", () => {
      const { container } = render(<StatsCards {...defaultProps} />);

      const gridContainer = container.firstChild;
      expect(gridContainer).toHaveClass(
        "grid-cols-2",
        "sm:grid-cols-2",
        "lg:grid-cols-4"
      );
    });

    test("has responsive gap classes", () => {
      const { container } = render(<StatsCards {...defaultProps} />);

      const gridContainer = container.firstChild;
      expect(gridContainer).toHaveClass("gap-2", "lg:gap-4");
    });

    test("has responsive padding classes on cards", () => {
      const { container } = render(<StatsCards {...defaultProps} />);

      const cards = container.querySelectorAll(".p-2");
      expect(cards).toHaveLength(4);

      cards.forEach((card) => {
        expect(card).toHaveClass("p-2", "sm:p-3");
      });
    });
  });
});
