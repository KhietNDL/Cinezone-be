/* eslint-disable no-undef */
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ComboPage from "./ComboPage";
import { configureStore } from "@reduxjs/toolkit";
import comboReducer from "../../../redux/features/comboSlice";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import * as api from "../../../services/APIForStaff/API";

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
  getAllProduct: jest.fn(),
}));

// Mock Swiper to avoid rendering errors
jest.mock("swiper/react", () => ({
  Swiper: ({ children }) => <div>{children}</div>,
  SwiperSlide: ({ children }) => <div>{children}</div>,
}));

jest.mock("swiper/modules", () => ({
  Navigation: {},
  Pagination: {},
}));

// Mock Ant Design Table
jest.mock("antd", () => {
  const antd = jest.requireActual("antd");

  return {
    ...antd,
    Table: ({ dataSource, columns, rowKey }) => (
      <div data-testid="mock-antd-table">
        {/* Render header row */}
        <div data-testid="table-header" role="row">
          {columns.map((col) => (
            <div key={col.title} data-testid={`header-${col.title}`}>
              {col.title}
            </div>
          ))}
        </div>
        {/* Render data rows */}
        {dataSource.map((record) => (
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
        ))}
      </div>
    ),
  };
});

const renderWithProvider = (ui, preloadedState = { combo: { cart: [] } }) => {
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

describe("ComboPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
// 1
  it("renders search input and header", async () => {
    api.getAllProduct.mockResolvedValueOnce({ products: [] });
    renderWithProvider(<ComboPage />);
    expect(await screen.findByPlaceholderText(/search combo/i)).toBeInTheDocument();
    expect(screen.getByText(/sell combo food/i)).toBeInTheDocument();
  });
// 2
  it("renders loading and fetched combos", async () => {
    const mockProducts = [
      {
        ProductId: "9f6cb2df-687e-4424-a125-6aa82792e38c",
        ProductName: "Coca-Cola Classic (Large)",
        Description: "A large, refreshing cup of ice-cold Coca-Cola",
        Price: "25000.00",
        ImageUrl: "https://storage.googleapis.com/movie-c96b6.firebasestorage.app/products/1752475085507-images.jpg",
        Quantity: 948,
      },
    ];
    api.getAllProduct.mockResolvedValueOnce({ products: mockProducts });

    renderWithProvider(<ComboPage />);
    expect(screen.getByText(/Loading products.../i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText(/Coca-Cola Classic/i)).toBeInTheDocument();
    });
  });
// 3
  it("navigates to checkout if cart has items", async () => {
    api.getAllProduct.mockResolvedValueOnce({ products: [] });

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
      },
    };

    renderWithProvider(<ComboPage />, storeWithCart);
    const checkoutBtn = await screen.findByRole("button", { name: /check out/i });
    fireEvent.click(checkoutBtn);

    expect(mockNavigate).toHaveBeenCalledWith("/staff/combo-selling/checkout");
  });
// 4
  it("renders cart table with total price", async () => {
    // Mock API để trả về ngay lập tức vì không cần thiết cho việc render giỏ hàng
    api.getAllProduct.mockResolvedValueOnce({ products: [] });

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
      },
    };

    renderWithProvider(<ComboPage />, storeWithCart);

    // Chờ bảng được render
    await waitFor(() => {
      // Kiểm tra bảng
      const table = screen.getByTestId("mock-antd-table");
      expect(table).toBeInTheDocument();

      // Kiểm tra tên sản phẩm trong bảng
      expect(screen.getByTestId("cell-9f6cb2df-687e-4424-a125-6aa82792e38c-Name")).toHaveTextContent(
        "Coca-Cola Classic (Large)"
      );

      // Kiểm tra giá được định dạng
      expect(screen.getByTestId("cell-9f6cb2df-687e-4424-a125-6aa82792e38c-Price")).toHaveTextContent("25.000 VNĐ");

      // Kiểm tra số lượng
      expect(screen.getByTestId("cell-9f6cb2df-687e-4424-a125-6aa82792e38c-Quantity")).toHaveTextContent("1");

      // Kiểm tra giá tổng trong bảng
      expect(screen.getByTestId("cell-9f6cb2df-687e-4424-a125-6aa82792e38c-Total")).toHaveTextContent("25.000 VNĐ");

      // Kiểm tra các nút trong cột Action
      expect(screen.getByTestId("cell-9f6cb2df-687e-4424-a125-6aa82792e38c-Action")).toBeInTheDocument();

      // Kiểm tra giá tổng bên ngoài bảng
      expect(screen.getByText(/Total Price:/i)).toBeInTheDocument();
      expect(screen.getByText("25.000 VNĐ", { selector: ".text-green-700" })).toBeInTheDocument();

      // Xác minh số hàng (tiêu đề + 1 hàng dữ liệu)
      const rows = screen.getAllByRole("row");
      expect(rows.length).toBe(2); // Tiêu đề + 1 hàng dữ liệu
    });
  });
});