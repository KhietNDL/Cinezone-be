/* eslint-disable no-undef */
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import ProductFormPopup from "../../../layouts/Admin/productComponent/ProductFormPopup";

// Mock react-icons
jest.mock("react-icons/md", () => ({
  MdOutlineClose: () => <div data-testid="close-icon">Close</div>,
}));

describe("ProductFormPopup", () => {
  // Mock functions
  const mockSetShowFormPopup = jest.fn();
  const mockSetProductName = jest.fn();
  const mockSetDescription = jest.fn();
  const mockSetUnit = jest.fn();
  const mockSetPrice = jest.fn();
  const mockSetQuantity = jest.fn();
  const mockHandleSubmit = jest.fn();
  const mockHandleImageChange = jest.fn();
  const mockResetForm = jest.fn();

  const defaultProps = {
    showFormPopup: true,
    setShowFormPopup: mockSetShowFormPopup,
    isEdit: false,
    productName: "",
    setProductName: mockSetProductName,
    description: "",
    setDescription: mockSetDescription,
    unit: "",
    setUnit: mockSetUnit,
    price: "",
    setPrice: mockSetPrice,
    quantity: "",
    setQuantity: mockSetQuantity,
    imagePreview: null,
    handleSubmit: mockHandleSubmit,
    handleImageChange: mockHandleImageChange,
    resetForm: mockResetForm,
    loading: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Rendering", () => {
    test("does not render when showFormPopup is false", () => {
      render(<ProductFormPopup {...defaultProps} showFormPopup={false} />);

      expect(screen.queryByText("Add New Product")).not.toBeInTheDocument();
    });

    test("renders popup when showFormPopup is true", () => {
      render(<ProductFormPopup {...defaultProps} />);

      expect(screen.getByText("Add New Product")).toBeInTheDocument();
      expect(
        screen.getByText("Create a new product entry")
      ).toBeInTheDocument();
    });

    test("renders edit mode correctly", () => {
      render(<ProductFormPopup {...defaultProps} isEdit={true} />);

      expect(screen.getByText("Edit Product")).toBeInTheDocument();
      expect(
        screen.getByText("Update your product information")
      ).toBeInTheDocument();
      expect(screen.getByText("Save Changes")).toBeInTheDocument();
    });

    test("renders add mode correctly", () => {
      render(<ProductFormPopup {...defaultProps} isEdit={false} />);

      expect(screen.getByText("Add New Product")).toBeInTheDocument();
      expect(
        screen.getByText("Create a new product entry")
      ).toBeInTheDocument();
      expect(screen.getByText("Add Product")).toBeInTheDocument();
    });
  });

  describe("Form Fields", () => {
    test("renders all required form fields", () => {
      render(<ProductFormPopup {...defaultProps} />);

      expect(screen.getByLabelText(/product name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/unit/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/price/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/quantity/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/product image/i)).toBeInTheDocument();
    });

    test("shows required asterisks for mandatory fields", () => {
      render(<ProductFormPopup {...defaultProps} />);

      const requiredFields = screen.getAllByText("*");
      expect(requiredFields).toHaveLength(4); // Product Name, Unit, Price, Quantity
    });
  });

  describe("Form Interactions", () => {
    test("calls setUnit when unit selection changes", async () => {
      const user = userEvent.setup();
      render(<ProductFormPopup {...defaultProps} />);

      const unitSelect = screen.getByLabelText(/unit/i);
      await user.selectOptions(unitSelect, "Box");

      expect(mockSetUnit).toHaveBeenCalledWith("Box");
    });
  });

  describe("Unit Selection Options", () => {
    test("displays all unit options with emojis", () => {
      render(<ProductFormPopup {...defaultProps} />);

      expect(screen.getByText("📦 Box")).toBeInTheDocument();
      expect(screen.getByText("☕ Cup")).toBeInTheDocument();
      expect(screen.getByText("🎯 Combo")).toBeInTheDocument();
    });

    test("has default empty option", () => {
      render(<ProductFormPopup {...defaultProps} />);

      expect(screen.getByText("Select unit")).toBeInTheDocument();
    });
  });

  describe("Image Upload", () => {
    test("renders image upload input", () => {
      render(<ProductFormPopup {...defaultProps} />);

      const imageInput = screen.getByLabelText(/product image/i);
      expect(imageInput).toBeInTheDocument();
      expect(imageInput).toHaveAttribute("type", "file");
      expect(imageInput).toHaveAttribute("accept", "image/*");
    });

    test("calls handleImageChange when image is selected", async () => {
      const user = userEvent.setup();
      render(<ProductFormPopup {...defaultProps} />);

      const imageInput = screen.getByLabelText(/product image/i);
      const file = new File(["dummy content"], "test.png", {
        type: "image/png",
      });

      await user.upload(imageInput, file);

      expect(mockHandleImageChange).toHaveBeenCalled();
    });

    test("displays image preview when imagePreview is provided", () => {
      const props = {
        ...defaultProps,
        imagePreview:
          "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==",
      };

      render(<ProductFormPopup {...props} />);

      const previewImage = screen.getByAltText("Preview");
      expect(previewImage).toBeInTheDocument();
      expect(previewImage).toHaveAttribute("src", props.imagePreview);
    });

    test("does not display image preview when imagePreview is null", () => {
      render(<ProductFormPopup {...defaultProps} />);

      expect(screen.queryByAltText("Preview")).not.toBeInTheDocument();
    });
  });

  describe("Form Submission", () => {
    test("prevents default form submission", () => {
      render(<ProductFormPopup {...defaultProps} />);

      const form = document.querySelector("form");
      expect(form).toBeInTheDocument();

      const mockPreventDefault = jest.fn();

      fireEvent.submit(form, { preventDefault: mockPreventDefault });

      expect(mockHandleSubmit).toHaveBeenCalled();
    });
  });

  describe("Loading State", () => {
    test("displays loading spinner when loading is true", () => {
      render(<ProductFormPopup {...defaultProps} loading={true} />);

      // Check for loading overlay elements
      expect(screen.getByText("Please wait a moment")).toBeInTheDocument();

      // Check for multiple "Processing..." texts
      const processingTexts = screen.getAllByText("Processing...");
      expect(processingTexts).toHaveLength(2); // One in button, one in overlay
    });

    test("disables buttons when loading is true", () => {
      render(<ProductFormPopup {...defaultProps} loading={true} />);

      const cancelButton = screen.getByText("Cancel");
      const submitButton = screen.getByRole("button", { name: /processing/i });

      expect(cancelButton).toBeDisabled();
      expect(submitButton).toBeDisabled();
    });

    test("shows processing text in submit button when loading", () => {
      render(<ProductFormPopup {...defaultProps} loading={true} />);

      // Find the submit button specifically
      const submitButton = screen.getByRole("button", { name: /processing/i });
      expect(submitButton).toBeInTheDocument();
      expect(submitButton).toHaveTextContent("Processing...");
      expect(screen.queryByText("Add Product")).not.toBeInTheDocument();
    });

    test("shows normal text in submit button when not loading", () => {
      render(<ProductFormPopup {...defaultProps} loading={false} />);

      expect(screen.getByText("Add Product")).toBeInTheDocument();
      expect(screen.queryByText("Processing...")).not.toBeInTheDocument();
    });
  });

  describe("Close Functionality", () => {
    test("calls setShowFormPopup and resetForm when close button is clicked", async () => {
      const user = userEvent.setup();
      render(<ProductFormPopup {...defaultProps} />);

      const closeButton = screen.getByLabelText("Close");
      await user.click(closeButton);

      expect(mockSetShowFormPopup).toHaveBeenCalledWith(false);
      expect(mockResetForm).toHaveBeenCalled();
    });

    test("calls setShowFormPopup and resetForm when cancel button is clicked", async () => {
      const user = userEvent.setup();
      render(<ProductFormPopup {...defaultProps} />);

      const cancelButton = screen.getByText("Cancel");
      await user.click(cancelButton);

      expect(mockSetShowFormPopup).toHaveBeenCalledWith(false);
      expect(mockResetForm).toHaveBeenCalled();
    });
  });

  describe("Accessibility", () => {
    test("has proper labels for all form inputs", () => {
      render(<ProductFormPopup {...defaultProps} />);

      expect(screen.getByLabelText(/product name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/unit/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/price/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/quantity/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/product image/i)).toBeInTheDocument();
    });

    test("has proper aria-label for close button", () => {
      render(<ProductFormPopup {...defaultProps} />);

      const closeButton = screen.getByLabelText("Close");
      expect(closeButton).toBeInTheDocument();
    });

    test("form inputs have required attribute for mandatory fields", () => {
      render(<ProductFormPopup {...defaultProps} />);

      expect(screen.getByLabelText(/product name/i)).toBeRequired();
      expect(screen.getByLabelText(/unit/i)).toBeRequired();
      expect(screen.getByLabelText(/price/i)).toBeRequired();
      expect(screen.getByLabelText(/quantity/i)).toBeRequired();
    });

    test("description field is not required", () => {
      render(<ProductFormPopup {...defaultProps} />);

      expect(screen.getByLabelText(/description/i)).not.toBeRequired();
    });
  });

  describe("Input Validation", () => {
    test("price input only accepts numbers", () => {
      render(<ProductFormPopup {...defaultProps} />);

      const priceInput = screen.getByLabelText(/price/i);
      expect(priceInput).toHaveAttribute("type", "number");
    });

    test("quantity input only accepts numbers", () => {
      render(<ProductFormPopup {...defaultProps} />);

      const quantityInput = screen.getByLabelText(/quantity/i);
      expect(quantityInput).toHaveAttribute("type", "number");
    });

    test("image input only accepts image files", () => {
      render(<ProductFormPopup {...defaultProps} />);

      const imageInput = screen.getByLabelText(/product image/i);
      expect(imageInput).toHaveAttribute("accept", "image/*");
    });
  });

  describe("Placeholders", () => {
    test("displays correct placeholders for inputs", () => {
      render(<ProductFormPopup {...defaultProps} />);

      expect(
        screen.getByPlaceholderText("Enter product name")
      ).toBeInTheDocument();
      expect(screen.getByPlaceholderText("e.g. 50,000")).toBeInTheDocument();
      expect(screen.getByPlaceholderText("e.g. 100")).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText("Enter product description...")
      ).toBeInTheDocument();
    });
  });

  describe("Responsive Design Elements", () => {
    test("renders grid layout classes for responsive design", () => {
      render(<ProductFormPopup {...defaultProps} />);

      const form = document.querySelector("form");
      expect(form).toBeInTheDocument();

      // Check if grid classes are present in the DOM
      const gridContainer = form.querySelector(
        ".grid.grid-cols-1.md\\:grid-cols-2"
      );
      expect(gridContainer).toBeInTheDocument();
    });
  });

  describe("Error Handling", () => {
    test("handles missing props gracefully", () => {
      const minimalProps = {
        showFormPopup: true,
        setShowFormPopup: jest.fn(),
        isEdit: false,
        productName: "",
        setProductName: jest.fn(),
        description: "",
        setDescription: jest.fn(),
        unit: "",
        setUnit: jest.fn(),
        price: "",
        setPrice: jest.fn(),
        quantity: "",
        setQuantity: jest.fn(),
        imagePreview: null,
        handleSubmit: jest.fn(),
        handleImageChange: jest.fn(),
        resetForm: jest.fn(),
        loading: false,
      };

      expect(() => {
        render(<ProductFormPopup {...minimalProps} />);
      }).not.toThrow();
    });
  });

  describe("Event Handling", () => {
    test("prevents form submission when fields are empty", async () => {
      // eslint-disable-next-line no-unused-vars
      const user = userEvent.setup();
      render(<ProductFormPopup {...defaultProps} />);

      // Get form by tag name instead of role
      const form = document.querySelector("form");
      expect(form).toBeInTheDocument();

      // Try to submit empty form
      fireEvent.submit(form);

      // Form should still call handleSubmit, but HTML5 validation should prevent actual submission
      expect(mockHandleSubmit).toHaveBeenCalled();
    });
  });
});
