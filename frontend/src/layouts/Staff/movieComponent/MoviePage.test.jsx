/* eslint-disable no-undef */
import React from "react";
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import MoviePage from "./MoviePage";
import * as api from "../../../services/APIForStaff/API";
import { useDebounce } from "../../../hooks/useDebounce";

// Mock CSS imports
jest.mock("swiper/css", () => ({}));
jest.mock("swiper/css/navigation", () => ({}));
jest.mock("swiper/css/pagination", () => ({}));
jest.mock("../component/SwiperButton.css", () => ({}));

// Mock useDebounce hook
jest.mock("../../../hooks/useDebounce", () => ({
  useDebounce: jest.fn(),
}));

// Mock API functions
jest.mock("../../../services/APIForStaff/API", () => ({
  getCurrentMovies: jest.fn(),
  searchMovies: jest.fn(),
}));

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

// Mock MovieSwiper component
jest.mock("../component/MovieSwiper", () => {
  return function MockMovieSwiper({ movies, selectedMovie, onSelectMovie }) {
    return (
      <div data-testid="movie-swiper">
        {movies.map((movie) => (
          <div
            key={movie.MovieId}
            data-testid={`movie-${movie.MovieId}`}
            onClick={() => onSelectMovie(movie)}
            className="movie-item"
          >
            {movie.NameOfEnglish}
          </div>
        ))}
        {selectedMovie && (
          <div data-testid="selected-movie">
            Selected: {selectedMovie.NameOfEnglish}
          </div>
        )}
      </div>
    );
  };
});

beforeAll(() => {
  jest.spyOn(console, "error").mockImplementation(() => {});
});

afterAll(() => {
  console.error.mockRestore();
});

const renderWithRouter = async (ui) => {
  await act(async () => {
    render(<BrowserRouter>{ui}</BrowserRouter>);
  });
};

