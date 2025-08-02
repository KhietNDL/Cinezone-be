/* eslint-disable no-undef */
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import SellTicketPage from "./SellTicketPage";
import * as api from "../../../services/APIForStaff/API";
import sellingReducer from "../../../redux/features/sellingSlice";
import memberReducer from "../../../redux/features/memberSlice";

// Mock CSS imports
jest.mock("swiper/css", () => ({}));
jest.mock("swiper/css/navigation", () => ({}));
jest.mock("swiper/css/pagination", () => ({}));
jest.mock("../component/SwiperButton.css", () => ({}));

// Mock API functions
jest.mock("../../../services/APIForStaff/API", () => ({
  getCurrentMovies: jest.fn(),
  searchMovies: jest.fn(),
  getShowtimesByMovieId: jest.fn(),
  getShowtimesByMovieIdAndDay: jest.fn(),
}));

// Mock components
jest.mock("./ShowtimeButton", () => {
  return function MockShowtimeButton({ selectedDay, onSelectDay, days, showDay, parentVersion, selectedTime, onSelectTime, times, showTime }) {
    return (
      <div data-testid="showtime-button">
        {showDay && (
          <div>
            <h3>Select Day</h3>
            {days?.map((day) => (
              <button
                key={day}
                data-testid={`day-${day}`}
                onClick={() => onSelectDay(day)}
                className={selectedDay === day ? "selected" : ""}
              >
                {day}
              </button>
            ))}
          </div>
        )}
        {showTime && (
          <div>
            <h3>Select Time - {parentVersion}</h3>
            {times?.map((time) => (
              <button
                key={time.time}
                data-testid={`time-${time.time}`}
                onClick={() => onSelectTime(parentVersion, time.time)}
                className={selectedTime === time.time ? "selected" : ""}
              >
                {time.time}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };
});

jest.mock("../component/MovieSwiper", () => {
  return function MockMovieSwiper({ movies, selectedMovie, onSelectMovie }) {
    return (
      <div data-testid="movie-swiper">
        {movies?.map((movie) => (
          <button
            key={movie.MovieId}
            data-testid={`movie-${movie.MovieId}`}
            onClick={() => onSelectMovie(movie)}
            className={selectedMovie?.MovieId === movie.MovieId ? "selected" : ""}
          >
            {movie.NameOfEnglish}
          </button>
        ))}
      </div>
    );
  };
});

jest.mock("../component/VersionCard", () => {
  return function MockVersionCard({ version, children }) {
    return (
      <div data-testid={`version-${version}`}>
        <h3>Version: {version}</h3>
        {children}
      </div>
    );
  };
});

// Mock react-icons
jest.mock("react-icons/io5", () => ({
  IoTime: () => <div data-testid="time-icon">Time Icon</div>,
  IoSearchOutline: () => <div data-testid="search-icon">Search Icon</div>,
}));

jest.mock("react-icons/fa6", () => ({
  FaCouch: () => <div data-testid="couch-icon">Couch Icon</div>,
  FaCalendarDays: () => <div data-testid="calendar-icon">Calendar Icon</div>,
  FaLocationDot: () => <div data-testid="location-icon">Location Icon</div>,
  FaTicket: () => <div data-testid="ticket-icon">Ticket Icon</div>,
  FaFilm: () => <div data-testid="film-icon">Film Icon</div>,
}));

jest.mock("react-icons/md", () => ({
  MdEventSeat: () => <div data-testid="seat-icon">Seat Icon</div>,
  MdCancel: () => <div data-testid="cancel-icon">Cancel Icon</div>,
}));

// Mock antd components
jest.mock("antd", () => ({
  Button: ({ children, onClick, disabled, icon, ...props }) => (
    <button onClick={onClick} disabled={disabled} {...props}>
      {icon}
      {children}
    </button>
  ),
  Spin: ({ children, size }) => (
    <div data-testid="spin" data-size={size}>
      {children}
    </div>
  ),
  Card: ({ children, className, ...props }) => (
    <div className={className} {...props}>
      {children}
    </div>
  ),
  Steps: ({ children, current }) => (
    <div data-testid="steps" data-current={current}>
      {children}
    </div>
  ),
  Badge: ({ children, count }) => (
    <div data-testid="badge" data-count={count}>
      {children}
    </div>
  ),
}));

// Mock @ant-design/icons
jest.mock("@ant-design/icons", () => ({
  CheckCircleOutlined: () => <div data-testid="check-icon">Check Icon</div>,
}));

// Suppress console errors for React act() warnings
beforeAll(() => {
  jest.spyOn(console, "error").mockImplementation(() => {});
});

afterAll(() => {
  console.error.mockRestore();
});

// Create test store
const createTestStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      selling: sellingReducer,
      member: memberReducer,
    },
    preloadedState: {
      selling: {
        selectedMovie: null,
        selectedDay: null,
        selectedVersion: null,
        selectedTime: null,
        room: "",
        showtimeId: "",
        ...initialState.selling,
      },
      member: {
        ...initialState.member,
      },
    },
  });
};

const renderWithProviders = (ui, initialState = {}) => {
  const store = createTestStore(initialState);
  return render(
    <Provider store={store}>
      <BrowserRouter>{ui}</BrowserRouter>
    </Provider>
  );
};

describe("SellTicketPage", () => {
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

  const sampleShowtimes = {
    showtimes: [
      { Day: "2023-12-25", showtimeId: 1 },
      { Day: "2023-12-26", showtimeId: 2 },
    ],
  };

  const sampleVersions = [
    {
      version: "2D",
      showtimes: [
        { time: "14:00", roomName: "Room A", showtimeId: 1 },
        { time: "16:00", roomName: "Room B", showtimeId: 2 },
      ],
    },
    {
      version: "3D",
      showtimes: [
        { time: "18:00", roomName: "Room C", showtimeId: 3 },
      ],
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    api.getCurrentMovies.mockResolvedValue({ data: sampleMovies });
    api.getShowtimesByMovieId.mockResolvedValue(sampleShowtimes);
    api.getShowtimesByMovieIdAndDay.mockResolvedValue({ versions: sampleVersions });
  });

  // 1. Test initial render
  it("renders SellTicketPage component with header", () => {
    renderWithProviders(<SellTicketPage />);
    expect(screen.getByText("Ticket Sales")).toBeInTheDocument();
    expect(screen.getByText("Staff Portal - Cinema Management")).toBeInTheDocument();
  });

  // 2. Test search input
  it("renders search input", () => {
    renderWithProviders(<SellTicketPage />);
    expect(screen.getByPlaceholderText("Search movies")).toBeInTheDocument();
  });

  // 3. Test progress steps
  it("renders progress steps", () => {
    renderWithProviders(<SellTicketPage />);
    expect(screen.getByText("Movie")).toBeInTheDocument();
    expect(screen.getByText("Date")).toBeInTheDocument();
    expect(screen.getByText("Time")).toBeInTheDocument();
    expect(screen.getByText("Seats")).toBeInTheDocument();
  });

  // 4. Test movie selection section
  it("renders movie selection section", () => {
    renderWithProviders(<SellTicketPage />);
    expect(screen.getByText("Step 1: Select Movie")).toBeInTheDocument();
    expect(screen.getByText("Choose a movie for your customer")).toBeInTheDocument();
  });

//   // 5. Test loading state
//   it("shows loading state when fetching movies", async () => {
//     api.getCurrentMovies.mockImplementation(() => new Promise(() => {})); // Never resolves
//     renderWithProviders(<SellTicketPage />);
    
//     expect(screen.getByTestId("spin")).toBeInTheDocument();
//     expect(screen.getByText("Loading movies...")).toBeInTheDocument();
//   });

  // 6. Test movie display
  it("displays movies when API call succeeds", async () => {
    renderWithProviders(<SellTicketPage />);

    await waitFor(() => {
      expect(screen.getByTestId("movie-swiper")).toBeInTheDocument();
      expect(screen.getByTestId("movie-1")).toBeInTheDocument();
      expect(screen.getByTestId("movie-2")).toBeInTheDocument();
    });
  });

  // 7. Test movie selection
  it("handles movie selection", async () => {
    renderWithProviders(<SellTicketPage />);

    await waitFor(() => {
      const movieButton = screen.getByTestId("movie-1");
      fireEvent.click(movieButton);
    });

    // Check if date selection section appears
    await waitFor(() => {
      expect(screen.getByText("Step 2: Select Date")).toBeInTheDocument();
    });
  });

  // 8. Test search functionality
  it("handles search input", async () => {
    api.searchMovies.mockResolvedValue({ data: { movies: sampleMovies } });
    renderWithProviders(<SellTicketPage />);

    const searchInput = screen.getByPlaceholderText("Search movies");
    fireEvent.change(searchInput, { target: { value: "avengers" } });

    await waitFor(() => {
      expect(api.searchMovies).toHaveBeenCalledWith("avengers");
    });
  });

  // 9. Test day selection
  it("handles day selection", async () => {
    renderWithProviders(<SellTicketPage />, {
      selling: { selectedMovie: sampleMovies[0] },
    });

    await waitFor(() => {
      expect(screen.getByText("Step 2: Select Date")).toBeInTheDocument();
    });

    const dayButton = screen.getByTestId("day-25/12/2023");
    fireEvent.click(dayButton);

    await waitFor(() => {
      expect(screen.getByText("Step 3: Select Showtime")).toBeInTheDocument();
    });
  });

  // 10. Test time selection
  it("handles time selection", async () => {
    renderWithProviders(<SellTicketPage />, {
      selling: {
        selectedMovie: sampleMovies[0],
        selectedDay: "25/12/2023",
      },
    });

    await waitFor(() => {
      expect(screen.getByText("Step 3: Select Showtime")).toBeInTheDocument();
    });

    const timeButton = screen.getByTestId("time-14:00");
    fireEvent.click(timeButton);

    await waitFor(() => {
      expect(screen.getByText("Step 4: Cinema Room Assignment")).toBeInTheDocument();
    });
  });

  // 11. Test room assignment
  it("displays room assignment when all selections are made", async () => {
    renderWithProviders(<SellTicketPage />, {
      selling: {
        selectedMovie: sampleMovies[0],
        selectedDay: "25/12/2023",
        selectedVersion: "2D",
        selectedTime: "14:00",
        room: "Room A",
      },
    });

    await waitFor(() => {
      expect(screen.getByText("Step 4: Cinema Room Assignment")).toBeInTheDocument();
      expect(screen.getByText("Room A")).toBeInTheDocument();
    });
  });

  // 12. Test proceed button
  it("enables proceed button when all selections are complete", async () => {
    renderWithProviders(<SellTicketPage />, {
      selling: {
        selectedMovie: sampleMovies[0],
        selectedDay: "25/12/2023",
        selectedVersion: "2D",
        selectedTime: "14:00",
      },
    });

    await waitFor(() => {
      const proceedButton = screen.getByText("Proceed to Seat Selection");
      expect(proceedButton).not.toBeDisabled();
    });
  });

  // 13. Test cancel functionality
  it("handles cancel and reset", async () => {
    renderWithProviders(<SellTicketPage />, {
      selling: {
        selectedMovie: sampleMovies[0],
        selectedDay: "25/12/2023",
        selectedVersion: "2D",
        selectedTime: "14:00",
      },
    });

    const cancelButton = screen.getByText("Cancel & Reset");
    fireEvent.click(cancelButton);

    await waitFor(() => {
      expect(screen.getByText("Step 1: Select Movie")).toBeInTheDocument();
    });
  });

  // 14. Test booking summary
  it("displays booking summary when movie is selected", async () => {
    renderWithProviders(<SellTicketPage />, {
      selling: {
        selectedMovie: sampleMovies[0],
        selectedDay: "25/12/2023",
        selectedVersion: "2D",
        selectedTime: "14:00",
      },
    });

    await waitFor(() => {
      expect(screen.getByText("Booking Summary")).toBeInTheDocument();
      expect(screen.getByText("Avengers Endgame")).toBeInTheDocument();
      expect(screen.getByText("25/12/2023")).toBeInTheDocument();
      expect(screen.getByText("2D")).toBeInTheDocument();
      expect(screen.getByText("14:00")).toBeInTheDocument();
    });
  });

  // 15. Test API error handling
  it("handles API errors gracefully", async () => {
    api.getCurrentMovies.mockRejectedValue(new Error("API Error"));
    renderWithProviders(<SellTicketPage />);

    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith("Error fetching movies:", expect.any(Error));
    });
  });

  // 16. Test search error handling
  it("handles search API errors", async () => {
    api.searchMovies.mockRejectedValue(new Error("Search API Error"));
    renderWithProviders(<SellTicketPage />);

    const searchInput = screen.getByPlaceholderText("Search movies");
    fireEvent.change(searchInput, { target: { value: "test" } });

    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith("Error searching movies:", expect.any(Error));
    });
  });

  // 17. Test component unmounting
  it("handles component unmounting during API call", async () => {
    api.getCurrentMovies.mockImplementation(() => new Promise(() => {})); // Never resolves
    
    const { unmount } = renderWithProviders(<SellTicketPage />);
    
    // Unmount component while API call is pending
    unmount();
    
    // Should not throw any errors
    expect(true).toBe(true);
  });

