/* eslint-disable no-undef */
import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import MovieDetail from "./MovieDetail";
import * as api from "../../../services/APIForStaff/API";

// Mock CSS imports
jest.mock("swiper/css", () => ({}));
jest.mock("swiper/css/navigation", () => ({}));
jest.mock("swiper/css/pagination", () => ({}));
jest.mock("../component/SwiperButton.css", () => ({}));

// Mock Swiper components
jest.mock("swiper/react", () => ({
  Swiper: ({ children, ...props }) => (
    <div data-testid="swiper" {...props}>
      {children}
    </div>
  ),
  SwiperSlide: ({ children, ...props }) => (
    <div data-testid="swiper-slide" {...props}>
      {children}
    </div>
  ),
}));

// Mock Swiper modules
jest.mock("swiper/modules", () => ({
  Navigation: {},
  Pagination: {},
}));

// Mock MovieSwiper component
jest.mock("../component/MovieSwiper", () => {
  return function MockMovieSwiper({ movies, onSelectMovie }) {
    return (
      <div data-testid="movie-swiper">
        {movies.map((movie) => (
          <div
            key={movie.MovieId}
            data-testid={`recommended-movie-${movie.MovieId}`}
            onClick={() => onSelectMovie && onSelectMovie(movie)}
          >
            {movie.NameOfEnglish}
          </div>
        ))}
      </div>
    );
  };
});

// Mock BackButton component
jest.mock("../component/BackButton", () => {
  return function MockBackButton() {
    return <div data-testid="back-button">Back</div>;
  };
});

// Mock VersionCard component
jest.mock("../component/VersionCard", () => {
  return function MockVersionCard({ version }) {
    return <div data-testid={`version-${version}`}>{version}</div>;
  };
});

// Mock API functions
jest.mock("../../../services/APIForStaff/API", () => ({
  getCurrentMovies: jest.fn(),
}));

// Mock react-toastify
jest.mock("react-toastify", () => ({
  toast: {
    error: jest.fn(),
  },
}));

// Mock useNavigate and useParams
const mockNavigate = jest.fn();
const mockUseParams = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
  useParams: () => mockUseParams(),
}));

// Mock console.error to suppress noise
const originalError = console.error;
beforeAll(() => {
  console.error = (...args) => {
    if (
      typeof args[0] === "string" &&
      args[0].includes("Warning: An update to MovieDetail")
    ) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});

describe("MovieDetail", () => {
  const sampleMovies = [
    {
      MovieId: 1,
      NameOfEnglish: "Avengers Endgame",
      NameOfVietnamese: "Biệt Đội Siêu Anh Hùng: Hồi Kết",
      PosterImage: "avengers-poster.jpg",
      AverageRating: 8.5,
      RunningTime: 181,
      FromDate: "2023-04-26T00:00:00.000Z",
      ToDate: "2023-07-26T00:00:00.000Z",
      Genres: "Action, Adventure, Drama",
      Director: "Anthony Russo, Joe Russo",
      Actors: "Robert Downey Jr., Chris Evans, Mark Ruffalo",
      ContentSynopsis: "After the devastating events of Avengers: Infinity War...",
      versions: [
        { VersionType: "2D" },
        { VersionType: "3D" },
      ],
      TrailerUrl: "https://youtube.com/watch?v=example",
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    api.getCurrentMovies.mockResolvedValue({ data: sampleMovies });
    mockUseParams.mockReturnValue({ slug: "avengers-endgame" });
  });

  // 1. Test loading state
  it("shows loading state initially", () => {
    render(
      <BrowserRouter>
        <MovieDetail />
      </BrowserRouter>
    );
    expect(screen.getByText("Loading Movie Details")).toBeInTheDocument();
  });

//   // 2. Test successful movie display
//   it("displays movie information when found", async () => {
//     render(
//       <BrowserRouter>
//         <MovieDetail />
//       </BrowserRouter>
//     );

//     await waitFor(() => {
//       // Use getAllByText to handle multiple elements with same text
//       const movieTitles = screen.getAllByText("Avengers Endgame");
//       expect(movieTitles.length).toBeGreaterThan(0);
//       expect(screen.getByText("Biệt Đội Siêu Anh Hùng: Hồi Kết")).toBeInTheDocument();
//     });
//   });

  // 3. Test movie rating display
  it("displays movie rating correctly", async () => {
    render(
      <BrowserRouter>
        <MovieDetail />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Rating")).toBeInTheDocument();
      expect(screen.getByText("(8.5)")).toBeInTheDocument();
    });
  });

  // 4. Test movie versions display
  it("displays movie versions correctly", async () => {
    render(
      <BrowserRouter>
        <MovieDetail />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Versions Available")).toBeInTheDocument();
      expect(screen.getByTestId("version-2D")).toBeInTheDocument();
      expect(screen.getByTestId("version-3D")).toBeInTheDocument();
    });
  });

  // 5. Test top 5 movies sidebar
  it("displays top 5 movies in sidebar", async () => {
    render(
      <BrowserRouter>
        <MovieDetail />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Top 5 Movies")).toBeInTheDocument();
      expect(screen.getByText("Highest rated films")).toBeInTheDocument();
    });
  });

  // 6. Test recommended movies
  it("displays recommended movies when available", async () => {
    render(
      <BrowserRouter>
        <MovieDetail />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Recommended Movies")).toBeInTheDocument();
      expect(screen.getByText("Movies you might also like")).toBeInTheDocument();
    });
  });

  // 7. Test API error handling
  it("handles API errors gracefully", async () => {
    api.getCurrentMovies.mockRejectedValue(new Error("API Error"));
    
    render(
      <BrowserRouter>
        <MovieDetail />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Movie Not Found")).toBeInTheDocument();
    });
  });

  // 8. Test back button functionality
  it("back button navigates correctly", async () => {
    render(
      <BrowserRouter>
        <MovieDetail />
      </BrowserRouter>
    );

    await waitFor(() => {
      const backButton = screen.getByTestId("back-button");
      expect(backButton).toBeInTheDocument();
    });
  });

  // 9. Test movie not found scenario
  it("shows movie not found when movie doesn't exist", async () => {
    mockUseParams.mockReturnValue({ slug: "non-existent-movie" });
    
    render(
      <BrowserRouter>
        <MovieDetail />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Movie Not Found")).toBeInTheDocument();
    });
  });

  // 10. Test no recommendations message
  it("shows no recommendations message when no similar movies", async () => {
    const moviesWithoutSimilar = [
      {
        ...sampleMovies[0],
        Genres: "Unique Genre",
      },
    ];
    api.getCurrentMovies.mockResolvedValue({ data: moviesWithoutSimilar });
    
    render(
      <BrowserRouter>
        <MovieDetail />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("No Recommendations Yet")).toBeInTheDocument();
    });
  });

  // 11. Test specific movie title in main content area
  it("displays movie title in main content area", async () => {
    render(
      <BrowserRouter>
        <MovieDetail />
      </BrowserRouter>
    );

    await waitFor(() => {
      // Look for the main movie title specifically in the content area
      const mainContent = screen.getByText("Avengers Endgame", { selector: "h2" });
      expect(mainContent).toBeInTheDocument();
    });
  });
}); 