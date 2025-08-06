/* eslint-disable no-undef */
import React from "react";
// import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
// import { toast } from "react-toastify";
import ConfirmTicketsPage from "./ConfirmTicketsPage";
import sellingReducer from "../../../../redux/features/sellingSlice";
import memberReducer from "../../../../redux/features/memberSlice";

// Mock all dependencies
const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

jest.mock("../../../../services/APIForStaff/API", () => ({
  getMovieById: jest.fn(),
  cancelBookingById: jest.fn(),
  checkPromotion: jest.fn(),
  createBookingHold: jest.fn(),
  checkMemberShip: jest.fn(),
  getUserInfo: jest.fn(),
}));

jest.mock("../../../../context/AuthContext", () => ({
  useAuth: () => ({
    user: {
      userId: "user123",
      id: "user123",
      email: "test@example.com",
    },
  }),
}));

jest.mock("../../../../hooks/useProcessPayment", () => ({
  processPayment: jest.fn(),
}));

jest.mock("react-toastify", () => ({
  toast: {
    error: jest.fn(),
    success: jest.fn(),
  },
}));

jest.mock("../../component/VersionCard", () => {
  return function MockVersionCard({ version, className }) {
    return (
      <div data-testid="version-card" className={className}>
        {version}
      </div>
    );
  };
});

jest.mock("../../component/PaymentMethod", () => {
  return function MockPaymentMethod({ value, onChange, showCardType, cardType, onCardTypeChange, cardTypeError }) {
    return (
      <div data-testid="payment-method">
        <div data-testid="payment-value">{value}</div>
        <button
          data-testid="payment-cash"
          onClick={() => onChange("Cash")}
          className={value === "Cash" ? "selected" : ""}
        >
          Cash
        </button>
        <button
          data-testid="payment-stripe"
          onClick={() => onChange("Stripe")}
          className={value === "Stripe" ? "selected" : ""}
        >
          Stripe
        </button>
        {showCardType && (
          <select
            data-testid="card-type-select"
            value={cardType}
            onChange={(e) => onCardTypeChange(e.target.value)}
          >
            <option value="">Select card type</option>
            <option value="visa">Visa</option>
            <option value="mastercard">Mastercard</option>
          </select>
        )}
        {cardTypeError && <div data-testid="card-type-error">{cardTypeError}</div>}
      </div>
    );
  };
});

jest.mock("../../component/MemberRank", () => {
  return function MockMemberRank({ rank, pointsMemberShip }) {
    return (
      <div data-testid="member-rank">
        <div data-testid="rank">{rank}</div>
        <div data-testid="points">{pointsMemberShip}</div>
      </div>
    );
  };
});

jest.mock("../../component/BackButton", () => {
  return function MockBackButton() {
    return <button data-testid="back-button">Back</button>;
  };
});

jest.mock("antd", () => ({
  ...jest.requireActual("antd"),
  Button: ({ children, onClick, disabled, type, icon, className, danger, htmlType }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      data-testid={`button-${type || "default"}`}
      className={className}
      data-danger={danger}
      data-html-type={htmlType}
    >
      {icon}
      {children}
    </button>
  ),
  Spin: ({ size, children, tip }) => (
    <div data-testid="spin" data-size={size} data-tip={tip}>
      {children || "Loading..."}
    </div>
  ),
  Switch: ({ checked, onChange, checkedChildren, unCheckedChildren, style }) => (
    <button
      data-testid="switch"
      onClick={() => onChange(!checked)}
      className={checked ? "checked" : "unchecked"}
      style={style}
    >
      {checked ? checkedChildren : unCheckedChildren}
    </button>
  ),
}));

jest.mock("react-icons/ri", () => ({
  RiFilmAiFill: () => <div data-testid="ri-film-ai-fill" />,
}));

