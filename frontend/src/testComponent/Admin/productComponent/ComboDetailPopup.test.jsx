/* eslint-disable no-undef */
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import ComboDetailPopup from "../../../layouts/Admin/productComponent/ComboDetailPopup";

// Mock data for testing
const mockComboDetail = {
  combo: {
    ProductName: "Combo Delicious",
    ImageUrl: "https://example.com/combo-image.jpg",
    Description: "Một combo ngon và tiết kiệm cho gia đình bạn",
    Price: 250000,
    Quantity: 2,
  },
  children: [
    {
      ComboProductId: 1,
      ProductName: "Sản phẩm A",
      ImageUrl: "https://example.com/product-a.jpg",
      Description: "Mô tả sản phẩm A rất ngon và bổ dưỡng",
      Unit: "kg",
      Quantity: 1,
    },
    {
      ComboProductId: 2,
      ProductName: "Sản phẩm B",
      ImageUrl: "https://example.com/product-b.jpg",
      Description: "Mô tả sản phẩm B chất lượng cao",
      Unit: "hộp",
      Quantity: 3,
    },
  ],
};

describe("ComboDetailPopup", () => {
  const mockSetShowComboDetail = jest.fn();

  beforeEach(() => {
    mockSetShowComboDetail.mockClear();
  });

  describe("Visibility Control", () => {
    test("should not render when showComboDetail is false", () => {
      render(
        <ComboDetailPopup
          showComboDetail={false}
          setShowComboDetail={mockSetShowComboDetail}
          comboDetail={mockComboDetail}
        />
      );

      expect(screen.queryByText("Combo Delicious")).not.toBeInTheDocument();
    });

    test("should not render when comboDetail is null", () => {
      render(
        <ComboDetailPopup
          showComboDetail={true}
          setShowComboDetail={mockSetShowComboDetail}
          comboDetail={null}
        />
      );

      expect(screen.queryByText("Combo Package")).not.toBeInTheDocument();
    });

    test("should render when showComboDetail is true and comboDetail exists", () => {
      render(
        <ComboDetailPopup
          showComboDetail={true}
          setShowComboDetail={mockSetShowComboDetail}
          comboDetail={mockComboDetail}
        />
      );

      expect(screen.getByText("Combo Delicious")).toBeInTheDocument();
      expect(screen.getByText("Combo Package")).toBeInTheDocument();
    });
  });

  describe("Header Section", () => {
    beforeEach(() => {
      render(
        <ComboDetailPopup
          showComboDetail={true}
          setShowComboDetail={mockSetShowComboDetail}
          comboDetail={mockComboDetail}
        />
      );
    });

    test("should display combo name in header", () => {
      expect(screen.getByText("Combo Delicious")).toBeInTheDocument();
    });

    test('should display "Combo Package" label', () => {
      expect(screen.getByText("Combo Package")).toBeInTheDocument();
    });
  });

  describe("Main Content Section", () => {
    beforeEach(() => {
      render(
        <ComboDetailPopup
          showComboDetail={true}
          setShowComboDetail={mockSetShowComboDetail}
          comboDetail={mockComboDetail}
        />
      );
    });

    test("should display combo image", () => {
      const comboImage = screen.getByAltText("Combo Delicious");
      expect(comboImage).toBeInTheDocument();
      expect(comboImage).toHaveAttribute(
        "src",
        "https://example.com/combo-image.jpg"
      );
    });

    test("should display combo description", () => {
      expect(
        screen.getByText("Một combo ngon và tiết kiệm cho gia đình bạn")
      ).toBeInTheDocument();
    });

    test("should display formatted combo price", () => {
      expect(screen.getByText("250.000 ₫")).toBeInTheDocument();
    });

    test('should display "Giá combo" label', () => {
      expect(screen.getByText("Giá combo")).toBeInTheDocument();
    });

    test('should display "Số lượng" label', () => {
      expect(screen.getByText("Số lượng")).toBeInTheDocument();
    });
  });

  describe("Combo Items Section", () => {
    beforeEach(() => {
      render(
        <ComboDetailPopup
          showComboDetail={true}
          setShowComboDetail={mockSetShowComboDetail}
          comboDetail={mockComboDetail}
        />
      );
    });

    test("should display combo items section title", () => {
      expect(screen.getByText("Sản phẩm trong combo")).toBeInTheDocument();
    });

    test("should display correct number of products badge", () => {
      expect(screen.getByText("2 sản phẩm")).toBeInTheDocument();
    });

    test("should display all combo items", () => {
      expect(screen.getByText("Sản phẩm A")).toBeInTheDocument();
      expect(screen.getByText("Sản phẩm B")).toBeInTheDocument();
    });

    test("should display item descriptions", () => {
      expect(
        screen.getByText("Mô tả sản phẩm A rất ngon và bổ dưỡng")
      ).toBeInTheDocument();
      expect(
        screen.getByText("Mô tả sản phẩm B chất lượng cao")
      ).toBeInTheDocument();
    });

    test("should display item units and quantities", () => {
      expect(screen.getByText("Đơn vị: kg")).toBeInTheDocument();
      expect(screen.getByText("Đơn vị: hộp")).toBeInTheDocument();
      expect(screen.getByText("SL: 1")).toBeInTheDocument();
      expect(screen.getByText("SL: 3")).toBeInTheDocument();
    });

    test("should display item images with correct src", () => {
      const productAImage = screen.getByAltText("Sản phẩm A");
      const productBImage = screen.getByAltText("Sản phẩm B");

      expect(productAImage).toHaveAttribute(
        "src",
        "https://example.com/product-a.jpg"
      );
      expect(productBImage).toHaveAttribute(
        "src",
        "https://example.com/product-b.jpg"
      );
    });
  });

  describe("Close Functionality", () => {
    beforeEach(() => {
      render(
        <ComboDetailPopup
          showComboDetail={true}
          setShowComboDetail={mockSetShowComboDetail}
          comboDetail={mockComboDetail}
        />
      );
    });

    test("should call setShowComboDetail(false) when footer close button is clicked", () => {
      const footerCloseButton = screen.getByRole("button", { name: "Đóng" });
      fireEvent.click(footerCloseButton);
      expect(mockSetShowComboDetail).toHaveBeenCalledWith(false);
    });
  });

  describe("Footer Section", () => {
    beforeEach(() => {
      render(
        <ComboDetailPopup
          showComboDetail={true}
          setShowComboDetail={mockSetShowComboDetail}
          comboDetail={mockComboDetail}
        />
      );
    });

    test("should display footer message", () => {
      expect(
        screen.getByText("Combo tiết kiệm & tiện lợi")
      ).toBeInTheDocument();
    });

    test("should display close button in footer", () => {
      expect(screen.getByRole("button", { name: "Đóng" })).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    beforeEach(() => {
      render(
        <ComboDetailPopup
          showComboDetail={true}
          setShowComboDetail={mockSetShowComboDetail}
          comboDetail={mockComboDetail}
        />
      );
    });

    test("should have proper aria-label for close button", () => {
      const closeButton = screen.getByRole("button", { name: "Close" });
      expect(closeButton).toHaveAttribute("aria-label", "Close");
    });

    test("should have proper alt text for images", () => {
      expect(screen.getByAltText("Combo Delicious")).toBeInTheDocument();
      expect(screen.getByAltText("Sản phẩm A")).toBeInTheDocument();
      expect(screen.getByAltText("Sản phẩm B")).toBeInTheDocument();
    });
  });

  describe("Edge Cases", () => {
    test("should handle empty children array", () => {
      const emptyChildrenCombo = {
        ...mockComboDetail,
        children: [],
      };

      render(
        <ComboDetailPopup
          showComboDetail={true}
          setShowComboDetail={mockSetShowComboDetail}
          comboDetail={emptyChildrenCombo}
        />
      );

      expect(screen.getByText("0 sản phẩm")).toBeInTheDocument();
    });

    test("should handle zero price", () => {
      const zeroPriceCombo = {
        ...mockComboDetail,
        combo: {
          ...mockComboDetail.combo,
          Price: 0,
        },
      };

      render(
        <ComboDetailPopup
          showComboDetail={true}
          setShowComboDetail={mockSetShowComboDetail}
          comboDetail={zeroPriceCombo}
        />
      );

      expect(screen.getByText("0 ₫")).toBeInTheDocument();
    });

    test("should handle missing image URLs gracefully", () => {
      const noImageCombo = {
        ...mockComboDetail,
        combo: {
          ...mockComboDetail.combo,
          ImageUrl: "",
        },
        children: [
          {
            ...mockComboDetail.children[0],
            ImageUrl: "",
          },
        ],
      };

      render(
        <ComboDetailPopup
          showComboDetail={true}
          setShowComboDetail={mockSetShowComboDetail}
          comboDetail={noImageCombo}
        />
      );

      // Component should still render without errors
      expect(screen.getByText("Combo Delicious")).toBeInTheDocument();
    });
  });

  describe("Number Formatting", () => {
    test("should format large numbers correctly", () => {
      const expensiveCombo = {
        ...mockComboDetail,
        combo: {
          ...mockComboDetail.combo,
          Price: 1234567,
        },
      };

      render(
        <ComboDetailPopup
          showComboDetail={true}
          setShowComboDetail={mockSetShowComboDetail}
          comboDetail={expensiveCombo}
        />
      );

      expect(screen.getByText("1.234.567 ₫")).toBeInTheDocument();
    });
  });
});
