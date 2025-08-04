import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import ProductCards from "../../../layouts/Admin/productComponent/ProductCards";

// Mock react-icons
jest.mock("react-icons/fa", () => ({
  FaRegEdit: () => <div data-testid="edit-icon">Edit</div>,
}));

jest.mock("react-icons/ri", () => ({
  RiDeleteBin5Line: () => <div data-testid="delete-icon">Delete</div>,
}));

jest.mock("react-icons/fa6", () => ({
  FaCirclePlus: () => <div data-testid="add-icon">Add</div>,
}));

jest.mock("react-icons/gr", () => ({
  GrView: () => <div data-testid="view-icon">View</div>,
}));

describe("ProductCards", () => {
  // Mock functions
  const mockHandleEdit = jest.fn();
  const mockSetSelectedProduct = jest.fn();
  const mockSetShowDeletePopup = jest.fn();
  const mockSetComboIdForAddItem = jest.fn();
  const mockSetShowAddItemPopup = jest.fn();
  const mockHandleViewComboDetail = jest.fn();
  const mockGetStockStatus = jest.fn();
  const mockFormatPrice = jest.fn();

  // Sample data
  const mockProducts = [
    {
      ProductId: 1,
      ProductName: "Test Product 1",
      Description: "Test Description 1",
      Unit: "kg",
      Price: 10.99,
      Quantity: 50,
      ImageUrl: "https://example.com/image1.jpg",
    },
    {
      ProductId: 2,
      ProductName: "Test Combo Product",
      Description: "Test Combo Description",
      Unit: "Combo",
      Price: 25.99,
      Quantity: 10,
      ImageUrl: null,
    },
    {
      ProductId: 3,
      ProductName: "Out of Stock Product",
      Description: "This product is out of stock",
      Unit: "piece",
      Price: 5.5,
      Quantity: 0,
      ImageUrl: "https://example.com/image3.jpg",
    },
  ];

  const defaultProps = {
    products: mockProducts,
    handleEdit: mockHandleEdit,
    setSelectedProduct: mockSetSelectedProduct,
    setShowDeletePopup: mockSetShowDeletePopup,
    setComboIdForAddItem: mockSetComboIdForAddItem,
    setShowAddItemPopup: mockSetShowAddItemPopup,
    handleViewComboDetail: mockHandleViewComboDetail,
    getStockStatus: mockGetStockStatus,
    formatPrice: mockFormatPrice,
  };

  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();

    // Setup default mock returns
    mockGetStockStatus.mockReturnValue({
      status: "In Stock",
      class: "bg-green-100 text-green-800",
    });
    mockFormatPrice.mockImplementation((price) => `$${price.toFixed(2)}`);
  });

  describe("Rendering", () => {
    test("renders all products", () => {
      render(<ProductCards {...defaultProps} />);

      expect(screen.getByText("Test Product 1")).toBeInTheDocument();
      expect(screen.getByText("Test Combo Product")).toBeInTheDocument();
      expect(screen.getByText("Out of Stock Product")).toBeInTheDocument();
    });

    test("renders product details correctly", () => {
      render(<ProductCards {...defaultProps} />);

      // Check product names
      expect(screen.getByText("Test Product 1")).toBeInTheDocument();
      expect(screen.getByText("Test Description 1")).toBeInTheDocument();

      // Check that formatPrice and getStockStatus are called
      expect(mockFormatPrice).toHaveBeenCalledWith(10.99);
      expect(mockGetStockStatus).toHaveBeenCalledWith(50);
    });

    test("renders product images when ImageUrl is provided", () => {
      render(<ProductCards {...defaultProps} />);

      const images = screen.getAllByRole("img");
      expect(images).toHaveLength(2); // Only products with ImageUrl
      expect(images[0]).toHaveAttribute(
        "src",
        "https://example.com/image1.jpg"
      );
      expect(images[0]).toHaveAttribute("alt", "Test Product 1");
    });

    test('renders "No image" text when ImageUrl is null', () => {
      render(<ProductCards {...defaultProps} />);

      expect(screen.getByText("No image")).toBeInTheDocument();
    });

    test("displays product information correctly", () => {
      render(<ProductCards {...defaultProps} />);

      // Check units
      expect(screen.getByText("kg")).toBeInTheDocument();
      expect(screen.getByText("Combo")).toBeInTheDocument();
      expect(screen.getByText("piece")).toBeInTheDocument();

      // Check quantities
      expect(screen.getByText("50")).toBeInTheDocument();
      expect(screen.getByText("10")).toBeInTheDocument();
      expect(screen.getByText("0")).toBeInTheDocument();
    });
  });

  describe("Stock Status", () => {
    test("calls getStockStatus for each product", () => {
      render(<ProductCards {...defaultProps} />);

      expect(mockGetStockStatus).toHaveBeenCalledTimes(3);
      expect(mockGetStockStatus).toHaveBeenCalledWith(50);
      expect(mockGetStockStatus).toHaveBeenCalledWith(10);
      expect(mockGetStockStatus).toHaveBeenCalledWith(0);
    });

    test("applies correct stock status class", () => {
      mockGetStockStatus.mockReturnValueOnce({
        status: "Out of Stock",
        class: "bg-red-100 text-red-800",
      });

      render(<ProductCards {...defaultProps} />);

      const statusSpan = screen.getByText("Out of Stock");
      expect(statusSpan).toHaveClass("bg-red-100", "text-red-800");
    });
  });

  describe("Action Buttons", () => {
    test("renders edit and delete buttons for all products", () => {
      render(<ProductCards {...defaultProps} />);

      const editButtons = screen.getAllByLabelText("Edit product");
      const deleteButtons = screen.getAllByLabelText("Delete product");

      expect(editButtons).toHaveLength(3);
      expect(deleteButtons).toHaveLength(3);
    });

    test("calls handleEdit when edit button is clicked", () => {
      render(<ProductCards {...defaultProps} />);

      const editButtons = screen.getAllByLabelText("Edit product");
      fireEvent.click(editButtons[0]);

      expect(mockHandleEdit).toHaveBeenCalledWith(mockProducts[0]);
    });

    test("calls delete functions when delete button is clicked", () => {
      render(<ProductCards {...defaultProps} />);

      const deleteButtons = screen.getAllByLabelText("Delete product");
      fireEvent.click(deleteButtons[0]);

      expect(mockSetSelectedProduct).toHaveBeenCalledWith(mockProducts[0]);
      expect(mockSetShowDeletePopup).toHaveBeenCalledWith(true);
    });
  });

  describe("Combo Product Features", () => {
    test("renders add item button only for combo products", () => {
      render(<ProductCards {...defaultProps} />);

      const addButtons = screen.getAllByLabelText("Add item to combo");
      expect(addButtons).toHaveLength(1); // Only one combo product
    });

    test("renders view combo button only for combo products", () => {
      render(<ProductCards {...defaultProps} />);

      const viewButtons = screen.getAllByLabelText("View combo items");
      expect(viewButtons).toHaveLength(1); // Only one combo product
    });

    test("calls add item functions when add button is clicked", () => {
      render(<ProductCards {...defaultProps} />);

      const addButton = screen.getByLabelText("Add item to combo");
      fireEvent.click(addButton);

      expect(mockSetComboIdForAddItem).toHaveBeenCalledWith(2); // Combo product ID
      expect(mockSetShowAddItemPopup).toHaveBeenCalledWith(true);
    });

    test("calls handleViewComboDetail when view button is clicked", () => {
      render(<ProductCards {...defaultProps} />);

      const viewButton = screen.getByLabelText("View combo items");
      fireEvent.click(viewButton);

      expect(mockHandleViewComboDetail).toHaveBeenCalledWith(2); // Combo product ID
    });

    test("does not render combo buttons for non-combo products", () => {
      const nonComboProducts = [mockProducts[0], mockProducts[2]]; // Exclude combo product

      render(<ProductCards {...defaultProps} products={nonComboProducts} />);

      expect(
        screen.queryByLabelText("Add item to combo")
      ).not.toBeInTheDocument();
      expect(
        screen.queryByLabelText("View combo items")
      ).not.toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    test("has proper aria-labels for all buttons", () => {
      render(<ProductCards {...defaultProps} />);

      expect(screen.getAllByLabelText("Edit product")).toHaveLength(3);
      expect(screen.getAllByLabelText("Delete product")).toHaveLength(3);
      expect(screen.getByLabelText("Add item to combo")).toBeInTheDocument();
      expect(screen.getByLabelText("View combo items")).toBeInTheDocument();
    });

    test("images have proper alt text", () => {
      render(<ProductCards {...defaultProps} />);

      const images = screen.getAllByRole("img");
      expect(images[0]).toHaveAttribute("alt", "Test Product 1");
      expect(images[1]).toHaveAttribute("alt", "Out of Stock Product");
    });
  });

  describe("Price Formatting", () => {
    test("calls formatPrice function for each product", () => {
      render(<ProductCards {...defaultProps} />);

      expect(mockFormatPrice).toHaveBeenCalledTimes(3);
      expect(mockFormatPrice).toHaveBeenCalledWith(10.99);
      expect(mockFormatPrice).toHaveBeenCalledWith(25.99);
      expect(mockFormatPrice).toHaveBeenCalledWith(5.5);
    });

    test("displays formatted price", () => {
      mockFormatPrice.mockImplementation(
        (price) => `VND ${price.toLocaleString()}`
      );

      render(<ProductCards {...defaultProps} />);

      expect(screen.getByText("VND 10.99")).toBeInTheDocument();
    });
  });

  describe("Edge Cases", () => {
    test("handles products with undefined or null values gracefully", () => {
      const edgeCaseProducts = [
        {
          ProductId: 999,
          ProductName: "",
          Description: null,
          Unit: undefined,
          Price: 0,
          Quantity: null,
          ImageUrl: "",
        },
      ];

      expect(() => {
        render(<ProductCards {...defaultProps} products={edgeCaseProducts} />);
      }).not.toThrow();
    });

    test("handles very long product names and descriptions", () => {
      const longTextProducts = [
        {
          ProductId: 4,
          ProductName: "A".repeat(200),
          Description: "B".repeat(500),
          Unit: "kg",
          Price: 10,
          Quantity: 5,
          ImageUrl: null,
        },
      ];

      render(<ProductCards {...defaultProps} products={longTextProducts} />);

      expect(screen.getByText("A".repeat(200))).toBeInTheDocument();
      expect(screen.getByText("B".repeat(500))).toBeInTheDocument();
    });
  });
});
