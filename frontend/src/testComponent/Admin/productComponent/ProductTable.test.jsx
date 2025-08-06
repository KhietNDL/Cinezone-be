/* eslint-disable no-undef */
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";

import ProductTable from "../../../layouts/Admin/productComponent/ProductTable";

// Mock các icon components
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

describe("ProductTable", () => {
  // Mock functions
  const mockHandleEdit = jest.fn();
  const mockSetSelectedProduct = jest.fn();
  const mockSetShowDeletePopup = jest.fn();
  const mockSetComboIdForAddItem = jest.fn();
  const mockSetShowAddItemPopup = jest.fn();
  const mockHandleViewComboDetail = jest.fn();
  const mockGetStockStatus = jest.fn();
  const mockFormatPrice = jest.fn();

  // Sample test data
  const mockProducts = [
    {
      ProductId: 1,
      ProductName: "Test Product 1",
      Description: "Test Description 1",
      ImageUrl: "https://example.com/image1.jpg",
      Unit: "piece",
      Price: 100000,
      Quantity: 50,
    },
    {
      ProductId: 2,
      ProductName: "Test Combo",
      Description: "Test Combo Description",
      ImageUrl: null,
      Unit: "Combo",
      Price: 200000,
      Quantity: 10,
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

    // Setup default mock implementations
    mockGetStockStatus.mockReturnValue({
      status: "In Stock",
      class: "bg-green-100 text-green-800",
    });

    mockFormatPrice.mockImplementation((price) => `₫${price.toLocaleString()}`);
  });

  describe("Rendering", () => {
    test("renders table with correct headers", () => {
      render(<ProductTable {...defaultProps} />);

      expect(screen.getByText("Image")).toBeInTheDocument();
      expect(screen.getByText("Product Name")).toBeInTheDocument();
      expect(screen.getByText("Unit")).toBeInTheDocument();
      expect(screen.getByText("Price")).toBeInTheDocument();
      expect(screen.getByText("Quantity")).toBeInTheDocument();
      expect(screen.getByText("Status")).toBeInTheDocument();
      expect(screen.getByText("Actions")).toBeInTheDocument();
    });

    test("renders products correctly", () => {
      render(<ProductTable {...defaultProps} />);

      expect(screen.getByText("Test Product 1")).toBeInTheDocument();
      expect(screen.getByText("Test Description 1")).toBeInTheDocument();
      expect(screen.getByText("Test Combo")).toBeInTheDocument();
      expect(screen.getByText("Test Combo Description")).toBeInTheDocument();
    });

    test("renders product image when ImageUrl is provided", () => {
      render(<ProductTable {...defaultProps} />);

      const productImage = screen.getByAltText("Test Product 1");
      expect(productImage).toBeInTheDocument();
      expect(productImage).toHaveAttribute(
        "src",
        "https://example.com/image1.jpg"
      );
    });

    test('renders "No image" text when ImageUrl is null', () => {
      render(<ProductTable {...defaultProps} />);

      expect(screen.getByText("No image")).toBeInTheDocument();
    });

    test("calls formatPrice function for each product", () => {
      render(<ProductTable {...defaultProps} />);

      expect(mockFormatPrice).toHaveBeenCalledWith(100000);
      expect(mockFormatPrice).toHaveBeenCalledWith(200000);
      expect(mockFormatPrice).toHaveBeenCalledTimes(2);
    });

    test("calls getStockStatus function for each product", () => {
      render(<ProductTable {...defaultProps} />);

      expect(mockGetStockStatus).toHaveBeenCalledWith(50);
      expect(mockGetStockStatus).toHaveBeenCalledWith(10);
      expect(mockGetStockStatus).toHaveBeenCalledTimes(2);
    });
  });

  describe("Actions", () => {
    test("renders edit and delete buttons for all products", () => {
      render(<ProductTable {...defaultProps} />);

      const editButtons = screen.getAllByTestId("edit-icon");
      const deleteButtons = screen.getAllByTestId("delete-icon");

      expect(editButtons).toHaveLength(2);
      expect(deleteButtons).toHaveLength(2);
    });

    test("calls handleEdit when edit button is clicked", () => {
      render(<ProductTable {...defaultProps} />);

      const editButtons = screen.getAllByLabelText("Edit product");
      fireEvent.click(editButtons[0]);

      expect(mockHandleEdit).toHaveBeenCalledWith(mockProducts[0]);
      expect(mockHandleEdit).toHaveBeenCalledTimes(1);
    });

    test("calls setSelectedProduct and setShowDeletePopup when delete button is clicked", () => {
      render(<ProductTable {...defaultProps} />);

      const deleteButtons = screen.getAllByLabelText("Delete product");
      fireEvent.click(deleteButtons[0]);

      expect(mockSetSelectedProduct).toHaveBeenCalledWith(mockProducts[0]);
      expect(mockSetShowDeletePopup).toHaveBeenCalledWith(true);
    });

    test("renders combo-specific buttons only for combo products", () => {
      render(<ProductTable {...defaultProps} />);

      // Should have 1 add button and 1 view button (only for combo product)
      expect(screen.getAllByTestId("add-icon")).toHaveLength(1);
      expect(screen.getAllByTestId("view-icon")).toHaveLength(1);
    });

    test("calls setComboIdForAddItem and setShowAddItemPopup when add item button is clicked", () => {
      render(<ProductTable {...defaultProps} />);

      const addButton = screen.getByLabelText("Add item to combo");
      fireEvent.click(addButton);

      expect(mockSetComboIdForAddItem).toHaveBeenCalledWith(2); // Combo product ID
      expect(mockSetShowAddItemPopup).toHaveBeenCalledWith(true);
    });

    test("calls handleViewComboDetail when view combo button is clicked", () => {
      render(<ProductTable {...defaultProps} />);

      const viewButton = screen.getByLabelText("View combo items");
      fireEvent.click(viewButton);

      expect(mockHandleViewComboDetail).toHaveBeenCalledWith(2); // Combo product ID
    });
  });

  describe("Edge Cases", () => {
    test("renders empty table when products array is empty", () => {
      render(<ProductTable {...defaultProps} products={[]} />);

      // Headers should still be present
      expect(screen.getByText("Product Name")).toBeInTheDocument();

      // But no product data
      expect(screen.queryByText("Test Product 1")).not.toBeInTheDocument();
    });

    test("handles products with missing optional fields", () => {
      const incompleteProduct = [
        {
          ProductId: 3,
          ProductName: "Incomplete Product",
          Description: "",
          ImageUrl: "",
          Unit: "kg",
          Price: 0,
          Quantity: 0,
        },
      ];

      render(<ProductTable {...defaultProps} products={incompleteProduct} />);

      expect(screen.getByText("Incomplete Product")).toBeInTheDocument();
      expect(mockFormatPrice).toHaveBeenCalledWith(0);
      expect(mockGetStockStatus).toHaveBeenCalledWith(0);
    });

    test("applies correct CSS classes and attributes", () => {
      render(<ProductTable {...defaultProps} />);

      const table = screen.getByRole("table");
      expect(table).toHaveClass(
        "min-w-[700px]",
        "w-full",
        "table-auto",
        "border-collapse"
      );

      const editButton = screen.getAllByLabelText("Edit product")[0];
      expect(editButton).toHaveAttribute("title", "Edit");

      const deleteButton = screen.getAllByLabelText("Delete product")[0];
      expect(deleteButton).toHaveAttribute("title", "Delete");
    });
  });

  describe("Accessibility", () => {
    test("has proper ARIA labels for action buttons", () => {
      render(<ProductTable {...defaultProps} />);

      expect(screen.getAllByLabelText("Edit product")).toHaveLength(2);
      expect(screen.getAllByLabelText("Delete product")).toHaveLength(2);
      expect(screen.getByLabelText("Add item to combo")).toBeInTheDocument();
      expect(screen.getByLabelText("View combo items")).toBeInTheDocument();
    });

    test("has proper title attributes for tooltips", () => {
      render(<ProductTable {...defaultProps} />);

      expect(screen.getAllByTitle("Edit")).toHaveLength(2);
      expect(screen.getAllByTitle("Delete")).toHaveLength(2);
      expect(screen.getByTitle("Add Item")).toBeInTheDocument();
      expect(screen.getByTitle("View Combo Items")).toBeInTheDocument();
    });
  });

  describe("Responsive Design", () => {
    test("has hidden class for mobile screens", () => {
      const { container } = render(<ProductTable {...defaultProps} />);

      const tableWrapper = container.firstChild;
      expect(tableWrapper).toHaveClass("hidden", "md:block");
    });

    test("has overflow-x-auto for horizontal scrolling", () => {
      const { container } = render(<ProductTable {...defaultProps} />);

      const tableWrapper = container.firstChild;
      expect(tableWrapper).toHaveClass("overflow-x-auto");
    });
  });
});
