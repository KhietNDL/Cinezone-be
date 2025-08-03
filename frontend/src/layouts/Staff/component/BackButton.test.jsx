/* eslint-disable no-undef */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import BackButton from './BackButton';

// Mock react-router-dom trước khi import component
const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate, // trả về hàm mock
}));

describe('BackButton', () => {
  beforeEach(() => {
    mockNavigate.mockClear(); // reset gọi trước mỗi test
  });

  it('renders the Back button with icon and text', () => {
    render(<BackButton />);
    
    // Kiểm tra có text "Back"
    expect(screen.getByText(/back/i)).toBeInTheDocument();

    // Kiểm tra icon tồn tại (dựa vào role hoặc title nếu cần)
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('calls navigate(-1) when button is clicked', () => {
    render(<BackButton />);

    fireEvent.click(screen.getByRole('button'));

    expect(mockNavigate).toHaveBeenCalledWith(-1);
    expect(mockNavigate).toHaveBeenCalledTimes(1);
  });
});
