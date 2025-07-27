/* eslint-disable no-undef */
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import MovieListPage from "../../../src/layouts/User/component/MovieListPage";
import { BrowserRouter } from "react-router-dom";

// Mock API
jest.mock("../../../src/services/API", () => ({
  getMovies: jest.fn(),
  searchMovies: jest.fn(),
}));
const { getMovies, searchMovies } = require("../../../src/services/API");

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

describe("MovieListPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  function renderPage() {
    return render(
      <BrowserRouter>
        <MovieListPage />
      </BrowserRouter>
    );
  }

  it("renders loading state", async () => {
    getMovies.mockResolvedValueOnce({
      data: [],
      pagination: { total: 0, currentPage: 1, totalPages: 1, limit: 8 },
    });
    renderPage();
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
    await waitFor(() => expect(getMovies).toHaveBeenCalled());
  });

  it("renders movie list", async () => {
    getMovies.mockResolvedValueOnce({
      data: [
        {
          MovieId: 1,
          NameOfEnglish: "Movie 1",
          PosterImage: "img1.jpg",
          AverageRating: 4.5,
          Description: "Desc 1",
        },
        {
          MovieId: 2,
          NameOfEnglish: "Movie 2",
          PosterImage: "img2.jpg",
          AverageRating: 3.2,
          Description: "Desc 2",
        },
      ],
      pagination: { total: 2, currentPage: 1, totalPages: 1, limit: 8 },
    });
    renderPage();
    expect(await screen.findByText("Movie 1")).toBeInTheDocument();
    expect(screen.getByText("Movie 2")).toBeInTheDocument();
    expect(screen.getAllByRole("button").length).toBeGreaterThan(0);
  });

  it("searches movies when typing in search box", async () => {
    getMovies.mockResolvedValueOnce({
      data: [],
      pagination: { total: 0, currentPage: 1, totalPages: 1, limit: 8 },
    });
    searchMovies.mockResolvedValueOnce({
      data: {
        data: [
          {
            MovieId: 3,
            NameOfEnglish: "Search Movie",
            PosterImage: "img3.jpg",
            AverageRating: 5,
            Description: "Desc 3",
          },
        ],
        total: 1,
        totalPages: 1,
      },
    });
    renderPage();
    const input = screen.getByPlaceholderText(
      /search movies, actors, genres.../i
    );
    fireEvent.change(input, { target: { value: "Search" } });
    await waitFor(() => expect(searchMovies).toHaveBeenCalled());
    expect(await screen.findByText("Search Movie")).toBeInTheDocument();
  });

  //   it("changes page when clicking pagination", async () => {
  //     getMovies.mockResolvedValueOnce({
  //       data: Array.from({ length: 8 }, (_, i) => ({
  //         MovieId: i + 1,
  //         NameOfEnglish: `Movie ${i + 1}`,
  //         PosterImage: "img.jpg",
  //         AverageRating: 4,
  //         Description: "Desc",
  //       })),
  //       pagination: { total: 16, currentPage: 1, totalPages: 2, limit: 8 },
  //     });
  //     getMovies.mockResolvedValueOnce({
  //       data: Array.from({ length: 8 }, (_, i) => ({
  //         MovieId: i + 9,
  //         NameOfEnglish: `Movie ${i + 9}`,
  //         PosterImage: "img.jpg",
  //         AverageRating: 4,
  //         Description: "Desc",
  //       })),
  //       pagination: { total: 16, currentPage: 2, totalPages: 2, limit: 8 },
  //     });
  //     renderPage();
  //     expect(await screen.findByText("Movie 1")).toBeInTheDocument();
  //     const page2Btn = screen.getByRole("button", { name: "2" });
  //     fireEvent.click(page2Btn);
  //     expect(await screen.findByText("Movie 9")).toBeInTheDocument();
  //   });

  it("changes sort order", async () => {
    getMovies.mockReset();
    getMovies.mockResolvedValueOnce({
      data: [
        {
          MovieId: 1,
          NameOfEnglish: "Newest Movie",
          PosterImage: "img.jpg",
          AverageRating: 4,
          Description: "Desc",
        },
      ],
      pagination: { total: 1, currentPage: 1, totalPages: 1, limit: 8 },
    });
    getMovies.mockResolvedValueOnce({
      data: [
        {
          MovieId: 2,
          NameOfEnglish: "Oldest Movie",
          PosterImage: "img.jpg",
          AverageRating: 4,
          Description: "Desc",
        },
      ],
      pagination: { total: 1, currentPage: 1, totalPages: 1, limit: 8 },
    });
    renderPage();
    expect(await screen.findByText("Newest Movie")).toBeInTheDocument();
    const sortButton = screen.getByText("Newest First");
    fireEvent.click(sortButton);

    const oldestFirstOption = await screen.findByText("Oldest First");
    fireEvent.click(oldestFirstOption);
    expect(await screen.findByText("Oldest Movie")).toBeInTheDocument();
    getMovies.mockReset();
  });

  it("navigates to movie detail when clicking a movie", async () => {
    getMovies.mockReset();
    getMovies.mockResolvedValueOnce({
      data: [
        {
          MovieId: 1,
          NameOfEnglish: "Movie Click",
          PosterImage: "img.jpg",
          AverageRating: 4,
          Description: "Desc",
        },
      ],
      pagination: { total: 1, currentPage: 1, totalPages: 1, limit: 8 },
    });
    renderPage();
    const movieCard = await screen.findByText("Movie Click");
    fireEvent.click(movieCard);
    expect(mockNavigate).toHaveBeenCalledWith("/movie-click");
  });
});
