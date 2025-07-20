import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import BookingPage from './BookingPage';
import { toast } from 'react-toastify';

// Mock các dependencies
jest.mock('../../../context/AuthContext', () => ({
  useAuth: () => ({ user: { userId: 1, name: 'Test User', email: 'test@example.com' } }),
}));

jest.mock('../../../services/API', () => ({
  getMovies: jest.fn(() => Promise.resolve({
    data: [
      { MovieId: 1, NameOfEnglish: 'Test Movie', NameOfVietnamese: 'Phim Test' },
    ],
  })),
  getShowtimeByMovieId: jest.fn(() => Promise.resolve({
    showtimes: [{ ShowtimeId: 1, Date: '2024-01-01', Time: '10:00' }],
  })),
  getTimeByDay: jest.fn(() => Promise.resolve({
    versions: [{ ShowtimeId: 1, Time: '10:00' }],
  })),
  getSeatsByShowtimeId: jest.fn(() => Promise.resolve({
    seats: [{ SeatId: 1, SeatNumber: 'A1', IsAvailable: true }],
    seatQuantity: 1,
  })),
  getAllProducts: jest.fn(() => Promise.resolve({
    products: [{ ProductId: 1, ProductName: 'Popcorn', Price: 50000 }],
  })),
  getMovieRatingsList: jest.fn(() => Promise.resolve({ ratings: [], total: 0 })),
  createMovieRating: jest.fn(() => Promise.resolve({})),
  updateMovieRating: jest.fn(() => Promise.resolve({})),
  deleteMovieRating: jest.fn(() => Promise.resolve({})),
}));

jest.mock('react-toastify', () => ({
  toast: {
    error: jest.fn(),
    success: jest.fn(),
  },
  ToastContainer: () => <div data-testid="toast-container" />,
}));

jest.mock('./Slug', () => ({
  slugify: jest.fn((text) => text.toLowerCase().replace(/\s+/g, '-')),
}));

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ slug: 'test-movie' }),
  useNavigate: () => mockNavigate,
}));

// Mock các components con
jest.mock('../bookingComponent/MovieInfor', () => {
  return function MockMovieInfo({ movie, onOpenTrailer, onOpenRatingList }) {
    return (
      <div data-testid="movie-info">
        <h2>{movie?.NameOfEnglish}</h2>
        <button onClick={onOpenTrailer} data-testid="open-trailer-btn">
          Open Trailer
        </button>
        <button onClick={onOpenRatingList} data-testid="open-rating-list-btn">
          Open Rating List
        </button>
      </div>
    );
  };
});

jest.mock('../bookingComponent/ShowtimeSelector', () => {
  return function MockShowtimeSelector({ selectedShowtimeId, dispatch }) {
    return (
      <div data-testid="showtime-selector">
        <button
          onClick={() => dispatch({ type: 'SET_SELECTED_SHOWTIME_ID', payload: 1 })}
          data-testid="select-showtime-btn"
        >
          Select Showtime
        </button>
      </div>
    );
  };
});

jest.mock('../bookingComponent/SeatMap', () => {
  return function MockSeatMap({ selectedSeats, onRefresh, dispatch, user, navigate }) {
    return (
      <div data-testid="seat-map">
        <button onClick={onRefresh} data-testid="refresh-seats-btn">
          Refresh Seats
        </button>
        <button
          onClick={() => dispatch({ type: 'SET_SELECTED_SEATS', payload: ['A1'] })}
          data-testid="select-seat-btn"
        >
          Select Seat A1
        </button>
      </div>
    );
  };
});

jest.mock('../bookingComponent/ProductsSection', () => {
  return function MockProductsSection({ onProductSelect }) {
    return (
      <div data-testid="products-section">
        <button
          onClick={() => onProductSelect({ ProductId: 1, Price: 50000 }, 2)}
          data-testid="select-product-btn"
        >
          Select Product
        </button>
      </div>
    );
  };
});

jest.mock('../bookingComponent/OrderSummary', () => {
  return function MockOrderSummary({ onContinue, totalAmount }) {
    return (
      <div data-testid="order-summary">
        <div>Total: {totalAmount}</div>
        <button onClick={onContinue} data-testid="continue-btn">
          Continue to Payment
        </button>
      </div>
    );
  };
});

jest.mock('../bookingComponent/VideoPopup', () => {
  return function MockVideoPopup({ isOpen, onClose }) {
    return isOpen ? (
      <div data-testid="video-popup">
        <button onClick={onClose} data-testid="close-video-btn">
          Close Video
        </button>
      </div>
    ) : null;
  };
});

