/* eslint-disable */
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import HeaderAdmin from "../../../layouts/Admin/component/HeaderAdmin";
import * as AuthContext from "../../../context/AuthContext";

// Mock logo import
jest.mock("../../../assets/logoWeb.png", () => "logoWeb.png");

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

// Mock API calls
jest.mock("../../../services/API", () => ({
  getUser: jest.fn(),
  logout: jest.fn(),
}));

const mockUser = {
  avatar_url: "avatar.png",
  fullName: "Admin User",
};

function renderHeaderAdmin(props = {}) {
  jest.spyOn(AuthContext, "useAuth").mockReturnValue({
    user: mockUser,
    signOut: jest.fn(),
  });
  return render(
    <HeaderAdmin onToggleSidebar={jest.fn()} isSidebarOpen={false} {...props} />
  );
}

describe("HeaderAdmin", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders logo and navigates to dashboard on click", () => {
    renderHeaderAdmin();
    const logo = screen.getByAltText("Logo");
    expect(logo).toBeInTheDocument();
    fireEvent.click(logo);
    expect(mockNavigate).toHaveBeenCalledWith("/admin/dashboard");
  });

  it("renders avatar and admin name", () => {
    renderHeaderAdmin();
    expect(screen.getByAltText("avatar")).toBeInTheDocument();
    expect(screen.getAllByText("Admin User")[0]).toBeInTheDocument();
    expect(screen.getAllByText("Admin")[0]).toBeInTheDocument();
  });

  it("opens and closes dropdown on profile click", async () => {
    renderHeaderAdmin();
    const profile = screen.getByTestId("profile-trigger");
    fireEvent.click(profile);
    expect(screen.getByText("Logout")).toBeInTheDocument();
    // Click backdrop to close
    const backdrop =
      screen.getByRole("presentation", { hidden: true }) ||
      document.querySelector(".fixed.inset-0");
    fireEvent.click(document.querySelector(".fixed.inset-0"));
    // Chờ cho dropdown thực sự bị ẩn
    await waitFor(() => {
      const dropdown = screen.getByTestId("dropdown-menu");
      expect(dropdown).toHaveClass("opacity-0");
      expect(dropdown).toHaveClass("pointer-events-none");
    });
  });

  it("calls signOut and navigates on logout", async () => {
    const mockSignOut = jest.fn();
    jest.spyOn(AuthContext, "useAuth").mockReturnValue({
      user: mockUser,
      signOut: mockSignOut,
    });
    render(<HeaderAdmin onToggleSidebar={jest.fn()} isSidebarOpen={false} />);
    // Open dropdown
    fireEvent.click(screen.getByTestId("profile-trigger"));
    // Click logout
    fireEvent.click(screen.getByText("Logout"));
    await waitFor(() => {
      expect(mockSignOut).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith("/");
    });
  });

  it("shows loading spinner when logging out", async () => {
    let resolveSignOut;
    const signOutPromise = new Promise((res) => (resolveSignOut = res));
    jest.spyOn(AuthContext, "useAuth").mockReturnValue({
      user: mockUser,
      signOut: () => signOutPromise,
    });
    render(<HeaderAdmin onToggleSidebar={jest.fn()} isSidebarOpen={false} />);
    // Sử dụng getAllByText để lấy đúng phần tử profile trigger
    const profileTriggers = screen.getAllByText("Admin User");
    // Click vào phần tử đầu tiên (profile ở header)
    fireEvent.click(profileTriggers[0].closest("div"));
    fireEvent.click(screen.getByText("Logout"));
    expect(screen.getByText(/Logging out/i)).toBeInTheDocument();
    resolveSignOut();
    await waitFor(() => {
      expect(screen.queryByText(/Logging out/i)).not.toBeInTheDocument();
    });
  });

  it("calls onToggleSidebar when sidebar button is clicked", () => {
    const onToggleSidebar = jest.fn();
    renderHeaderAdmin({ onToggleSidebar });
    const btn = screen.getAllByRole("button")[0];
    fireEvent.click(btn);
    expect(onToggleSidebar).toHaveBeenCalled();
  });

  it("shows X icon when isSidebarOpen is true", () => {
    renderHeaderAdmin({ isSidebarOpen: true });
    expect(screen.getByTestId("lucide-x")).toBeInTheDocument();
  });

  it("shows Menu icon when isSidebarOpen is false", () => {
    renderHeaderAdmin({ isSidebarOpen: false });
    expect(screen.getByTestId("lucide-menu")).toBeInTheDocument();
  });
});
