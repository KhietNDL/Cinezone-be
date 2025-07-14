/* eslint-disable no-undef */
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import MovieTheaterLogin from "./Login";
import { BrowserRouter } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import * as api from "../../services/API";

// Mock toast
jest.mock("react-toastify", () => ({
  toast: { success: jest.fn(), error: jest.fn() },
}));

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
  Link: ({ to, children }) => <a href={to}>{children}</a>,
}));

// Mock login API
jest.mock("../../services/API", () => ({
  login: jest.fn(),
}));

// Mock AuthContext
const mockSignIn = jest.fn();
const renderWithProviders = (ui) => {
  return render(
    <AuthContext.Provider value={{ signIn: mockSignIn }}>
      <BrowserRouter>{ui}</BrowserRouter>
    </AuthContext.Provider>
  );
};

describe("MovieTheaterLogin", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  // 1
  it("renders login form", () => {
    renderWithProviders(<MovieTheaterLogin />);
    expect(
      screen.getByPlaceholderText(/enter your email/i)
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/enter password/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /sign in/i })
    ).toBeInTheDocument();
  });
  // 2
  it("shows error if email and password are empty", async () => {
    renderWithProviders(<MovieTheaterLogin />);
    fireEvent.click(screen.getByRole("button", { name: /sign in/i }));
    expect(await screen.findByText(/email is required/i)).toBeInTheDocument();
    expect(
      await screen.findByText(/password is required/i)
    ).toBeInTheDocument();
  });
  // 3
  it("shows error if email format is invalid", async () => {
    renderWithProviders(<MovieTheaterLogin />);
    fireEvent.change(screen.getByPlaceholderText(/enter your email/i), {
      target: { value: "invalidemail" },
    });
    fireEvent.change(screen.getByPlaceholderText(/enter password/i), {
      target: { value: "password123" },
    });
    fireEvent.click(screen.getByRole("button", { name: /sign in/i }));

    expect(
      await screen.findByText((content) =>
        content.toLowerCase().includes("invalid email format")
      )
    ).toBeInTheDocument();
  });
  // 4
  it("shows error if password is less than 8 characters", async () => {
    renderWithProviders(<MovieTheaterLogin />);
    fireEvent.change(screen.getByPlaceholderText(/enter your email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/enter password/i), {
      target: { value: "short" },
    });
    fireEvent.click(screen.getByRole("button", { name: /sign in/i }));
    expect(
      await screen.findByText(/password must be at least 8 characters/i)
    ).toBeInTheDocument();
  });
  // 5
  it("calls login API and signIn on valid submit", async () => {
    api.login.mockResolvedValue({
      token: "fake-jwt-token",
      user: { userId: "123" },
    });
    renderWithProviders(<MovieTheaterLogin />);
    fireEvent.change(screen.getByPlaceholderText(/enter your email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/enter password/i), {
      target: { value: "password123" },
    });
    fireEvent.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() => {
      expect(api.login).toHaveBeenCalledWith({
        email: "test@example.com",
        password: "password123",
      });
      expect(mockSignIn).toHaveBeenCalled();
    });
  });
});
