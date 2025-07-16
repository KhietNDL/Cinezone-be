/* eslint-disable no-undef */
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import ResetPassword from "./ResetPassword";
import * as api from "../../services/API";

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

jest.mock("../../services/API", () => ({
  resetPassword: jest.fn(),
}));

describe("ResetPassword", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders reset password form", () => {
    render(
      <BrowserRouter>
        <ResetPassword />
      </BrowserRouter>
    );
    expect(screen.getByText(/reset your password/i)).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/enter your new password/i)
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /reset password/i })
    ).toBeInTheDocument();
  });

  it("shows error if password is too short", async () => {
    render(
      <BrowserRouter>
        <ResetPassword />
      </BrowserRouter>
    );
    fireEvent.change(screen.getByPlaceholderText(/enter your new password/i), {
      target: { value: "short" },
    });
    fireEvent.click(screen.getByRole("button", { name: /reset password/i }));
    expect(
      await screen.findByText(/at least 8 characters/i)
    ).toBeInTheDocument();
  });

  it("shows error if password is too weak", async () => {
    render(
      <BrowserRouter>
        <ResetPassword />
      </BrowserRouter>
    );
    fireEvent.change(screen.getByPlaceholderText(/enter your new password/i), {
      target: { value: "abcdefgh" },
    });
    fireEvent.click(screen.getByRole("button", { name: /reset password/i }));
    expect(
      await screen.findByText(/password is too weak/i)
    ).toBeInTheDocument();
  });

  it("calls resetPassword API and shows success on valid password", async () => {
    api.resetPassword.mockResolvedValue({});
    render(
      <BrowserRouter>
        <ResetPassword />
      </BrowserRouter>
    );
    fireEvent.change(screen.getByPlaceholderText(/enter your new password/i), {
      target: { value: "Abcd1234!" },
    });
    fireEvent.click(screen.getByRole("button", { name: /reset password/i }));
    await waitFor(() => {
      expect(api.resetPassword).toHaveBeenCalledWith({
        newPassword: "Abcd1234!",
      });
    });
    expect(await screen.findByText(/password reset/i)).toBeInTheDocument();
  });

  //   it("shows error if resetPassword API fails", async () => {
  //     api.resetPassword.mockRejectedValue({ message: "Reset failed!" });
  //     render(
  //       <BrowserRouter>
  //         <ResetPassword />
  //       </BrowserRouter>
  //     );
  //     fireEvent.change(screen.getByPlaceholderText(/enter your new password/i), {
  //       target: { value: "Abcd1234!" },
  //     });
  //     fireEvent.click(screen.getByRole("button", { name: /reset password/i }));
  //     expect(await screen.findByText(/reset failed/i)).toBeInTheDocument();
  //   });

  it("shows password strength indicator", () => {
    render(
      <BrowserRouter>
        <ResetPassword />
      </BrowserRouter>
    );
    const input = screen.getByPlaceholderText(/enter your new password/i);
    fireEvent.change(input, { target: { value: "abcdefgh" } });
    expect(screen.getByTestId("password-strength-label")).toHaveTextContent(
      /medium/i
    );

    fireEvent.change(input, { target: { value: "Abcd1234!" } });
    expect(screen.getByTestId("password-strength-label")).toHaveTextContent(
      /strong/i
    );
  });
});
