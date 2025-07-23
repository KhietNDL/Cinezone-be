/* eslint-disable */
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import EditAccount from "../../layouts/User/component/EditAccount";
import * as api from "../../services/API";
import * as AuthContext from "../../context/AuthContext";

// Mock toast
jest.mock("react-toastify", () => ({
  toast: { success: jest.fn(), error: jest.fn() },
}));

// Mock updateAccount API
jest.mock("../../services/API", () => ({
  updateAccount: jest.fn(),
}));

const mockSetUser = jest.fn();
const defaultUser = {
  userId: "1",
  fullName: "Test User",
  dateOfBirth: "2000-01-01",
  phoneNumber: "0123456789",
  sex: 2,
  email: "test@example.com",
  cccd: "123456789",
  address: "123 Street",
  avatar_url: "",
};

function renderWithAuth({ user = defaultUser, isLoading = false } = {}) {
  jest.spyOn(AuthContext, "useAuth").mockReturnValue({
    user,
    isLoading,
    setUser: mockSetUser,
  });
  return render(<EditAccount />);
}

describe("EditAccount", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders loading when authLoading is true", () => {
    renderWithAuth({ isLoading: true });
    expect(screen.getByText(/loading information/i)).toBeInTheDocument();
  });

  it("renders not found when user is null", () => {
    renderWithAuth({ user: null });
    expect(screen.getByText(/user information not found/i)).toBeInTheDocument();
  });

  it("renders user info", () => {
    renderWithAuth();
    expect(screen.getAllByText(/test user/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/test@example.com/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/male/i)).toBeInTheDocument();
    expect(screen.getByText(/2000/i)).toBeInTheDocument();
  });

  it("switches to edit mode when Edit Profile is clicked", () => {
    renderWithAuth();
    fireEvent.click(screen.getByRole("button", { name: /edit profile/i }));
    expect(screen.getByText(/edit profile information/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/enter full name/i)).toBeInTheDocument();
  });

  it("cancels edit and returns to view mode", () => {
    renderWithAuth();
    fireEvent.click(screen.getByRole("button", { name: /edit profile/i }));
    fireEvent.click(screen.getByRole("button", { name: /cancel/i }));
    expect(screen.getAllByText(/test user/i).length).toBeGreaterThan(0);
    expect(
      screen.queryByText(/edit profile information/i)
    ).not.toBeInTheDocument();
  });

  it("shows error if required fields are missing", async () => {
    renderWithAuth();
    fireEvent.click(screen.getByRole("button", { name: /edit profile/i }));
    fireEvent.change(screen.getByPlaceholderText(/enter full name/i), {
      target: { value: "" },
    });
    fireEvent.change(screen.getByPlaceholderText(/enter email/i), {
      target: { value: "" },
    });
    fireEvent.click(screen.getByRole("button", { name: /save changes/i }));
    await waitFor(() => {
      expect(require("react-toastify").toast.error).toHaveBeenCalledWith(
        expect.stringMatching(/please fill in required fields/i)
      );
    });
  });

  it("calls updateAccount API and shows success toast", async () => {
    api.updateAccount.mockResolvedValue({
      success: true,
      user: { avatar_url: "avatar.png" },
    });
    renderWithAuth();
    fireEvent.click(screen.getByRole("button", { name: /edit profile/i }));
    fireEvent.change(screen.getByPlaceholderText(/enter full name/i), {
      target: { value: "New Name" },
    });
    fireEvent.click(screen.getByRole("button", { name: /save changes/i }));
    await waitFor(() => {
      expect(api.updateAccount).toHaveBeenCalled();
      expect(require("react-toastify").toast.success).toHaveBeenCalledWith(
        expect.stringMatching(/profile updated successfully/i)
      );
    });
  });

  it("shows default avatar when no avatar", () => {
    renderWithAuth({ user: { ...defaultUser, avatar_url: "" } });
    expect(screen.getByText("T")).toBeInTheDocument();
  });
});
