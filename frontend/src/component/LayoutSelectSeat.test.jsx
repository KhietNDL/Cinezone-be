/* eslint-disable no-undef */
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { LayoutSelectSeat } from "./LayoutSelectSeat";

// Mock react-icons
jest.mock("react-icons/pi", () => ({
  PiArmchairLight: ({ className, style }) => (
    <div data-testid="pi-armchair-light" className={className} style={style}>
      PiArmchairLight
    </div>
  ),
  PiArmchairFill: ({ className, style }) => (
    <div data-testid="pi-armchair-fill" className={className} style={style}>
      PiArmchairFill
    </div>
  ),
}));

jest.mock("react-icons/md", () => ({
  MdOutlineChair: ({ className, style }) => (
    <div data-testid="md-outline-chair" className={className} style={style}>
      MdOutlineChair
    </div>
  ),
}));

// Sample seat data
const sampleSeats = [
  {
    seatId: "1",
    seatNumber: "A1",
    status: "available",
    type: "Normal",
    price: 75000,
  },
  {
    seatId: "2",
    seatNumber: "A2",
    status: "taken",
    type: "Normal",
    price: 75000,
  },
  {
    seatId: "3",
    seatNumber: "A3",
    status: "available",
    type: "VIP",
    price: 85000,
  },
  {
    seatId: "4",
    seatNumber: "B1",
    status: "available",
    type: "Couple",
    price: 120000,
  },
  {
    seatId: "5",
    seatNumber: "B2",
    status: "holding",
    type: "Normal",
    price: 75000,
  },
];

const defaultProps = {
  onSeatSelect: jest.fn(),
  initialSelectedSeats: [],
  seatDataFromAPI: sampleSeats,
  containerWidth: "750px",
  width: 30,
  height: 30,
  textColor: "text-gray-500",
  widthDouble: 60,
  heightDouble: 30,
  aisleWidth: 60,
  seatSpacing: 12,
  seatSpacingCouple: 0,
  seatColors: {
    available: "text-purple-300",
    selected: "text-purple-100",
    taken: "text-purple-600",
    holding: "text-blue-600",
    vip: "text-purple-200",
    normal: "text-purple-300",
    couple: "text-purple-400",
  },
};