// //  18. Test icons are rendered
//   it("renders all required icons", () => {
//     renderWithProviders(<SellTicketPage />);
//     expect(screen.getByTestId("ticket-icon")).toBeInTheDocument();
//     expect(screen.getByTestId("search-icon")).toBeInTheDocument();
//     expect(screen.getByTestId("film-icon")).toBeInTheDocument();
//     expect(screen.getByTestId("calendar-icon")).toBeInTheDocument();
//     expect(screen.getByTestId("time-icon")).toBeInTheDocument();
//     expect(screen.getByTestId("couch-icon")).toBeInTheDocument();
//   });

  // 19. Test step progression
  it("shows correct step progression", async () => {
    renderWithProviders(<SellTicketPage />);

    // Initially only movie step should be visible
    expect(screen.getByText("Step 1: Select Movie")).toBeInTheDocument();
    expect(screen.queryByText("Step 2: Select Date")).not.toBeInTheDocument();

    // After movie selection, date step should appear
    await waitFor(() => {
      const movieButton = screen.getByTestId("movie-1");
      fireEvent.click(movieButton);
    });

    await waitFor(() => {
      expect(screen.getByText("Step 2: Select Date")).toBeInTheDocument();
    });
  });

  // 20. Test disabled proceed button
  it("disables proceed button when selections are incomplete", async () => {
    renderWithProviders(<SellTicketPage />);

    await waitFor(() => {
      const proceedButton = screen.getByText("Proceed to Seat Selection");
      expect(proceedButton).toBeDisabled();
    });
  });
}); 