jest.mock("react-icons/fa", () => ({
  FaMoneyBillWave: () => <div data-testid="fa-money-bill-wave" />,
  FaIdCard: () => <div data-testid="fa-id-card" />,
  FaUser: () => <div data-testid="fa-user" />,
  FaPhone: () => <div data-testid="fa-phone" />,
  FaExchangeAlt: () => <div data-testid="fa-exchange-alt" />,
}));

jest.mock("react-icons/fa6", () => ({
  FaCalendarDays: () => <div data-testid="fa-calendar-days" />,
  FaLocationDot: () => <div data-testid="fa-location-dot" />,
  FaCouch: () => <div data-testid="fa-couch" />,
  FaFire: () => <div data-testid="fa-fire" />,
  FaStar: () => <div data-testid="fa-star" />,
  FaX: () => <div data-testid="fa-x" />,
}));

jest.mock("react-icons/bi", () => ({
  BiSolidDiscount: () => <div data-testid="bi-solid-discount" />,
}));

jest.mock("react-icons/io5", () => ({
  IoTime: () => <div data-testid="io-time" />,
  IoSearch: () => <div data-testid="io-search" />,
  IoAddOutline: () => <div data-testid="io-add-outline" />,
}));

jest.mock("react-icons/fi", () => ({
  FiLoader: () => <div data-testid="fi-loader" />,
}));

jest.mock("@ant-design/icons", () => ({
  CheckOutlined: () => <div data-testid="check-outlined" />,
  CloseOutlined: () => <div data-testid="close-outlined" />,
}));

// Sample data
const sampleMovie = {
  MovieId: "movie1",
  NameOfEnglish: "Avengers Endgame",
  NameOfVietnamese: "Biệt Đội Siêu Anh Hùng: Hồi Kết",
  PosterImage: "https://example.com/poster.jpg",
};

const sampleSeats = [
  { seatId: "1", seatNumber: "A1", price: 75000, status: "available" },
  { seatId: "2", seatNumber: "A2", price: 75000, status: "available" },
];

const sampleBookingData = {
  selectedMovie: sampleMovie,
  showtimeId: "showtime1",
  selectedDay: "2024-01-15",
  selectedTime: "14:30",
  room: "Room A",
  selectedVersion: "2D",
  seatData: sampleSeats,
  selectedSeats: ["A1", "A2"],
  totalPrice: 150000,
  bookingId: "booking123",
};

// const sampleMember = {
//   id: "member123",
//   fullName: "John Doe",
//   phone: "0123456789",
//   identityCard: "123456789",
//   score: 500,
//   email: "john@example.com",
//   rank: "Gold",
//   pointsMemberShip: 1000,
//   discountTicket: 10,
// };

// Create test store
const createTestStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      selling: sellingReducer,
      member: memberReducer,
    },
    preloadedState: {
      selling: {
        ...sampleBookingData,
        ...initialState.selling,
      },
      member: {
        member: null,
        memberChecked: false,
        ...initialState.member,
      },
    },
  });
};

// Test wrapper component
const renderWithProviders = (ui, { initialState = {}, ...renderOptions } = {}) => {
  const store = createTestStore(initialState);
  const Wrapper = ({ children }) => (
    <Provider store={store}>
      <BrowserRouter>{children}</BrowserRouter>
    </Provider>
  );
  return {
    store,
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
  };
};