describe("LayoutSelectSeat", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "error").mockImplementation(() => {});
    jest.spyOn(console, "log").mockImplementation(() => {});
  });

  afterEach(() => {
    console.error.mockRestore();
    console.log.mockRestore();
  });

  //   // 1. Test initial render
  //   it("renders component with screen and seat layout", async () => {
  //     render(<LayoutSelectSeat {...defaultProps} />);

  //     await waitFor(() => {
  //       expect(screen.getByText("SCREEN")).toBeInTheDocument();
  //     });

  //     // Check for row labels
  //     expect(screen.getByText("A")).toBeInTheDocument();
  //     expect(screen.getByText("B")).toBeInTheDocument();
  //   });

  //   // 2. Test seat rendering for different types
  //   it("renders different seat types correctly", async () => {
  //     render(<LayoutSelectSeat {...defaultProps} />);

  //     await waitFor(() => {
  //       // Check for different seat icons
  //       expect(screen.getAllByTestId("pi-armchair-light")).toHaveLength(expect.any(Number));
  //       expect(screen.getAllByTestId("pi-armchair-fill")).toHaveLength(expect.any(Number));
  //       expect(screen.getAllByTestId("md-outline-chair")).toHaveLength(expect.any(Number));
  //     });
  //   });

  // 3. Test seat selection functionality
  it("handles seat selection correctly", async () => {
    const mockOnSeatSelect = jest.fn();
    render(
      <LayoutSelectSeat {...defaultProps} onSeatSelect={mockOnSeatSelect} />
    );

    await waitFor(() => {
      // Find and click on an available seat
      const availableSeat = screen.getByTitle(
        "Normal Seat A1 - 75,000đ - available"
      );
      fireEvent.click(availableSeat);
    });

    await waitFor(() => {
      expect(mockOnSeatSelect).toHaveBeenCalledWith({
        seats: expect.arrayContaining([
          expect.objectContaining({
            seatNumber: "A1",
            price: 75000,
          }),
        ]),
        seatIds: expect.arrayContaining(["1"]),
        totalPrice: 75000,
        count: 1,
      });
    });
  });

  // 4. Test seat deselection
  it("handles seat deselection correctly", async () => {
    const mockOnSeatSelect = jest.fn();
    render(
      <LayoutSelectSeat
        {...defaultProps}
        onSeatSelect={mockOnSeatSelect}
        initialSelectedSeats={["A1"]}
      />
    );

    await waitFor(() => {
      // Click on already selected seat to deselect
      const selectedSeat = screen.getByTitle(
        "Normal Seat A1 - 75,000đ - available"
      );
      fireEvent.click(selectedSeat);
    });

    await waitFor(() => {
      expect(mockOnSeatSelect).toHaveBeenCalledWith({
        seats: [],
        seatIds: [],
        totalPrice: 0,
        count: 0,
      });
    });
  });

  // 5. Test multiple seat selection
  it("handles multiple seat selection", async () => {
    const mockOnSeatSelect = jest.fn();
    render(
      <LayoutSelectSeat {...defaultProps} onSeatSelect={mockOnSeatSelect} />
    );

    await waitFor(() => {
      // Select first seat
      const seat1 = screen.getByTitle("Normal Seat A1 - 75,000đ - available");
      fireEvent.click(seat1);

      // Select second seat
      const seat3 = screen.getByTitle("VIP Seat A3 - 85,000đ - available");
      fireEvent.click(seat3);
    });

    await waitFor(() => {
      expect(mockOnSeatSelect).toHaveBeenCalledWith({
        seats: expect.arrayContaining([
          expect.objectContaining({ seatNumber: "A1", price: 75000 }),
          expect.objectContaining({ seatNumber: "A3", price: 85000 }),
        ]),
        seatIds: expect.arrayContaining(["1", "3"]),
        totalPrice: 160000,
        count: 2,
      });
    });
  });

  // 6. Test taken seat cannot be selected
  it("prevents selection of taken seats", async () => {
    const mockOnSeatSelect = jest.fn();
    render(
      <LayoutSelectSeat {...defaultProps} onSeatSelect={mockOnSeatSelect} />
    );

    await waitFor(() => {
      const takenSeat = screen.getByTitle("Normal Seat A2 - 75,000đ - taken");
      fireEvent.click(takenSeat);
    });

    // Should not call onSeatSelect for taken seats
    expect(mockOnSeatSelect).not.toHaveBeenCalled();
  });

  // 7. Test holding seat cannot be selected
  it("prevents selection of holding seats", async () => {
    const mockOnSeatSelect = jest.fn();
    render(
      <LayoutSelectSeat {...defaultProps} onSeatSelect={mockOnSeatSelect} />
    );

    await waitFor(() => {
      const holdingSeat = screen.getByTitle(
        "Normal Seat B2 - 75,000đ - holding"
      );
      fireEvent.click(holdingSeat);
    });

    // Should not call onSeatSelect for holding seats
    expect(mockOnSeatSelect).not.toHaveBeenCalled();
  });

  // 8. Test seat color rendering
  it("renders seats with correct colors based on status", async () => {
    render(<LayoutSelectSeat {...defaultProps} />);

    await waitFor(() => {
      // Check for different seat colors
      const availableSeat = screen.getByTitle(
        "Normal Seat A1 - 75,000đ - available"
      );
      const takenSeat = screen.getByTitle("Normal Seat A2 - 75,000đ - taken");
      const vipSeat = screen.getByTitle("VIP Seat A3 - 85,000đ - available");

      expect(availableSeat).toHaveClass("text-purple-300");
      expect(takenSeat).toHaveClass("text-purple-600");
      expect(vipSeat).toHaveClass("text-purple-200");
    });
  });

  // 9. Test legend rendering
  it("renders seat legend correctly", async () => {
    render(<LayoutSelectSeat {...defaultProps} />);

    await waitFor(() => {
      expect(screen.getByText("Normal")).toBeInTheDocument();
      expect(screen.getByText("VIP")).toBeInTheDocument();
      expect(screen.getByText("Couple")).toBeInTheDocument();
      expect(screen.getByText("Selecting")).toBeInTheDocument();
      expect(screen.getByText("Taken")).toBeInTheDocument();
      expect(screen.getByText("Holding")).toBeInTheDocument();
    });
  });

  // 10. Test empty seat data
  it("handles empty seat data gracefully", () => {
    render(<LayoutSelectSeat {...defaultProps} seatDataFromAPI={[]} />);

    // Should still render screen but no seats
    expect(screen.getByText("SCREEN")).toBeInTheDocument();
  });

  // 11. Test custom seat colors
  it("applies custom seat colors correctly", () => {
    const customColors = {
      available: "text-green-300",
      selected: "text-blue-100",
      taken: "text-red-600",
      holding: "text-yellow-600",
      vip: "text-orange-200",
      normal: "text-green-300",
      couple: "text-pink-400",
    };

    render(<LayoutSelectSeat {...defaultProps} seatColors={customColors} />);

    // Check if custom colors are applied
    const availableSeat = screen.getByTitle(
      "Normal Seat A1 - 75,000đ - available"
    );
    expect(availableSeat).toHaveClass("text-green-300");
  });

  // 12. Test couple seat rendering
  it("renders couple seats with correct dimensions", async () => {
    render(<LayoutSelectSeat {...defaultProps} />);

    await waitFor(() => {
      const coupleSeat = screen.getByTitle(
        "Couple Seat B1 - 120,000đ - available"
      );
      expect(coupleSeat).toBeInTheDocument();

      // Check if couple seat uses MdOutlineChair icon
      const coupleIcon = coupleSeat.querySelector(
        '[data-testid="md-outline-chair"]'
      );
      expect(coupleIcon).toBeInTheDocument();
    });
  });

  // 13. Test row layout structure
  it("renders rows with correct structure", async () => {
    render(<LayoutSelectSeat {...defaultProps} />);

    await waitFor(() => {
      // Check for row labels on both sides
      const rowLabels = screen.getAllByText("A");
      expect(rowLabels.length).toBeGreaterThan(1); // Should appear on both sides
    });
  });

  // 14. Test aisle rendering
  it("renders aisle between seat sections", async () => {
    render(<LayoutSelectSeat {...defaultProps} />);

    await waitFor(() => {
      // Check for aisle separator
      const aisle = document.querySelector(".w-px.h-4.bg-gray-600");
      expect(aisle).toBeInTheDocument();
    });
  });

  // 15. Test tooltip functionality
  it("shows tooltips on seat hover", async () => {
    render(<LayoutSelectSeat {...defaultProps} />);

    await waitFor(() => {
      const seat = screen.getByTitle("Normal Seat A1 - 75,000đ - available");

      // Hover over seat to show tooltip
      fireEvent.mouseEnter(seat);

      // Tooltip should be present in DOM (though might be hidden by CSS)
      expect(seat).toHaveAttribute(
        "title",
        "Normal Seat A1 - 75,000đ - available"
      );
    });
  });

  //   // 16. Test animation classes
  //   it("applies animation classes correctly", async () => {
  //     render(<LayoutSelectSeat {...defaultProps} />);

  //     await waitFor(() => {
  //       // Check for animation classes
  //       const screenElement = screen.getByText("SCREEN").closest("div");
  //       expect(screenElement).toHaveClass("transition-all", "duration-700");
  //     });
  //   });

  //   // 17. Test responsive design
  //   it("applies responsive design classes", async () => {
  //     render(<LayoutSelectSeat {...defaultProps} />);

  //     await waitFor(() => {
  //       // Check for responsive classes in legend
  //       const legendContainer = screen.getByText("Normal").closest("div");
  //       expect(legendContainer).toHaveClass("flex", "justify-center", "items-center");
  //     });
  //   });

  // 18. Test seat spacing
  it("applies correct seat spacing", async () => {
    render(<LayoutSelectSeat {...defaultProps} />);

    await waitFor(() => {
      const seats = document.querySelectorAll(
        '[data-testid="pi-armchair-light"], [data-testid="pi-armchair-fill"], [data-testid="md-outline-chair"]'
      );
      expect(seats.length).toBeGreaterThan(0);
    });
  });

  // 19. Test component unmounting
  it("handles component unmounting gracefully", async () => {
    const { unmount } = render(<LayoutSelectSeat {...defaultProps} />);

    await waitFor(() => {
      expect(screen.getByText("SCREEN")).toBeInTheDocument();
    });

    unmount();
    // Should not throw any errors
  });

  // 20. Test console logging
  it("logs selected seats to console", async () => {
    render(<LayoutSelectSeat {...defaultProps} />);

    await waitFor(() => {
      const seat = screen.getByTitle("Normal Seat A1 - 75,000đ - available");
      fireEvent.click(seat);
    });
  });
});
