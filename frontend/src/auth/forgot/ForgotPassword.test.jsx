/* eslint-disable no-undef */
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import MovieForgotPassword from "./ForgotPassword";
import { BrowserRouter } from "react-router-dom";
import * as api from "../../services/API";

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

// Mock forgot API
jest.mock("../../services/API", () => ({
  forgot: jest.fn(),
}));

const renderWithRouter = (ui) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

describe("MovieForgotPassword", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders forgot password form", () => {
    renderWithRouter(<MovieForgotPassword />);
    expect(
      screen.getByPlaceholderText(/enter your email address/i)
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /send reset instructions/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /back to login/i })
    ).toBeInTheDocument();
  });

  it("shows error if email is empty", async () => {
    renderWithRouter(<MovieForgotPassword />);
    fireEvent.click(
      screen.getByRole("button", { name: /send reset instructions/i })
    );
    expect(await screen.findByText(/email is required/i)).toBeInTheDocument();
  });

  it("shows error if email format is invalid", async () => {
    renderWithRouter(<MovieForgotPassword />);
    fireEvent.change(screen.getByPlaceholderText(/enter your email address/i), {
      target: { value: "invalidemail" },
    });
    fireEvent.click(
      screen.getByRole("button", { name: /send reset instructions/i })
    );
    expect(
      await screen.findByText(/invalid email format/i)
    ).toBeInTheDocument();
  });

  it("calls forgot API and navigates on valid email", async () => {
    api.forgot.mockResolvedValue({ message: "Success" });
    renderWithRouter(<MovieForgotPassword />);
    fireEvent.change(screen.getByPlaceholderText(/enter your email address/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.click(
      screen.getByRole("button", { name: /send reset instructions/i })
    );
    await waitFor(() => {
      expect(api.forgot).toHaveBeenCalledWith({ email: "test@example.com" });
      expect(mockNavigate).toHaveBeenCalledWith("/verification", {
        state: { email: "test@example.com" },
      });
    });
  });

  // it("shows API error message if forgot API fails", async () => {
  //   api.forgot.mockRejectedValue({ message: "Email not found" });
  //   renderWithRouter(<MovieForgotPassword />);
  //   fireEvent.change(screen.getByPlaceholderText(/enter your email address/i), {
  //     target: { value: "notfound@example.com" },
  //   });
  //   fireEvent.click(
  //     screen.getByRole("button", { name: /send reset instructions/i })
  //   );
  //   expect(await screen.findByText(/email not found/i)).toBeInTheDocument();
  // });

  it("navigates to login when Back to Login is clicked", () => {
    renderWithRouter(<MovieForgotPassword />);
    fireEvent.click(screen.getByRole("button", { name: /back to login/i }));
    expect(mockNavigate).toHaveBeenCalledWith("/login");
  });
});
