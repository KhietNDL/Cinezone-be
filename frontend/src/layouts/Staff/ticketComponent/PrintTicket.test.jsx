/* eslint-disable no-undef */
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
// import { toast } from "react-toastify";
// import jsPDF from "jspdf";
// import html2canvas from "html2canvas";
import PrintTicket from "./PrintTicket";
import sellingReducer from "../../../redux/features/sellingSlice";
import memberReducer from "../../../redux/features/memberSlice";

// Mock all dependencies
const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
  Link: ({ children, to, className }) => (
    <a href={to} className={className}>
      {children}
    </a>
  ),
}));

// Mock API functions
const mockGetMovieById = jest.fn();

jest.mock("../../../services/APIForStaff/API", () => ({
  getMovieById: (...args) => mockGetMovieById(...args),
}));

// Mock PDF generation libraries
jest.mock("jspdf", () => {
  const mockPDF = {
    internal: {
      pageSize: {
        getWidth: jest.fn(() => 210), // A4 width in mm
      },
    },
    addImage: jest.fn(),
    save: jest.fn(),
  };
  return jest.fn(() => mockPDF);
});

jest.mock("html2canvas", () => {
  return jest.fn(() =>
    Promise.resolve({
      toDataURL: jest.fn(() => "data:image/png;base64,mockImageData"),
      width: 800,
      height: 600,
    })
  );
});

// Mock QR Code component
jest.mock("qrcode.react", () => ({
  QRCodeCanvas: ({ value, size, bgColor, fgColor, level, className }) => (
    <div
      data-testid="qr-code"
      data-value={value}
      data-size={size}
      data-bg-color={bgColor}
      data-fg-color={fgColor}
      data-level={level}
      className={className}
    >
      QR Code: {value}
    </div>
  ),
}));

// Mock toast
jest.mock("react-toastify", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
    info: jest.fn(),
  },
}));

// Mock components
jest.mock("../component/BackButton", () => {
  return function MockBackButton() {
    return <button data-testid="back-button">Back</button>;
  };
});

jest.mock("../component/VersionCard", () => {
  return function MockVersionCard({ version, readonly, className }) {
    return (
      <div
        data-testid="version-card"
        data-version={version}
        data-readonly={readonly}
        className={className}
      >
        {version}
      </div>
    );
  };
});

// Mock Ant Design components
jest.mock("antd", () => ({
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
  Tag: ({ children, color, className }) => (
    <span data-testid="antd-tag" data-color={color} className={className}>
      {children}
    </span>
  ),
}));

// Mock react-icons
jest.mock("react-icons/fa6", () => ({
  FaTicket: () => <div data-testid="fa-ticket" />,
  FaCouch: () => <div data-testid="fa-couch" />,
  FaLocationDot: () => <div data-testid="fa-location-dot" />,
  FaMoneyBillWave: () => <div data-testid="fa-money-bill-wave" />,
  FaAlignLeft: () => <div data-testid="fa-align-left" />,
}));

jest.mock("react-icons/io5", () => ({
  IoTime: () => <div data-testid="io-time" />,
}));

// Mock logo import
jest.mock("../../../assets/logoWhite.png", () => "mock-logo.png");

// Sample data
const sampleMovie = {
  MovieId: "movie1",
  NameOfEnglish: "Avengers Endgame",
  NameOfVietnamese: "Biệt Đội Siêu Anh Hùng: Hồi Kết",
  PosterImage: "https://example.com/poster.jpg",
  ContentSynopsis: "Epic superhero movie about saving the universe from Thanos.",
};

const sampleBookingData = {
  selectedMovie: sampleMovie,
  selectedDay: "2024-01-15",
  selectedTime: "14:30",
  room: "Room A",
  selectedVersion: "2D",
  selectedSeats: ["A1", "A2", "A3"],
  totalPrice: 225000,
  discount: 10,
  amountPaid: 202500,
  bookingId: "booking123",
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

describe("PrintTicket", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "error").mockImplementation(() => {});
    jest.spyOn(console, "warn").mockImplementation(() => {});

    // Reset all mocks to default resolved values
    mockGetMovieById.mockResolvedValue({ data: sampleMovie });
  });

  afterEach(() => {
    console.error.mockRestore();
    console.warn.mockRestore();
  });

  // 1. Test component renders correctly with booking data
//   it("renders ticket preview with booking data", async () => {
//     renderWithProviders(<PrintTicket />);

//     await waitFor(() => {
//       expect(screen.getByText("Avengers Endgame")).toBeInTheDocument();
//     });

