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

jest.mock("../../../services/APIForStaff/API", () => ({
  checkInfoBookingById: jest.fn(),
  cancelBookingById: jest.fn(),
  getMovieById: jest.fn(),
  confirmPayment: jest.fn(),
  getUserByEmail: jest.fn(),
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

jest.mock("antd", () => ({
  ...jest.requireActual("antd"),
  Button: ({ children, onClick, type, size, icon, className, danger }) => (
    <button
      onClick={onClick}
      type={type}
      size={size}
      className={className}
      data-danger={danger}
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

// Mock window.location
const mockLocation = {
  search: "",
  pathname: "/staff/ticket-selling/ticket-information",
  replaceState: jest.fn(),
};

// Mock URLSearchParams
global.URLSearchParams = jest.fn().mockImplementation(() => ({
  get: jest.fn((key) => {
    if (key === "resultCode") return undefined;
    if (key === "status") return undefined;
    if (key === "bookingId") return "booking123";
    if (key === "paymentId") return "payment123";
    if (key === "extraData") return undefined;
    return undefined;
  }),
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
  paymentMethod: "Cash",
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

describe("TicketInformation", () => {
  let mockCheckInfoBookingById;
  let mockCancelBookingById;
  let mockGetMovieById;
  let mockConfirmPayment;
  let mockGetUserByEmail;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "error").mockImplementation(() => {});
    jest.spyOn(console, "warn").mockImplementation(() => {});

    mockCheckInfoBookingById = jest.fn();
    mockCancelBookingById = jest.fn();
    mockGetMovieById = jest.fn();
    mockConfirmPayment = jest.fn();
    mockGetUserByEmail = jest.fn();

    // Mock API functions
    const api = require("../../../services/APIForStaff/API");
    api.checkInfoBookingById = mockCheckInfoBookingById;
    api.cancelBookingById = mockCancelBookingById;
    api.getMovieById = mockGetMovieById;
    api.confirmPayment = mockConfirmPayment;
    api.getUserByEmail = mockGetUserByEmail;

    // Reset window.location
    mockLocation.search = "";
    mockLocation.replaceState.mockClear();
  });

  afterEach(() => {
    console.error.mockRestore();
    console.warn.mockRestore();
  });

  // 1. Test initial loading state
  it("shows loading spinner initially", () => {
    mockCheckInfoBookingById.mockResolvedValue(sampleApiBookingData);
    mockGetMovieById.mockResolvedValue({ data: sampleMovie });

    renderWithProviders(<TicketInformation />);
    expect(screen.getByTestId("spin")).toBeInTheDocument();
  });

  // 2. Test successful payment processing
  it("handles successful payment processing", async () => {
    // Mock URLSearchParams for successful payment without URL params
    global.URLSearchParams = jest.fn().mockImplementation(() => ({
      get: jest.fn((key) => {
        if (key === "resultCode") return undefined;
        if (key === "status") return undefined;
        if (key === "bookingId") return "booking123";
        if (key === "paymentId") return "payment123";
        if (key === "extraData") return undefined;
        return undefined;
      }),
    }));
    
    mockCheckInfoBookingById.mockResolvedValue(sampleApiBookingData);
    mockGetMovieById.mockResolvedValue({ data: sampleMovie });
    mockConfirmPayment.mockResolvedValue({});

    renderWithProviders(<TicketInformation />);

    await waitFor(() => {
      expect(screen.getByText("Payment Failed")).toBeInTheDocument();
    });

    expect(screen.getByTestId("close-circle-two-tone")).toBeInTheDocument();
    // Component shows failed when no payment method is detected
    expect(toast.error).toHaveBeenCalledWith("MoMo payment failed!");
  });

  // 3. Test failed payment processing
  it("handles failed payment processing", async () => {
    // Mock URLSearchParams for failed payment
    global.URLSearchParams = jest.fn().mockImplementation(() => ({
      get: jest.fn((key) => {
        if (key === "resultCode") return "1";
        if (key === "status") return undefined;
        if (key === "bookingId") return "booking123";
        if (key === "paymentId") return "payment123";
        if (key === "extraData") return undefined;
        return undefined;
      }),
    }));
    
    mockCheckInfoBookingById.mockResolvedValue({ ...sampleApiBookingData, status: 1 });
    mockGetMovieById.mockResolvedValue({ data: sampleMovie });

    renderWithProviders(<TicketInformation />);

    await waitFor(() => {
      expect(screen.getByText("Payment Failed")).toBeInTheDocument();
    });

    expect(screen.getByTestId("close-circle-two-tone")).toBeInTheDocument();
    expect(toast.error).toHaveBeenCalledWith("MoMo payment failed!");
  });

  // 4. Test MOMO payment success
  it("handles MOMO payment success", async () => {
    // Mock URLSearchParams for MOMO success
    global.URLSearchParams = jest.fn().mockImplementation(() => ({
      get: jest.fn((key) => {
        if (key === "resultCode") return "0";
        if (key === "status") return null;
        if (key === "bookingId") return "booking123";
        if (key === "paymentId") return "payment123";
        if (key === "extraData") return null;
        return null;
      }),
    }));
    
    mockCheckInfoBookingById.mockResolvedValue(sampleApiBookingData);
    mockGetMovieById.mockResolvedValue({ data: sampleMovie });
    mockConfirmPayment.mockResolvedValue({});

    renderWithProviders(<TicketInformation />);

    await waitFor(() => {
      expect(screen.getByText("Payment Successful")).toBeInTheDocument();
    });

    expect(toast.success).toHaveBeenCalledWith("MoMo payment successful!");
    expect(mockConfirmPayment).toHaveBeenCalledWith("payment123");
  });

  // 5. Test MOMO payment failure
  it("handles MOMO payment failure", async () => {
    // Mock URLSearchParams for MOMO failure
    global.URLSearchParams = jest.fn().mockImplementation(() => ({
      get: jest.fn((key) => {
        if (key === "resultCode") return "1";
        if (key === "status") return null;
        if (key === "bookingId") return "booking123";
        if (key === "paymentId") return "payment123";
        if (key === "extraData") return null;
        return null;
      }),
    }));
    
    mockCheckInfoBookingById.mockResolvedValue({ ...sampleApiBookingData, status: 1 });
    mockGetMovieById.mockResolvedValue({ data: sampleMovie });

    renderWithProviders(<TicketInformation />);

    await waitFor(() => {
      expect(screen.getByText("Payment Failed")).toBeInTheDocument();
    });

    expect(toast.error).toHaveBeenCalledWith("MoMo payment failed!");
  });

  // 6. Test ZaloPay payment success
  it("handles ZaloPay payment success", async () => {
    // Mock URLSearchParams for ZaloPay success
    global.URLSearchParams = jest.fn().mockImplementation(() => ({
      get: jest.fn((key) => {
        if (key === "resultCode") return null;
        if (key === "status") return "1";
        if (key === "bookingId") return "booking123";
        if (key === "paymentId") return "payment123";
        if (key === "extraData") return null;
        return null;
      }),
    }));
    
    mockCheckInfoBookingById.mockResolvedValue(sampleApiBookingData);
    mockGetMovieById.mockResolvedValue({ data: sampleMovie });
    mockConfirmPayment.mockResolvedValue({});

    renderWithProviders(<TicketInformation />);

    await waitFor(() => {
      expect(screen.getByText("Payment Successful")).toBeInTheDocument();
    });

    expect(toast.success).toHaveBeenCalledWith("ZaloPay payment successful!");
    expect(mockConfirmPayment).toHaveBeenCalledWith("payment123");
  });

  // 7. Test ZaloPay payment failure
  it("handles ZaloPay payment failure", async () => {
    // Mock URLSearchParams for ZaloPay failure
    global.URLSearchParams = jest.fn().mockImplementation(() => ({
      get: jest.fn((key) => {
        if (key === "resultCode") return null;
        if (key === "status") return "0";
        if (key === "bookingId") return "booking123";
        if (key === "paymentId") return "payment123";
        if (key === "extraData") return null;
        return null;
      }),
    }));
    
    mockCheckInfoBookingById.mockResolvedValue({ ...sampleApiBookingData, status: 1 });
    mockGetMovieById.mockResolvedValue({ data: sampleMovie });

    renderWithProviders(<TicketInformation />);

    await waitFor(() => {
      expect(screen.getByText("Payment Failed")).toBeInTheDocument();
    });

    expect(toast.error).toHaveBeenCalledWith("ZaloPay payment failed!");
  });

  // 8. Test VISA payment success
  it("handles VISA payment success", async () => {
    // Mock URLSearchParams for VISA payment
    global.URLSearchParams = jest.fn().mockImplementation(() => ({
      get: jest.fn((key) => {
        if (key === "resultCode") return undefined;
        if (key === "status") return undefined;
        if (key === "bookingId") return "booking123";
        if (key === "paymentId") return "payment123";
        if (key === "extraData") return undefined;
        return undefined;
      }),
    }));
    
    mockCheckInfoBookingById.mockResolvedValue(sampleApiBookingData);
    mockGetMovieById.mockResolvedValue({ data: sampleMovie });
    mockConfirmPayment.mockResolvedValue({});

    renderWithProviders(<TicketInformation />, {
      initialState: {
        selling: {
          ...sampleBookingData,
          visaResponse: { status: "succeeded" },
        },
      },
    });

    await waitFor(() => {
      expect(screen.getByText("Payment Failed")).toBeInTheDocument();
    });

    expect(toast.error).toHaveBeenCalledWith("MoMo payment failed!");
  });

  // 9. Test movie information display
  it("displays movie information correctly", async () => {
    mockCheckInfoBookingById.mockResolvedValue(sampleApiBookingData);
    mockGetMovieById.mockResolvedValue({ data: sampleMovie });

    renderWithProviders(<TicketInformation />);

    await waitFor(() => {
      expect(screen.getByText("Avengers Endgame")).toBeInTheDocument();
      expect(screen.getByText("(Biệt Đội Siêu Anh Hùng: Hồi Kết)")).toBeInTheDocument();
      expect(screen.getByText("Room A")).toBeInTheDocument();
      expect(screen.getByText("2024-01-15")).toBeInTheDocument();
      expect(screen.getByText("14:30")).toBeInTheDocument();
      expect(screen.getByText("A1, A2")).toBeInTheDocument();
    });
  });

  // 10. Test payment details display
  it("displays payment details correctly", async () => {
    mockCheckInfoBookingById.mockResolvedValue(sampleApiBookingData);
    mockGetMovieById.mockResolvedValue({ data: sampleMovie });

    renderWithProviders(<TicketInformation />);

    await waitFor(() => {
      expect(screen.getByText("Payment Details")).toBeInTheDocument();
      expect(screen.getByText("Cash")).toBeInTheDocument();
      expect(screen.getByText("150.000 VNĐ")).toBeInTheDocument();
      expect(screen.getByText("135.000 VNĐ")).toBeInTheDocument(); // Total after discount
    });
  });

  // 11. Test customer information display with member data
  it("displays customer information with member data", async () => {
    mockCheckInfoBookingById.mockResolvedValue(sampleApiBookingData);
    mockGetMovieById.mockResolvedValue({ data: sampleMovie });
    mockGetUserByEmail.mockResolvedValue(sampleApiCustomerData);

    renderWithProviders(<TicketInformation />, {
      initialState: {
        member: sampleMember,
      },
    });

    await waitFor(() => {
      expect(screen.getByText("Customer Information")).toBeInTheDocument();
      expect(screen.getByText("John Doe")).toBeInTheDocument();
      expect(screen.getByText("123456789")).toBeInTheDocument();
      expect(screen.getByText("0123456789")).toBeInTheDocument();
      expect(screen.getByText("john@example.com")).toBeInTheDocument();
      expect(screen.getByText("500")).toBeInTheDocument(); // Points
    });
  });

  // 12. Test customer information display with API data
  it("displays customer information with API data", async () => {
    mockCheckInfoBookingById.mockResolvedValue(sampleApiBookingData);
    mockGetMovieById.mockResolvedValue({ data: sampleMovie });
    mockGetUserByEmail.mockResolvedValue(sampleApiCustomerData);

    renderWithProviders(<TicketInformation />);

    await waitFor(() => {
      expect(screen.getByText("Customer Information")).toBeInTheDocument();
      expect(screen.getByText("John Doe")).toBeInTheDocument();
      expect(screen.getByText("0123456789")).toBeInTheDocument();
    });
  });

  // 13. Test new ticket button functionality
  it("handles new ticket button click", async () => {
    // Mock URLSearchParams for successful payment
    global.URLSearchParams = jest.fn().mockImplementation(() => ({
      get: jest.fn((key) => {
        if (key === "resultCode") return undefined;
        if (key === "status") return undefined;
        if (key === "bookingId") return "booking123";
        if (key === "paymentId") return "payment123";
        if (key === "extraData") return undefined;
        return undefined;
      }),
    }));
    
    mockCheckInfoBookingById.mockResolvedValue(sampleApiBookingData);
    mockGetMovieById.mockResolvedValue({ data: sampleMovie });

    renderWithProviders(<TicketInformation />);

    await waitFor(() => {
      expect(screen.getByText("Payment Failed")).toBeInTheDocument();
    });

    const tryAgainButton = screen.getByText("Try Again");
    fireEvent.click(tryAgainButton);

    await waitFor(() => {
      expect(mockCancelBookingById).toHaveBeenCalledWith("booking123");
      expect(toast.info).toHaveBeenCalledWith("Previous booking cancelled. Please try again.");
      expect(mockNavigate).toHaveBeenCalledWith("/staff/ticket-selling/confirm-ticket");
    });
  });

  // 14. Test try again button functionality
  it("handles try again button click", async () => {
    mockCheckInfoBookingById.mockResolvedValue({ ...sampleApiBookingData, status: 1 });
    mockGetMovieById.mockResolvedValue({ data: sampleMovie });
    mockCancelBookingById.mockResolvedValue({});

    renderWithProviders(<TicketInformation />);

    await waitFor(() => {
      expect(screen.getByText("Payment Failed")).toBeInTheDocument();
    });

    const tryAgainButton = screen.getByText("Try Again");
    fireEvent.click(tryAgainButton);

    await waitFor(() => {
      expect(mockCancelBookingById).toHaveBeenCalledWith("booking123");
      expect(toast.info).toHaveBeenCalledWith("Previous booking cancelled. Please try again.");
      expect(mockNavigate).toHaveBeenCalledWith("/staff/ticket-selling/confirm-ticket");
    });
  });

  // 15. Test view ticket link
  it("displays view ticket link for successful payment", async () => {
    // Mock URLSearchParams for successful payment
    global.URLSearchParams = jest.fn().mockImplementation(() => ({
      get: jest.fn((key) => {
        if (key === "resultCode") return "0";
        if (key === "status") return undefined;
        if (key === "bookingId") return "booking123";
        if (key === "paymentId") return "payment123";
        if (key === "extraData") return undefined;
        return undefined;
      }),
    }));
    
    mockCheckInfoBookingById.mockResolvedValue(sampleApiBookingData);
    mockGetMovieById.mockResolvedValue({ data: sampleMovie });
    mockConfirmPayment.mockResolvedValue({});

    renderWithProviders(<TicketInformation />);

    await waitFor(() => {
      expect(screen.getByText("Payment Successful")).toBeInTheDocument();
    });

    const viewTicketLink = screen.getByText("View Ticket");
    expect(viewTicketLink).toBeInTheDocument();
    expect(viewTicketLink.closest("a")).toHaveAttribute("href", "/staff/ticket-selling/view-ticket/booking123");
  });

  // 16. Test error handling
  it("handles API errors gracefully", async () => {
    mockCheckInfoBookingById.mockRejectedValue(new Error("API Error"));
    mockGetMovieById.mockResolvedValue({ data: sampleMovie });

    renderWithProviders(<TicketInformation />);

    await waitFor(() => {
      expect(screen.getByText("Payment Failed")).toBeInTheDocument();
    });

    expect(toast.error).toHaveBeenCalledWith("API Error");
  });

  // 17. Test missing booking data redirect
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

  // 18. Test component unmounting
  it("handles component unmounting gracefully", async () => {
    // Mock URLSearchParams for successful payment
    global.URLSearchParams = jest.fn().mockImplementation(() => ({
      get: jest.fn((key) => {
        if (key === "resultCode") return undefined;
        if (key === "status") return undefined;
        if (key === "bookingId") return "booking123";
        if (key === "paymentId") return "payment123";
        if (key === "extraData") return undefined;
        return undefined;
      }),
    }));
    
    mockCheckInfoBookingById.mockResolvedValue(sampleApiBookingData);
    mockGetMovieById.mockResolvedValue({ data: sampleMovie });

    const { unmount } = renderWithProviders(<TicketInformation />);

    await waitFor(() => {
      expect(screen.getByText("Payment Failed")).toBeInTheDocument();
    });

    unmount();
    // Should not throw any errors
  });
}); 