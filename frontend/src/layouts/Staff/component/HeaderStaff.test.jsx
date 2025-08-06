/* eslint-disable no-undef */
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

// Mock useAuth from AuthContext
let mockUser = null;
const mockSignOut = jest.fn();

jest.mock("../../../context/AuthContext", () => ({
  useAuth: () => ({
    user: mockUser,
    signOut: mockSignOut,
  }),
}));

// Dynamic import để áp dụng mock đúng
const renderHeader = () => {
  const HeaderStaff = require("./HeaderStaff").default;
  return render(
    <BrowserRouter>
      <HeaderStaff />
    </BrowserRouter>
  );
};

describe("HeaderStaff component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUser = null;
  });
// 1
  it("renders Sign In button when no user is logged in", () => {
    renderHeader();
    expect(screen.getByText(/sign in/i)).toBeInTheDocument();
  });
// 2
  it("navigates to /login on Sign In click", () => {
    renderHeader();
    fireEvent.click(screen.getByText(/sign in/i));
    expect(mockNavigate).toHaveBeenCalledWith("/login");
  });
// 3
  it("renders avatar and user full name when logged in", () => {
    mockUser = { fullName: "NGUYEN NGOC MINH", avatar_url: "https://storage.googleapis.com/movie-c96b6.firebasestorage.app/avatars/1750777082196-Arcane_01.jpg?GoogleAccessId=firebase-adminsdk-fbsvc%40movie-c96b6.iam.gserviceaccount.com&Expires=16730323200&Signature=bnvwI4LC9r2uJJyVU2%2BXGsrym8BZuJ1IIaIZ%2BWGCURIxZ743LVEpB8atyHLr24ZlfxmEvRhtX3OQDpWVzJhkGIdsCfTyzBK7tMQgycuA8%2FqTAsDtTJAFP%2F2O1nGCKIORvtcIaVpAz3lp%2By4gOLmmmmJsl3OmU2IZTEv%2BnbBckwpjaYGg2RBp6CcdiKhCKhrj7DECfu0EaKuBeQgEndvlMuhVlF8t78LHMn%2FWuum5VJDRYDZCx436%2FLiTz9jW%2BhFVW%2FonOYtKsiLX5EuslfCkc5fVjwplPHBbK6rXyaSX0GIMz%2BdMTkXN91JF8ZDNEziRZhAt61E%2F0jenM%2B00HxtUZg%3D%3D" };
    renderHeader();
    expect(screen.getByText("NGUYEN NGOC MINH")).toBeInTheDocument();
    expect(screen.getByRole("img")).toHaveAttribute("src", "https://storage.googleapis.com/movie-c96b6.firebasestorage.app/avatars/1750777082196-Arcane_01.jpg?GoogleAccessId=firebase-adminsdk-fbsvc%40movie-c96b6.iam.gserviceaccount.com&Expires=16730323200&Signature=bnvwI4LC9r2uJJyVU2%2BXGsrym8BZuJ1IIaIZ%2BWGCURIxZ743LVEpB8atyHLr24ZlfxmEvRhtX3OQDpWVzJhkGIdsCfTyzBK7tMQgycuA8%2FqTAsDtTJAFP%2F2O1nGCKIORvtcIaVpAz3lp%2By4gOLmmmmJsl3OmU2IZTEv%2BnbBckwpjaYGg2RBp6CcdiKhCKhrj7DECfu0EaKuBeQgEndvlMuhVlF8t78LHMn%2FWuum5VJDRYDZCx436%2FLiTz9jW%2BhFVW%2FonOYtKsiLX5EuslfCkc5fVjwplPHBbK6rXyaSX0GIMz%2BdMTkXN91JF8ZDNEziRZhAt61E%2F0jenM%2B00HxtUZg%3D%3D");
  });
// 4
  it("toggles dropdown when user box is clicked", () => {
    mockUser = { fullName: "NGUYEN NGOC MINH" };
    renderHeader();
    fireEvent.click(screen.getByText("NGUYEN NGOC MINH"));
    expect(screen.getByText(/sign out/i)).toBeInTheDocument();
  });
// 5
  // it("opens confirmation modal on Sign Out click", () => {
  //   mockUser = { fullName: "NGUYEN NGOC MINH" };
  //   renderHeader();
  //   fireEvent.click(screen.getByText("NGUYEN NGOC MINH"));
  //   fireEvent.click(screen.getByText("Sign Out"));
  //   expect(screen.getByText(/do you want to sign out/i)).toBeInTheDocument();
  // });
// 6
  it("executes signOut and navigates on confirm logout", async () => {
    mockUser = { fullName: "NGUYEN NGOC MINH" };
    renderHeader();
    fireEvent.click(screen.getByText("NGUYEN NGOC MINH"));
    fireEvent.click(screen.getByText("Sign Out"));

    const confirmBtn = screen.getByRole("button", { name: /sign out/i });
    fireEvent.click(confirmBtn);

    await waitFor(() => {
      expect(mockSignOut).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith("/");
    });
  });
// 7
  it("closes modal when Cancel is clicked", () => {
    mockUser = { fullName: "NGUYEN NGOC MINH" };
    renderHeader();
    fireEvent.click(screen.getByText("NGUYEN NGOC MINH"));
    fireEvent.click(screen.getByText("Sign Out"));
    fireEvent.click(screen.getByRole("button", { name: /cancel/i }));
    expect(screen.queryByText(/do you want to sign out/i)).not.toBeInTheDocument();
  });
// 8
  // it("renders loading spinner during sign out", async () => {
  //   mockSignOut.mockImplementation(() => new Promise((res) => setTimeout(res, 500)));
  //   mockUser = { fullName: "NGUYEN NGOC MINH" };
  //   renderHeader();

  //   fireEvent.click(screen.getByText("NGUYEN NGOC MINH"));
  //   fireEvent.click(screen.getByText("Sign Out"));

  //   const signOutBtn = screen.getByRole("button", { name: /sign out/i });
  //   fireEvent.click(signOutBtn);

  //   expect(await screen.findByText(/sign out.../i)).toBeInTheDocument();
  // });
});
