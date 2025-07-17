import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import BackButton from './BackButton';
import { useNavigate } from 'react-router-dom';


jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
}));

describe('BackButton', () => {
  it('renders the Back button', () => {
    render(<BackButton />);
    expect(screen.getByText(/back/i)).toBeInTheDocument();
  });

  it('calls navigate(-1) when clicked', () => {
    const mockNavigate = jest.fn();
    useNavigate.mockReturnValue(mockNavigate); // Gán giá trị trả về

    render(<BackButton />);
    fireEvent.click(screen.getByText(/back/i));

    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });
});