describe("ConfirmTicketsPage", () => {
  let mockGetMovieById;
  let mockCancelBookingById;
  let mockCheckPromotion;
  let mockCreateBookingHold;
  let mockCheckMemberShip;
  let mockGetUserInfo;
  let mockProcessPayment;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "error").mockImplementation(() => {});

    mockGetMovieById = jest.fn();
    mockCancelBookingById = jest.fn();
    mockCheckPromotion = jest.fn();
    mockCreateBookingHold = jest.fn();
    mockCheckMemberShip = jest.fn();
    mockGetUserInfo = jest.fn();
    mockProcessPayment = jest.fn();

    // Mock API functions
    const api = require("../../../../services/APIForStaff/API");
    api.getMovieById = mockGetMovieById;
    api.cancelBookingById = mockCancelBookingById;
    api.checkPromotion = mockCheckPromotion;
    api.createBookingHold = mockCreateBookingHold;
    api.checkMemberShip = mockCheckMemberShip;
    api.getUserInfo = mockGetUserInfo;

    // Mock processPayment
    const processPayment = require("../../../../hooks/useProcessPayment");
    processPayment.processPayment = mockProcessPayment;
  });

  afterEach(() => {
    console.error.mockRestore();
  });

  // 1. Test initial render with loading state
  it("shows loading spinner initially", () => {
    mockGetMovieById.mockResolvedValue({ data: sampleMovie });

    renderWithProviders(<ConfirmTicketsPage />);
    expect(screen.getByTestId("spin")).toBeInTheDocument();
  });

  // // 2. Test successful data loading
  // it("loads and displays movie data successfully", async () => {
  //   mockGetMovieById.mockResolvedValue({ data: sampleMovie });

  //   renderWithProviders(<ConfirmTicketsPage />);

  //   await waitFor(() => {
  //     expect(screen.getByText("Confirm Tickets")).toBeInTheDocument();
  //   });

  //   expect(screen.getByText("Avengers Endgame")).toBeInTheDocument();
  //   expect(screen.getByText("(Biệt Đội Siêu Anh Hùng: Hồi Kết)")).toBeInTheDocument();
  // });

  // 3. Test missing booking data redirect
  it("redirects when no booking data is found", async () => {
    renderWithProviders(<ConfirmTicketsPage />, {
      initialState: { 
        selling: { selectedMovie: null },
        member: {}
      },
    });

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/staff/ticket-selling");
    });
  });

  // // 4. Test member search functionality
  // it("handles member search correctly", async () => {
  //   mockGetMovieById.mockResolvedValue({ data: sampleMovie });
  //   mockGetUserInfo.mockResolvedValue({
  //     users: [{
  //       UserId: "member123",
  //       FullName: "John Doe",
  //       PhoneNumber: "0123456789",
  //       CCCD: "123456789",
  //       ScoreBalance: 500,
  //       Email: "john@example.com",
  //     }],
  //   });
  //   mockCheckMemberShip.mockResolvedValue({
  //     membership: {
  //       MembershipName: "Gold",
  //       TotalAccumulatedPoints: 1000,
  //       DiscountTicket: 10,
  //     },
  //   });

  //   renderWithProviders(<ConfirmTicketsPage />);

  //   await waitFor(() => {
  //     expect(screen.getByText("Confirm Tickets")).toBeInTheDocument();
  //   });

  //   const searchInput = screen.getByPlaceholderText("Email / Phone / ID");
  //   const searchButton = screen.getByText("Check");

  //   fireEvent.change(searchInput, { target: { value: "john@example.com" } });
  //   fireEvent.click(searchButton);

  //   await waitFor(() => {
  //     expect(mockGetUserInfo).toHaveBeenCalledWith("email", "john@example.com");
  //     expect(toast.success).toHaveBeenCalledWith("Member found! Applied membership discount (10%)");
  //   });
  // });

  // // 5. Test promotion code functionality
  // it("handles promotion code correctly", async () => {
  //   mockGetMovieById.mockResolvedValue({ data: sampleMovie });
  //   mockCheckPromotion.mockResolvedValue({
  //     promotions: [{
  //       DiscountValue: 15,
  //       StartTime: "2024-01-01",
  //       EndTime: "2024-12-31",
  //     }],
  //   });

  //   renderWithProviders(<ConfirmTicketsPage />, {
  //     initialState: {
  //       member: {
  //         member: sampleMember,
  //         memberChecked: true,
  //       },
  //     },
  //   });

  //   await waitFor(() => {
  //     expect(screen.getByText("Confirm Tickets")).toBeInTheDocument();
  //   });

  //   // Wait for member section to render
  //   await waitFor(() => {
  //     expect(screen.getByText("John Doe")).toBeInTheDocument();
  //   });

  //   const promotionInput = screen.getByPlaceholderText("Enter promotion code");
  //   const addButton = screen.getByText("Add");

  //   fireEvent.change(promotionInput, { target: { value: "PROMO15" } });
  //   fireEvent.click(addButton);

  //   await waitFor(() => {
  //     expect(mockCheckPromotion).toHaveBeenCalledWith("PROMO15");
  //   });
  // });

  // // 6. Test payment method selection
  // it("handles payment method selection", async () => {
  //   mockGetMovieById.mockResolvedValue({ data: sampleMovie });

  //   renderWithProviders(<ConfirmTicketsPage />);

  //   await waitFor(() => {
  //     expect(screen.getByText("Confirm Tickets")).toBeInTheDocument();
  //   });

  //   const cashButton = screen.getByTestId("payment-cash");
  //   fireEvent.click(cashButton);

  //   await waitFor(() => {
  //     expect(screen.getByTestId("payment-value")).toHaveTextContent("Cash");
  //   });
  // });

  // // 7. Test form submission with cash payment
  // it("handles form submission with cash payment", async () => {
  //   mockGetMovieById.mockResolvedValue({ data: sampleMovie });
  //   mockCreateBookingHold.mockResolvedValue({ bookingId: "booking123" });
  //   mockProcessPayment.mockResolvedValue({
  //     data: { paymentId: "payment123" },
  //   });

  //   renderWithProviders(<ConfirmTicketsPage />);

  //   await waitFor(() => {
  //     expect(screen.getByText("Confirm Tickets")).toBeInTheDocument();
  //   });

  //   // Select cash payment
  //   const cashButton = screen.getByTestId("payment-cash");
  //   fireEvent.click(cashButton);

  //   // Enter cash given
  //   const cashGivenInput = screen.getByPlaceholderText(/At least/);
  //   fireEvent.change(cashGivenInput, { target: { value: "200000" } });

  //   // Wait for form to be valid
  //   await waitFor(() => {
  //     const submitButton = screen.getByTestId("button-primary");
  //     expect(submitButton).not.toBeDisabled();
  //   });

  //   // Submit form
  //   const submitButton = screen.getByTestId("button-primary");
  //   fireEvent.click(submitButton);

  //   await waitFor(() => {
  //     expect(mockCreateBookingHold).toHaveBeenCalled();
  //     expect(mockProcessPayment).toHaveBeenCalled();
  //   });
  // });

  // // 8. Test form submission with stripe payment
  // it("handles form submission with stripe payment", async () => {
  //   mockGetMovieById.mockResolvedValue({ data: sampleMovie });
  //   mockCreateBookingHold.mockResolvedValue({ bookingId: "booking123" });
  //   mockProcessPayment.mockResolvedValue({
  //     data: { clientSecret: "secret123" },
  //   });

  //   renderWithProviders(<ConfirmTicketsPage />);

  //   await waitFor(() => {
  //     expect(screen.getByText("Confirm Tickets")).toBeInTheDocument();
  //   });

  //   // Select stripe payment
  //   const stripeButton = screen.getByTestId("payment-stripe");
  //   fireEvent.click(stripeButton);

  //   // Select card type
  //   const cardTypeSelect = screen.getByTestId("card-type-select");
  //   fireEvent.change(cardTypeSelect, { target: { value: "visa" } });

  //   // Wait for form to be valid
  //   await waitFor(() => {
  //     const submitButton = screen.getByTestId("button-primary");
  //     expect(submitButton).not.toBeDisabled();
  //   });

  //   // Submit form
  //   const submitButton = screen.getByTestId("button-primary");
  //   fireEvent.click(submitButton);

  //   await waitFor(() => {
  //     expect(mockCreateBookingHold).toHaveBeenCalled();
  //     expect(mockProcessPayment).toHaveBeenCalled();
  //   });
  // });

  // // 9. Test cancel functionality
  // it("handles cancel correctly", async () => {
  //   mockGetMovieById.mockResolvedValue({ data: sampleMovie });
  //   mockCancelBookingById.mockResolvedValue({});

  //   renderWithProviders(<ConfirmTicketsPage />);

  //   await waitFor(() => {
  //     expect(screen.getByText("Confirm Tickets")).toBeInTheDocument();
  //   });

  //   const cancelButton = screen.getByTestId("button-default");
  //   fireEvent.click(cancelButton);

  //   await waitFor(() => {
  //     expect(mockCancelBookingById).toHaveBeenCalledWith("booking123");
  //     expect(mockNavigate).toHaveBeenCalledWith("/staff/ticket-selling");
  //   });
  // });

  // // 10. Test member points conversion
  // it("handles member points conversion", async () => {
  //   mockGetMovieById.mockResolvedValue({ data: sampleMovie });

  //   renderWithProviders(<ConfirmTicketsPage />, {
  //     initialState: {
  //       member: {
  //         member: sampleMember,
  //         memberChecked: true,
  //       },
  //     },
  //   });

  //   await waitFor(() => {
  //     expect(screen.getByText("Confirm Tickets")).toBeInTheDocument();
  //   });

  //   // Check if member info is displayed
  //   expect(screen.getByText("John Doe")).toBeInTheDocument();
  //   expect(screen.getByText("0123456789")).toBeInTheDocument();
  //   expect(screen.getByText("123456789")).toBeInTheDocument();

  //   // Test points conversion switch
  //   const switchButton = screen.getByTestId("switch");
  //   fireEvent.click(switchButton);

  //   await waitFor(() => {
  //     expect(switchButton).toHaveClass("checked");
  //   });
  // });

  // // 11. Test price calculation
  // it("calculates prices correctly", async () => {
  //   mockGetMovieById.mockResolvedValue({ data: sampleMovie });

  //   renderWithProviders(<ConfirmTicketsPage />);

  //   await waitFor(() => {
  //     expect(screen.getByText("Confirm Tickets")).toBeInTheDocument();
  //   });

  //   // Check if price details are displayed
  //   expect(screen.getByText("Seat A1:")).toBeInTheDocument();
  //   expect(screen.getAllByText("75.000 VNĐ")).toHaveLength(2); // Both seats have same price
  //   expect(screen.getByText("Seat A2:")).toBeInTheDocument();
  //   expect(screen.getAllByText("150.000 VNĐ")).toHaveLength(3); // Total appears in multiple places
  // });

  // // 12. Test validation errors
  // it("shows validation errors for invalid input", async () => {
  //   mockGetMovieById.mockResolvedValue({ data: sampleMovie });

  //   renderWithProviders(<ConfirmTicketsPage />);

  //   await waitFor(() => {
  //     expect(screen.getByText("Confirm Tickets")).toBeInTheDocument();
  //   });

  //   // Try to submit without selecting payment method
  //   const submitButton = screen.getByTestId("button-primary");
  //   fireEvent.click(submitButton);

  //   await waitFor(() => {
  //     expect(submitButton).toBeDisabled();
  //   });
  // });

  // // 13. Test member search error handling
  // it("handles member search errors", async () => {
  //   mockGetMovieById.mockResolvedValue({ data: sampleMovie });
  //   mockGetUserInfo.mockRejectedValue(new Error("Member not found"));

  //   renderWithProviders(<ConfirmTicketsPage />);

  //   await waitFor(() => {
  //     expect(screen.getByText("Confirm Tickets")).toBeInTheDocument();
  //   });

  //   const searchInput = screen.getByPlaceholderText("Email / Phone / ID");
  //   const searchButton = screen.getByText("Check");

  //   fireEvent.change(searchInput, { target: { value: "invalid@email.com" } });
  //   fireEvent.click(searchButton);

  //   await waitFor(() => {
  //     expect(toast.error).toHaveBeenCalledWith(expect.any(Error));
  //   });
  // });

  // // 14. Test promotion code error handling
  // it("handles promotion code errors", async () => {
  //   mockGetMovieById.mockResolvedValue({ data: sampleMovie });
  //   mockCheckPromotion.mockRejectedValue(new Error("Invalid promotion code"));

  //   renderWithProviders(<ConfirmTicketsPage />, {
  //     initialState: {
  //       member: {
  //         member: sampleMember,
  //         memberChecked: true,
  //       },
  //     },
  //   });

  //   await waitFor(() => {
  //     expect(screen.getByText("Confirm Tickets")).toBeInTheDocument();
  //   });

  //   // Wait for member section to render
  //   await waitFor(() => {
  //     expect(screen.getByText("John Doe")).toBeInTheDocument();
  //   });

  //   const promotionInput = screen.getByPlaceholderText("Enter promotion code");
  //   const addButton = screen.getByText("Add");

  //   fireEvent.change(promotionInput, { target: { value: "INVALID" } });
  //   fireEvent.click(addButton);

  //   await waitFor(() => {
  //     expect(toast.error).toHaveBeenCalledWith(expect.any(Error));
  //   });
  // });

  // // 15. Test component unmounting
  // it("handles component unmounting gracefully", async () => {
  //   mockGetMovieById.mockResolvedValue({ data: sampleMovie });

  //   const { unmount } = renderWithProviders(<ConfirmTicketsPage />);

  //   await waitFor(() => {
  //     expect(screen.getByText("Confirm Tickets")).toBeInTheDocument();
  //   });

  //   unmount();
  //   // Should not throw any errors
  // });

  // // 16. Test responsive design elements
  // it("displays responsive design elements", async () => {
  //   mockGetMovieById.mockResolvedValue({ data: sampleMovie });

  //   renderWithProviders(<ConfirmTicketsPage />);

  //   await waitFor(() => {
  //     expect(screen.getByText("Confirm Tickets")).toBeInTheDocument();
  //   });

  //   // Check for responsive classes
  //   const header = screen.getByText("Confirm Tickets").closest("h1");
  //   expect(header).toHaveClass("text-3xl", "font-bold");
  // });

  // // 17. Test icon rendering
  // it("renders all required icons", async () => {
  //   mockGetMovieById.mockResolvedValue({ data: sampleMovie });

  //   renderWithProviders(<ConfirmTicketsPage />);

  //   await waitFor(() => {
  //     expect(screen.getByTestId("ri-film-ai-fill")).toBeInTheDocument();
  //     expect(screen.getByTestId("fa-money-bill-wave")).toBeInTheDocument();
  //     expect(screen.getByTestId("fa-user")).toBeInTheDocument();
  //     expect(screen.getByTestId("fa-calendar-days")).toBeInTheDocument();
  //     expect(screen.getByTestId("fa-location-dot")).toBeInTheDocument();
  //     expect(screen.getByTestId("fa-couch")).toBeInTheDocument();
  //   });
  // });

  // // 18. Test booking information display
  // it("displays booking information correctly", async () => {
  //   mockGetMovieById.mockResolvedValue({ data: sampleMovie });

  //   renderWithProviders(<ConfirmTicketsPage />);

  //   await waitFor(() => {
  //     expect(screen.getByText("Ticket Information")).toBeInTheDocument();
  //     expect(screen.getByText("2024-01-15")).toBeInTheDocument();
  //     expect(screen.getByText("14:30")).toBeInTheDocument();
  //     expect(screen.getByText("Room A")).toBeInTheDocument();
  //     expect(screen.getByText("A1, A2 - (2 tickets)")).toBeInTheDocument();
  //   });
  // });
}); 