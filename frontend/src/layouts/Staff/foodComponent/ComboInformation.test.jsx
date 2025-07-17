/* eslint-disable no-undef */
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ComboInformation from "./ComboInformation";
import { configureStore } from "@reduxjs/toolkit";
import comboReducer from "../../../redux/features/comboSlice";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import * as api from "../../../services/APIForStaff/API";
import { toast } from "react-toastify";

// Mock window APIs
beforeAll(() => {
  Object.defineProperty(window, "getComputedStyle", {
    value: () => ({
      getPropertyValue: () => "",
    }),
  });

  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: jest.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });
});

// Mock toast
jest.mock("react-toastify", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
    warning: jest.fn(),
    info: jest.fn(),
  },
  ToastContainer: () => <div />,
}));

// Mock navigate
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

// Mock API
jest.mock("../../../services/APIForStaff/API", () => ({
  cancelProductsById: jest.fn(),
}));

// Mock Ant Design Table
jest.mock("antd", () => {
  const antd = jest.requireActual("antd");

  return {
    ...antd,
    Table: ({ dataSource, columns, rowKey, locale }) => (
      <div data-testid="mock-antd-table">
        {/* Render header row */}
        <div data-testid="table-header" role="row">
          {columns.map((col) => (
            <div key={col.title} data-testid={`header-${col.title}`}>
              {col.title}
            </div>
          ))}
        </div>
        {/* Render data rows or empty text */}
        {dataSource.length === 0 ? (
          <div data-testid="table-empty">{locale?.emptyText || "No data"}</div>
        ) : (
          dataSource.map((record) => (
            <div key={record[rowKey]} data-testid={`row-${record[rowKey]}`} role="row">
              {columns.map((col) => (
                <div
                  key={`${record[rowKey]}-${col.title}`}
                  data-testid={`cell-${record[rowKey]}-${col.title}`}
                >
                  {col.render ? col.render(record[col.dataIndex], record) : record[col.dataIndex]}
                </div>
              ))}
            </div>
          ))
        )}
      </div>
    ),
  };
});

const renderWithProvider = (ui, preloadedState = { combo: { cart: [], orderProductId: null } }) => {
  const store = configureStore({
    reducer: {
      combo: comboReducer,
    },
    preloadedState,
  });

  return render(
    <Provider store={store}>
      <BrowserRouter>{ui}</BrowserRouter>
    </Provider>
  );
};

