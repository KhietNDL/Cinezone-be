/* eslint-disable no-undef */
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { configureStore } from "@reduxjs/toolkit";
import comboReducer from "../../../redux/features/comboSlice";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
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
    },
    ToastContainer: () => <div />,
}));

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useNavigate: () => mockNavigate,
}));

// Mock API
jest.mock("../../../services/APIForStaff/API", () => ({
    createProductHold: jest.fn(),
}));

// Mock useAuth
const mockUser = { userId: "070eefc0-5bc5-471a-bafc-27e44338b1a2" };
jest.mock("../../../context/AuthContext", () => ({
    useAuth: () => ({ user: mockUser }),
}));

// Mock processPayment
jest.mock("../../../hooks/useProcessPayment", () => ({
    processPayment: jest.fn(),
}));

// Import component after mocks
import CheckOutComboPage from "./CheckOutComboPage";

// Mock antd Table
jest.mock("antd", () => {
    const antd = jest.requireActual("antd");

    const MockTable = ({ dataSource, columns, rowKey }) => (
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
            {dataSource?.map((record) => (
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
    );

    return {
        ...antd,
        Table: MockTable,
        Image: ({ src }) => <img src={src} alt="product" />,
        Button: antd.Button,
        Input: antd.Input,
        Select: antd.Select,
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

describe("CheckOutComboPage", () => {
    const mockCartItem = {
        id: "9f6cb2df-687e-4424-a125-6aa82792e38c",
        name: "Coca-Cola Classic (Large)",
        price: 25000,
        quantity: 1,
        image: "https://storage.googleapis.com/movie-c96b6.firebasestorage.app/products/1752475085507-images.jpg",
    };

    beforeEach(() => {
        jest.clearAllMocks();
        require("../../../services/APIForStaff/API").createProductHold.mockReset();
        require("../../../hooks/useProcessPayment").processPayment.mockReset();
    });

    it("renders checkout page with cart table and payment method", () => {
        const storeWithCart = {
            combo: {
                cart: [mockCartItem],
            },
        };

        renderWithProvider(<CheckOutComboPage />, storeWithCart);

        expect(screen.getByText(/Combo Checkout/i)).toBeInTheDocument();
        expect(screen.getByTestId("mock-antd-table")).toBeInTheDocument();
        expect(screen.getByTestId(`row-${mockCartItem.id}`)).toBeInTheDocument();
        expect(screen.getByTestId(`cell-${mockCartItem.id}-Product`)).toHaveTextContent(mockCartItem.name);
        expect(screen.getByTestId(`cell-${mockCartItem.id}-Quantity`)).toHaveTextContent("1");
        expect(screen.getByTestId("total-amount")).toHaveTextContent("25.000 VNĐ");
        expect(screen.getByText(/Payment Information/i)).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /Confirm Payment/i })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /Cancel Order/i })).toBeInTheDocument();
    });

    // it("shows warning if cart is empty on confirm", async () => {
    //     renderWithProvider(<CheckOutComboPage />);

    //     fireEvent.click(screen.getByRole("button", { name: /Confirm Payment/i }));

    //     await waitFor(() => {
    //         expect(toast.warning).toHaveBeenCalledWith("Cart is empty or missing order number.");
    //     });
    // });

    // it("shows error if user information is missing", async () => {
    //     jest.mock("../../../context/AuthContext", () => ({
    //         useAuth: () => ({ user: null }),
    //     }));

    //     const storeWithCart = {
    //         combo: {
    //             cart: [mockCartItem],
    //         },
    //     };

    //     const { unmount } = renderWithProvider(<CheckOutComboPage />, storeWithCart);

    //     fireEvent.click(screen.getByRole("button", { name: /Confirm Payment/i }));

    //     await waitFor(() => {
    //         expect(toast.error).toHaveBeenCalledWith("User information not found.");
    //     });

    //     unmount();
    //     jest.mock("../../../context/AuthContext", () => ({
    //         useAuth: () => ({ user: mockUser }),
    //     }));
    // });

    it("calls createProductHold and processPayment on valid confirm", async () => {
        const storeWithCart = {
            combo: {
                cart: [mockCartItem],
            },
        };

        const mockCreateProductHold = require("../../../services/APIForStaff/API").createProductHold;
        const mockProcessPayment = require("../../../hooks/useProcessPayment").processPayment;

        mockCreateProductHold.mockResolvedValue({ OrderProductId: "order-123" });
        mockProcessPayment.mockResolvedValue({});

        renderWithProvider(<CheckOutComboPage />, storeWithCart);

        fireEvent.change(screen.getByPlaceholderText("Enter cash given by customer"), {
            target: { value: "30000" },
        });

        fireEvent.click(screen.getByRole("button", { name: /Confirm Payment/i }));

        await waitFor(() => {
            expect(mockCreateProductHold).toHaveBeenCalledWith(
                mockUser.userId,
                [{ ProductId: mockCartItem.id, Quantity: mockCartItem.quantity }],
                "Payment for combo"
            );
            expect(mockProcessPayment).toHaveBeenCalledWith({
                paymentMethod: "Cash",
                orderId: "order-123",
                amount: mockCartItem.price * mockCartItem.quantity,
                type: "combo",
                navigate: expect.any(Function),
                setIsRedirecting: null,
                successUrl: "/staff/combo-selling/combo-information",
            });
        });
    });

    it("navigates back to combo-selling on cancel", () => {
        const storeWithCart = {
            combo: {
                cart: [mockCartItem],
            },
        };

        renderWithProvider(<CheckOutComboPage />, storeWithCart);

        fireEvent.click(screen.getByRole("button", { name: /Cancel Order/i }));

        expect(mockNavigate).toHaveBeenCalledWith("/staff/combo-selling");
    });

    it("shows error if payment fails", async () => {
        const storeWithCart = {
            combo: {
                cart: [mockCartItem],
            },
        };

        require("../../../services/APIForStaff/API").createProductHold.mockRejectedValue(
            new Error("Payment error")
        );

        renderWithProvider(<CheckOutComboPage />, storeWithCart);

        fireEvent.change(screen.getByPlaceholderText("Enter cash given by customer"), {
            target: { value: "30000" },
        });

        fireEvent.click(screen.getByRole("button", { name: /Confirm Payment/i }));

        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith("Payment failed.");
        });
    });

    // it("updates payment method and uses it in processPayment", async () => {
    //     const storeWithCart = {
    //         combo: {
    //             cart: [mockCartItem],
    //         },
    //     };

    //     const mockProcessPayment = require("../../../hooks/useProcessPayment").processPayment;
    //     mockProcessPayment.mockResolvedValue({});

    //     renderWithProvider(<CheckOutComboPage />, storeWithCart);

    //     // Change payment method to Momo
    //     fireEvent.click(screen.getByText("Momo"));
    //     fireEvent.click(screen.getByRole("button", { name: /Confirm Payment/i }));

    //     await waitFor(() => {
    //         expect(mockProcessPayment).toHaveBeenCalledWith(
    //             expect.objectContaining({
    //                 paymentMethod: "Momo",
    //             })
    //         );
    //     });
    // });

    it("renders multiple items in table and calculates total correctly", () => {
        const secondItem = {
            id: "item-2",
            name: "Popcorn (Large)",
            price: 30000,
            quantity: 2,
            image: "https://example.com/popcorn.jpg",
        };
        const storeWithCart = {
            combo: {
                cart: [mockCartItem, secondItem],
            },
        };

        renderWithProvider(<CheckOutComboPage />, storeWithCart);

        expect(screen.getByTestId(`row-${mockCartItem.id}`)).toBeInTheDocument();
        expect(screen.getByTestId("row-item-2")).toBeInTheDocument();
        expect(screen.getByTestId("total-amount")).toHaveTextContent("85.000 VNĐ");
    });
});