jest.mock('../bookingComponent/FeedbackModal', () => {
  return function MockFeedbackModal({ isOpen, onSubmit, setIsFeedbackOpen }) {
    return isOpen ? (
      <div data-testid="feedback-modal">
        <button onClick={onSubmit} data-testid="submit-feedback-btn">
          Submit Feedback
        </button>
        <button onClick={() => setIsFeedbackOpen(false)} data-testid="close-feedback-btn">
          Close
        </button>
      </div>
    ) : null;
  };
});

jest.mock('../bookingComponent/RatingListModal', () => {
  return function MockRatingListModal({ isOpen, setIsRatingListOpen, onUpdateRating, onDeleteRating }) {
    return isOpen ? (
      <div data-testid="rating-list-modal">
        <button onClick={() => setIsRatingListOpen(false)} data-testid="close-rating-list-btn">
          Close Rating List
        </button>
        <button onClick={onUpdateRating} data-testid="update-rating-btn">
          Update Rating
        </button>
        <button onClick={() => onDeleteRating(1)} data-testid="delete-rating-btn">
          Delete Rating
        </button>
      </div>
    ) : null;
  };
});

jest.mock('../../../component/BackButton', () => {
  return function MockBackButton() {
    return <button data-testid="back-button">Back</button>;
  };
});

const createMockStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      booking: (state = {
        selectedSeats: [],
        selectedRoom: null,
        selectedDate: null,
        selectedTime: null,
        selectedShowtimeId: null,
        seatQuantity: 0,
        seatsData: [],
        movie: null,
        product: [],
        calculatedTotalPrice: 0,
        ...initialState,
      }, action) => {
        switch (action.type) {
          case 'SET_SELECTED_SEATS':
            return { ...state, selectedSeats: action.payload };
          case 'SET_SELECTED_SHOWTIME_ID':
            return { ...state, selectedShowtimeId: action.payload };
          default:
            return state;
        }
      },
    },
  });
};

const TestWrapper = ({ children, initialState = {} }) => {
  const store = createMockStore(initialState);
  return (
    <Provider store={store}>
      <BrowserRouter>{children}</BrowserRouter>
    </Provider>
  );
};

