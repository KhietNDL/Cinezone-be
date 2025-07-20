/* eslint-disable no-undef */
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import CheckOutComboPage from "./CheckOutComboPage";
import { configureStore } from "@reduxjs/toolkit";
import comboReducer from "../../../redux/features/comboSlice";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import * as api from "../../../services/APIForStaff/API";
import { toast } from "react-toastify";
import { processPayment } from "../../../hooks/useProcessPayment";
// import { useAuth } from "../../../context/AuthContext";

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

// Mock antd Table
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

describe("CheckOutComboPage", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    const mockCartItem = {
        id: "9f6cb2df-687e-4424-a125-6aa82792e38c",
        name: "Coca-Cola Classic (Large)",
        price: 25000,
        quantity: 1,
        image: "https://storage.googleapis.com/movie-c96b6.firebasestorage.app/products/1752475085507-images.jpg",
    };
    // 1
    it("renders checkout page with cart table and payment method", () => {
        const storeWithCart = {
            combo: {
                cart: [mockCartItem],
            },
        };

        renderWithProvider(<CheckOutComboPage />, storeWithCart);

        // Kiểm tra tiêu đề
        expect(screen.getByText(/Confirm Combos/i)).toBeInTheDocument();

        // Kiểm tra bảng
        expect(screen.getByTestId("mock-antd-table")).toBeInTheDocument();
        expect(screen.getByTestId("row-9f6cb2df-687e-4424-a125-6aa82792e38c")).toBeInTheDocument();
        expect(
            screen.getByTestId("cell-9f6cb2df-687e-4424-a125-6aa82792e38c-Product")
        ).toHaveTextContent("Coca-Cola Classic (Large)");
        expect(screen.getByTestId("cell-9f6cb2df-687e-4424-a125-6aa82792e38c-Quantity")).toHaveTextContent("1");
        expect(screen.getByTestId("cell-9f6cb2df-687e-4424-a125-6aa82792e38c-Unit Price")).toHaveTextContent(
            "25.000 VNĐ"
        );
        expect(screen.getByTestId("cell-9f6cb2df-687e-4424-a125-6aa82792e38c-Total")).toHaveTextContent("25.000 VNĐ");

        // Kiểm tra tổng giá
        expect(screen.getByText(/Total Amount:/i)).toBeInTheDocument();
        expect(screen.getByTestId("total-amount")).toHaveTextContent("25.000 VNĐ");

        // Kiểm tra phương thức thanh toán
        expect(screen.getByText(/Payment method:/i)).toBeInTheDocument();

        // Kiểm tra các nút
        expect(screen.getByRole("button", { name: /Confirm/i })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /Cancel/i })).toBeInTheDocument();
    });
    // 2
    it("shows warning if cart is empty on confirm", async () => {
        renderWithProvider(<CheckOutComboPage />, { combo: { cart: [] } });

        fireEvent.click(screen.getByRole("button", { name: /Confirm/i }));

        await waitFor(() => {
            expect(toast.warning).toHaveBeenCalledWith("Cart is empty or missing order number.");
        });
    });
    // 3
    it("shows error if user information is missing", async () => {
        jest.mock("../../../context/AuthContext", () => ({
            useAuth: () => ({ user: null }),
        }));

        const storeWithCart = {
            combo: {
                cart: [mockCartItem],
            },
        };

        renderWithProvider(<CheckOutComboPage />, storeWithCart);

        fireEvent.click(screen.getByRole("button", { name: /Confirm/i }));

        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith("Payment failed.");
        });
    });
    // 4
    it("calls createProductHold and processPayment on valid confirm", async () => {
        const storeWithCart = {
            combo: {
                cart: [mockCartItem],
            },
        };

        api.createProductHold.mockResolvedValue({ OrderProductId: "order-123" });
        processPayment.mockResolvedValue();

        renderWithProvider(<CheckOutComboPage />, storeWithCart);

        fireEvent.click(screen.getByRole("button", { name: /Confirm/i }));

        await waitFor(() => {
            expect(api.createProductHold).toHaveBeenCalledWith(
                "070eefc0-5bc5-471a-bafc-27e44338b1a2",
                [{ ProductId: "9f6cb2df-687e-4424-a125-6aa82792e38c", Quantity: 1 }],
                "Payment for combo"
            );
            expect(processPayment).toHaveBeenCalledWith({
                paymentMethod: "Cash",
                orderId: "order-123",
                amount: 25000,
                type: "combo",
                navigate: expect.any(Function),
                setIsRedirecting: null,
                successUrl: "/staff/combo-selling/combo-information",
            });
        });
    });
    // 5
    it("navigates back to combo-selling on cancel", async () => {
        const storeWithCart = {
            combo: {
                cart: [mockCartItem],
            },
        };

        renderWithProvider(<CheckOutComboPage />, storeWithCart);

        fireEvent.click(screen.getByRole("button", { name: /Cancel/i }));

        expect(mockNavigate).toHaveBeenCalledWith("/staff/combo-selling");
    });
    // 6
    it("shows error if payment fails", async () => {
        const storeWithCart = {
            combo: {
                cart: [mockCartItem],
            },
        };

        api.createProductHold.mockRejectedValue(new Error("Payment error"));

        renderWithProvider(<CheckOutComboPage />, storeWithCart);

        fireEvent.click(screen.getByRole("button", { name: /Confirm/i }));

        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith("Payment failed.");
        });
    });
    // 7
    it("updates payment method and uses it in processPayment", async () => {
        const storeWithCart = {
            combo: {
                cart: [mockCartItem],
            },
        };
    
        api.createProductHold.mockResolvedValue({ OrderProductId: "order-456" });
        processPayment.mockResolvedValue();
    
        renderWithProvider(<CheckOutComboPage />, storeWithCart);
    
        // Click the Momo payment method
        fireEvent.click(screen.getByText("Momo"));
        fireEvent.click(screen.getByRole("button", { name: /Confirm/i }));
    
        await waitFor(() => {
            expect(processPayment).toHaveBeenCalledWith(
                expect.objectContaining({
                    paymentMethod: "Momo",
                })
            );
        });
    });
    // 8
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

        // Both rows present
        expect(screen.getByTestId("row-9f6cb2df-687e-4424-a125-6aa82792e38c")).toBeInTheDocument();
        expect(screen.getByTestId("row-item-2")).toBeInTheDocument();

        // Check total calculation: 25,000 + 30,000*2 = 85,000
        expect(screen.getByTestId("total-amount")).toHaveTextContent("85.000 VNĐ");
    });
    // 9
    // it("disables Confirm button while loading", async () => {
    //     const storeWithCart = {
    //         combo: {
    //             cart: [mockCartItem],
    //         },
    //     };
    
    //     // Make processPayment hang until we resolve it
    //     let resolvePayment;
    //     processPayment.mockImplementation(() => new Promise((resolve) => { resolvePayment = resolve; }));
    
    //     renderWithProvider(<CheckOutComboPage />, storeWithCart);
    
    //     fireEvent.click(screen.getByRole("button", { name: /Confirm/i }));
    
    //     // Button should be loading/disabled
    //     expect(screen.getByRole("button", { name: /Confirm/i })).toHaveAttribute("disabled");
    
    //     // Finish payment
    //     resolvePayment();
    //     await waitFor(() => {
    //         expect(processPayment).toHaveBeenCalled();
    //     });
    // });
});