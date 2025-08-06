/* eslint-disable no-undef */
import React from 'react';
import { render, screen } from '@testing-library/react';
import MovieInfoSection from './MovieInfoSection';
import VersionCard from '../../component/VersionCard';

// Mock các icon components để tránh lỗi khi render
jest.mock('react-icons/ri', () => ({
  RiFilmAiFill: () => <span>RiFilmAiFill</span>,
}));
jest.mock('react-icons/fa6', () => ({
  FaCalendarDays: () => <span>FaCalendarDays</span>,
  FaLocationDot: () => <span>FaLocationDot</span>,
  FaCouch: () => <span>FaCouch</span>,
  FaStar: () => <span>FaStar</span>,
}));
jest.mock('react-icons/io5', () => ({
  IoTime: () => <span>IoTime</span>,
}));

// Mock VersionCard component
jest.mock('../../component/VersionCard', () => ({ version, className }) => (
  <div data-testid="version-card" className={className}>
    {version}
  </div>
));

describe('MovieInfoSection', () => {
  const defaultProps = {
    movieInfo: {
      PosterImage: 'https://example.com/poster.jpg',
      NameOfEnglish: 'Inception',
      NameOfVietnamese: 'Kẻ Đánh Cắp Giấc Mơ',
      Director: 'Christopher Nolan',
      RunningTime: 148,
      Genre: 'Action, Sci-Fi, Thriller',
      AverageRating: 'PG-13',
      ContentSynopsis: 'A thief who steals corporate secrets through dream infiltration technology.',
    },
    bookingData: {
      selectedVersion: 'IMAX',
      selectedDay: '01/08/2025',
      selectedTime: '14:00',
      room: 'Room 1',
      selectedSeats: ['A1', 'A2'],
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders movie information correctly', () => {
    render(<MovieInfoSection {...defaultProps} />);

    expect(screen.getByText('Ticket Information')).toBeInTheDocument();
    expect(screen.getByText('Inception')).toBeInTheDocument();
    expect(screen.getByText('(Kẻ Đánh Cắp Giấc Mơ)')).toBeInTheDocument();
    expect(screen.getByText('Christopher Nolan')).toBeInTheDocument();
    expect(screen.getByText('148 minutes')).toBeInTheDocument();
    expect(screen.getByText('Action')).toBeInTheDocument();
    expect(screen.getByText('Sci-Fi')).toBeInTheDocument();
    expect(screen.getByText('Thriller')).toBeInTheDocument();
    expect(screen.getByText('PG-13')).toBeInTheDocument();
    expect(screen.getByText('A thief who steals corporate secrets through dream infiltration technology.')).toBeInTheDocument();
    expect(screen.getByTestId('version-card')).toHaveTextContent('IMAX');
  });

  test('renders booking information correctly', () => {
    render(<MovieInfoSection {...defaultProps} />);

    expect(screen.getByText('Booking Information')).toBeInTheDocument();
    expect(screen.getByText('01/08/2025')).toBeInTheDocument();
    expect(screen.getByText('14:00')).toBeInTheDocument();
    expect(screen.getByText('Room 1')).toBeInTheDocument();
    expect(screen.getByText('2 seats')).toBeInTheDocument();
  });

//   test('renders placeholder poster on image error', () => {
//     render(<MovieInfoSection {...defaultProps} />);

//     const posterImage = screen.getByAltText('Inception');
//     fireEvent.error(posterImage);
//     expect(posterImage).toHaveAttribute('src', '/placeholder-poster.jpg');
//   });

  test('handles missing movie info gracefully', () => {
    const incompleteProps = {
      movieInfo: {
        PosterImage: 'https://example.com/poster.jpg',
        NameOfEnglish: 'Unknown Movie',
        NameOfVietnamese: '',
      },
      bookingData: defaultProps.bookingData,
    };

    render(<MovieInfoSection {...incompleteProps} />);

    expect(screen.getByText('Unknown Movie')).toBeInTheDocument();
    expect(screen.getByText('N/A')).toHaveTextContent('N/A'); // Director
    expect(screen.getByText('N/A minutes')).toBeInTheDocument(); // RunningTime
    expect(screen.getByText('Action')).toBeInTheDocument(); // Default Genre
    expect(screen.getByText('General')).toBeInTheDocument(); // Default Rating
    expect(screen.queryByText('Synopsis')).not.toBeInTheDocument(); // No synopsis
  });

  test('renders "Now Showing" badge', () => {
    render(<MovieInfoSection {...defaultProps} />);

    expect(screen.getByText('● Now Showing')).toBeInTheDocument();
  });

//   test('renders correct styles for layout', () => {
//     render(<MovieInfoSection {...defaultProps} />);

//     const container = screen.getByText('Ticket Information').closest('div');
//     expect(container).toHaveClass('bg-white rounded-xl shadow-sm border border-gray-200');

//     const posterImage = screen.getByAltText('Inception');
//     expect(posterImage).toHaveClass('w-full lg:w-52 h-98 object-cover rounded-xl shadow-lg border border-gray-200');

//     const versionCard = screen.getByTestId('version-card');
//     expect(versionCard).toHaveClass('text-xs');
//   });

  test('splits and renders multiple genres correctly', () => {
    render(<MovieInfoSection {...defaultProps} />);

    const genres = ['Action', 'Sci-Fi', 'Thriller'];
    genres.forEach((genre) => {
      expect(screen.getByText(genre)).toBeInTheDocument();
    });
  });

  test('does not render synopsis when ContentSynopsis is empty', () => {
    const noSynopsisProps = {
      ...defaultProps,
      movieInfo: { ...defaultProps.movieInfo, ContentSynopsis: '' },
    };

    render(<MovieInfoSection {...noSynopsisProps} />);

    expect(screen.queryByText('Synopsis')).not.toBeInTheDocument();
  });
});