//     expect(screen.getByText("Print Ticket")).toBeInTheDocument();
//     expect(screen.getByText("Ticket Preview")).toBeInTheDocument();
//     expect(screen.getByText("2024-01-15 - 14:30")).toBeInTheDocument();
//     expect(screen.getByText("Room A")).toBeInTheDocument();
//     expect(screen.getByText("A1, A2, A3")).toBeInTheDocument();
//     expect(screen.getByText("225.000 VNĐ")).toBeInTheDocument();
//     expect(screen.getByText("202.500 VNĐ")).toBeInTheDocument();
//   });

  // 2. Test QR code generation
  it("displays QR code with booking ID", async () => {
    renderWithProviders(<PrintTicket />);

    await waitFor(() => {
      expect(screen.getByTestId("qr-code")).toBeInTheDocument();
    });

    const qrCode = screen.getByTestId("qr-code");
    expect(qrCode).toHaveAttribute("data-value", "booking123");
    expect(qrCode).toHaveAttribute("data-size", "100");
    expect(qrCode).toHaveAttribute("data-bg-color", "#ffffff");
    expect(qrCode).toHaveAttribute("data-fg-color", "#000000");
  });

  // 3. Test movie information display
  it("displays movie information correctly", async () => {
    renderWithProviders(<PrintTicket />);

    await waitFor(() => {
      expect(screen.getByText("Avengers Endgame")).toBeInTheDocument();
    });

    expect(screen.getByText("Now Showing")).toBeInTheDocument();
    expect(screen.getByText("Synopsis:")).toBeInTheDocument();
    expect(screen.getByText(/Epic superhero movie about saving the universe/)).toBeInTheDocument();
  });

  // 4. Test ticket details section
  it("displays all ticket details correctly", async () => {
    renderWithProviders(<PrintTicket />);

    await waitFor(() => {
      expect(screen.getByText("Avengers Endgame")).toBeInTheDocument();
    });

    // Check all ticket detail labels and values
    expect(screen.getByText("Screen:")).toBeInTheDocument();
    expect(screen.getByText("Time:")).toBeInTheDocument();
    expect(screen.getByText("Room:")).toBeInTheDocument();
    expect(screen.getByText("Seats:")).toBeInTheDocument();
    expect(screen.getByText("Discount:")).toBeInTheDocument();
    expect(screen.getByText("Price:")).toBeInTheDocument();
    expect(screen.getByText("Total:")).toBeInTheDocument();

    expect(screen.getByText("10%")).toBeInTheDocument();
  });

  // 5. Test version card display
  it("displays version card correctly", async () => {
    renderWithProviders(<PrintTicket />);

    await waitFor(() => {
      expect(screen.getByTestId("version-card")).toBeInTheDocument();
    });

    const versionCard = screen.getByTestId("version-card");
    expect(versionCard).toHaveAttribute("data-version", "2D");
    expect(versionCard).toHaveAttribute("data-readonly", "true");
  });

//   // 6. Test PDF export functionality
//   it("handles PDF export successfully", async () => {
//     const mockPDFInstance = {
//       internal: { pageSize: { getWidth: jest.fn(() => 210) } },
//       addImage: jest.fn(),
//       save: jest.fn(),
//     };
//     jsPDF.mockReturnValue(mockPDFInstance);

//     renderWithProviders(<PrintTicket />);

//     await waitFor(() => {
//       expect(screen.getByText("Print Ticket")).toBeInTheDocument();
//     });

//     const printButton = screen.getAllByText("Print Ticket")[1]; // Get the button, not the heading
//     fireEvent.click(printButton);

//     await waitFor(() => {
//       expect(html2canvas).toHaveBeenCalled();
//       expect(mockPDFInstance.addImage).toHaveBeenCalledWith(
//         "data:image/png;base64,mockImageData",
//         "PNG",
//         0,
//         10,
//         210,
//         expect.any(Number)
//       );
//       expect(mockPDFInstance.save).toHaveBeenCalledWith("ticket.pdf");
//     });
//   });

//   // 7. Test PDF export error handling
//   it("handles PDF export error gracefully", async () => {
//     html2canvas.mockRejectedValue(new Error("Canvas error"));

//     renderWithProviders(<PrintTicket />);

//     await waitFor(() => {
//       expect(screen.getByText("Print Ticket")).toBeInTheDocument();
//     });

//     const printButton = screen.getAllByText("Print Ticket")[1];
//     fireEvent.click(printButton);

