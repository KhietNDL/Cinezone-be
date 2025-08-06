/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  cleanup,
} from "@testing-library/react";
import "@testing-library/jest-dom";
import { jest, describe, beforeEach, it, expect } from "@jest/globals";
jest.mock("../../../services/API", () => ({
  getCinemaRooms: jest.fn(),
  createCinemaRoom: jest.fn(),
  searchCinemaRooms: jest.fn(),
  deleteCinemaRoom: jest.fn(),
  updateCinemaRoom: jest.fn(),
}));
jest.mock("../../../../src/component/LayoutSelectSeat", () => ({
  LayoutSelectSeat: () => (
    <div data-testid="layout-select-seat">LayoutSelectSeat</div>
  ),
}));
jest.mock(
  "../../../../src/layouts/Admin/movieComponent/Pagination",
  () => () => <div data-testid="pagination">Pagination</div>
);

import RoomManagement from "../../../../src/layouts/Admin/component/RoomManagement";
import { getCinemaRooms, searchCinemaRooms } from "../../../services/API";

describe("RoomManagement", () => {
  const mockRooms = [
    { CinemaRoomId: "1", Name: "Room A", SeatQuantity: 100, Type: "Normal" },
    { CinemaRoomId: "2", Name: "Room B", SeatQuantity: 120, Type: "IMAX" },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    getCinemaRooms.mockResolvedValue({
      data: mockRooms,
      pagination: { totalPages: 1, total: 2 },
    });
    searchCinemaRooms.mockResolvedValue({
      data: mockRooms,
      pagination: { totalPages: 1, total: 2 },
    });
  });

  it("renders room list and stats", async () => {
    render(<RoomManagement />);
    expect(screen.getByText("Total Rooms")).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getAllByText("Room A").length).toBeGreaterThan(0);
      expect(screen.getAllByText("Room B").length).toBeGreaterThan(0);
    });
  });

  it("can search for rooms", async () => {
    render(<RoomManagement />);
    const searchInput = screen.getByPlaceholderText(/search by room name/i);
    fireEvent.change(searchInput, { target: { value: "Room" } });
    await waitFor(() => {
      expect(searchCinemaRooms).toHaveBeenCalled();
    });
  });

  it("opens add room modal", async () => {
    render(<RoomManagement />);
    const addButton = screen.getByRole("button", { name: /room/i });
    fireEvent.click(addButton);
    expect(screen.getByText(/add new room/i)).toBeInTheDocument();
  });

  it("opens edit room modal", async () => {
    render(<RoomManagement />);
    await waitFor(() =>
      expect(screen.getAllByLabelText(/edit/i).length).toBeGreaterThan(0)
    );
    const editButtons = screen.getAllByLabelText(/edit/i);
    fireEvent.click(editButtons[0]);
    expect(screen.getByText(/edit room/i)).toBeInTheDocument();
  });

  it("opens delete room modal", async () => {
    render(<RoomManagement />);
    await waitFor(() =>
      expect(screen.getAllByText("Room A").length).toBeGreaterThan(0)
    );
    const deleteButtons = screen.getAllByLabelText(/delete/i);
    fireEvent.click(deleteButtons[0]);
    expect(screen.getByText(/delete room/i)).toBeInTheDocument();
  });

  afterEach(() => cleanup());

  it("opens detail modal", async () => {
    render(<RoomManagement />);
    await waitFor(() =>
      expect(screen.getAllByText("Room A").length).toBeGreaterThan(0)
    );
    const detailButtons = screen.getAllByText(/detail/i);

    let found = false;
    for (const btn of detailButtons) {
      fireEvent.click(btn);
      try {
        await screen.findByTestId("layout-select-seat", {}, { timeout: 500 });
        found = true;
        break;
      } catch (e) {
        // Không tìm thấy, thử nút tiếp theo
      }
    }
    expect(found).toBe(true);
  });
});
