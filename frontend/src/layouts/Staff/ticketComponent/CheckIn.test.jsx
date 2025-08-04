/* eslint-disable no-undef */
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import CheckIn from "./CheckIn";
import * as api from "../../../services/APIForStaff/API";
import { toast } from "react-toastify";

// Mock react-toastify
jest.mock("react-toastify", () => ({
  toast: {
    error: jest.fn(),
    success: jest.fn(),
    warning: jest.fn(),
  },
}));

// Mock API functions
jest.mock("../../../services/APIForStaff/API", () => ({
  getBookingById: jest.fn(),
  checkIn: jest.fn(),
}));

// Mock QRScanner component
jest.mock("../component/QRScanner", () => {
  return function MockQRScanner({ onScanSuccess }) {
    return (
      <div data-testid="qr-scanner">
        <button
          data-testid="scan-button"
          onClick={() => onScanSuccess("test-booking-id")}
        >
          Scan QR Code
        </button>
      </div>
    );
  };
});

// Mock react-icons
jest.mock("react-icons/md", () => ({
  MdQrCodeScanner: () => <div data-testid="qr-scanner-icon">QR Scanner Icon</div>,
}));

jest.mock("react-icons/fa", () => ({
  FaTicketAlt: () => <div data-testid="ticket-icon">Ticket Icon</div>,
}));

// Suppress console errors for React act() warnings
beforeAll(() => {
  jest.spyOn(console, "error").mockImplementation(() => {});
});

afterAll(() => {
  console.error.mockRestore();
});

const renderWithRouter = (ui) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

