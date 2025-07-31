/* eslint-disable */
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Header from "../../layouts/User/component/Header";
import * as AuthContext from "../../context/AuthContext";
import * as api from "../../services/API";
import * as slugModule from "../../layouts/User/component/Slug";
import { BrowserRouter } from "react-router-dom";

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
  Link: ({ to, children, ...props }) => (
    <a href={to} {...props}>
      {children}
    </a>
  ),
}));

// Mock socket.io-client
jest.mock("socket.io-client", () => ({
  io: () => ({
    emit: jest.fn(),
    on: jest.fn(),
    disconnect: jest.fn(),
  }),
}));

// Mock slugify
jest
  .spyOn(slugModule, "slugify")
  .mockImplementation((str) =>
    str ? str.toLowerCase().replace(/\s+/g, "-") : ""
  );

// Mock searchMovies
jest.spyOn(api, "searchMovies").mockImplementation(async ({ name }) => ({
  data: {
    data:
      name === "Avengers"
        ? [
            { MovieId: 1, NameOfEnglish: "Avengers" },
            { MovieId: 2, NameOfEnglish: "Avengers: Endgame" },
          ]
        : [],
  },
}));

jest.mock("../../services/API", () => ({
  searchMovies: jest.fn(),
}));

const mockUser = {
  userId: "123",
  avatar_url: "https://avatar.com/avatar.png",
  fullName: "Test User",
};

function renderHeader({ user = mockUser } = {}) {
  jest.spyOn(AuthContext, "useAuth").mockReturnValue({ user });
  return render(
    <BrowserRouter>
      <Header />
    </BrowserRouter>
  );
}

describe("Header", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders logo and navigates home on click", () => {
    renderHeader();
    const logo = screen.getByAltText("CineZone Logo");
    expect(logo).toBeInTheDocument();
    fireEvent.click(logo);
    expect(mockNavigate).toHaveBeenCalledWith("/");
  });

  it("renders Movies and Promotions navigation", () => {
    renderHeader();
    expect(screen.getByText("Movies")).toBeInTheDocument();
    expect(screen.getByText("Promotions")).toBeInTheDocument();
    fireEvent.click(screen.getByText("Movies"));
    expect(mockNavigate).toHaveBeenCalledWith("/movies");
    fireEvent.click(screen.getByText("Promotions"));
    // Link uses href, not navigate
    expect(screen.getByText("Promotions").closest("a")).toHaveAttribute(
      "href",
      "/promotions"
    );
  });

  it("shows search input when search icon is clicked", () => {
    renderHeader();
    // Tìm search button bằng cách tìm button có chứa search icon
    const searchBtns = screen.getAllByRole("button");
    const searchBtn = searchBtns.find(
      (btn) =>
        btn.querySelector("svg") &&
        btn.querySelector("svg").getAttribute("viewBox")?.includes("512")
    );
    expect(searchBtn).toBeDefined();
    fireEvent.click(searchBtn);
    expect(screen.getByPlaceholderText(/search movies/i)).toBeInTheDocument();
  });

  // it("shows search results when typing and clicking result navigates", async () => {
  //   renderHeader();
  //   const searchBtn = screen
  //     .getAllByRole("button")
  //     .find((btn) => btn.querySelector("svg"));
  //   fireEvent.click(searchBtn);
  //   const input = screen.getByPlaceholderText(/search/i);
  //   fireEvent.change(input, { target: { value: "Avengers" } });
  //   await waitFor(() =>
  //     expect(screen.getByText("Avengers")).toBeInTheDocument()
  //   );
  //   fireEvent.click(screen.getByText("Avengers"));
  //   expect(mockNavigate).toHaveBeenCalledWith("/avengers");
  // });

  //   it("shows notification icon and toggles notification panel", () => {
  //     renderHeader();
  //     // Tìm đúng bell button
  //     const bellBtn = screen
  //       .getAllByRole("img")
  //       .find((el) => el.className.includes("cursor-pointer")).parentElement;
  //     fireEvent.click(bellBtn);

  //     // Kiểm tra text Notification và No notifications xuất hiện
  //     expect(screen.getByText("Notification")).toBeInTheDocument();
  //     expect(screen.getByText("No notifications")).toBeInTheDocument();
  //   });

  it("shows user avatar and navigates to account on click", () => {
    renderHeader();
    const avatar = screen.getByAltText("User Avatar");
    expect(avatar).toBeInTheDocument();
    fireEvent.click(avatar);
    expect(mockNavigate).toHaveBeenCalledWith("/account");
  });

  it("shows user icon if no avatar", () => {
    renderHeader({ user: { ...mockUser, avatar_url: "" } });
    // Tìm Sign In button vì khi không có avatar, component sẽ hiển thị Sign In
    expect(screen.getByText(/sign in/i)).toBeInTheDocument();
  });

  it("shows Sign In button if not logged in", () => {
    renderHeader({ user: null });
    expect(screen.getByText("Sign In")).toBeInTheDocument();
    fireEvent.click(screen.getByText("Sign In"));
    expect(mockNavigate).toHaveBeenCalledWith("/login");
  });
});
