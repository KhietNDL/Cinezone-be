/* eslint-disable no-undef */
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import AddItemPopup from "../../../layouts/Admin/productComponent/AddItemPopup";

// Mock react-icons
jest.mock("react-icons/md", () => ({
  MdOutlineClose: () => <div data-testid="close-icon">Close</div>,
}));

describe("AddItemPopup", () => {
  const mockProducts = [
    {
      ProductId: 1,
      ProductName: "Coca Cola",
      Unit: "Can",
      ImageUrl: "https://example.com/coke.jpg",
    },
    {
      ProductId: 2,
      ProductName: "Popcorn Large",
      Unit: "Box",
      ImageUrl: "https://example.com/popcorn.jpg",
    },
    {
      ProductId: 3,
      ProductName: "Movie Combo",
      Unit: "Combo",
      ImageUrl: "https://example.com/combo.jpg",
    },
    {
      ProductId: 4,
      ProductName: "Nachos",
      Unit: "Tray",
      ImageUrl: null, // Test case for missing image
    },
  ];

  const defaultProps = {
    showAddItemPopup: true,
    setShowAddItemPopup: jest.fn(),
    products: mockProducts,
    addItemProductId: null,
    setAddItemProductId: jest.fn(),
    addItemQuantity: "",
    setAddItemQuantity: jest.fn(),
    handleAddItemToCombo: jest.fn(),
    loading: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    document.body.innerHTML = "";
  });

  describe("Rendering and Visibility", () => {
    it("renders nothing when showAddItemPopup is false", () => {
      render(<AddItemPopup {...defaultProps} showAddItemPopup={false} />);

      expect(screen.queryByText("Add to Combo")).not.toBeInTheDocument();
    });

    it("renders modal backdrop with correct styling", () => {
      render(<AddItemPopup {...defaultProps} />);

      const backdrop = document.querySelector(".fixed.inset-0.bg-black\\/70");
      expect(backdrop).toBeInTheDocument();
      expect(backdrop).toHaveClass("backdrop-blur-sm", "z-50");
    });

    it("renders modal content with correct styling", () => {
      render(<AddItemPopup {...defaultProps} />);

      const modal = document.querySelector(".bg-white.rounded-3xl");
      expect(modal).toBeInTheDocument();
      expect(modal).toHaveClass("shadow-2xl", "max-w-lg", "border-gray-100");
    });
  });

  describe("Header Section", () => {
    it("renders close button with correct functionality", () => {
      render(<AddItemPopup {...defaultProps} />);

      const closeButton = screen.getByLabelText("Close");
      expect(closeButton).toBeInTheDocument();
      expect(screen.getByTestId("close-icon")).toBeInTheDocument();

      fireEvent.click(closeButton);
      expect(defaultProps.setShowAddItemPopup).toHaveBeenCalledWith(false);
    });

    it("applies correct gradient styling to header", () => {
      render(<AddItemPopup {...defaultProps} />);

      const header = document.querySelector(
        ".bg-gradient-to-br.from-emerald-500"
      );
      expect(header).toBeInTheDocument();
      expect(header).toHaveClass("via-teal-500", "to-cyan-600");
    });
  });

  describe("Product Selection", () => {
    it("displays all non-combo products", () => {
      render(<AddItemPopup {...defaultProps} />);

      expect(screen.getByText("Coca Cola")).toBeInTheDocument();
      expect(screen.getByText("Popcorn Large")).toBeInTheDocument();
      expect(screen.getByText("Nachos")).toBeInTheDocument();
      expect(screen.queryByText("Movie Combo")).not.toBeInTheDocument(); // Combo products should be filtered out
    });

    it("displays product images with correct src and alt attributes", () => {
      render(<AddItemPopup {...defaultProps} />);

      const cokeImage = screen.getByAltText("Coca Cola");
      expect(cokeImage).toHaveAttribute("src", "https://example.com/coke.jpg");

      const popcornImage = screen.getByAltText("Popcorn Large");
      expect(popcornImage).toHaveAttribute(
        "src",
        "https://example.com/popcorn.jpg"
      );
    });

    it("displays placeholder image for products without ImageUrl", () => {
      render(<AddItemPopup {...defaultProps} />);

      const nachosImage = screen.getByAltText("Nachos");
      expect(nachosImage).toHaveAttribute(
        "src",
        "https://via.placeholder.com/48x48?text=No+Image"
      );
    });

    it("displays product units correctly", () => {
      render(<AddItemPopup {...defaultProps} />);

      expect(screen.getByText("Unit: Can")).toBeInTheDocument();
      expect(screen.getByText("Unit: Box")).toBeInTheDocument();
      expect(screen.getByText("Unit: Tray")).toBeInTheDocument();
    });

    it("calls setAddItemProductId when clicking on a product", () => {
      render(<AddItemPopup {...defaultProps} />);

      const cokeProduct = screen
        .getByText("Coca Cola")
        .closest('[role="button"]');
      fireEvent.click(cokeProduct);

      expect(defaultProps.setAddItemProductId).toHaveBeenCalledWith(1);
    });

    it("calls setAddItemProductId when clicking on radio button", () => {
      render(<AddItemPopup {...defaultProps} />);

      const radioButtons = screen.getAllByRole("radio");
      fireEvent.click(radioButtons[0]);

      expect(defaultProps.setAddItemProductId).toHaveBeenCalledWith(1);
    });

    it("highlights selected product with correct styling", () => {
      render(<AddItemPopup {...defaultProps} addItemProductId={1} />);

      const selectedProduct = screen
        .getByText("Coca Cola")
        .closest('[role="button"]');
      expect(selectedProduct).toHaveClass(
        "border-emerald-500",
        "bg-gradient-to-r",
        "from-emerald-50",
        "to-teal-50"
      );
    });

    it("shows checkmark icon for selected product", () => {
      render(<AddItemPopup {...defaultProps} addItemProductId={1} />);

      const checkmarkIcon = document.querySelector(
        ".w-8.h-8.bg-emerald-500.rounded-full"
      );
      expect(checkmarkIcon).toBeInTheDocument();
    });

    it("shows ping animation for selected product radio button", () => {
      render(<AddItemPopup {...defaultProps} addItemProductId={1} />);

      const pingElement = document.querySelector(".animate-ping");
      expect(pingElement).toBeInTheDocument();
      expect(pingElement).toHaveClass("bg-emerald-500", "rounded-full");
    });

    it("sets aria-pressed correctly for selected product", () => {
      render(<AddItemPopup {...defaultProps} addItemProductId={1} />);

      const selectedProduct = screen
        .getByText("Coca Cola")
        .closest('[role="button"]');
      expect(selectedProduct).toHaveAttribute("aria-pressed", "true");
    });
  });

  describe("Quantity Input", () => {
    it("renders quantity input with correct attributes", () => {
      render(<AddItemPopup {...defaultProps} />);

      const quantityInput = screen.getByPlaceholderText("Enter quantity");
      expect(quantityInput).toHaveAttribute("type", "number");
      expect(quantityInput).toHaveAttribute("min", "1");
      expect(quantityInput).toHaveAttribute("required");
    });

    it("displays current quantity value", () => {
      render(<AddItemPopup {...defaultProps} addItemQuantity="5" />);

      const quantityInput = screen.getByPlaceholderText("Enter quantity");
      expect(quantityInput).toHaveValue(5);
    });

    it("calls setAddItemQuantity when quantity changes", () => {
      render(<AddItemPopup {...defaultProps} />);

      const quantityInput = screen.getByPlaceholderText("Enter quantity");
      fireEvent.change(quantityInput, { target: { value: "3" } });

      expect(defaultProps.setAddItemQuantity).toHaveBeenCalledWith("3");
    });

    it("displays quantity section with correct labels", () => {
      render(<AddItemPopup {...defaultProps} />);

      expect(screen.getByText("Quantity")).toBeInTheDocument();
      expect(
        screen.getByText("Enter the desired quantity")
      ).toBeInTheDocument();
    });
  });

  describe("Form Submission", () => {
    it("disables submit button when no product is selected", () => {
      render(<AddItemPopup {...defaultProps} addItemProductId={null} />);

      const addButton = screen.getByRole("button", { name: /add to combo/i });
      expect(addButton).toBeDisabled();
    });

    it("enables submit button when product is selected", () => {
      render(<AddItemPopup {...defaultProps} addItemProductId={1} />);

      const addButton = screen.getByRole("button", { name: /add to combo/i });
      expect(addButton).not.toBeDisabled();
    });
  });

  describe("Loading State", () => {
    it("displays loading spinner in submit button when loading", () => {
      render(<AddItemPopup {...defaultProps} loading={true} />);

      expect(screen.getByText("Adding...")).toBeInTheDocument();
      expect(document.querySelector(".animate-spin")).toBeInTheDocument();
    });

    it("disables all buttons when loading", () => {
      render(<AddItemPopup {...defaultProps} loading={true} />);

      const cancelButton = screen.getByText("Cancel");
      const addButton = screen.getByRole("button", { name: /adding/i });

      expect(cancelButton).toBeDisabled();
      expect(addButton).toBeDisabled();
    });

    it("shows loading overlay when loading", () => {
      render(<AddItemPopup {...defaultProps} loading={true} />);

      expect(screen.getByText("Adding Item...")).toBeInTheDocument();
      expect(
        screen.getByText("Please wait while we process your request")
      ).toBeInTheDocument();
    });

    it("shows loading spinner in overlay", () => {
      render(<AddItemPopup {...defaultProps} loading={true} />);

      const loadingSpinners = document.querySelectorAll(".animate-spin");
      expect(loadingSpinners.length).toBeGreaterThan(0);
    });
  });

  describe("Cancel Functionality", () => {
    it("calls setShowAddItemPopup when cancel button is clicked", () => {
      render(<AddItemPopup {...defaultProps} />);

      const cancelButton = screen.getByText("Cancel");
      fireEvent.click(cancelButton);

      expect(defaultProps.setShowAddItemPopup).toHaveBeenCalledWith(false);
    });

    it("does not call setShowAddItemPopup when cancel button is disabled", () => {
      render(<AddItemPopup {...defaultProps} loading={true} />);

      const cancelButton = screen.getByText("Cancel");
      fireEvent.click(cancelButton);

      expect(defaultProps.setShowAddItemPopup).not.toHaveBeenCalled();
    });
  });

  describe("Accessibility", () => {
    it("has proper radio button group", () => {
      render(<AddItemPopup {...defaultProps} />);

      const radioButtons = screen.getAllByRole("radio");
      expect(radioButtons).toHaveLength(3); // Excluding combo products
    });

    it("has proper labels for form elements", () => {
      render(<AddItemPopup {...defaultProps} />);

      expect(screen.getByText("Select Product")).toBeInTheDocument();
      expect(screen.getByText("Quantity")).toBeInTheDocument();
    });

    it("has required field indicators", () => {
      render(<AddItemPopup {...defaultProps} />);

      const requiredIndicators = screen.getAllByText("*");
      expect(requiredIndicators).toHaveLength(2);
    });

    it("has proper aria-label for close button", () => {
      render(<AddItemPopup {...defaultProps} />);

      const closeButton = screen.getByLabelText("Close");
      expect(closeButton).toBeInTheDocument();
    });

    it("has tabIndex for product selection buttons", () => {
      render(<AddItemPopup {...defaultProps} />);

      const productButtons = screen.getAllByRole("button");
      const productSelectionButtons = productButtons.filter(
        (button) => button.getAttribute("tabIndex") === "0"
      );
      expect(productSelectionButtons.length).toBeGreaterThan(0);
    });
  });

  describe("Product Filtering", () => {
    it("filters out combo products from the selection", () => {
      render(<AddItemPopup {...defaultProps} />);

      expect(screen.queryByText("Movie Combo")).not.toBeInTheDocument();
    });

    it("displays only non-combo products", () => {
      const productsWithMultipleCombos = [
        ...mockProducts,
        {
          ProductId: 5,
          ProductName: "Another Combo",
          Unit: "Combo",
          ImageUrl: null,
        },
      ];

      render(
        <AddItemPopup {...defaultProps} products={productsWithMultipleCombos} />
      );

      expect(screen.getByText("Coca Cola")).toBeInTheDocument();
      expect(screen.getByText("Popcorn Large")).toBeInTheDocument();
      expect(screen.getByText("Nachos")).toBeInTheDocument();
      expect(screen.queryByText("Movie Combo")).not.toBeInTheDocument();
      expect(screen.queryByText("Another Combo")).not.toBeInTheDocument();
    });
  });

  describe("Edge Cases", () => {
    it("handles empty products array", () => {
      render(<AddItemPopup {...defaultProps} products={[]} />);

      expect(screen.getByText("Select Product")).toBeInTheDocument();
      expect(screen.queryByRole("radio")).not.toBeInTheDocument();
    });

    it("handles products with missing properties", () => {
      const incompleteProducts = [
        { ProductId: 1, ProductName: "Test Product" },
      ];

      render(<AddItemPopup {...defaultProps} products={incompleteProducts} />);

      expect(screen.getByText("Test Product")).toBeInTheDocument();
    });

    it("handles very long product names", () => {
      const longNameProducts = [
        {
          ProductId: 1,
          ProductName: "A".repeat(100),
          Unit: "Can",
          ImageUrl: "test.jpg",
        },
      ];

      render(<AddItemPopup {...defaultProps} products={longNameProducts} />);

      const productElement = screen.getByText("A".repeat(100));
      expect(productElement).toHaveClass("truncate");
    });

    it("handles negative quantity values", () => {
      render(<AddItemPopup {...defaultProps} />);

      const quantityInput = screen.getByPlaceholderText("Enter quantity");
      fireEvent.change(quantityInput, { target: { value: "-5" } });

      expect(defaultProps.setAddItemQuantity).toHaveBeenCalledWith("-5");
    });
  });

  describe("Styling and Animation", () => {
    it("applies correct hover effects to product cards", () => {
      render(<AddItemPopup {...defaultProps} />);

      const productCard = screen
        .getByText("Coca Cola")
        .closest('[role="button"]');
      expect(productCard).toHaveClass(
        "hover:scale-[1.02]",
        "hover:border-emerald-300",
        "hover:shadow-md"
      );
    });

    it("applies correct transition classes", () => {
      render(<AddItemPopup {...defaultProps} />);

      const productCard = screen
        .getByText("Coca Cola")
        .closest('[role="button"]');
      expect(productCard).toHaveClass("transition-all", "duration-300");
    });

    it("applies correct gradient backgrounds", () => {
      render(<AddItemPopup {...defaultProps} />);

      const submitButton = screen.getByRole("button", {
        name: /add to combo/i,
      });
      expect(submitButton).toHaveClass(
        "bg-gradient-to-r",
        "from-emerald-600",
        "to-teal-600"
      );
    });

    it("shows animation classes on modal", () => {
      render(<AddItemPopup {...defaultProps} />);

      const backdrop = document.querySelector(".animate-fadeIn");
      const modal = document.querySelector(".animate-slideUp");

      expect(backdrop).toBeInTheDocument();
      expect(modal).toBeInTheDocument();
    });
  });
});