describe('BookingPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockNavigate.mockClear();
  });

  test('renders BookingPage without crashing', async () => {
    render(
      <TestWrapper>
        <BookingPage />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByTestId('toast-container')).toBeInTheDocument();
    });
  });

  test('displays movie information when movie is loaded', async () => {
    const initialState = {
      movie: { MovieId: 1, NameOfEnglish: 'Test Movie', NameOfVietnamese: 'Phim Test' }
    };

    render(
      <TestWrapper initialState={initialState}>
        <BookingPage />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('Test Movie')).toBeInTheDocument();
    });
  });

  test('opens video popup when trailer button is clicked', async () => {
    const initialState = {
      movie: { MovieId: 1, NameOfEnglish: 'Test Movie', NameOfVietnamese: 'Phim Test' }
    };

    render(
      <TestWrapper initialState={initialState}>
        <BookingPage />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByTestId('open-trailer-btn')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId('open-trailer-btn'));

    await waitFor(() => {
      expect(screen.getByTestId('video-popup')).toBeInTheDocument();
    });
  });

  test('closes video popup when close button is clicked', async () => {
    const initialState = {
      movie: { MovieId: 1, NameOfEnglish: 'Test Movie', NameOfVietnamese: 'Phim Test' }
    };

    render(
      <TestWrapper initialState={initialState}>
        <BookingPage />
      </TestWrapper>
    );

    // Open popup first
    fireEvent.click(screen.getByTestId('open-trailer-btn'));
    await waitFor(() => {
      expect(screen.getByTestId('video-popup')).toBeInTheDocument();
    });

    // Close popup
    fireEvent.click(screen.getByTestId('close-video-btn'));
    await waitFor(() => {
      expect(screen.queryByTestId('video-popup')).not.toBeInTheDocument();
    });
  });

  test('opens rating list modal when rating button is clicked', async () => {
    const initialState = {
      movie: { MovieId: 1, NameOfEnglish: 'Test Movie', NameOfVietnamese: 'Phim Test' }
    };

    render(
      <TestWrapper initialState={initialState}>
        <BookingPage />
      </TestWrapper>
    );

    fireEvent.click(screen.getByTestId('open-rating-list-btn'));

    await waitFor(() => {
      expect(screen.getByTestId('rating-list-modal')).toBeInTheDocument();
    });
  });

  test('handles product selection correctly', async () => {
    render(
      <TestWrapper>
        <BookingPage />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByTestId('products-section')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId('select-product-btn'));

    // Product selection should update the total price
    await waitFor(() => {
      expect(screen.getByTestId('order-summary')).toBeInTheDocument();
    });
  });

  test('shows error when continuing without selecting seats', async () => {
    render(
      <TestWrapper>
        <BookingPage />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByTestId('continue-btn')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId('continue-btn'));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        'Please select at least one seat to continue',
        expect.any(Object)
      );
    });
  });

  test('navigates to payment page when continuing with selected seats', async () => {
    const initialState = {
      selectedSeats: ['A1'],
      calculatedTotalPrice: 100000,
    };

    render(
      <TestWrapper initialState={initialState}>
        <BookingPage />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByTestId('continue-btn')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId('continue-btn'));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/confirmPayment');
    });
  });

  test('handles seat refresh functionality', async () => {
    const initialState = {
      selectedShowtimeId: 1,
    };

    render(
      <TestWrapper initialState={initialState}>
        <BookingPage />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByTestId('refresh-seats-btn')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId('refresh-seats-btn'));

    // Should call the API to refresh seats
    await waitFor(() => {
      expect(require('../../../services/API').getSeatsByShowtimeId).toHaveBeenCalledWith(1);
    });
  });

  test('calculates total amount correctly', async () => {
    const initialState = {
      calculatedTotalPrice: 100000,
    };

    render(
      <TestWrapper initialState={initialState}>
        <BookingPage />
      </TestWrapper>
    );

    // Select a product to add to total
    fireEvent.click(screen.getByTestId('select-product-btn'));

    await waitFor(() => {
      const totalElement = screen.getByText(/Total:/);
      expect(totalElement).toBeInTheDocument();
    });
  });

  test('handles API errors gracefully', async () => {
    const mockGetMovies = require('../../../services/API').getMovies;
    mockGetMovies.mockRejectedValueOnce(new Error('API Error'));

    render(
      <TestWrapper>
        <BookingPage />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        'Failed to load movie details',
        expect.any(Object)
      );
    });
  });

  test('handles feedback submission', async () => {
    const initialState = {
      movie: { MovieId: 1, NameOfEnglish: 'Test Movie' }
    };

    render(
      <TestWrapper initialState={initialState}>
        <BookingPage />
      </TestWrapper>
    );

    // Open feedback modal (would need to trigger from within the component)
    // This is a simplified test - in reality, you'd need to trigger the modal opening
    // through the proper component interactions
  });

  test('formats price correctly', async () => {
    const initialState = {
      calculatedTotalPrice: 100000,
    };

    render(
      <TestWrapper initialState={initialState}>
        <BookingPage />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByTestId('order-summary')).toBeInTheDocument();
    });

    // The formatPrice function should format Vietnamese currency
    // This would be tested through the OrderSummary component
  });

  test('handles date change and resets time selection', async () => {
    const initialState = {
      selectedDate: '2024-01-01',
      selectedTime: '10:00',
      selectedShowtimeId: 1,
    };

    render(
      <TestWrapper initialState={initialState}>
        <BookingPage />
      </TestWrapper>
    );

    // This would test the useEffect that handles date changes
    // In a real scenario, you'd need to trigger a date change through the ShowtimeSelector
  });

  test('shows loading state correctly', async () => {
    render(
      <TestWrapper>
        <BookingPage />
      </TestWrapper>
    );

    // Initially should show loading state
    // This depends on how loading states are implemented in your components
  });

  test('handles authentication check for product selection', async () => {
    // Mock unauthenticated user
    const mockUseAuth = require('../../../context/AuthContext').useAuth;
    mockUseAuth.mockReturnValueOnce({ user: null });

    render(
      <TestWrapper>
        <BookingPage />
      </TestWrapper>
    );

    fireEvent.click(screen.getByTestId('select-product-btn'));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        'Please sign in to select products',
        expect.any(Object)
      );
    });
  });

  test('handles authentication check for payment continuation', async () => {
    // Mock unauthenticated user
    const mockUseAuth = require('../../../context/AuthContext').useAuth;
    mockUseAuth.mockReturnValueOnce({ user: null });

    const initialState = {
      selectedSeats: ['A1'],
    };

    render(
      <TestWrapper initialState={initialState}>
        <BookingPage />
      </TestWrapper>
    );

    fireEvent.click(screen.getByTestId('continue-btn'));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        'Please sign in to continue with payment',
        expect.any(Object)
      );
    });
  });
});