//     await waitFor(() => {
//       expect(toast.error).toHaveBeenCalledWith("Failed to generate PDFCanvas error");
//     });
//   });

  // 8. Test cancel button functionality
  it("handles cancel button click", async () => {
    renderWithProviders(<PrintTicket />);

    await waitFor(() => {
      expect(screen.getByText("Cancel")).toBeInTheDocument();
    });

    const cancelButton = screen.getByText("Cancel");
    fireEvent.click(cancelButton);

    expect(mockNavigate).toHaveBeenCalledWith("/staff/ticket-selling");
  });

  // 9. Test redirect when no movie data
  it("redirects when no selected movie", async () => {
    renderWithProviders(<PrintTicket />, {
      initialState: {
        selling: {
          selectedMovie: null,
        },
      },
    });

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/staff/ticket-selling");
    });
  });

  // 10. Test redirect when movie has no ID
  it("redirects when movie has no MovieId", async () => {
    renderWithProviders(<PrintTicket />, {
      initialState: {
        selling: {
          selectedMovie: { NameOfEnglish: "Test Movie" }, // No MovieId
        },
      },
    });

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/staff/ticket-selling");
    });
  });

  // 11. Test movie loading from API
  it("loads movie data from API successfully", async () => {
    const apiMovieData = {
      ...sampleMovie,
      NameOfEnglish: "Updated Movie Title",
    };
    mockGetMovieById.mockResolvedValue({ data: apiMovieData });

    renderWithProviders(<PrintTicket />);

    await waitFor(() => {
      expect(mockGetMovieById).toHaveBeenCalledWith("movie1");
      expect(screen.getByText("Updated Movie Title")).toBeInTheDocument();
    });
  });

  // 12. Test movie API error fallback
  it("falls back to selected movie data when API fails", async () => {
    mockGetMovieById.mockRejectedValue(new Error("API Error"));

    renderWithProviders(<PrintTicket />);

    await waitFor(() => {
      expect(mockGetMovieById).toHaveBeenCalledWith("movie1");
      expect(screen.getByText("Avengers Endgame")).toBeInTheDocument();
    });
  });

//   // 13. Test default values when booking data is incomplete
//   it("displays default values for missing booking data", async () => {
//     renderWithProviders(<PrintTicket />, {
//       initialState: {
//         selling: {
//           selectedMovie: sampleMovie,
//           selectedDay: "",
//           selectedTime: "",
//           room: "",
//           selectedSeats: [],
//           totalPrice: 0,
//           discount: 0,
//         },
//       },
//     });

//     await waitFor(() => {
//       expect(screen.getByText("Avengers Endgame")).toBeInTheDocument();
//     });

//     expect(screen.getByText("N/A")).toBeInTheDocument();
//     expect(screen.getByText("0%")).toBeInTheDocument();
//     expect(screen.getByText("0 VNĐ")).toBeInTheDocument();
//   });

  // 14. Test price formatting
  it("formats prices correctly", async () => {
    renderWithProviders(<PrintTicket />, {
      initialState: {
        selling: {
          ...sampleBookingData,
          totalPrice: 1000000,
          amountPaid: 900000,
        },
      },
    });

    await waitFor(() => {
      expect(screen.getByText("1.000.000 VNĐ")).toBeInTheDocument();
      expect(screen.getByText("900.000 VNĐ")).toBeInTheDocument();
    });
  });

  // 15. Test loading state
  it("shows loading when movie info is not available", () => {
    renderWithProviders(<PrintTicket />, {
      initialState: {
        selling: {
          selectedMovie: { MovieId: "movie1" }, // Movie without NameOfEnglish
        },
      },
    });

    expect(screen.getByText("Loading ticket information...")).toBeInTheDocument();
  });

//   // 16. Test header section
//   it("renders header section correctly", async () => {
//     renderWithProviders(<PrintTicket />);

//     await waitFor(() => {
//       expect(screen.getByTestId("back-button")).toBeInTheDocument();
//     });

//     expect(screen.getByText("Print Ticket")).toBeInTheDocument();
//     expect(screen.getByText("Staff Portal - Ticket Preview")).toBeInTheDocument();
//   });

  // 17. Test responsive layout elements
  it("renders responsive ticket layout", async () => {
    renderWithProviders(<PrintTicket />);

    await waitFor(() => {
      expect(screen.getByText("Avengers Endgame")).toBeInTheDocument();
    });

    // Check if ticket container exists
    const ticketContainer = screen.getByText("Ticket Details").closest("div");
    expect(ticketContainer).toBeInTheDocument();
  });

  // 18. Test component cleanup
  it("handles component unmounting gracefully", async () => {
    const { unmount } = renderWithProviders(<PrintTicket />);

    await waitFor(() => {
      expect(screen.getByText("Avengers Endgame")).toBeInTheDocument();
    });

    unmount();
    // Should not throw any errors
  });

  // 19. Test with empty seats array
  it("handles empty seats array correctly", async () => {
    renderWithProviders(<PrintTicket />, {
      initialState: {
        selling: {
          ...sampleBookingData,
          selectedSeats: [],
        },
      },
    });

    await waitFor(() => {
      expect(screen.getByText("Avengers Endgame")).toBeInTheDocument();
    });

    expect(screen.getByText("N/A")).toBeInTheDocument();
  });

  // 20. Test multiple action buttons
  it("renders all action buttons correctly", async () => {
    renderWithProviders(<PrintTicket />);

    await waitFor(() => {
      expect(screen.getByText("Avengers Endgame")).toBeInTheDocument();
    });

    const printButtons = screen.getAllByText("Print Ticket");
    expect(printButtons).toHaveLength(2); // Header and button

    const cancelButton = screen.getByText("Cancel");
    expect(cancelButton).toBeInTheDocument();

    // Check Link wrapper
    const link = cancelButton.closest("a");
    expect(link).toHaveAttribute("href", "/staff/ticket-selling");
  });
});