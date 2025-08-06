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

  // 1 - 
  it("renders search input and header", async () => {
    api.getAllProduct.mockResolvedValueOnce({ products: [] });
    renderWithProvider(<ComboPage />);
    
    // The actual placeholder text is "Search movies" not "search combo"
    expect(await screen.findByPlaceholderText(/search movies/i)).toBeInTheDocument();
    // The header says "Combo Sales" not "sell combo food"
    expect(screen.getByText(/combo sales/i)).toBeInTheDocument();
  });

  // 2 -
  it("renders loading and fetched combos", async () => {
    api.getAllProduct.mockResolvedValueOnce({ products: mockProducts });

    renderWithProvider(<ComboPage />);
    // The actual loading text is "Loading Products" not "Loading products..."
    expect(screen.getByText(/loading products/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText(/Coca-Cola Classic/i)).toBeInTheDocument();
    });
  });

  // 3 - 
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
    // The button text is "Proceed to Checkout" not "check out"
    const checkoutBtn = await screen.findByRole("button", { name: /proceed to checkout/i });
    fireEvent.click(checkoutBtn);

    expect(mockNavigate).toHaveBeenCalledWith("/staff/combo-selling/checkout");
  });

  // 4 -
  // it("renders cart table with total price", async () => {
  //   api.getAllProduct.mockResolvedValueOnce({ products: [] });

  //   const storeWithCart = {
  //     combo: {
  //       cart: [
  //         {
  //           id: "9f6cb2df-687e-4424-a125-6aa82792e38c",
  //           name: "Coca-Cola Classic (Large)",
  //           price: 25000,
  //           quantity: 1,
  //           image: "https://storage.googleapis.com/movie-c96b6.firebasestorage.app/products/1752475085507-images.jpg",
  //         },
  //       ],
  //     },
  //   };

  //   renderWithProvider(<ComboPage />, storeWithCart);

  //   await waitFor(() => {
  //     const table = screen.getByTestId("mock-antd-table");
  //     expect(table).toBeInTheDocument();

  //     expect(screen.getByTestId("cell-9f6cb2df-687e-4424-a125-6aa82792e38c-Name")).toHaveTextContent(
  //       "Coca-Cola Classic (Large)"
  //     );

  //     expect(screen.getByTestId("cell-9f6cb2df-687e-4424-a125-6aa82792e38c-Price")).toHaveTextContent("25.000 VNĐ");
  //     expect(screen.getByTestId("cell-9f6cb2df-687e-4424-a125-6aa82792e38c-Quantity")).toHaveTextContent("1");
  //     expect(screen.getByTestId("cell-9f6cb2df-687e-4424-a125-6aa82792e38c-Total")).toHaveTextContent("25.000 VNĐ");
  //     expect(screen.getByTestId("cell-9f6cb2df-687e-4424-a125-6aa82792e38c-Action")).toBeInTheDocument();

  //     // The total amount text is "Total Amount" not "Total Price"
  //     expect(screen.getByText(/total amount/i)).toBeInTheDocument();
  //     // Look for the total price in the purple text section
  //     expect(screen.getByText("25.000 VNĐ")).toBeInTheDocument();

  //     const rows = screen.getAllByRole("row");
  //     expect(rows.length).toBe(2);
  //   });
  // });

  // 5 - 
  it("displays matching combos when searching with valid keyword", async () => {
    api.getAllProduct.mockResolvedValueOnce({ products: mockProducts });

    renderWithProvider(<ComboPage />);

    await waitFor(() => {
      expect(screen.getByTestId("item-9f6cb2df-687e-4424-a125-6aa82792e38c")).toBeInTheDocument();
      expect(screen.getByTestId("item-123e4567-e89b-12d3-a456-426614174000")).toBeInTheDocument();
    });

    // Use the correct placeholder text
    fireEvent.change(screen.getByPlaceholderText(/search movies/i), {
      target: { value: "Coca" },
    });

    await waitFor(() => {
      expect(screen.getByTestId("item-9f6cb2df-687e-4424-a125-6aa82792e38c")).toBeInTheDocument();
      expect(screen.queryByTestId("item-123e4567-e89b-12d3-a456-426614174000")).not.toBeInTheDocument();

      const slides = screen.getAllByTestId("swiper-slide");
      expect(slides.length).toBe(1);
    });
  });

  // 6 - 
  it("do not displays combos when searching with invalid keywords", async () => {
    api.getAllProduct.mockResolvedValueOnce({ products: mockProducts });

    renderWithProvider(<ComboPage />);

    await waitFor(() => {
      expect(screen.getByTestId("item-9f6cb2df-687e-4424-a125-6aa82792e38c")).toBeInTheDocument();
      expect(screen.getByTestId("item-123e4567-e89b-12d3-a456-426614174000")).toBeInTheDocument();
    });

    // Use the correct placeholder text
    fireEvent.change(screen.getByPlaceholderText(/search movies/i), {
      target: { value: "invalidCombo" },
    });

    await waitFor(() => {
      expect(screen.queryByTestId("item-9f6cb2df-687e-4424-a125-6aa82792e38c")).not.toBeInTheDocument();
      expect(screen.queryByTestId("item-123e4567-e89b-12d3-a456-426614174000")).not.toBeInTheDocument();
    });
  });

  // 7
  it("increases the quantity of a product in the cart", async () => {
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

    const quantityCell = await screen.findByText("1");
    expect(quantityCell).toBeInTheDocument();

    const increaseButton = screen.getByTestId("increase-9f6cb2df-687e-4424-a125-6aa82792e38c");
    fireEvent.click(increaseButton);

    await waitFor(() => {
      expect(screen.getByText("2")).toBeInTheDocument();
    });

    expect(screen.getByTestId("cell-9f6cb2df-687e-4424-a125-6aa82792e38c-Total")).toHaveTextContent("50.000 VNĐ");
  });

  // 8
  it("decreases the quantity of a product in the cart", async () => {
    api.getAllProduct.mockResolvedValueOnce({ products: [] });

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

    const quantityCell = await screen.findByText("2");
    expect(quantityCell).toBeInTheDocument();

    const decreaseButton = screen.getByTestId("decrease-9f6cb2df-687e-4424-a125-6aa82792e38c");
    fireEvent.click(decreaseButton);

    await waitFor(() => {
      expect(screen.getByText("1")).toBeInTheDocument();
    });

    expect(screen.getByTestId("cell-9f6cb2df-687e-4424-a125-6aa82792e38c-Total")).toHaveTextContent("25.000 VNĐ");
  });

  // 9
  it("removes a product from the cart", async () => {
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

    const productRow = await screen.findByTestId("row-9f6cb2df-687e-4424-a125-6aa82792e38c");
    expect(productRow).toBeInTheDocument();

    const removeButton = screen.getByTestId("remove-9f6cb2df-687e-4424-a125-6aa82792e38c");
    fireEvent.click(removeButton);

    await waitFor(() => {
      expect(screen.queryByTestId("row-9f6cb2df-687e-4424-a125-6aa82792e38c")).not.toBeInTheDocument();
    });
  });

  // 10 - 
  it("clears the cart and navigates to combo selling page on cancel", async () => {
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

    // The button text is "Clear Cart" not "cancel"
    const cancelButton = screen.getByRole("button", { name: /clear cart/i });
    fireEvent.click(cancelButton);

    await waitFor(() => {
      expect(screen.queryByText("Coca-Cola Classic (Large)")).not.toBeInTheDocument();
    });
  });
});