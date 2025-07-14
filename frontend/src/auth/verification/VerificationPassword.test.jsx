/* eslint-disable no-undef */
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import EmailVerification from "./VerificationPassword";
import * as api from "../../services/API";

// Mock useNavigate, useLocation
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
  useLocation: () => ({ state: { email: "test@example.com" } }),
}));

// Mock API
jest.mock("../../services/API", () => ({
  verification: jest.fn(),
  forgot: jest.fn(),
}));

describe("EmailVerification", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders verification inputs and submit button", () => {
    render(
      <BrowserRouter>
        <EmailVerification />
      </BrowserRouter>
    );
    expect(screen.getByText(/verify your email/i)).toBeInTheDocument();
    expect(screen.getAllByRole("textbox")).toHaveLength(6);
    expect(
      screen.getByRole("button", { name: /verify email/i })
    ).toBeInTheDocument();
  });

  //   it("shows error if code is incomplete", async () => {
  //     render(
  //       <BrowserRouter>
  //         <EmailVerification />
  //       </BrowserRouter>
  //     );npm
  //     fireEvent.click(screen.getByRole("button", { name: /verify email/i }));
  //     expect(
  //       await screen.findByText(/please enter complete 6-digit code/i)
  //     ).toBeInTheDocument();
  //   });

  it("calls verification API and shows success on valid code", async () => {
    api.verification.mockResolvedValue({ token: "token", user: { id: 1 } });
    render(
      <BrowserRouter>
        <EmailVerification />
      </BrowserRouter>
    );
    const inputs = screen.getAllByRole("textbox");
    inputs.forEach((input, idx) => {
      fireEvent.change(input, { target: { value: String(idx + 1) } });
    });
    fireEvent.click(screen.getByRole("button", { name: /verify email/i }));
    expect(api.verification).toHaveBeenCalledWith({
      resetCode: "123456",
      email: "test@example.com",
    });
    expect(await screen.findByText(/email verified/i)).toBeInTheDocument();
  });

  //   it("shows error if verification API fails", async () => {
  //     api.verification.mockRejectedValue({ message: "Verification failed!" });
  //     render(
  //       <BrowserRouter>
  //         <EmailVerification />
  //       </BrowserRouter>
  //     );
  //     const inputs = screen.getAllByRole("textbox");
  //     inputs.forEach((input, idx) => {
  //       fireEvent.change(input, { target: { value: String(idx + 1) } });
  //     });
  //     fireEvent.click(screen.getByRole("button", { name: /verify email/i }));
  //     expect(await screen.findByText(/verification failed/i)).toBeInTheDocument();
  //   });

  it("calls forgot API when resend is clicked", async () => {
    api.forgot.mockResolvedValue({});
    render(
      <BrowserRouter>
        <EmailVerification />
      </BrowserRouter>
    );
    const resendBtn = screen.getByRole("button", {
      name: /resend verification code/i,
    });
    fireEvent.click(resendBtn);
    await waitFor(() => {
      expect(api.forgot).toHaveBeenCalledWith({ email: "test@example.com" });
    });
  });

  it("shows error when resend is clicked more than 3 times", async () => {
    api.forgot.mockResolvedValue({});
    render(
      <BrowserRouter>
        <EmailVerification />
      </BrowserRouter>
    );
    const resendBtn = screen.getByRole("button", {
      name: /resend verification code/i,
    });
    fireEvent.click(resendBtn);
    await waitFor(() => expect(api.forgot).toHaveBeenCalledTimes(1));
    fireEvent.click(resendBtn);
    await waitFor(() => expect(api.forgot).toHaveBeenCalledTimes(2));
    fireEvent.click(resendBtn);
    await waitFor(() => expect(api.forgot).toHaveBeenCalledTimes(3));
    // 4th click should show error
    fireEvent.click(resendBtn);
    expect(
      await screen.findByText(/maximum resend attempts reached/i)
    ).toBeInTheDocument();
  });
});