describe("ComboInformation", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock URLSearchParams trực tiếp
    jest.spyOn(URLSearchParams.prototype, "get").mockImplementation((key) => {
      if (window.location.search.includes("resultCode=1006")) {
        return key === "resultCode" ? "1006" : null;
      }
      return key === "resultCode" ? "0" : null;
    });
    window.location.search = "";
  });

  afterEach(() => {
    window.location.search = "";
    jest.spyOn(URLSearchParams.prototype, "get").mockRestore();
  });

  it("renders success state with cart details", async () => {
    window.location.search = "?resultCode=0";
    const storeWithCart = {
      combo: {
        cart: [
          {
            id: "9f6cb2df-687e-4424-a125-6aa82792e38c",
            name: "Coca-Cola Classic (Large)",
            price: 25000,
            quantity: 1,
            image: "https://storage.googleapis.com/movie-c96b6.firebasestorage.app/products/1752475085507-images.jpg",
          },
        ],
        orderProductId: "order-123",
      },
    };

    renderWithProvider(<ComboInformation />, storeWithCart);

    // Kiểm tra tiêu đề và biểu tượng trạng thái
    expect(screen.getByText("Payment Successfully")).toBeInTheDocument();
    expect(screen.getByText("Payment Successfully")).toHaveClass("text-green-600");
    expect(screen.getByTestId("mock-antd-table")).toBeInTheDocument();

    // Kiểm tra bảng chi tiết combo
    expect(screen.getByTestId("row-9f6cb2df-687e-4424-a125-6aa82792e38c")).toBeInTheDocument();
    expect(screen.getByTestId("cell-9f6cb2df-687e-4424-a125-6aa82792e38c-Name")).toHaveTextContent(
      "Coca-Cola Classic (Large)"
    );
    expect(screen.getByTestId("cell-9f6cb2df-687e-4424-a125-6aa82792e38c-Quantity")).toHaveTextContent("1");
    expect(screen.getByTestId("cell-9f6cb2df-687e-4424-a125-6aa82792e38c-Unit Price")).toHaveTextContent(
      "25.000 VNĐ"
    );
    expect(screen.getByTestId("cell-9f6cb2df-687e-4424-a125-6aa82792e38c-Total")).toHaveTextContent("25.000 VNĐ");

    // Kiểm tra tổng giá
    expect(screen.getByText(/Total Amount:/i)).toBeInTheDocument();
    expect(screen.getByText("25.000 VNĐ", { selector: ".text-green-600" })).toBeInTheDocument();

    // Kiểm tra các nút
    expect(screen.getByRole("button", { name: /New Combo/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Cancel/i })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /Try Again/i })).not.toBeInTheDocument();
  });

  it("renders error state with try again button", async () => {
    window.location.search = "?resultCode=1006";
    const storeWithCart = {
      combo: {
        cart: [
          {
            id: "9f6cb2df-687e-4424-a125-6aa82792e38c",
            name: "Coca-Cola Classic (Large)",
            price: 25000,
            quantity: 1,
            image: "https://storage.googleapis.com/movie-c96b6.firebasestorage.app/products/1752475085507-images.jpg",
          },
        ],
        orderProductId: "order-123",
      },
    };

    renderWithProvider(<ComboInformation />, storeWithCart);

    // Kiểm tra tiêu đề và biểu tượng trạng thái
    expect(screen.getByText("Payment Failed")).toBeInTheDocument();
    expect(screen.getByText("Payment Failed")).toHaveClass("text-red-600");

    // Kiểm tra bảng chi tiết combo
    expect(screen.getByTestId("mock-antd-table")).toBeInTheDocument();
    expect(screen.getByTestId("row-9f6cb2df-687e-4424-a125-6aa82792e38c")).toBeInTheDocument();

    // Kiểm tra tổng giá
    expect(screen.getByText(/Total Amount:/i)).toBeInTheDocument();
    expect(screen.getByText("25.000 VNĐ", { selector: ".text-green-600" })).toBeInTheDocument();

    // Kiểm tra nút Try Again
    expect(screen.getByRole("button", { name: /Try Again/i })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /New Combo/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /Cancel/i })).not.toBeInTheDocument();
  });

  it("renders empty cart with no data in table", async () => {
    window.location.search = "?resultCode=0";
    const storeWithEmptyCart = {
      combo: {
        cart: [],
        orderProductId: null,
      },
    };

    renderWithProvider(<ComboInformation />, storeWithEmptyCart);

    // Kiểm tra tiêu đề
    expect(screen.getByText("Payment Successfully")).toBeInTheDocument();

    // Kiểm tra bảng rỗng
    expect(screen.getByText("No combos in cart.")).toBeInTheDocument();

    // Kiểm tra tổng giá
    expect(screen.getByText(/Total Amount:/i)).toBeInTheDocument();
    expect(screen.getByText("0 VNĐ", { selector: ".text-green-600" })).toBeInTheDocument();

    // Kiểm tra các nút
    expect(screen.getByRole("button", { name: /New Combo/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Cancel/i })).toBeInTheDocument();
  });

  it("handles New Combo button click", async () => {
    window.location.search = "?resultCode=0";
    const storeWithCart = {
      combo: {
        cart: [
          {
            id: "9f6cb2df-687e-4424-a125-6aa82792e38c",
            name: "Coca-Cola Classic (Large)",
            price: 25000,
            quantity: 1,
            image: "https://storage.googleapis.com/movie-c96b6.firebasestorage.app/products/1752475085507-images.jpg",
          },
        ],
        orderProductId: "order-123",
      },
    };

    renderWithProvider(<ComboInformation />, storeWithCart);

    fireEvent.click(screen.getByRole("button", { name: /New Combo/i }));

    expect(mockNavigate).toHaveBeenCalledWith("/staff/combo-selling");
  });

  it("handles Cancel button click", async () => {
    window.location.search = "?resultCode=0";
    const storeWithCart = {
      combo: {
        cart: [
          {
            id: "9f6cb2df-687e-4424-a125-6aa82792e38c",
            name: "Coca-Cola Classic (Large)",
            price: 25000,
            quantity: 1,
            image: "https://storage.googleapis.com/movie-c96b6.firebasestorage.app/products/1752475085507-images.jpg",
          },
        ],
        orderProductId: "order-123",
      },
    };

    renderWithProvider(<ComboInformation />, storeWithCart);

    fireEvent.click(screen.getByRole("button", { name: /Cancel/i }));

    expect(mockNavigate).toHaveBeenCalledWith("/staff/combo-selling");
  });

  it("handles Try Again button click with successful API call", async () => {
    window.location.search = "?resultCode=1006";
    const storeWithCart = {
      combo: {
        cart: [
          {
            id: "9f6cb2df-687e-4424-a125-6aa82792e38c",
            name: "Coca-Cola Classic (Large)",
            price: 25000,
            quantity: 1,
            image: "https://storage.googleapis.com/movie-c96b6.firebasestorage.app/products/1752475085507-images.jpg",
          },
        ],
        orderProductId: "order-123",
      },
    };

    api.cancelProductsById.mockResolvedValueOnce({});

    renderWithProvider(<ComboInformation />, storeWithCart);

    fireEvent.click(screen.getByRole("button", { name: /Try Again/i }));

    await waitFor(() => {
      expect(api.cancelProductsById).toHaveBeenCalledWith("order-123");
      expect(toast.info).toHaveBeenCalledWith("Previous booking cancelled. Please try again.");
      expect(mockNavigate).toHaveBeenCalledWith("/staff/combo-selling/checkout");
    });
  });

  it("handles Try Again button click with failed API call", async () => {
    window.location.search = "?resultCode=1006";
    const storeWithCart = {
      combo: {
        cart: [
          {
            id: "9f6cb2df-687e-4424-a125-6aa82792e38c",
            name: "Coca-Cola Classic (Large)",
            price: 25000,
            quantity: 1,
            image: "https://storage.googleapis.com/movie-c96b6.firebasestorage.app/products/1752475085507-images.jpg",
          },
        ],
        orderProductId: "order-123",
      },
    };

    api.cancelProductsById.mockRejectedValueOnce(new Error("Cancellation failed"));

    renderWithProvider(<ComboInformation />, storeWithCart);

    fireEvent.click(screen.getByRole("button", { name: /Try Again/i }));

    await waitFor(() => {
      expect(api.cancelProductsById).toHaveBeenCalledWith("order-123");
      expect(toast.error).toHaveBeenCalledWith("Failed to cancel previous booking");
      expect(mockNavigate).toHaveBeenCalledWith("/staff/combo-selling/checkout");
    });
  });
});