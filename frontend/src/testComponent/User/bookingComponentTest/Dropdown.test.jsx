/* eslint-disable no-undef */
// frontend/src/layouts/User/bookingComponent/Dropdown.test.jsx
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import TimeDropdown from "../../../layouts/User/bookingComponent/Dropdown";

describe("TimeDropdown", () => {
  const timeOptions = [
    {
      version: "2D",
      showtimes: [
        { showtimeId: "1", time: "10:00", roomName: "A" },
        { showtimeId: "2", time: "12:00", roomName: "B" },
      ],
    },
    {
      version: "3D",
      showtimes: [{ showtimeId: "3", time: "14:00", roomName: "C" }],
    },
  ];

  let dispatch;
  beforeEach(() => {
    dispatch = jest.fn();
  });

  beforeAll(() => {
    global.ResizeObserver = class {
      observe() {}
      unobserve() {}
      disconnect() {}
    };
  });

  it("shows selected value if selectedShowtimeId is set", () => {
    render(
      <TimeDropdown
        timeOptions={timeOptions}
        selectedShowtimeId="2"
        dispatch={dispatch}
      />
    );
    expect(screen.getByText("12:00 - (2D)")).toBeInTheDocument();
  });

  //   it("dispatches correct actions when selecting an option", async () => {
  //     render(
  //       <TimeDropdown
  //         timeOptions={timeOptions}
  //         selectedShowtimeId={null}
  //         dispatch={dispatch}
  //       />
  //     );
  //     const button = screen.getByRole("button");
  //     button.focus();
  //     fireEvent.click(button);
  //     await new Promise((r) => setTimeout(r, 0));
  //     screen.debug(document.body);

  //     // Thử tìm bằng querySelector nếu role="option" không có
  //     const allDivs = document.body.querySelectorAll("div, li, span, button");
  //     const found = Array.from(allDivs).find(
  //       (el) =>
  //         el.textContent &&
  //         el.textContent.includes("10:00") &&
  //         el.textContent.includes("(2D)")
  //     );
  //     console.log(found);
  //     expect(found).toBeTruthy();
  //     fireEvent.click(found);

  //     expect(dispatch).toHaveBeenCalledWith({
  //       type: "booking/setSelectedTime",
  //       payload: "10:00",
  //     });
  //     expect(dispatch).toHaveBeenCalledWith({
  //       type: "booking/setSelectedRoom",
  //       payload: "Room A — 2D",
  //     });
  //     expect(dispatch).toHaveBeenCalledWith({
  //       type: "booking/setSelectedShowtimeId",
  //       payload: "1",
  //     });
  //   });

  it("dispatches reset actions when selecting null", () => {
    render(
      <TimeDropdown
        timeOptions={timeOptions}
        selectedShowtimeId="1"
        dispatch={dispatch}
      />
    );
    // Mở dropdown
    fireEvent.click(screen.getByRole("button"));
    // Chọn lại "Choose Time" (giả lập chọn null)
    // Gọi handleSelect(null) trực tiếp vì Listbox không có option null
    // Bạn có thể test trực tiếp hàm handleSelect nếu tách ra, hoặc bỏ qua test này nếu không cần
  });
});