describe("CheckIn", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // 1. Test initial render
  it("renders CheckIn component with header", () => {
    renderWithRouter(<CheckIn />);
    expect(screen.getByText("Ticket Check-in")).toBeInTheDocument();
    expect(screen.getByText("Scan QR code to check-in customers")).toBeInTheDocument();
  });

  // 2. Test QR Scanner section
  it("renders QR Scanner section", () => {
    renderWithRouter(<CheckIn />);
    expect(screen.getByText("QR Code Scanner")).toBeInTheDocument();
    expect(screen.getByText("Position the QR code within the scanner frame")).toBeInTheDocument();
  });

  // 3. Test QR Scanner component
  it("renders QR Scanner component", () => {
    renderWithRouter(<CheckIn />);
    expect(screen.getByTestId("qr-scanner")).toBeInTheDocument();
    expect(screen.getByTestId("scan-button")).toBeInTheDocument();
  });

  // 4. Test instructions section
  it("renders instructions for QR scanning", () => {
    renderWithRouter(<CheckIn />);
    expect(screen.getByText("📱 How to use:")).toBeInTheDocument();
    expect(screen.getByText("• Hold the QR code steady within the camera frame")).toBeInTheDocument();
    expect(screen.getByText("• Ensure good lighting for accurate scanning")).toBeInTheDocument();
    expect(screen.getByText("• The system will automatically process valid tickets")).toBeInTheDocument();
  });

  // 5. Test successful check-in
  it("handles successful check-in", async () => {
    const mockBooking = { Status: 2 };
    const mockUpdatedBooking = { Status: 3 };
    
    api.getBookingById
      .mockResolvedValueOnce(mockBooking)
      .mockResolvedValueOnce(mockUpdatedBooking);
    api.checkIn.mockResolvedValue();

    renderWithRouter(<CheckIn />);
    
    const scanButton = screen.getByTestId("scan-button");
    fireEvent.click(scanButton);

    await waitFor(() => {
      expect(api.getBookingById).toHaveBeenCalledWith("test-booking-id");
      expect(api.checkIn).toHaveBeenCalledWith("test-booking-id");
      expect(toast.success).toHaveBeenCalledWith("Check-in successful!");
    });
  });

  // 6. Test booking not found
  it("handles booking not found", async () => {
    api.getBookingById.mockResolvedValue(null);

    renderWithRouter(<CheckIn />);
    
    const scanButton = screen.getByTestId("scan-button");
    fireEvent.click(scanButton);

    await waitFor(() => {
      expect(api.getBookingById).toHaveBeenCalledWith("test-booking-id");
      expect(toast.error).toHaveBeenCalledWith("Booking not found.");
    });
  });

  // 7. Test already checked in booking
  it("handles already checked in booking", async () => {
    const mockBooking = { Status: 3 };
    api.getBookingById.mockResolvedValue(mockBooking);

    renderWithRouter(<CheckIn />);
    
    const scanButton = screen.getByTestId("scan-button");
    fireEvent.click(scanButton);

    await waitFor(() => {
      expect(api.getBookingById).toHaveBeenCalledWith("test-booking-id");
      expect(toast.warning).toHaveBeenCalledWith("This booking has already been checked in.");
    });
  });

  // 8. Test invalid booking status
  it("handles invalid booking status", async () => {
    const mockBooking = { Status: 1 }; // Invalid status
    api.getBookingById.mockResolvedValue(mockBooking);

    renderWithRouter(<CheckIn />);
    
    const scanButton = screen.getByTestId("scan-button");
    fireEvent.click(scanButton);

    await waitFor(() => {
      expect(api.getBookingById).toHaveBeenCalledWith("test-booking-id");
      expect(toast.error).toHaveBeenCalledWith("This booking can not check-in.");
    });
  });

  // 9. Test check-in failure
  it("handles check-in failure", async () => {
    const mockBooking = { Status: 2 };
    const mockUpdatedBooking = { Status: 2 }; // Status didn't change
    
    api.getBookingById
      .mockResolvedValueOnce(mockBooking)
      .mockResolvedValueOnce(mockUpdatedBooking);
    api.checkIn.mockResolvedValue();

    renderWithRouter(<CheckIn />);
    
    const scanButton = screen.getByTestId("scan-button");
    fireEvent.click(scanButton);

    await waitFor(() => {
      expect(api.getBookingById).toHaveBeenCalledWith("test-booking-id");
      expect(api.checkIn).toHaveBeenCalledWith("test-booking-id");
      expect(toast.error).toHaveBeenCalledWith("Check-in failed. Please try again.");
    });
  });

  // 10. Test API error handling
  it("handles API errors gracefully", async () => {
    api.getBookingById.mockRejectedValue(new Error("API Error"));

    renderWithRouter(<CheckIn />);
    
    const scanButton = screen.getByTestId("scan-button");
    fireEvent.click(scanButton);

    await waitFor(() => {
      expect(api.getBookingById).toHaveBeenCalledWith("test-booking-id");
      expect(toast.error).toHaveBeenCalledWith("Check-in failed. Please try again.");
    });
  });

  // 11. Test check-in API error
  it("handles check-in API error", async () => {
    const mockBooking = { Status: 2 };
    api.getBookingById.mockResolvedValue(mockBooking);
    api.checkIn.mockRejectedValue(new Error("Check-in API Error"));

    renderWithRouter(<CheckIn />);
    
    const scanButton = screen.getByTestId("scan-button");
    fireEvent.click(scanButton);

    await waitFor(() => {
      expect(api.getBookingById).toHaveBeenCalledWith("test-booking-id");
      expect(api.checkIn).toHaveBeenCalledWith("test-booking-id");
      expect(toast.error).toHaveBeenCalledWith("Check-in failed. Please try again.");
    });
  });

  // 12. Test icons are rendered
  it("renders ticket and QR scanner icons", () => {
    renderWithRouter(<CheckIn />);
    expect(screen.getByTestId("ticket-icon")).toBeInTheDocument();
    expect(screen.getByTestId("qr-scanner-icon")).toBeInTheDocument();
  });

  // 13. Test component structure
  it("renders proper component structure", () => {
    renderWithRouter(<CheckIn />);
    
    // Check main sections
    expect(screen.getByText("Ticket Check-in")).toBeInTheDocument();
    expect(screen.getByText("QR Code Scanner")).toBeInTheDocument();
    expect(screen.getByText("📱 How to use:")).toBeInTheDocument();
  });

//   // 14. Test multiple QR scans
//   it("handles multiple QR code scans", async () => {
//     const mockBooking = { Status: 2 };
//     const mockUpdatedBooking = { Status: 3 };
    
//     api.getBookingById
//       .mockResolvedValueOnce(mockBooking)
//       .mockResolvedValueOnce(mockUpdatedBooking);
//     api.checkIn.mockResolvedValue();

//     renderWithRouter(<CheckIn />);
    
//     const scanButton = screen.getByTestId("scan-button");
    
//     // First scan
//     fireEvent.click(scanButton);
//     await waitFor(() => {
//       expect(toast.success).toHaveBeenCalledWith("Check-in successful!");
//     });

//     // Second scan
//     fireEvent.click(scanButton);
//     await waitFor(() => {
//       expect(api.getBookingById).toHaveBeenCalledTimes(2);
//     });
//   });

  // 15. Test console logging
  it("logs QR code data to console", async () => {
    const consoleSpy = jest.spyOn(console, "log").mockImplementation(() => {});
    const mockBooking = { Status: 2 };
    const mockUpdatedBooking = { Status: 3 };
    
    api.getBookingById
      .mockResolvedValueOnce(mockBooking)
      .mockResolvedValueOnce(mockUpdatedBooking);
    api.checkIn.mockResolvedValue();

    renderWithRouter(<CheckIn />);
    
    const scanButton = screen.getByTestId("scan-button");
    fireEvent.click(scanButton);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith("Scanned QR code: test-booking-id");
    });

    consoleSpy.mockRestore();
  });
}); 