/* eslint-disable no-undef */
import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  cleanup,
  within,
} from "@testing-library/react";
import "@testing-library/jest-dom";
import PromotionManagement from "../../../../src/layouts/Admin/component/PromotionManagement";

// Mock toast
jest.mock("react-toastify", () => ({
  toast: { success: jest.fn(), error: jest.fn() },
  ToastContainer: () => <div data-testid="toast-container" />,
}));

// Mock API
jest.mock("../../../../src/services/API", () => ({
  getPromotion: jest.fn(),
  createPromotion: jest.fn(),
  deletePromotion: jest.fn(),
  updatePromotion: jest.fn(),
  searchPromotion: jest.fn(),
}));

// Mock child components
jest.mock(
  "../../../../src/layouts/Admin/movieComponent/Pagination",
  () => () => <div data-testid="pagination" />
);
jest.mock(
  "../../../../src/layouts/Admin/promotionComponent/StatsCards",
  () => () => <div data-testid="stats-cards" />
);
jest.mock(
  "../../../../src/layouts/Admin/promotionComponent/SearchAndAdd",
  () => (props) =>
    (
      <div data-testid="search-and-add">
        <input
          placeholder="Search by name"
          value={props.searchTerm}
          onChange={(e) => props.setSearchTerm(e.target.value)}
        />
        <button
          onClick={() => {
            props.resetForm();
            props.setShowFormPopup(true);
          }}
        >
          Add Promotion
        </button>
      </div>
    )
);
jest.mock(
  "../../../../src/layouts/Admin/promotionComponent/PromotionTable",
  () => (props) =>
    (
      <table data-testid="promotion-table">
        <tbody>
          {props.promotions.map((promotion) => (
            <tr key={promotion.PromotionId}>
              <td>{promotion.Title}</td>
              <td>
                <button
                  aria-label="Edit promotion"
                  onClick={() => props.handleEdit(promotion)}
                >
                  Edit
                </button>
                <button
                  aria-label="Delete promotion"
                  onClick={() => {
                    props.setSelectedPromotion(promotion);
                    props.setShowDeletePopup(true);
                  }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    )
);
jest.mock(
  "../../../../src/layouts/Admin/promotionComponent/PromotionCards",
  () => () => <div data-testid="promotion-cards" />
);
jest.mock(
  "../../../../src/layouts/Admin/promotionComponent/DeletePopup",
  () => (props) =>
    props.showDeletePopup ? (
      <div data-testid="delete-popup">
        <button onClick={() => props.setShowDeletePopup(false)}>Cancel</button>
        <button onClick={props.handleDelete}>Delete</button>
      </div>
    ) : null
);
jest.mock(
  "../../../../src/layouts/Admin/promotionComponent/PromotionFormPopup",
  () => (props) =>
    props.showFormPopup ? (
      <form data-testid="form-popup" onSubmit={props.handleSubmit}>
        <input
          placeholder="Promotion Name"
          value={props.title}
          onChange={(e) => props.setTitle(e.target.value)}
        />
        <input
          placeholder="Value"
          value={props.discountValue}
          onChange={(e) => props.setDiscountValue(e.target.value)}
        />
        <input
          placeholder="Start Date"
          value={props.startTime}
          onChange={(e) => props.setStartTime(e.target.value)}
        />
        <input
          placeholder="End Date"
          value={props.endTime}
          onChange={(e) => props.setEndTime(e.target.value)}
        />
        <input
          placeholder="Detail"
          value={props.detail}
          onChange={(e) => props.setDetail(e.target.value)}
        />
        <button
          type="button"
          onClick={() => {
            props.setShowFormPopup(false);
            props.resetForm();
          }}
        >
          Cancel
        </button>
        <button type="submit">
          {props.isEdit ? "Save Promotion" : "Add Promotion"}
        </button>
      </form>
    ) : null
);

import {
  getPromotion,
  createPromotion,
  deletePromotion,
  updatePromotion,
  searchPromotion,
} from "../../../../src/services/API";

describe("PromotionManagement", () => {
  const mockPromotions = [
    {
      PromotionId: "1",
      Title: "Promo 1",
      StartTime: "2024-06-01T00:00:00Z",
      EndTime: "2024-06-30T00:00:00Z",
      DiscountValue: 10,
      Detail: "Detail 1",
      Image: "",
    },
    {
      PromotionId: "2",
      Title: "Promo 2",
      StartTime: "2024-07-01T00:00:00Z",
      EndTime: "2024-07-31T00:00:00Z",
      DiscountValue: 20,
      Detail: "Detail 2",
      Image: "",
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    getPromotion.mockResolvedValue({
      data: mockPromotions,
      pagination: { totalPages: 1, total: 2 },
    });
    searchPromotion.mockResolvedValue({
      promotions: mockPromotions,
      length: 2,
    });
    createPromotion.mockResolvedValue({});
    updatePromotion.mockResolvedValue({});
    deletePromotion.mockResolvedValue({});
  });

  afterEach(() => cleanup());

  it("renders promotion list and stats", async () => {
    render(<PromotionManagement />);
    expect(screen.getByTestId("stats-cards")).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByTestId("promotion-table")).toBeInTheDocument();
      expect(screen.getByText("Promo 1")).toBeInTheDocument();
      expect(screen.getByText("Promo 2")).toBeInTheDocument();
    });
  });

  it("can search for promotions", async () => {
    render(<PromotionManagement />);
    const searchInput = screen.getByPlaceholderText("Search by name");
    fireEvent.change(searchInput, { target: { value: "Promo" } });
    await waitFor(() => {
      expect(searchPromotion).toHaveBeenCalledWith("Promo");
    });
  });

  it("opens add promotion modal", async () => {
    render(<PromotionManagement />);
    // Nút đầu tiên là nút mở modal
    const addButtons = screen.getAllByText("Add Promotion");
    fireEvent.click(addButtons[0]);
    expect(screen.getByTestId("form-popup")).toBeInTheDocument();
    // Lấy nút submit trong form-popup
    const form = screen.getByTestId("form-popup");
    const submitBtn = within(form).getByRole("button", {
      name: "Add Promotion",
    });
    expect(submitBtn).toBeInTheDocument();
  });

  it("opens edit promotion modal", async () => {
    render(<PromotionManagement />);
    await waitFor(() => {
      expect(screen.getByText("Promo 1")).toBeInTheDocument();
    });
    const editButtons = screen.getAllByLabelText("Edit promotion");
    fireEvent.click(editButtons[0]);
    expect(screen.getByTestId("form-popup")).toBeInTheDocument();
    expect(screen.getByText("Save Promotion")).toBeInTheDocument();
  });

  it("opens delete promotion modal and confirms delete", async () => {
    render(<PromotionManagement />);
    await waitFor(() => {
      expect(screen.getByText("Promo 1")).toBeInTheDocument();
    });
    const deleteButtons = screen.getAllByLabelText("Delete promotion");
    fireEvent.click(deleteButtons[0]);
    expect(screen.getByTestId("delete-popup")).toBeInTheDocument();
    // Nút xác nhận xóa là nút Delete cuối cùng (trong popup)
    const allDeleteBtns = screen.getAllByText("Delete");
    const confirmDelete = allDeleteBtns[allDeleteBtns.length - 1];
    fireEvent.click(confirmDelete);
    await waitFor(() => {
      expect(deletePromotion).toHaveBeenCalledWith("1");
    });
  });

  it("calls createPromotion API on add", async () => {
    render(<PromotionManagement />);
    const addButtons = screen.getAllByText("Add Promotion");
    fireEvent.click(addButtons[0]);
    const nameInput = screen.getByPlaceholderText("Promotion Name");
    const valueInput = screen.getByPlaceholderText("Value");
    const startInput = screen.getByPlaceholderText("Start Date");
    const endInput = screen.getByPlaceholderText("End Date");
    const detailInput = screen.getByPlaceholderText("Detail");
    fireEvent.change(nameInput, { target: { value: "New Promo" } });
    fireEvent.change(valueInput, { target: { value: "15" } });
    fireEvent.change(startInput, { target: { value: "2024-08-01" } });
    fireEvent.change(endInput, { target: { value: "2024-08-31" } });
    fireEvent.change(detailInput, { target: { value: "New detail" } });
    // Nút submit là nút thứ hai (trong form)
    const submitBtn = screen.getAllByText("Add Promotion")[1];
    fireEvent.click(submitBtn);
    await waitFor(() => {
      expect(createPromotion).toHaveBeenCalled();
    });
  });

  it("calls updatePromotion API on edit", async () => {
    render(<PromotionManagement />);
    await waitFor(() => {
      expect(screen.getByText("Promo 1")).toBeInTheDocument();
    });
    const editButtons = screen.getAllByLabelText("Edit promotion");
    fireEvent.click(editButtons[0]);
    const nameInput = screen.getByPlaceholderText("Promotion Name");
    fireEvent.change(nameInput, { target: { value: "Promo 1 Updated" } });
    const saveBtn = screen.getByText("Save Promotion");
    fireEvent.click(saveBtn);
    await waitFor(() => {
      expect(updatePromotion).toHaveBeenCalled();
    });
  });
});
