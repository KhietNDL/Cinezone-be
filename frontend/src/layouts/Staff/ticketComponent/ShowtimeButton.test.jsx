/* eslint-disable no-undef */
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ShowtimeButton from "./ShowtimeButton";
import "@testing-library/jest-dom";

// Mock Tooltip from Ant Design to just render children
jest.mock("antd", () => {
  const original = jest.requireActual("antd");
  return {
    ...original,
    Tooltip: ({ children }) => <>{children}</>,
  };
});

describe("ShowtimeButton", () => {
  const mockOnSelectDay = jest.fn();
  const mockOnSelectTime = jest.fn();

  const mockDays = ["06/08/2025", "07/08/2025"];
  const mockTimes = [
    { time: "14:00", showtimeId: "1", roomName: "Room A" },
    { time: "16:30", showtimeId: "2", roomName: "Room B" },
  ];

  beforeEach(() => {
    mockOnSelectDay.mockClear();
    mockOnSelectTime.mockClear();
  });

//   test("renders day buttons correctly", () => {
//     render(
//       <ShowtimeButton
//         showDay={true}
//         showTime={false}
//         days={mockDays}
//         selectedDay={null}
//         onSelectDay={mockOnSelectDay}
//       />
//     );

//     mockDays.forEach((day) => {
//       expect(screen.getByText(/Today|Tomorrow|Aug/)).toBeInTheDocument();
//     });
//   });

  test("selects a day and calls onSelectDay", () => {
    render(
      <ShowtimeButton
        showDay={true}
        showTime={false}
        days={mockDays}
        selectedDay={null}
        onSelectDay={mockOnSelectDay}
        onSelectTime={mockOnSelectTime}
      />
    );

    const dayButton = screen.getAllByRole("button")[0];
    fireEvent.click(dayButton);
    expect(mockOnSelectDay).toHaveBeenCalledWith(mockDays[0]);
    expect(mockOnSelectTime).toHaveBeenCalledWith(null);
  });

  test("renders time buttons correctly", () => {
    render(
      <ShowtimeButton
        showDay={false}
        showTime={true}
        times={mockTimes}
        selectedTime={null}
        onSelectTime={mockOnSelectTime}
        parentVersion="2D"
      />
    );

    expect(screen.getByText("14:00")).toBeInTheDocument();
    expect(screen.getByText("16:30")).toBeInTheDocument();
  });

  test("selects a time and calls onSelectTime", () => {
    render(
      <ShowtimeButton
        showDay={false}
        showTime={true}
        times={mockTimes}
        selectedTime={null}
        onSelectTime={mockOnSelectTime}
        parentVersion="2D"
      />
    );

    fireEvent.click(screen.getByText("16:30"));
    expect(mockOnSelectTime).toHaveBeenCalledWith("2D", "16:30");
  });

  test("shows empty state when times is empty", () => {
    render(
      <ShowtimeButton
        showDay={false}
        showTime={true}
        times={[]}
        selectedTime={null}
        onSelectTime={mockOnSelectTime}
      />
    );

    expect(screen.getByText("No showtimes available")).toBeInTheDocument();
    expect(screen.getByText("Please select a different date")).toBeInTheDocument();
  });
});
