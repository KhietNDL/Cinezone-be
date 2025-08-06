/* eslint-disable no-undef */
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import TicketInformation from "./TicketInformation";
import sellingReducer from "../../../redux/features/sellingSlice";
import memberReducer from "../../../redux/features/memberSlice";

// Mock all dependencies
const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
  Link: ({ children, to }) => <a href={to}>{children}</a>,
}));

// Mock API functions
const mockCheckInfoBookingById = jest.fn();
const mockCancelBookingById = jest.fn();
const mockGetMovieById = jest.fn();
const mockConfirmPayment = jest.fn();
const mockGetUserByEmail = jest.fn();

jest.mock("../../../services/APIForStaff/API", () => ({
  checkInfoBookingById: (...args) => mockCheckInfoBookingById(...args),
  cancelBookingById: (...args) => mockCancelBookingById(...args),
  getMovieById: (...args) => mockGetMovieById(...args),
  confirmPayment: (...args) => mockConfirmPayment(...args),
  getUserByEmail: (...args) => mockGetUserByEmail(...args),
}));

jest.mock("react-toastify", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
    info: jest.fn(),
  },
}));

jest.mock("../component/BackButton", () => {
  return function MockBackButton() {
    return <button data-testid="back-button">Back</button>;
  };
});

jest.mock("../component/VersionCard", () => {
  return function MockVersionCard({ version, readonly }) {
    return <div data-testid="version-card" data-version={version} data-readonly={readonly}>{version}</div>;
  };
});

