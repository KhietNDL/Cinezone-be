/* eslint-disable no-undef */
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import PromotionFormPopup from "../../../layouts/Admin/promotionComponent/PromotionFormPopup";

// Mock react-icons
jest.mock("react-icons/md", () => ({
  MdOutlineClose: ({ size }) => (
    <div data-testid="close-icon" data-size={size}>
      Close Icon
    </div>
  ),
}));

describe("PromotionFormPopup", () => {
  const mockSetShowFormPopup = jest.fn();
  const mockSetTitle = jest.fn();
  const mockSetStartTime = jest.fn();
  const mockSetEndTime = jest.fn();
  const mockSetDiscountValue = jest.fn();
  const mockSetDetail = jest.fn();
  const mockHandleSubmit = jest.fn();
  const mockHandleImageChange = jest.fn();
  const mockResetForm = jest.fn();

  const defaultProps = {
    showFormPopup: true,
    setShowFormPopup: mockSetShowFormPopup,
    isEdit: false,
    title: "",
    setTitle: mockSetTitle,
    startTime: "",
    setStartTime: mockSetStartTime,
    endTime: "",
    setEndTime: mockSetEndTime,
    discountValue: "",
    setDiscountValue: mockSetDiscountValue,
    detail: "",
    setDetail: mockSetDetail,
    imagePreview: null,
    handleSubmit: mockHandleSubmit,
    handleImageChange: mockHandleImageChange,
    resetForm: mockResetForm,
    loading: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Visibility and Rendering", () => {
    test("renders nothing when showFormPopup is false", () => {
      const { container } = render(
        <PromotionFormPopup {...defaultProps} showFormPopup={false} />
      );

      expect(container).toBeEmptyDOMElement();
    });

    test("has correct overlay styling", () => {
      const { container } = render(<PromotionFormPopup {...defaultProps} />);

      const overlay = container.firstChild;
      expect(overlay).toHaveClass(
        "fixed",
        "inset-0",
        "bg-black/40",
        "backdrop-blur-sm",
        "flex",
        "items-center",
        "justify-center",
        "z-50",
        "p-2",
        "sm:p-4"
      );
    });
  });

  describe("Header Section", () => {
    test("displays correct title for add mode", () => {
      render(<PromotionFormPopup {...defaultProps} isEdit={false} />);

      expect(screen.getByText("Add New Promotion")).toBeInTheDocument();
      expect(
        screen.getByText("Fill in the details below to add a promotion")
      ).toBeInTheDocument();
    });

    test("displays correct title for edit mode", () => {
      render(<PromotionFormPopup {...defaultProps} isEdit={true} />);

      expect(screen.getByText("Edit Promotion")).toBeInTheDocument();
      expect(
        screen.getByText("Update the details below to edit the promotion")
      ).toBeInTheDocument();
    });

    test("header has correct gradient styling", () => {
      const { container } = render(<PromotionFormPopup {...defaultProps} />);

      const header = container.querySelector(
        ".bg-gradient-to-r.from-blue-600.to-blue-700"
      );
      expect(header).toBeInTheDocument();
      expect(header).toHaveClass(
        "px-4",
        "sm:px-6",
        "py-3",
        "sm:py-4",
        "text-white"
      );
    });

    test("renders close button with correct styling", () => {
      render(<PromotionFormPopup {...defaultProps} />);

      const closeButton = screen.getByLabelText("Close");
      expect(closeButton).toBeInTheDocument();
      expect(closeButton).toHaveClass(
        "p-1",
        "sm:p-2",
        "hover:bg-white/10",
        "rounded-full",
        "transition-colors"
      );
    });

    test("close button has correct icon", () => {
      render(<PromotionFormPopup {...defaultProps} />);

      const closeIcon = screen.getByTestId("close-icon");
      expect(closeIcon).toBeInTheDocument();
      expect(closeIcon).toHaveAttribute("data-size", "30");
    });
  });

  describe("Form Fields", () => {
    test("renders all required form fields", () => {
      render(<PromotionFormPopup {...defaultProps} />);

      expect(screen.getByLabelText(/Promotion Name/)).toBeInTheDocument();
      expect(screen.getByLabelText(/Value/)).toBeInTheDocument();
      expect(screen.getByLabelText(/Start Date/)).toBeInTheDocument();
      expect(screen.getByLabelText(/End Date/)).toBeInTheDocument();
      expect(screen.getByLabelText(/Detail/)).toBeInTheDocument();
      expect(screen.getByLabelText(/Image/)).toBeInTheDocument();
    });

    test("required fields have asterisk indicators", () => {
      render(<PromotionFormPopup {...defaultProps} />);

      const requiredLabels = screen.getAllByText("*");
      expect(requiredLabels).toHaveLength(4); // Name, Value, Start Date, End Date

      requiredLabels.forEach((asterisk) => {
        expect(asterisk).toHaveClass("text-red-500");
      });
    });

    test("form fields have correct input types", () => {
      render(<PromotionFormPopup {...defaultProps} />);

      expect(screen.getByLabelText(/Promotion Name/)).toHaveAttribute(
        "type",
        "text"
      );
      expect(screen.getByLabelText(/Value/)).toHaveAttribute("type", "number");
      expect(screen.getByLabelText(/Start Date/)).toHaveAttribute(
        "type",
        "date"
      );
      expect(screen.getByLabelText(/End Date/)).toHaveAttribute("type", "date");
      expect(screen.getByLabelText(/Detail/)).toHaveAttribute("type", "text");
      expect(screen.getByLabelText(/Image/)).toHaveAttribute("type", "file");
    });

    test("required fields have required attribute", () => {
      render(<PromotionFormPopup {...defaultProps} />);

      expect(screen.getByLabelText(/Promotion Name/)).toBeRequired();
      expect(screen.getByLabelText(/Value/)).toBeRequired();
      expect(screen.getByLabelText(/Start Date/)).toBeRequired();
      expect(screen.getByLabelText(/End Date/)).toBeRequired();
      expect(screen.getByLabelText(/Detail/)).not.toBeRequired();
    });

    test("image input accepts only image files", () => {
      render(<PromotionFormPopup {...defaultProps} />);

      const imageInput = screen.getByLabelText(/Image/);
      expect(imageInput).toHaveAttribute("accept", "image/*");
    });

    test("image input is hidden", () => {
      render(<PromotionFormPopup {...defaultProps} />);

      const imageInput = screen.getByLabelText(/Image/);
      expect(imageInput).toHaveClass("hidden");
    });
  });

  describe("Form Field Values and Interactions", () => {
    test("displays correct values in form fields", () => {
      const propsWithValues = {
        ...defaultProps,
        title: "Test Promotion",
        discountValue: "25",
        startTime: "2024-01-01",
        endTime: "2024-12-31",
        detail: "Test detail",
      };

      render(<PromotionFormPopup {...propsWithValues} />);

      expect(screen.getByDisplayValue("Test Promotion")).toBeInTheDocument();
      expect(screen.getByDisplayValue("25")).toBeInTheDocument();
      expect(screen.getByDisplayValue("2024-01-01")).toBeInTheDocument();
      expect(screen.getByDisplayValue("2024-12-31")).toBeInTheDocument();
      expect(screen.getByDisplayValue("Test detail")).toBeInTheDocument();
    });

    test("calls setTitle when title input changes", () => {
      render(<PromotionFormPopup {...defaultProps} />);

      const titleInput = screen.getByLabelText(/Promotion Name/);
      fireEvent.change(titleInput, { target: { value: "New Title" } });

      expect(mockSetTitle).toHaveBeenCalledWith("New Title");
    });

    test("calls setDiscountValue when discount value input changes", () => {
      render(<PromotionFormPopup {...defaultProps} />);

      const discountInput = screen.getByLabelText(/Value/);
      fireEvent.change(discountInput, { target: { value: "30" } });

      expect(mockSetDiscountValue).toHaveBeenCalledWith("30");
    });

    test("calls setStartTime when start date input changes", () => {
      render(<PromotionFormPopup {...defaultProps} />);

      const startTimeInput = screen.getByLabelText(/Start Date/);
      fireEvent.change(startTimeInput, { target: { value: "2024-06-01" } });

      expect(mockSetStartTime).toHaveBeenCalledWith("2024-06-01");
    });

    test("calls setEndTime when end date input changes", () => {
      render(<PromotionFormPopup {...defaultProps} />);

      const endTimeInput = screen.getByLabelText(/End Date/);
      fireEvent.change(endTimeInput, { target: { value: "2024-12-01" } });

      expect(mockSetEndTime).toHaveBeenCalledWith("2024-12-01");
    });

    test("calls setDetail when detail input changes", () => {
      render(<PromotionFormPopup {...defaultProps} />);

      const detailInput = screen.getByLabelText(/Detail/);
      fireEvent.change(detailInput, { target: { value: "New detail" } });

      expect(mockSetDetail).toHaveBeenCalledWith("New detail");
    });

    test("calls handleImageChange when image input changes", () => {
      render(<PromotionFormPopup {...defaultProps} />);

      const imageInput = screen.getByLabelText(/Image/);
      const file = new File(["test"], "test.jpg", { type: "image/jpeg" });

      fireEvent.change(imageInput, { target: { files: [file] } });

      expect(mockHandleImageChange).toHaveBeenCalled();
    });
  });

  describe("Image Preview", () => {
    test("does not show image preview when imagePreview is null", () => {
      render(<PromotionFormPopup {...defaultProps} imagePreview={null} />);

      expect(screen.queryByAltText("Preview")).not.toBeInTheDocument();
    });

    test("shows image preview when imagePreview is provided", () => {
      const imageUrl = "https://example.com/test-image.jpg";
      render(<PromotionFormPopup {...defaultProps} imagePreview={imageUrl} />);

      const previewImage = screen.getByAltText("Preview");
      expect(previewImage).toBeInTheDocument();
      expect(previewImage).toHaveAttribute("src", imageUrl);
      expect(previewImage).toHaveClass(
        "w-20",
        "h-20",
        "sm:w-24",
        "sm:h-24",
        "object-cover",
        "rounded",
        "border",
        "border-gray-200"
      );
    });
  });

  describe("Action Buttons", () => {
    test("renders cancel and submit buttons", () => {
      render(<PromotionFormPopup {...defaultProps} />);

      expect(screen.getByText("Cancel")).toBeInTheDocument();
      expect(screen.getByText("Add Promotion")).toBeInTheDocument();
    });

    test("submit button shows correct text based on isEdit prop", () => {
      // Test add mode
      render(<PromotionFormPopup {...defaultProps} isEdit={false} />);
      expect(screen.getByText("Add Promotion")).toBeInTheDocument();

      // Test edit mode
      render(<PromotionFormPopup {...defaultProps} isEdit={true} />);
      expect(screen.getByText("Save Promotion")).toBeInTheDocument();
    });

    test("cancel button has correct styling", () => {
      render(<PromotionFormPopup {...defaultProps} />);

      const cancelButton = screen.getByText("Cancel");
      expect(cancelButton).toHaveClass(
        "px-4",
        "sm:px-6",
        "py-2",
        "sm:py-3",
        "text-gray-700",
        "bg-white",
        "border",
        "border-gray-300",
        "hover:bg-gray-50",
        "rounded-lg",
        "text-sm",
        "sm:text-base"
      );
    });

    test("submit button has correct styling", () => {
      render(<PromotionFormPopup {...defaultProps} />);

      const submitButton = screen.getByText("Add Promotion");
      expect(submitButton).toHaveClass(
        "px-4",
        "sm:px-6",
        "py-2",
        "sm:py-3",
        "bg-gradient-to-r",
        "from-blue-600",
        "to-blue-700",
        "hover:from-blue-700",
        "hover:to-blue-800",
        "text-white",
        "rounded-lg",
        "text-sm",
        "sm:text-base"
      );
    });

    test("buttons are disabled when loading", () => {
      render(<PromotionFormPopup {...defaultProps} loading={true} />);

      const cancelButton = screen.getByText("Cancel");
      const submitButton = screen.getByText("Add Promotion");

      expect(cancelButton).toBeDisabled();
      expect(submitButton).toBeDisabled();
    });

    test("buttons are enabled when not loading", () => {
      render(<PromotionFormPopup {...defaultProps} loading={false} />);

      const cancelButton = screen.getByText("Cancel");
      const submitButton = screen.getByText("Add Promotion");

      expect(cancelButton).not.toBeDisabled();
      expect(submitButton).not.toBeDisabled();
    });
  });

  describe("Button Interactions", () => {
    test("cancel button closes popup and resets form", () => {
      render(<PromotionFormPopup {...defaultProps} />);

      const cancelButton = screen.getByText("Cancel");
      fireEvent.click(cancelButton);

      expect(mockSetShowFormPopup).toHaveBeenCalledWith(false);
      expect(mockResetForm).toHaveBeenCalled();
    });

    test("close button (X) closes popup and resets form", () => {
      render(<PromotionFormPopup {...defaultProps} />);

      const closeButton = screen.getByLabelText("Close");
      fireEvent.click(closeButton);

      expect(mockSetShowFormPopup).toHaveBeenCalledWith(false);
      expect(mockResetForm).toHaveBeenCalled();
    });
  });

  describe("Loading State", () => {
    test("does not show loading overlay when loading is false", () => {
      render(<PromotionFormPopup {...defaultProps} loading={false} />);

      expect(
        screen.queryByText(/Đang thêm khuyến mãi.../)
      ).not.toBeInTheDocument();
    });

    test("shows loading overlay when loading is true", () => {
      render(<PromotionFormPopup {...defaultProps} loading={true} />);

      expect(screen.getByText("Đang thêm khuyến mãi...")).toBeInTheDocument();
    });

    test("loading overlay shows correct text for edit mode", () => {
      render(
        <PromotionFormPopup {...defaultProps} loading={true} isEdit={true} />
      );

      expect(
        screen.getByText("Đang cập nhật khuyến mãi...")
      ).toBeInTheDocument();
    });

    test("loading overlay shows correct text for add mode", () => {
      render(
        <PromotionFormPopup {...defaultProps} loading={true} isEdit={false} />
      );

      expect(screen.getByText("Đang thêm khuyến mãi...")).toBeInTheDocument();
    });

    test("loading overlay has correct styling", () => {
      const { container } = render(
        <PromotionFormPopup {...defaultProps} loading={true} />
      );

      const loadingOverlay = container.querySelector(
        ".fixed.inset-0.bg-black\\/40"
      );
      expect(loadingOverlay).toHaveClass(
        "fixed",
        "inset-0",
        "bg-black/40",
        "flex",
        "items-center",
        "justify-center",
        "z-50"
      );
    });

    test("loading spinner has correct styling", () => {
      const { container } = render(
        <PromotionFormPopup {...defaultProps} loading={true} />
      );

      const spinner = container.querySelector(".animate-spin");
      expect(spinner).toBeInTheDocument();
      expect(spinner).toHaveClass(
        "h-6",
        "sm:h-8",
        "w-6",
        "sm:w-8",
        "text-blue-600",
        "mb-3",
        "sm:mb-4"
      );
    });
  });

  describe("Form Layout and Styling", () => {
    test("form has correct grid layout", () => {
      const { container } = render(<PromotionFormPopup {...defaultProps} />);

      const formGrid = container.querySelector(
        ".grid.grid-cols-1.md\\:grid-cols-2"
      );
      expect(formGrid).toBeInTheDocument();
      expect(formGrid).toHaveClass(
        "bg-gray-50",
        "p-3",
        "sm:p-4",
        "rounded-lg",
        "gap-3",
        "sm:gap-4"
      );
    });

    test("detail field spans full width on larger screens", () => {
      const { container } = render(<PromotionFormPopup {...defaultProps} />);

      const detailContainer = container.querySelector(".md\\:col-span-2");
      expect(detailContainer).toBeInTheDocument();
    });

    test("form inputs have consistent styling", () => {
      render(<PromotionFormPopup {...defaultProps} />);

      const inputs = screen.getAllByRole("textbox");
      const numberInput = screen.getByRole("spinbutton");
      const dateInputs = screen.getAllByDisplayValue("");

      [...inputs, numberInput, ...dateInputs].forEach((input) => {
        if (input.type !== "file") {
          expect(input).toHaveClass(
            "w-full",
            "px-3",
            "sm:px-4",
            "py-2",
            "sm:py-3",
            "border",
            "border-gray-300",
            "rounded-lg",
            "focus:outline-none",
            "focus:ring-2",
            "focus:ring-blue-500",
            "text-sm",
            "sm:text-base"
          );
        }
      });
    });
  });

  describe("Choose Image Button", () => {
    test("choose image button has correct styling", () => {
      render(<PromotionFormPopup {...defaultProps} />);

      const chooseImageButton = screen.getByText("Choose Image");
      expect(chooseImageButton).toHaveClass(
        "px-3",
        "sm:px-4",
        "py-1",
        "sm:py-2",
        "bg-blue-50",
        "border",
        "border-blue-200",
        "rounded-lg",
        "text-blue-700",
        "hover:bg-blue-100",
        "text-sm",
        "sm:text-base"
      );
    });

    test("choose image button is clickable", () => {
      render(<PromotionFormPopup {...defaultProps} />);

      const chooseImageLabel = screen
        .getByText("Choose Image")
        .closest("label");
      expect(chooseImageLabel).toHaveClass("cursor-pointer");
    });
  });

  describe("Responsive Design", () => {
    test("form content has responsive padding", () => {
      const { container } = render(<PromotionFormPopup {...defaultProps} />);

      const contentDiv = container.querySelector(".p-4.sm\\:p-6");
      expect(contentDiv).toBeInTheDocument();
    });

    test("buttons have responsive padding", () => {
      render(<PromotionFormPopup {...defaultProps} />);

      const cancelButton = screen.getByText("Cancel");
      const submitButton = screen.getByText("Add Promotion");

      expect(cancelButton).toHaveClass("px-4", "sm:px-6", "py-2", "sm:py-3");
      expect(submitButton).toHaveClass("px-4", "sm:px-6", "py-2", "sm:py-3");
    });
  });

  describe("Accessibility", () => {
    test("close button has proper aria-label", () => {
      render(<PromotionFormPopup {...defaultProps} />);

      const closeButton = screen.getByLabelText("Close");
      expect(closeButton).toHaveAttribute("aria-label", "Close");
    });

    test("all form inputs have proper labels", () => {
      render(<PromotionFormPopup {...defaultProps} />);

      const titleInput = screen.getByLabelText(/Promotion Name/);
      const valueInput = screen.getByLabelText(/Value/);
      const startDateInput = screen.getByLabelText(/Start Date/);
      const endDateInput = screen.getByLabelText(/End Date/);
      const detailInput = screen.getByLabelText(/Detail/);
      const imageInput = screen.getByLabelText(/Image/);

      expect(titleInput).toBeInTheDocument();
      expect(valueInput).toBeInTheDocument();
      expect(startDateInput).toBeInTheDocument();
      expect(endDateInput).toBeInTheDocument();
      expect(detailInput).toBeInTheDocument();
      expect(imageInput).toBeInTheDocument();
    });

    test("form inputs have proper IDs matching labels", () => {
      render(<PromotionFormPopup {...defaultProps} />);

      expect(screen.getByLabelText(/Promotion Name/)).toHaveAttribute(
        "id",
        "title"
      );
      expect(screen.getByLabelText(/Value/)).toHaveAttribute(
        "id",
        "discountValue"
      );
      expect(screen.getByLabelText(/Start Date/)).toHaveAttribute(
        "id",
        "startTime"
      );
      expect(screen.getByLabelText(/End Date/)).toHaveAttribute(
        "id",
        "endTime"
      );
      expect(screen.getByLabelText(/Detail/)).toHaveAttribute("id", "detail");
      expect(screen.getByLabelText(/Image/)).toHaveAttribute("id", "image");
    });
  });

  describe("Error Handling and Edge Cases", () => {
    test("handles missing props gracefully", () => {
      const minimalProps = {
        showFormPopup: true,
        setShowFormPopup: jest.fn(),
        handleSubmit: jest.fn(),
        resetForm: jest.fn(),
      };

      expect(() => {
        render(<PromotionFormPopup {...minimalProps} />);
      }).not.toThrow();
    });

    test("handles empty string values", () => {
      const propsWithEmptyStrings = {
        ...defaultProps,
        title: "",
        discountValue: "",
        startTime: "",
        endTime: "",
        detail: "",
      };

      expect(() => {
        render(<PromotionFormPopup {...propsWithEmptyStrings} />);
      }).not.toThrow();
    });
  });
});
