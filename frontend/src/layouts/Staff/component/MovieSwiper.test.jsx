/* eslint-disable no-undef */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import MovieSwiper from './MovieSwiper';
import { MemoryRouter } from 'react-router-dom';

// Mock CSS imports
jest.mock("swiper/css", () => ({}));
jest.mock("swiper/css/navigation", () => ({}));
jest.mock("swiper/css/pagination", () => ({}));
jest.mock("./SwiperButton.css", () => ({}));

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

// Mock ItemCard component
jest.mock("./ItemCard", () => {
  return function MockItemCard({ item, selected, onSelect }) {
    return (
      <div 
        data-testid={`item-${item.MovieId}`}
        onClick={onSelect}
        className={selected ? "selected" : ""}
      >
        <h3>{item.NameOfEnglish}</h3>
        <button data-testid={`select-${item.MovieId}`}>Select</button>
      </div>
    );
  };
});

// Mock Antd Empty component
jest.mock("antd", () => ({
  Empty: ({ description }) => (
    <div data-testid="empty-state">
      {description}
    </div>
  ),
}));

// Mock react-icons
jest.mock("react-icons/fa6", () => ({
  FaChevronLeft: () => <span data-testid="chevron-left">←</span>,
  FaChevronRight: () => <span data-testid="chevron-right">→</span>,
}));

describe('MovieSwiper', () => {
  const sampleMovies = [
    { MovieId: 1, NameOfEnglish: 'Avengers Endgame', Title: 'Avengers Endgame' },
    { MovieId: 2, NameOfEnglish: 'Interstellar', Title: 'Interstellar' },
  ];

  const renderWithRouter = (ui) => render(<MemoryRouter>{ui}</MemoryRouter>);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders title and number of movies', () => {
    renderWithRouter(<MovieSwiper movies={sampleMovies} />);

    expect(screen.getByText(/Available Movies/i)).toBeInTheDocument();
    expect(screen.getByText(/2 movies/i)).toBeInTheDocument();
  });

  it('renders Empty when movies is empty', () => {
    renderWithRouter(<MovieSwiper movies={[]} />);

    expect(screen.getByText(/No movies available/i)).toBeInTheDocument();
  });

  it('calls onSelectMovie when a movie is selected', () => {
    const mockSelect = jest.fn();
    renderWithRouter(
      <MovieSwiper movies={sampleMovies} onSelectMovie={mockSelect} />
    );

    const selectButton = screen.getByTestId('select-1');
    fireEvent.click(selectButton);

    expect(mockSelect).toHaveBeenCalledWith(sampleMovies[0]);
  });

  it('renders movie with <Link> when useLink is true', () => {
    renderWithRouter(
      <MovieSwiper movies={sampleMovies} useLink={true} />
    );

    const links = screen.getAllByRole('link');
    const firstLink = links[0];
    expect(firstLink.getAttribute('href')).toContain(`/staff/movie/1`);
  });

  it('renders selected movie label if selectedMovie is provided', () => {
    renderWithRouter(
      <MovieSwiper movies={sampleMovies} selectedMovie={sampleMovies[1]} />
    );

    expect(screen.getByText(/Selected: Interstellar/i)).toBeInTheDocument();
  });

  it('renders navigation buttons', () => {
    renderWithRouter(<MovieSwiper movies={sampleMovies} />);

    expect(screen.getByTestId('chevron-left')).toBeInTheDocument();
    expect(screen.getByTestId('chevron-right')).toBeInTheDocument();
  });

  it('renders swiper container', () => {
    renderWithRouter(<MovieSwiper movies={sampleMovies} />);

    expect(screen.getByTestId('swiper')).toBeInTheDocument();
  });

  it('renders correct number of swiper slides', () => {
    renderWithRouter(<MovieSwiper movies={sampleMovies} />);

    const slides = screen.getAllByTestId('swiper-slide');
    expect(slides).toHaveLength(2);
  });

  it('renders movie items correctly', () => {
    renderWithRouter(<MovieSwiper movies={sampleMovies} />);

    expect(screen.getByText('Avengers Endgame')).toBeInTheDocument();
    expect(screen.getByText('Interstellar')).toBeInTheDocument();
  });

  it('applies selected class to selected movie', () => {
    renderWithRouter(
      <MovieSwiper movies={sampleMovies} selectedMovie={sampleMovies[0]} />
    );

    const selectedItem = screen.getByTestId('item-1');
    expect(selectedItem).toHaveClass('selected');
  });

  it('handles single movie count correctly', () => {
    const singleMovie = [sampleMovies[0]];
    renderWithRouter(<MovieSwiper movies={singleMovie} />);

    expect(screen.getByText(/1 movie/i)).toBeInTheDocument();
  });

  it('handles null movies gracefully', () => {
    renderWithRouter(<MovieSwiper movies={null} />);

    expect(screen.getByText(/No movies available/i)).toBeInTheDocument();
  });

  it('handles undefined movies gracefully', () => {
    renderWithRouter(<MovieSwiper movies={undefined} />);

    expect(screen.getByText(/No movies available/i)).toBeInTheDocument();
  });

  it('renders custom link when linkTo prop is provided', () => {
    const customLinkTo = (movie) => `/custom/path/${movie.MovieId}`;
    renderWithRouter(
      <MovieSwiper movies={sampleMovies} useLink={true} linkTo={customLinkTo} />
    );

    const links = screen.getAllByRole('link');
    const firstLink = links[0];
    expect(firstLink.getAttribute('href')).toContain('/custom/path/1');
  });

  it('does not render selected movie label when no movie is selected', () => {
    renderWithRouter(<MovieSwiper movies={sampleMovies} />);

    expect(screen.queryByText(/Selected:/i)).not.toBeInTheDocument();
  });

  it('renders empty state with proper styling', () => {
    renderWithRouter(<MovieSwiper movies={[]} />);

    const emptyState = screen.getByTestId('empty-state');
    expect(emptyState).toBeInTheDocument();
  });
});
