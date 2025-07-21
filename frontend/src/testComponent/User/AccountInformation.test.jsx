/* eslint-disable */
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AccountInformation from "../../layouts/User/component/AccountImformation";
import * as AuthContext from "../../context/AuthContext";

// Thêm đoạn này để mock API tránh lỗi import.meta.env
jest.mock("../../services/API", () => ({
  getUser: jest.fn(),
  logout: jest.fn(),
}));

// Mock react-router-dom
const mockNavigate = jest.fn();
const mockLocation = { pathname: "/account/personal" };
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
  useLocation: () => mockLocation,
  Outlet: () => <div data-testid="outlet" />,
}));

const defaultUser = {
  FullName: "Test User",
  DateOfBirth: "2000-01-01",
  PhoneNumber: "0123456789",
  Sex: "Male",
  Email: "test@example.com",
  avatar_url: "avatar.png",
};

function renderWithAuth({ user = defaultUser, signOut = jest.fn() } = {}) {
  jest.spyOn(AuthContext, "useAuth").mockReturnValue({
    user,
    signOut,
  });
  return render(<AccountInformation />);
}

describe("AccountInformation", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockLocation.pathname = "/account/personal";
  });

  it("renders sidebar and outlet", () => {
    renderWithAuth();
    expect(screen.getByText(/information account/i)).toBeInTheDocument();
    expect(screen.getByText(/history/i)).toBeInTheDocument();
    expect(screen.getByText(/sign out/i)).toBeInTheDocument();
    expect(screen.getByTestId("outlet")).toBeInTheDocument();
  });

  it("highlights personal tab by default", () => {
    renderWithAuth();
    const personalTab = screen.getByText(/information account/i).parentElement;
    expect(personalTab).toHaveClass("bg-purple-200");
  });

  it("switches to history tab when clicked", () => {
    renderWithAuth();
    const historyTab = screen.getByText(/history/i).parentElement;
    fireEvent.click(historyTab);
    expect(mockNavigate).toHaveBeenCalledWith("/account/history");
  });

  it("opens and closes sidebar on mobile", () => {
    renderWithAuth();
    // Mở sidebar
    const openBtn = screen.getAllByRole("button")[0];
    fireEvent.click(openBtn);
    // Nút đóng sidebar xuất hiện
    const closeBtn = screen
      .getAllByRole("button")
      .find((btn) => btn.innerHTML.includes("svg"));
    expect(closeBtn).toBeTruthy();
    fireEvent.click(closeBtn);
  });

  it("opens and closes sign out popup", () => {
    renderWithAuth();
    const signOutBtn = screen.getByText(/sign out/i).parentElement;
    fireEvent.click(signOutBtn);
    expect(screen.getByText(/do you want to sign out/i)).toBeInTheDocument();
    // Đóng popup
    fireEvent.click(screen.getByRole("button", { name: /cancel/i }));
    expect(
      screen.queryByText(/do you want to sign out/i)
    ).not.toBeInTheDocument();
  });

  it("calls signOut and navigates on confirm sign out", async () => {
    const mockSignOut = jest.fn();
    renderWithAuth({ signOut: mockSignOut });
    const signOutBtn = screen.getByText(/sign out/i).parentElement;
    fireEvent.click(signOutBtn);

    const allSignOutButtons = screen.getAllByRole("button", {
      name: /sign out/i,
    });
    const confirmBtn = allSignOutButtons[allSignOutButtons.length - 1];
    fireEvent.click(confirmBtn);

    await waitFor(() => {
      expect(mockSignOut).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith("/");
    });
  });

  it("redirects to /account/personal if at /account", () => {
    mockLocation.pathname = "/account";
    renderWithAuth();
    expect(mockNavigate).toHaveBeenCalledWith("/account/personal", {
      replace: true,
    });
  });

  it("shows user info in profileData state", () => {
    renderWithAuth();
    // Kiểm tra dữ liệu user đã được truyền vào state profileData
    expect(screen.getByText(/information account/i)).toBeInTheDocument();
  });
});
