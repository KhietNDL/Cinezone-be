/* eslint-disable no-undef */
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import RegistrationForm from "./Register";
import { BrowserRouter } from "react-router-dom";
// import { AuthContext } from "../../context/AuthContext";
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

// Mock register API
jest.mock("../../services/API", () => ({
  register: jest.fn(),
}));

// Mock AuthContext
const mockSignIn = jest.fn();
jest.mock("../../context/AuthContext", () => ({
  useAuth: () => mockSignIn,
}));

const renderWithProviders = (ui) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

describe("RegistrationForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders registration form", () => {
    renderWithProviders(<RegistrationForm />);
    expect(
      screen.getByPlaceholderText(/enter your full name/i)
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/enter your email/i)
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/create a strong password/i)
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/your phone/i)).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/your identification card/i)
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /create account/i })
    ).toBeInTheDocument();
  });

  it("shows errors if required fields are empty", async () => {
    renderWithProviders(<RegistrationForm />);
    fireEvent.click(screen.getByRole("button", { name: /create account/i }));
    expect(
      await screen.findByText(/full name is required/i)
    ).toBeInTheDocument();
    expect(await screen.findByText(/email is required/i)).toBeInTheDocument();
    expect(
      await screen.findByText(/password is required/i)
    ).toBeInTheDocument();
    expect(
      await screen.findByText(/phone number is required/i)
    ).toBeInTheDocument();
    expect(
      await screen.findByText(/date of birth is required/i)
    ).toBeInTheDocument();
    expect(await screen.findByText(/sex is required/i)).toBeInTheDocument();
    expect(
      await screen.findByText(/identification card is required/i)
    ).toBeInTheDocument();
  });

  it("shows error if email format is invalid", async () => {
    renderWithProviders(<RegistrationForm />);
    fireEvent.change(screen.getByPlaceholderText(/enter your full name/i), {
      target: { value: "Nguyen Van A" },
    });
    fireEvent.change(screen.getByPlaceholderText(/enter your email/i), {
      target: { value: "invalidemail" },
    });
    fireEvent.change(screen.getByPlaceholderText(/create a strong password/i), {
      target: { value: "Password1!" },
    });
    fireEvent.change(screen.getByPlaceholderText(/your phone/i), {
      target: { value: "0123456789" },
    });
    fireEvent.change(screen.getByPlaceholderText(/your identification card/i), {
      target: { value: "123456789012" },
    });
    fireEvent.change(screen.getByLabelText(/date of birth/i), {
      target: { value: "2000-01-01" },
    });
    fireEvent.change(screen.getByLabelText(/gender/i), {
      target: { value: "1" },
    });
    fireEvent.click(screen.getByRole("button", { name: /create account/i }));
    expect(
      await screen.findByText(/please enter a valid email/i)
    ).toBeInTheDocument();
  });

  it("shows error if password is weak", async () => {
    renderWithProviders(<RegistrationForm />);
    fireEvent.change(screen.getByPlaceholderText(/enter your full name/i), {
      target: { value: "Nguyen Van A" },
    });
    fireEvent.change(screen.getByPlaceholderText(/enter your email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/create a strong password/i), {
      target: { value: "short" },
    });
    fireEvent.change(screen.getByPlaceholderText(/your phone/i), {
      target: { value: "0123456789" },
    });
    fireEvent.change(screen.getByPlaceholderText(/your identification card/i), {
      target: { value: "123456789012" },
    });
    fireEvent.change(screen.getByLabelText(/date of birth/i), {
      target: { value: "2000-01-01" },
    });
    fireEvent.change(screen.getByLabelText(/gender/i), {
      target: { value: "1" },
    });
    fireEvent.click(screen.getByRole("button", { name: /create account/i }));
    expect(
      await screen.findByText(/password must be at least 8 characters/i)
    ).toBeInTheDocument();
  });

  it("calls register API and signIn on valid submit", async () => {
    api.register.mockResolvedValue({
      token: "fake-jwt-token",
      user: { userId: "123" },
    });
    renderWithProviders(<RegistrationForm />);
    fireEvent.change(screen.getByPlaceholderText(/enter your full name/i), {
      target: { value: "Nguyen Van A" },
    });
    fireEvent.change(screen.getByPlaceholderText(/enter your email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/create a strong password/i), {
      target: { value: "Password1!" },
    });
    fireEvent.change(screen.getByPlaceholderText(/your phone/i), {
      target: { value: "0123456789" },
    });
    fireEvent.change(screen.getByPlaceholderText(/your identification card/i), {
      target: { value: "123456789012" },
    });
    fireEvent.change(screen.getByLabelText(/date of birth/i), {
      target: { value: "2000-01-01" },
    });
    fireEvent.change(screen.getByLabelText(/gender/i), {
      target: { value: "1" },
    });
    fireEvent.click(screen.getByRole("button", { name: /create account/i }));
    await waitFor(() => {
      expect(api.register).toHaveBeenCalledWith(
        {
          email: "test@example.com",
          password: "Password1!",
          fullName: "Nguyen Van A",
          dateOfBirth: "2000-01-01",
          sex: 1,
          phoneNumber: "0123456789",
          cccd: "123456789012",
        },
        false
      );
      expect(mockSignIn).toHaveBeenCalled();
    });
  });
});
