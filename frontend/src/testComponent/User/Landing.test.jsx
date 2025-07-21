/* eslint-disable */
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import LandingPage from "../../layouts/User/component/Landing";
import * as api from "../../services/API";
import { useNavigate } from "react-router-dom";

// Thêm các dòng này để mock CSS
jest.mock("swiper/css", () => {});
jest.mock("swiper/css/pagination", () => {});
jest.mock("swiper/css/navigation", () => {});

// Mock Swiper (nếu cần)
jest.mock("swiper/react", () => ({
  Swiper: ({ children }) => <div>{children}</div>,
  SwiperSlide: ({ children, ...props }) => <div {...props}>{children}</div>,
}));
jest.mock("swiper/modules", () => ({
  Pagination: () => null,
  Navigation: () => null,
}));

// Mock toast
jest.mock("react-toastify", () => ({
  toast: { success: jest.fn(), error: jest.fn() },
}));

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

// Mock redux
jest.mock("react-redux", () => ({
  useDispatch: () => jest.fn(),
  useSelector: () => ({}),
}));

// Mock API
jest.mock("../../services/API", () => ({
  getMovies: jest.fn(),
  getCurrentMovies: jest.fn(),
  getUpcomingMovies: jest.fn(),
  getPromotion: jest.fn(),
}));

describe("LandingPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    api.getMovies.mockResolvedValue({
      data: [
        {
          NameOfEnglish: "Current Movie",
          idMovie: 1,
          PosterImage: "poster.jpg",
        },
      ],
    });
    api.getCurrentMovies.mockResolvedValue({
      data: [
        {
          NameOfEnglish: "Current Movie",
          idMovie: 2,
          MovieId: 2,
          PosterImage: "poster.jpg",
          FromDate: "2024-06-01",
          ToDate: "2024-06-30",
          RunningTime: 120,
          Genres: "Action",
        },
      ],
    });
    api.getUpcomingMovies.mockResolvedValue({
      data: [
        {
          NameOfEnglish: "Upcoming Movie",
          idMovie: 3,
          MovieId: 3,
          PosterImage: "poster2.jpg",
          FromDate: "2024-07-01",
          ToDate: "2024-07-30",
          RunningTime: 100,
          Genres: "Drama",
        },
      ],
    });
    api.getPromotion.mockResolvedValue({
      data: [
        {
          idPromotion: 1,
          Title: "PROMO1",
          StartTime: "2024-01-01",
          EndTime: "2099-01-01",
          Image: "promo.jpg",
        },
      ],
    });
    Object.assign(navigator, { clipboard: { writeText: jest.fn() } });
  });

  it("renders main sections", async () => {
    render(<LandingPage />);
    expect(await screen.findByText(/now showing/i)).toBeInTheDocument();
    expect(screen.getByText(/coming soon/i)).toBeInTheDocument();
    expect(screen.getByText(/special promotions/i)).toBeInTheDocument();
  });

  it("calls all APIs on mount", async () => {
    render(<LandingPage />);
    await waitFor(() => {
      expect(api.getMovies).toHaveBeenCalled();
      expect(api.getCurrentMovies).toHaveBeenCalled();
      expect(api.getUpcomingMovies).toHaveBeenCalled();
      expect(api.getPromotion).toHaveBeenCalled();
    });
  });

  it("shows current and upcoming movies", async () => {
    render(<LandingPage />);
    expect(await screen.findByText("Current Mo...")).toBeInTheDocument();
    expect(screen.getByText("Upcoming M...")).toBeInTheDocument();
  });

  it("navigates to movie detail when Book Now is clicked", async () => {
    render(<LandingPage />);
    // Đợi render xong
    const bookNowBtn = await screen.findByRole("button", { name: /book now/i });
    fireEvent.click(bookNowBtn);
    expect(mockNavigate).toHaveBeenCalledWith("/current-movie");
  });

  it("shows promotion and copies code on click", async () => {
    render(<LandingPage />);
    const promoImg = await screen.findByAltText(/promo1/i);

    // Hover đúng SwiperSlide (thường là parentElement.parentElement)
    const swiperSlide = promoImg.parentElement.parentElement;
    fireEvent.mouseEnter(swiperSlide);

    // Log DOM để debug nếu cần
    // console.log(document.body.innerHTML);

    // Dùng matcher function để tìm text
    const promoTexts = await screen.findAllByText(
      (content, node) =>
        node.textContent && node.textContent.includes("PROMO1"),
      {},
      { timeout: 1000 }
    );
    expect(promoTexts.length).toBeGreaterThan(0);

    // Click vào tất cả các overlay
    promoTexts.forEach((span) => fireEvent.click(span));
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith("PROMO1");
  });
});