jest.mock("antd", () => ({
  ...jest.requireActual("antd"),
  Button: ({ children, onClick, type, size, icon, className, danger, color, variant }) => (
    <button
      onClick={onClick}
      type={type}
      size={size}
      className={className}
      data-danger={danger}
      data-color={color}
      data-variant={variant}
      data-testid="antd-button"
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
}));

jest.mock("@ant-design/icons", () => ({
  CheckCircleTwoTone: ({ twoToneColor, className }) => (
    <div data-testid="check-circle-two-tone" className={className} data-color={twoToneColor}>
      CheckCircleTwoTone
    </div>
  ),
  CloseCircleTwoTone: ({ twoToneColor, className }) => (
    <div data-testid="close-circle-two-tone" className={className} data-color={twoToneColor}>
      CloseCircleTwoTone
    </div>
  ),
}));

// Mock all react-icons
jest.mock("react-icons/fa6", () => ({
  FaTicket: () => <div data-testid="fa-ticket" />,
  FaCouch: () => <div data-testid="fa-couch" />,
  FaLocationDot: () => <div data-testid="fa-location-dot" />,
  FaUser: () => <div data-testid="fa-user" />,
  FaPhone: () => <div data-testid="fa-phone" />,
  FaCalendarDays: () => <div data-testid="fa-calendar-days" />,
  FaEnvelope: () => <div data-testid="fa-envelope" />,
  FaStar: () => <div data-testid="fa-star" />,
  FaFire: () => <div data-testid="fa-fire" />,
  FaX: () => <div data-testid="fa-x" />,
}));

jest.mock("react-icons/io5", () => ({
  IoReloadOutline: () => <div data-testid="io-reload-outline" />,
  IoTicketSharp: () => <div data-testid="io-ticket-sharp" />,
  IoTime: () => <div data-testid="io-time" />,
}));

jest.mock("react-icons/ri", () => ({
  RiFilmAiFill: () => <div data-testid="ri-film-ai-fill" />,
  RiMovie2AiFill: () => <div data-testid="ri-movie-2-ai-fill" />,
  RiDiscountPercentFill: () => <div data-testid="ri-discount-percent-fill" />,
}));

jest.mock("react-icons/fa", () => ({
  FaMoneyBillWave: () => <div data-testid="fa-money-bill-wave" />,
  FaIdCard: () => <div data-testid="fa-id-card" />,
  FaRegEye: () => <div data-testid="fa-reg-eye" />,
}));

// Sample data
const sampleMovie = {
  MovieId: "movie1",
  NameOfEnglish: "Avengers Endgame",
  NameOfVietnamese: "Biệt Đội Siêu Anh Hùng: Hồi Kết",
  PosterImage: "https://example.com/poster.jpg",
};

const sampleBookingData = {
  selectedMovie: sampleMovie,
  bookingId: "booking123",
  paymentId: "payment123",
  paymentMethod: "cash",
  discount: 10,
  visaResponse: null,
};

const sampleMember = {
  member: {
    id: "member123",
    fullName: "John Doe",
    phone: "0123456789",
    identityCard: "123456789",
    score: 500,
    email: "john@example.com",
  },
  memberChecked: true,
};

const sampleApiBookingData = {
  movieNameEnglish: "Avengers Endgame",
  movieNameVN: "Biệt Đội Siêu Anh Hùng: Hồi Kết",
  room: "Room A",
  showDate: "2024-01-15",
  showTime: "14:30",
  seats: ["A1", "A2"],
  seatPrices: { A1: 75000, A2: 75000 },
  totalPrice: 150000,
  TotalAmount: 135000,
  status: 2,
  buyerName: "John Doe",
  buyerPhone: "0123456789",
  versionType: "2D",
};

const sampleApiCustomerData = {
  users: [{
    FullName: "John Doe",
    CCCD: "123456789",
    Email: "john@example.com",
    ScoreBalance: 500,
  }],
};

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

// Mock URLSearchParams globally
const createMockURLSearchParams = (params = {}) => {
  return jest.fn().mockImplementation(() => ({
    get: jest.fn((key) => params[key] || null),
  }));
};

describe("TicketInformation", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "error").mockImplementation(() => {});
    jest.spyOn(console, "warn").mockImplementation(() => {});

    // Reset all mocks to default resolved values
    mockCheckInfoBookingById.mockResolvedValue(sampleApiBookingData);
    mockGetMovieById.mockResolvedValue({ data: sampleMovie });
    mockConfirmPayment.mockResolvedValue({});
    mockCancelBookingById.mockResolvedValue({});
    mockGetUserByEmail.mockResolvedValue(sampleApiCustomerData);

    // Mock window.history.replaceState
    Object.defineProperty(window, 'history', {
      value: {
        replaceState: jest.fn(),
      },
      writable: true
    });

    // Default URLSearchParams mock (no payment params)
    global.URLSearchParams = createMockURLSearchParams({});
  });

  afterEach(() => {
    console.error.mockRestore();
    console.warn.mockRestore();
  });

  // 1. Test initial loading state
  it("shows loading spinner initially", () => {
    renderWithProviders(<TicketInformation />);
    expect(screen.getByTestId("spin")).toBeInTheDocument();
  });

  // 2. Test successful MOMO payment
  it("handles successful MOMO payment", async () => {
    global.URLSearchParams = createMockURLSearchParams({
      resultCode: "0",
      bookingId: "booking123",
      paymentId: "payment123",
    });

    renderWithProviders(<TicketInformation />);

    await waitFor(() => {
      expect(screen.getByText("Payment Successful")).toBeInTheDocument();
    }, { timeout: 3000 });

    expect(mockConfirmPayment).toHaveBeenCalledWith("payment123");
    expect(toast.success).toHaveBeenCalledWith("MoMo payment successful!");
    expect(screen.getByTestId("check-circle-two-tone")).toBeInTheDocument();
  });

  // 3. Test failed MOMO payment
  it("handles failed MOMO payment", async () => {
    global.URLSearchParams = createMockURLSearchParams({
      resultCode: "1",
      bookingId: "booking123",
      paymentId: "payment123",
    });

    renderWithProviders(<TicketInformation />);

    await waitFor(() => {
      expect(screen.getByText("Payment Failed")).toBeInTheDocument();
    }, { timeout: 3000 });

    expect(toast.error).toHaveBeenCalledWith("MoMo payment failed!");
    expect(screen.getByTestId("close-circle-two-tone")).toBeInTheDocument();
  });

  // 4. Test successful ZaloPay payment
  it("handles successful ZaloPay payment", async () => {
    global.URLSearchParams = createMockURLSearchParams({
      status: "1",
      bookingId: "booking123",
      paymentId: "payment123",
    });

    renderWithProviders(<TicketInformation />);

    await waitFor(() => {
      expect(screen.getByText("Payment Successful")).toBeInTheDocument();
    }, { timeout: 3000 });

    expect(mockConfirmPayment).toHaveBeenCalledWith("payment123");
    expect(toast.success).toHaveBeenCalledWith("ZaloPay payment successful!");
  });

  // 5. Test failed ZaloPay payment
  it("handles failed ZaloPay payment", async () => {
    global.URLSearchParams = createMockURLSearchParams({
      status: "0",
      bookingId: "booking123",
      paymentId: "payment123",
    });

    renderWithProviders(<TicketInformation />);

    await waitFor(() => {
      expect(screen.getByText("Payment Failed")).toBeInTheDocument();
    }, { timeout: 3000 });

    expect(toast.error).toHaveBeenCalledWith("ZaloPay payment failed!");
  });

  // 6. Test successful VISA payment
  it("handles successful VISA payment", async () => {
    global.URLSearchParams = createMockURLSearchParams({
      bookingId: "booking123",
      paymentId: "payment123",
    });

    renderWithProviders(<TicketInformation />, {
      initialState: {
        selling: {
          ...sampleBookingData,
          visaResponse: { status: "succeeded" },
        },
      },
    });

    await waitFor(() => {
      expect(screen.getByText("Payment Successful")).toBeInTheDocument();
    }, { timeout: 3000 });

    expect(mockConfirmPayment).toHaveBeenCalledWith("payment123");
    expect(toast.success).toHaveBeenCalledWith("Stripe payment successful!");
  });

  // 7. Test payment failed due to booking status
  it("handles payment failed when booking status is not successful", async () => {
    mockCheckInfoBookingById.mockResolvedValue({
      ...sampleApiBookingData,
      status: 1, // Failed status
    });

    global.URLSearchParams = createMockURLSearchParams({
      bookingId: "booking123",
      paymentId: "payment123",
    });

    renderWithProviders(<TicketInformation />);

    await waitFor(() => {
      expect(screen.getByText("Payment Failed")).toBeInTheDocument();
    }, { timeout: 3000 });

    expect(toast.error).toHaveBeenCalledWith("Payment failed!");
  });

  // 8. Test movie information display
  it("displays movie information correctly", async () => {
    global.URLSearchParams = createMockURLSearchParams({
      resultCode: "0",
      bookingId: "booking123",
      paymentId: "payment123",
    });

    renderWithProviders(<TicketInformation />);

    await waitFor(() => {
      expect(screen.getByText("Payment Successful")).toBeInTheDocument();
    }, { timeout: 3000 });

    expect(screen.getByText("Avengers Endgame")).toBeInTheDocument();
    expect(screen.getByText("(Biệt Đội Siêu Anh Hùng: Hồi Kết)")).toBeInTheDocument();
    expect(screen.getByText("Room A")).toBeInTheDocument();
    expect(screen.getByText("2024-01-15")).toBeInTheDocument();
    expect(screen.getByText("14:30")).toBeInTheDocument();
    expect(screen.getByText("A1, A2")).toBeInTheDocument();
  });

  // 9. Test payment details display
  it("displays payment details correctly", async () => {
    global.URLSearchParams = createMockURLSearchParams({
      resultCode: "0",
      bookingId: "booking123",
      paymentId: "payment123",
    });

    renderWithProviders(<TicketInformation />);

    await waitFor(() => {
      expect(screen.getByText("Payment Successful")).toBeInTheDocument();
    }, { timeout: 3000 });

    expect(screen.getByText("Payment Details")).toBeInTheDocument();
    expect(screen.getByText("cash")).toBeInTheDocument();
    expect(screen.getByText("150.000 VNĐ")).toBeInTheDocument();
    expect(screen.getByText("135.000 VNĐ")).toBeInTheDocument();
  });

  // 10. Test customer information display with member data
  it("displays customer information with member data", async () => {
    global.URLSearchParams = createMockURLSearchParams({
      resultCode: "0",
      bookingId: "booking123",
      paymentId: "payment123",
    });

    renderWithProviders(<TicketInformation />, {
      initialState: {
        member: sampleMember,
      },
    });

    await waitFor(() => {
      expect(screen.getByText("Payment Successful")).toBeInTheDocument();
    }, { timeout: 3000 });

    expect(screen.getByText("Customer Information")).toBeInTheDocument();
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("123456789")).toBeInTheDocument();
    expect(screen.getByText("0123456789")).toBeInTheDocument();
    expect(screen.getByText("john@example.com")).toBeInTheDocument();
    expect(screen.getByText("500")).toBeInTheDocument();
  });

  // 11. Test try again button functionality
  it("handles try again button click for failed payment", async () => {
    global.URLSearchParams = createMockURLSearchParams({
      resultCode: "1",
      bookingId: "booking123",
      paymentId: "payment123",
    });

    renderWithProviders(<TicketInformation />);

    await waitFor(() => {
      expect(screen.getByText("Payment Failed")).toBeInTheDocument();
    }, { timeout: 3000 });

    const tryAgainButton = screen.getByText("Try Again");
    fireEvent.click(tryAgainButton);

    await waitFor(() => {
      expect(mockCancelBookingById).toHaveBeenCalledWith("booking123");
      expect(toast.info).toHaveBeenCalledWith("Previous booking cancelled. Please try again.");
      expect(mockNavigate).toHaveBeenCalledWith("/staff/ticket-selling/confirm-ticket");
    });
  });

  // 12. Test close button functionality
  it("handles close button click for failed payment", async () => {
    global.URLSearchParams = createMockURLSearchParams({
      resultCode: "1",
      bookingId: "booking123",
      paymentId: "payment123",
    });

    renderWithProviders(<TicketInformation />);

    await waitFor(() => {
      expect(screen.getByText("Payment Failed")).toBeInTheDocument();
    }, { timeout: 3000 });

    const closeButton = screen.getByText("Close");
    fireEvent.click(closeButton);

    await waitFor(() => {
      expect(mockCancelBookingById).toHaveBeenCalledWith("booking123");
      expect(toast.success).toHaveBeenCalledWith("Booking cancelled.");
      expect(mockNavigate).toHaveBeenCalledWith("/staff/ticket-selling");
    });
  });

  // 13. Test new ticket button functionality for successful payment
  it("handles new ticket button click for successful payment", async () => {
    global.URLSearchParams = createMockURLSearchParams({
      resultCode: "0",
      bookingId: "booking123",
      paymentId: "payment123",
    });

    renderWithProviders(<TicketInformation />);

    await waitFor(() => {
      expect(screen.getByText("Payment Successful")).toBeInTheDocument();
    }, { timeout: 3000 });

    const newTicketButton = screen.getByText("New Ticket");
    fireEvent.click(newTicketButton);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/staff/ticket-selling", { replace: true });
    });
  });

  // 14. Test view ticket link for successful payment
  it("displays view ticket link for successful payment", async () => {
    global.URLSearchParams = createMockURLSearchParams({
      resultCode: "0",
      bookingId: "booking123",
      paymentId: "payment123",
    });

    renderWithProviders(<TicketInformation />);

    await waitFor(() => {
      expect(screen.getByText("Payment Successful")).toBeInTheDocument();
    }, { timeout: 3000 });

    const viewTicketLink = screen.getByText("View Ticket");
    expect(viewTicketLink).toBeInTheDocument();
    expect(viewTicketLink.closest("a")).toHaveAttribute("href", "/staff/ticket-selling/view-ticket/booking123");
  });

  // 15. Test API error handling
  it("handles API errors gracefully", async () => {
    mockCheckInfoBookingById.mockRejectedValue(new Error("API Error"));

    global.URLSearchParams = createMockURLSearchParams({
      bookingId: "booking123",
      paymentId: "payment123",
    });

    renderWithProviders(<TicketInformation />);

    await waitFor(() => {
      expect(screen.getByText("Payment Failed")).toBeInTheDocument();
    }, { timeout: 3000 });

    expect(toast.error).toHaveBeenCalledWith("API Error");
  });

  // 16. Test redirect when no booking data
  it("redirects when no booking data is found", async () => {
    renderWithProviders(<TicketInformation />, {
      initialState: {
        selling: { selectedMovie: null },
      },
    });

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/staff/ticket-selling");
    });
  });

  // 17. Test no customer information display
  it("displays no customer information when member is not checked", async () => {
    global.URLSearchParams = createMockURLSearchParams({
      resultCode: "0",
      bookingId: "booking123",
      paymentId: "payment123",
    });

    renderWithProviders(<TicketInformation />, {
      initialState: {
        member: {
          member: null,
          memberChecked: false,
        },
      },
    });

    await waitFor(() => {
      expect(screen.getByText("Payment Successful")).toBeInTheDocument();
    }, { timeout: 3000 });

    expect(screen.getByText("Customer Information")).toBeInTheDocument();
    expect(screen.getByText("No customer information")).toBeInTheDocument();
  });

  // 18. Test extraData parsing
  // it("handles extraData parsing for booking and payment IDs", async () => {
  //   const extraData = encodeURIComponent(JSON.stringify({
  //     bookingId: "booking456",
  //     paymentId: "payment456",
  //   }));

  //   global.URLSearchParams = createMockURLSearchParams({
  //     resultCode: "0",
  //     extraData: extraData,
  //   });

  //   renderWithProviders(<TicketInformation />);

  //   await waitFor(() => {
  //     expect(screen.getByText("Payment Successful")).toBeInTheDocument();
  //   }, { timeout: 3000 });

  //   expect(mockCheckInfoBookingById).toHaveBeenCalledWith("booking456");
  //   expect(mockConfirmPayment).toHaveBeenCalledWith("payment456");
  // });
});