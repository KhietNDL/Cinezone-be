/* eslint-disable no-undef */
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import UserManagement from "../../../layouts/Admin/component/UserManagement";
import * as api from "../../../services/APIForAdmin/API";

// Mock toast
jest.mock("react-toastify", () => ({
  toast: { success: jest.fn(), error: jest.fn() },
}));

// Mock API
jest.mock("../../../services/APIForAdmin/API", () => ({
  getAllUsers: jest.fn(),
  createUser: jest.fn(),
  editUser: jest.fn(),
  deleteUser: jest.fn(),
  searchUserByName: jest.fn(),
}));

const mockUsers = [
  {
    UserId: "1",
    FullName: "User One",
    DateOfBirth: "2000-01-01",
    Sex: 1,
    Email: "user1@example.com",
    PhoneNumber: "0123456789",
    Address: "Address 1",
    CCCD: "123456789",
    avatar_url: "",
  },
  {
    UserId: "2",
    FullName: "User Two",
    DateOfBirth: "1990-02-02",
    Sex: 2,
    Email: "user2@example.com",
    PhoneNumber: "0987654321",
    Address: "Address 2",
    CCCD: "987654321",
    avatar_url: "",
  },
];

function setup() {
  return render(<UserManagement />);
}

describe("UserManagement", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    api.getAllUsers.mockResolvedValue({
      users: mockUsers,
      pagination: { totalPages: 1, total: 2 },
    });
  });

  it("renders loading state initially", async () => {
    api.getAllUsers.mockImplementation(
      () =>
        new Promise((resolve) =>
          setTimeout(
            () =>
              resolve({ users: [], pagination: { totalPages: 1, total: 0 } }),
            100
          )
        )
    );
    setup();
    expect(screen.getByText(/loading users/i)).toBeInTheDocument();
    await waitFor(() => expect(api.getAllUsers).toHaveBeenCalled());
  });

  it("renders user list after loading", async () => {
    setup();
    await waitFor(() => {
      expect(screen.getAllByText(/user one/i).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/user two/i).length).toBeGreaterThan(0);
    });
  });

  it("opens add user modal", async () => {
    setup();
    await waitFor(() => {
      expect(screen.getAllByText(/user one/i).length).toBeGreaterThan(0);
    });
    fireEvent.click(screen.getByRole("button", { name: /add/i }));
    expect(screen.getAllByText(/add user/i).length).toBeGreaterThan(0);
  });

  it("opens edit user modal", async () => {
    setup();
    await waitFor(() => {
      expect(screen.getAllByText(/user one/i).length).toBeGreaterThan(0);
    });
    fireEvent.click(screen.getAllByRole("button", { name: /edit/i })[0]);
    expect(screen.getByText(/edit user/i)).toBeInTheDocument();
  });

  it("opens delete user modal", async () => {
    setup();
    await waitFor(() => {
      expect(screen.getAllByText(/user one/i).length).toBeGreaterThan(0);
    });
    fireEvent.click(screen.getAllByRole("button", { name: /delete/i })[0]);
    // Kiểm tra tiêu đề modal
    expect(
      screen.getByRole("heading", { name: /delete user/i })
    ).toBeInTheDocument();
    // Hoặc kiểm tra nút xác nhận xóa
    // expect(
    //   screen.getAllByRole("button", { name: /delete user/i }).length
    // ).toBeGreaterThan(0);
  });

  //   it("calls createUser API on add", async () => {
  //     api.createUser.mockResolvedValue({});
  //     setup();
  //     await waitFor(() => {
  //       expect(screen.getAllByText(/user one/i).length).toBeGreaterThan(0);
  //     });
  //     fireEvent.click(screen.getByRole("button", { name: /add/i }));
  //     fireEvent.change(screen.getByPlaceholderText(/full name/i), {
  //       target: { value: "New User" },
  //     });
  //     // Use getAllByPlaceholderText and select the correct one from the modal
  //     fireEvent.change(screen.getAllByPlaceholderText(/email/i)[1], {
  //       target: { value: "new@example.com" },
  //     });
  //     fireEvent.change(screen.getByPlaceholderText(/phone/i), {
  //       target: { value: "0123456789" },
  //     });
  //     fireEvent.change(screen.getByPlaceholderText("Enter address"), {
  //       target: { value: "Somewhere" },
  //     });
  //     fireEvent.change(screen.getByPlaceholderText(/identity card/i), {
  //       target: { value: "111222333" },
  //     });
  //     fireEvent.change(screen.getByPlaceholderText(/password/i), {
  //       target: { value: "password" },
  //     });
  //     // Use getByLabelText for date input
  //     fireEvent.change(screen.getByLabelText(/date of birth/i), {
  //       target: { value: "2001-01-01" },
  //     });
  //     // Use getByLabelText for radio button
  //     fireEvent.click(screen.getByLabelText(/male/i));

  //     // Find the correct Add User button in the modal
  //     const addUserButtons = screen.getAllByRole("button", { name: /add user/i });
  //     fireEvent.click(addUserButtons[addUserButtons.length - 1]);

  //     await waitFor(() => expect(api.createUser).toHaveBeenCalled());
  //   });

  it("calls editUser API on update", async () => {
    api.editUser.mockResolvedValue({});
    setup();
    await waitFor(() => {
      expect(screen.getAllByText(/user one/i).length).toBeGreaterThan(0);
    });
    fireEvent.click(screen.getAllByRole("button", { name: /edit/i })[0]);
    fireEvent.change(screen.getByPlaceholderText(/full name/i), {
      target: { value: "Updated Name" },
    });
    fireEvent.click(screen.getByRole("button", { name: /update/i }));
    await waitFor(() => expect(api.editUser).toHaveBeenCalled());
  });

  it("calls deleteUser API on confirm delete", async () => {
    api.deleteUser.mockResolvedValue({});
    setup();
    await waitFor(() => {
      expect(screen.getAllByText(/user one/i).length).toBeGreaterThan(0);
    });
    fireEvent.click(screen.getAllByRole("button", { name: /delete/i })[0]);
    const deleteButtons = screen.getAllByRole("button", {
      name: /delete user/i,
    });
    fireEvent.click(deleteButtons[deleteButtons.length - 1]);
    await waitFor(() => expect(api.deleteUser).toHaveBeenCalled());
  });

  it("shows error toast on API error", async () => {
    api.getAllUsers.mockRejectedValue(new Error("API error"));
    setup();
    await waitFor(() => {
      expect(require("react-toastify").toast.error).toHaveBeenCalled();
    });
  });
});