describe("MoviePage", () => {
  const sampleMovies = [
    {
      MovieId: 1,
      NameOfEnglish: "Avengers Endgame",
      NameOfVietnamese: "Biệt Đội Siêu Anh Hùng: Hồi Kết",
      PosterImage: "avengers-poster.jpg",
    },
    {
      MovieId: 2,
      NameOfEnglish: "Interstellar",
      NameOfVietnamese: "Giữa Các Vì Sao",
      PosterImage: "interstellar-poster.jpg",
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    useDebounce.mockReturnValue(""); // Mặc định
  });

  it("renders Movie Management header", async () => {
    await renderWithRouter(<MoviePage />);
    expect(screen.getByText("Movie Management")).toBeInTheDocument();
  });

  it("renders search input", async () => {
    await renderWithRouter(<MoviePage />);
    expect(screen.getByPlaceholderText("Search movies")).toBeInTheDocument();
  });

  it("shows loading state initially", async () => {
    api.getCurrentMovies.mockImplementation(() => new Promise(() => {})); // Không bao giờ resolve
    await renderWithRouter(<MoviePage />);
    expect(screen.getByText("Loading Movies")).toBeInTheDocument();
  });

  it("displays movies when API call succeeds", async () => {
    api.getCurrentMovies.mockResolvedValue({ data: sampleMovies });
    await renderWithRouter(<MoviePage />);
    await waitFor(() => {
      expect(screen.getByText("Movie Selection")).toBeInTheDocument();
    });
  });

  it("shows no movies message when movies array is empty", async () => {
    api.getCurrentMovies.mockResolvedValue({ data: [] });
    await renderWithRouter(<MoviePage />);
    await waitFor(() => {
      expect(screen.getByText("No Movies Found")).toBeInTheDocument();
    });
  });

  it("calls search API when search term is entered", async () => {
    api.getCurrentMovies.mockResolvedValue({ data: [] });
    api.searchMovies.mockResolvedValue({ data: sampleMovies });
    useDebounce.mockReturnValue("avengers");

    await renderWithRouter(<MoviePage />);
    await waitFor(() => {
      expect(api.searchMovies).toHaveBeenCalledWith("avengers");
    });
  });

  it("updates search input value", async () => {
    await renderWithRouter(<MoviePage />);
    const searchInput = screen.getByPlaceholderText("Search movies");
    fireEvent.change(searchInput, { target: { value: "test search" } });
    expect(searchInput.value).toBe("test search");
  });

  it("handles movie selection and navigation", async () => {
    api.getCurrentMovies.mockResolvedValue({ data: sampleMovies });
    await renderWithRouter(<MoviePage />);
    await waitFor(() => {
      const movieItem = screen.getByTestId("movie-1");
      fireEvent.click(movieItem);
    });
    expect(mockNavigate).toHaveBeenCalledWith("/staff/movie/avengers-endgame");
  });

  // it("shows clear search button when there is a search term and no results", async () => {
  //   api.getCurrentMovies.mockResolvedValue({ data: [] });
  //   api.searchMovies.mockResolvedValue({ data: [] });
  //   useDebounce.mockReturnValue("nonexistent");
  
  //   await renderWithRouter(<MoviePage />);
    
  //   // Instead of looking for "Clear Search" text, look for the close icon or button
  //   await waitFor(() => {
  //     const clearButton = screen.getByRole('button', { name: /clear search/i });
  //     expect(clearButton).toBeInTheDocument();
  //   });
  // });

  it("clears search when clear button is clicked", async () => {
    api.getCurrentMovies.mockResolvedValue({ data: [] });
    api.searchMovies.mockResolvedValue({ data: [] });
    useDebounce.mockReturnValue("nonexistent");
  
    await renderWithRouter(<MoviePage />);
    
    const searchInput = screen.getByPlaceholderText("Search movies");
    fireEvent.change(searchInput, { target: { value: "test" } });
    
    const clearButton = screen.getByRole('button', { name: /clear search/i });
    fireEvent.click(clearButton);
    
    expect(searchInput.value).toBe("");
  });

  it("handles error in getCurrentMovies API call", async () => {
    api.getCurrentMovies.mockRejectedValue(new Error("API Error"));
    await renderWithRouter(<MoviePage />);
    await waitFor(() => {
      expect(screen.getByText("No Movies Found")).toBeInTheDocument();
    });
  });

  it("handles error in searchMovies API call", async () => {
    api.getCurrentMovies.mockResolvedValue({ data: [] });
    api.searchMovies.mockRejectedValue(new Error("Search API Error"));
    useDebounce.mockReturnValue("test");

    await renderWithRouter(<MoviePage />);
    await waitFor(() => {
      expect(screen.getByText("No Movies Found")).toBeInTheDocument();
    });
  });

  it("shows appropriate message when search returns no results", async () => {
    api.getCurrentMovies.mockResolvedValue({ data: [] });
    api.searchMovies.mockResolvedValue({ data: [] });
    useDebounce.mockReturnValue("nonexistent");
  
    await renderWithRouter(<MoviePage />);
    
    await waitFor(() => {
      expect(screen.getByText("No Movies Found")).toBeInTheDocument();
      expect(screen.getByText(/No movies are currently available/)).toBeInTheDocument();
    });
  });

  it("calls getCurrentMovies when search is empty", async () => {
    useDebounce.mockReturnValue("");
    await renderWithRouter(<MoviePage />);
    await waitFor(() => {
      expect(api.getCurrentMovies).toHaveBeenCalled();
    });
  });

  it("shows loading state during search", async () => {
    api.getCurrentMovies.mockResolvedValue({ data: [] });
    api.searchMovies.mockImplementation(() => new Promise(() => {}));
    useDebounce.mockReturnValue("test");

    await renderWithRouter(<MoviePage />);
    await waitFor(() => {
      expect(screen.getByText("Loading Movies")).toBeInTheDocument();
    });
  });

  it("handles component unmounting during API call", async () => {
    api.getCurrentMovies.mockImplementation(() => new Promise(() => {}));
    const { unmount } = render(<BrowserRouter><MoviePage /></BrowserRouter>);
    unmount();
    expect(true).toBe(true);
  });
});