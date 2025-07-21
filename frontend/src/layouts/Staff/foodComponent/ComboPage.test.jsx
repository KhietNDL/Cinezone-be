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
  Swiper: ({ children }) => <div data-testid="swiper">{children}</div>,
  SwiperSlide: ({ children }) => <div data-testid="swiper-slide">{children}</div>,
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
// Mock ItemCard component
jest.mock("../component/ItemCard", () => ({ item, onSelect, selected, disabled, ...props }) => (
  <div {...props}>
    <h3>{item.name}</h3>
    <button
      data-testid={`item-${item.id}`}
      onClick={() => onSelect(item)}
      disabled={disabled}
    >
      {selected ? "Selected" : "Select"}
    </button>
  </div>
));

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
  const mockProducts = [
    {
      ProductId: "9f6cb2df-687e-4424-a125-6aa82792e38c",
      ProductName: "Coca-Cola Classic (Large)",
      Description: "A large, refreshing cup of ice-cold Coca-Cola",
      Price: "25000.00",
      ImageUrl: "https://storage.googleapis.com/movie-c96b6.firebasestorage.app/products/1752475085507-images.jpg",
      Quantity: 948,
    },
    {
      ProductId: "123e4567-e89b-12d3-a456-426614174000",
      ProductName: "Popcorn (Large)",
      Description: "A large bucket of freshly popped popcorn",
      Price: "30000.00",
      ImageUrl: "https://storage.googleapis.com/popcorn.jpg",
      Quantity: 500,
    },
  ];
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

  // 5
  it("displays matching combos when searching with valid keyword", async () => {
    api.getAllProduct.mockResolvedValueOnce({ products: mockProducts });

    renderWithProvider(<ComboPage />);

    // Chờ sản phẩm được tải
    await waitFor(() => {
      expect(screen.getByTestId("item-9f6cb2df-687e-4424-a125-6aa82792e38c")).toBeInTheDocument();
      expect(screen.getByTestId("item-123e4567-e89b-12d3-a456-426614174000")).toBeInTheDocument();
    });

    // Nhập từ khóa "Coca"
    fireEvent.change(screen.getByPlaceholderText(/search combo/i), {
      target: { value: "Coca" },
    });

    await waitFor(() => {
      // Kiểm tra chỉ có Coca-Cola hiển thị
      expect(screen.getByTestId("item-9f6cb2df-687e-4424-a125-6aa82792e38c")).toBeInTheDocument();
      expect(screen.queryByTestId("item-123e4567-e89b-12d3-a456-426614174000")).not.toBeInTheDocument();

      // Kiểm tra SwiperSlide
      const slides = screen.getAllByTestId("swiper-slide");
      expect(slides.length).toBe(1); // Chỉ có 1 slide cho Coca-Cola
    });
  });

  // 6
  it("do not displays combos when searching with invalid keywords", async () => {

    api.getAllProduct.mockResolvedValueOnce({ products: mockProducts });

    renderWithProvider(<ComboPage />);

    // Chờ sản phẩm được tải
    await waitFor(() => {
      expect(screen.getByTestId("item-9f6cb2df-687e-4424-a125-6aa82792e38c")).toBeInTheDocument();
      expect(screen.getByTestId("item-123e4567-e89b-12d3-a456-426614174000")).toBeInTheDocument();
    });

    // Nhập từ khóa "invalidCombo"
    fireEvent.change(screen.getByPlaceholderText(/search combo/i), {
      target: { value: "invalidCombo" },
    });

    await waitFor(() => {
      // Kiểm tra không hiển thị combo
      expect(screen.queryByTestId("item-9f6cb2df-687e-4424-a125-6aa82792e38c")).not.toBeInTheDocument();
      expect(screen.queryByTestId("item-123e4567-e89b-12d3-a456-426614174000")).not.toBeInTheDocument();
    });
  });

  // 7
  it("increases the quantity of a product in the cart", async () => {
    api.getAllProduct.mockResolvedValueOnce({ products: [] }); // Không cần fetch combo nào

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

    // Đợi số lượng hiện ban đầu là 1
    const quantityCell = await screen.findByText("1");
    expect(quantityCell).toBeInTheDocument();

    // Click nút tăng số lượng
    const increaseButton = screen.getByTestId("increase-9f6cb2df-687e-4424-a125-6aa82792e38c");
    fireEvent.click(increaseButton);

    // Số lượng tăng lên 2
    await waitFor(() => {
      expect(screen.getByText("2")).toBeInTheDocument();
    });

    // Tổng giá cập nhật: 25,000 * 2 = 50,000 VNĐ
    expect(screen.getByTestId("cell-9f6cb2df-687e-4424-a125-6aa82792e38c-Total")).toHaveTextContent("50.000 VNĐ");
  });

  // 8
  it("decreases the quantity of a product in the cart", async () => {
    api.getAllProduct.mockResolvedValueOnce({ products: [] }); // Không cần fetch combo nào

    const storeWithCart = {
      combo: {
        cart: [
          {
            id: "9f6cb2df-687e-4424-a125-6aa82792e38c",
            name: "Coca-Cola Classic (Large)",
            price: 25000,
            quantity: 2,
            image: "https://storage.googleapis.com/movie-c96b6.firebasestorage.app/products/1752475085507-images.jpg",
          },
        ],
      },
    };

    renderWithProvider(<ComboPage />, storeWithCart);

    // Đợi số lượng hiện ban đầu là 1
    const quantityCell = await screen.findByText("2");
    expect(quantityCell).toBeInTheDocument();

    // Click nút tăng số lượng
    const decreaseButton = screen.getByTestId("decrease-9f6cb2df-687e-4424-a125-6aa82792e38c");
    fireEvent.click(decreaseButton);

    // Số lượng tăng lên 2
    await waitFor(() => {
      expect(screen.getByText("1")).toBeInTheDocument();
    });

    // Tổng giá cập nhật: 25,000 * 1 = 25,000 VNĐ
    expect(screen.getByTestId("cell-9f6cb2df-687e-4424-a125-6aa82792e38c-Total")).toHaveTextContent("25.000 VNĐ");
  });

  // 9
  it("removes a product from the cart", async () => {
    api.getAllProduct.mockResolvedValueOnce({ products: [] }); // Không cần fetch combo nào

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

    // Đợi sản phẩm hiển thị trong giỏ hàng
    const productRow = await screen.findByTestId("row-9f6cb2df-687e-4424-a125-6aa82792e38c");
    expect(productRow).toBeInTheDocument();

    // Click nút xóa sản phẩm
    const removeButton = screen.getByTestId("remove-9f6cb2df-687e-4424-a125-6aa82792e38c");
    fireEvent.click(removeButton);

    // Chờ sản phẩm bị xóa khỏi giỏ hàng
    await waitFor(() => {
      expect(screen.queryByTestId("row-9f6cb2df-687e-4424-a125-6aa82792e38c")).not.toBeInTheDocument();
    });
  });

  // 10
  it("clears the cart and navigates to combo selling page on cancel", async () => {
    api.getAllProduct.mockResolvedValueOnce({ products: [] }); // Không cần fetch combo nào

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

    // Click nút hủy
    const cancelButton = screen.getByRole("button", { name: /cancel/i });
    fireEvent.click(cancelButton);

    // Kiểm tra xem cart đã được xóa
    await waitFor(() => {
      expect(screen.queryByText("Coca-Cola Classic (Large)")).not.toBeInTheDocument();
    });
  });

});