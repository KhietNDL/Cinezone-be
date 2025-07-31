/* eslint-disable no-undef */
// frontend/src/testComponent/User/MovieHeroSwiper.test.jsx
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import MovieHeroSwiper from "../../layouts/User/landingComponent/MovieHeroSwiper";
import { MemoryRouter } from "react-router-dom";

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

const mockMovies = [
  {
    NameOfEnglish: "Movie One",
    PosterImage: "movie1.jpg",
    AverageRating: 8.2,
    Genres: "Action,Adventure",
    ContentSynopsis: "This is the first movie.",
    TrailerUrl: "trailer1.mp4",
    IframeUrl: "https://youtube.com/embed/abc", // Thêm dòng này
  },
  {
    NameOfEnglish: "Movie Two",
    PosterImage: "movie2.jpg",
    AverageRating: 7.5,
    Genres: "Drama,Romance",
    ContentSynopsis: "This is the second movie.",
    TrailerUrl: "trailer2.mp4",
    IframeUrl: "",
  },
];

describe("MovieHeroSwiper", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders movie info correctly", () => {
    render(
      <MemoryRouter>
        <MovieHeroSwiper movieData={mockMovies} />
      </MemoryRouter>
    );
    expect(screen.getByText(/Movie One/i)).toBeInTheDocument();
    expect(screen.getByText(/Action/i)).toBeInTheDocument();
    expect(screen.getByText(/Adventure/i)).toBeInTheDocument();
    expect(screen.getAllByText("8.2").length).toBeGreaterThan(0); // Sửa ở đây
    expect(screen.getByText(/Book Now/i)).toBeInTheDocument();
    expect(screen.getByText(/Watch Trailer/i)).toBeInTheDocument();
  });

  it("navigates to next and previous slide", () => {
    render(
      <MemoryRouter>
        <MovieHeroSwiper movieData={mockMovies} />
      </MemoryRouter>
    );
    // Next slide
    fireEvent.click(screen.getByLabelText(/Next slide/i));
    expect(screen.getByText(/Movie Two/i)).toBeInTheDocument();
    // Prev slide
    fireEvent.click(screen.getByLabelText(/Previous slide/i));
    expect(screen.getByText(/Movie One/i)).toBeInTheDocument();
  });

  it("navigates to movie detail when Book Now is clicked", () => {
    render(
      <MemoryRouter>
        <MovieHeroSwiper movieData={mockMovies} />
      </MemoryRouter>
    );
    fireEvent.click(
      screen.getByRole("button", { name: /Book tickets for Movie One/i })
    );
    expect(mockNavigate).toHaveBeenCalledWith("/movie-one");
  });

  it("shows trailer popup when Watch Trailer is clicked", () => {
    render(
      <MemoryRouter>
        <MovieHeroSwiper movieData={mockMovies} />
      </MemoryRouter>
    );
    fireEvent.click(
      screen.getByRole("button", { name: /Watch trailer for Movie One/i })
    );
    expect(screen.getByTitle(/Trailer/i)).toBeInTheDocument();
    // Đóng popup
    const unnamedButtons = screen.getAllByRole("button", { name: "" });
    fireEvent.click(unnamedButtons[unnamedButtons.length - 1]);
    expect(screen.queryByTitle(/Trailer/i)).not.toBeInTheDocument();
  });

  it("shows correct number of slide indicators and can change slide by clicking", () => {
    render(
      <MemoryRouter>
        <MovieHeroSwiper movieData={mockMovies} />
      </MemoryRouter>
    );
    const indicators = screen.getAllByRole("button");
    // There are 2 indicators, plus 2 nav arrows, plus 2 action buttons = 6 buttons
    // We'll filter by className for indicators
    const indicatorEls = indicators.filter(
      (el) => el.className && el.className.includes("w-12")
    );
    expect(indicatorEls.length).toBe(2);
    // Click second indicator
    fireEvent.click(indicatorEls[1]);
    expect(screen.getByText(/Movie Two/i)).toBeInTheDocument();
  });
});
