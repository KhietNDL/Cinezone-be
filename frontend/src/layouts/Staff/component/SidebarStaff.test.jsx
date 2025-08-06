/* eslint-disable no-undef */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import SidebarStaff from './SidebarStaff';

// Mock react-icons
jest.mock('react-icons/bs', () => ({
  BsQrCodeScan: () => <span data-testid="qr-scan-icon">QR Scan Icon</span>,
}));

jest.mock('react-icons/md', () => ({
  MdLocalMovies: () => <span data-testid="movies-icon">Movies Icon</span>,
  MdDashboard: () => <span data-testid="dashboard-icon">Dashboard Icon</span>,
}));

jest.mock('react-icons/io5', () => ({
  IoTicketOutline: () => <span data-testid="ticket-icon">Ticket Icon</span>,
  IoFastFoodOutline: () => <span data-testid="food-icon">Food Icon</span>,
}));

jest.mock('react-icons/fa', () => ({
  FaTimes: ({ size, className }) => (
    <span data-testid="close-icon" data-size={size} className={className}>
      Close Icon
    </span>
  ),
}));

// Wrapper component to provide router context
const renderWithRouter = (component, { route = '/' } = {}) => {
  window.history.pushState({}, 'Test page', route);
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('SidebarStaff Component', () => {
  const defaultProps = {
    isOpen: false,
    onToggle: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders all menu items when sidebar is open', () => {
      renderWithRouter(<SidebarStaff {...defaultProps} isOpen={true} />);

      expect(screen.getByText('Dashboard')).toBeInTheDocument();
      expect(screen.getByText('Movies')).toBeInTheDocument();
      expect(screen.getByText('Ticket Sales')).toBeInTheDocument();
      expect(screen.getByText('Food & Combos')).toBeInTheDocument();
      expect(screen.getByText('Check-in')).toBeInTheDocument();
    });

    it('renders all menu icons', () => {
      renderWithRouter(<SidebarStaff {...defaultProps} isOpen={true} />);

      expect(screen.getByTestId('dashboard-icon')).toBeInTheDocument();
      expect(screen.getByTestId('movies-icon')).toBeInTheDocument();
      expect(screen.getByTestId('ticket-icon')).toBeInTheDocument();
      expect(screen.getByTestId('food-icon')).toBeInTheDocument();
      expect(screen.getByTestId('qr-scan-icon')).toBeInTheDocument();
    });

    it('renders close button when sidebar is open on mobile', () => {
      renderWithRouter(<SidebarStaff {...defaultProps} isOpen={true} />);

      const closeButton = screen.getByTestId('close-icon');
      expect(closeButton).toBeInTheDocument();
      expect(closeButton).toHaveAttribute('data-size', '20');
    });

    it('does not render overlay when sidebar is closed', () => {
      renderWithRouter(<SidebarStaff {...defaultProps} isOpen={false} />);

      // Overlay should not be present when sidebar is closed
      const overlay = document.querySelector('.fixed.inset-0.bg-black\\/40');
      expect(overlay).not.toBeInTheDocument();
    });

    it('renders overlay when sidebar is open', () => {
      renderWithRouter(<SidebarStaff {...defaultProps} isOpen={true} />);

      const overlay = document.querySelector('.fixed.inset-0.bg-black\\/40');
      expect(overlay).toBeInTheDocument();
    });
  });

  describe('Navigation Links', () => {
    it('renders correct navigation links with proper hrefs', () => {
      renderWithRouter(<SidebarStaff {...defaultProps} isOpen={true} />);

      const dashboardLink = screen.getByText('Dashboard').closest('a');
      const moviesLink = screen.getByText('Movies').closest('a');
      const ticketSalesLink = screen.getByText('Ticket Sales').closest('a');
      const foodCombosLink = screen.getByText('Food & Combos').closest('a');
      const checkInLink = screen.getByText('Check-in').closest('a');

      expect(dashboardLink).toHaveAttribute('href', '/staff');
      expect(moviesLink).toHaveAttribute('href', '/staff/movie');
      expect(ticketSalesLink).toHaveAttribute('href', '/staff/ticket-selling');
      expect(foodCombosLink).toHaveAttribute('href', '/staff/combo-selling');
      expect(checkInLink).toHaveAttribute('href', '/staff/check-in');
    });

    it('applies active styles to current route', () => {
      renderWithRouter(<SidebarStaff {...defaultProps} isOpen={true} />, { route: '/staff' });

      const dashboardLink = screen.getByText('Dashboard').closest('a');
      expect(dashboardLink).toHaveClass('bg-purple-100', 'text-purple-700', 'border-l-4', 'border-purple-600');
    });

    it('applies inactive styles to non-current routes', () => {
      renderWithRouter(<SidebarStaff {...defaultProps} isOpen={true} />, { route: '/staff' });

      const moviesLink = screen.getByText('Movies').closest('a');
      expect(moviesLink).toHaveClass('text-gray-700');
      expect(moviesLink).not.toHaveClass('bg-purple-100', 'text-purple-700', 'border-l-4', 'border-purple-600');
    });
  });

  describe('User Interactions', () => {
    it('calls onToggle when close button is clicked', () => {
      const onToggle = jest.fn();
      renderWithRouter(<SidebarStaff {...defaultProps} isOpen={true} onToggle={onToggle} />);

      const closeButton = screen.getByTestId('close-icon').closest('button');
      fireEvent.click(closeButton);

      expect(onToggle).toHaveBeenCalledTimes(1);
    });

    it('calls onToggle when overlay is clicked', () => {
      const onToggle = jest.fn();
      renderWithRouter(<SidebarStaff {...defaultProps} isOpen={true} onToggle={onToggle} />);

      const overlay = document.querySelector('.fixed.inset-0.bg-black\\/40');
      fireEvent.click(overlay);

      expect(onToggle).toHaveBeenCalledTimes(1);
    });

    it('calls onToggle when navigation link is clicked', () => {
      const onToggle = jest.fn();
      renderWithRouter(<SidebarStaff {...defaultProps} isOpen={true} onToggle={onToggle} />);

      const moviesLink = screen.getByText('Movies').closest('a');
      fireEvent.click(moviesLink);

      expect(onToggle).toHaveBeenCalledTimes(1);
    });

    it('does not call onToggle when onToggle prop is not provided', () => {
      renderWithRouter(<SidebarStaff isOpen={true} />);

      const moviesLink = screen.getByText('Movies').closest('a');
      fireEvent.click(moviesLink);

      // Should not throw error when onToggle is not provided
      expect(moviesLink).toBeInTheDocument();
    });
  });

  describe('Responsive Behavior', () => {
    it('applies correct classes for mobile sidebar when open', () => {
      renderWithRouter(<SidebarStaff {...defaultProps} isOpen={true} />);

      const sidebar = document.querySelector('.fixed.top-0.shrink-0.left-0.h-full.bg-white.shadow-lg.z-50');
      expect(sidebar).toHaveClass('translate-x-0');
    });

    it('applies correct classes for mobile sidebar when closed', () => {
      renderWithRouter(<SidebarStaff {...defaultProps} isOpen={false} />);

      const sidebar = document.querySelector('.fixed.top-0.shrink-0.left-0.h-full.bg-white.shadow-lg.z-50');
      expect(sidebar).toHaveClass('-translate-x-full');
    });

    it('applies correct classes for desktop sidebar', () => {
      renderWithRouter(<SidebarStaff {...defaultProps} isOpen={false} />);

      const sidebar = document.querySelector('.fixed.top-0.shrink-0.left-0.h-full.bg-white.shadow-lg.z-50');
      expect(sidebar).toHaveClass('lg:translate-x-0', 'lg:static', 'lg:block');
    });
  });

  describe('Accessibility', () => {
    it('has proper button semantics for close button', () => {
      renderWithRouter(<SidebarStaff {...defaultProps} isOpen={true} />);

      const closeButton = screen.getByTestId('close-icon').closest('button');
      expect(closeButton).toBeInTheDocument();
      expect(closeButton).toHaveClass('p-2', 'md:p-3', 'rounded-lg', 'hover:bg-gray-100', 'text-gray-600', 'transition-colors');
    });

    it('has proper navigation structure', () => {
      renderWithRouter(<SidebarStaff {...defaultProps} isOpen={true} />);

      const nav = screen.getByRole('navigation');
      expect(nav).toBeInTheDocument();
      expect(nav).toHaveClass('space-y-2', 'md:space-y-3');
    });

    it('has proper link semantics for navigation items', () => {
      renderWithRouter(<SidebarStaff {...defaultProps} isOpen={true} />);

      const links = screen.getAllByRole('link');
      expect(links).toHaveLength(5); // Dashboard, Movies, Ticket Sales, Food & Combos, Check-in
    });
  });

  describe('Styling and Classes', () => {
    it('applies correct classes to sidebar container', () => {
      renderWithRouter(<SidebarStaff {...defaultProps} isOpen={true} />);

      const sidebar = document.querySelector('.fixed.top-0.shrink-0.left-0.h-full.bg-white.shadow-lg.z-50');
      expect(sidebar).toHaveClass(
        'fixed',
        'top-0',
        'shrink-0',
        'left-0',
        'h-full',
        'bg-white',
        'shadow-lg',
        'z-50',
        'w-[260px]',
        'md:w-[308px]',
        'transform',
        'transition-transform',
        'duration-300',
        'ease-in-out'
      );
    });

    it('applies correct classes to navigation items', () => {
      renderWithRouter(<SidebarStaff {...defaultProps} isOpen={true} />);

      const navItems = screen.getAllByRole('link');
      navItems.forEach(item => {
        expect(item).toHaveClass(
          'flex',
          'items-center',
          'space-x-3',
          'md:space-x-4',
          'px-4',
          'md:px-6',
          'py-3',
          'md:py-4',
          'rounded-lg',
          'transition-all',
          'duration-200'
        );
      });
    });

    it('applies correct classes to close button container', () => {
      renderWithRouter(<SidebarStaff {...defaultProps} isOpen={true} />);

      const closeButtonContainer = screen.getByTestId('close-icon').closest('div');
      expect(closeButtonContainer).toHaveClass('flex', 'justify-end', 'p-4', 'md:p-6', 'lg:hidden');
    });
  });

  describe('Edge Cases', () => {
    it('handles missing onToggle prop gracefully', () => {
      expect(() => {
        renderWithRouter(<SidebarStaff isOpen={true} />);
      }).not.toThrow();
    });

    it('renders correctly with all props provided', () => {
      const onToggle = jest.fn();
      renderWithRouter(<SidebarStaff isOpen={true} onToggle={onToggle} />);

      expect(screen.getByText('Dashboard')).toBeInTheDocument();
      expect(screen.getByText('Movies')).toBeInTheDocument();
      expect(screen.getByText('Ticket Sales')).toBeInTheDocument();
      expect(screen.getByText('Food & Combos')).toBeInTheDocument();
      expect(screen.getByText('Check-in')).toBeInTheDocument();
    });

    it('renders correctly when isOpen is false', () => {
      renderWithRouter(<SidebarStaff {...defaultProps} isOpen={false} />);

      // Sidebar should still be in the DOM but with hidden classes
      const sidebar = document.querySelector('.fixed.top-0.shrink-0.left-0.h-full.bg-white.shadow-lg.z-50');
      expect(sidebar).toBeInTheDocument();
      expect(sidebar).toHaveClass('-translate-x-full');
    });
  });

  describe('Menu Structure', () => {
    it('renders menu items in correct order', () => {
      renderWithRouter(<SidebarStaff {...defaultProps} isOpen={true} />);

      const navItems = screen.getAllByRole('link');
      const expectedOrder = ['Dashboard', 'Movies', 'Ticket Sales', 'Food & Combos', 'Check-in'];

      navItems.forEach((item, index) => {
        expect(item).toHaveTextContent(expectedOrder[index]);
      });
    });

    it('renders menu items with correct icons', () => {
      renderWithRouter(<SidebarStaff {...defaultProps} isOpen={true} />);

      const dashboardItem = screen.getByText('Dashboard').closest('a');
      const moviesItem = screen.getByText('Movies').closest('a');
      const ticketSalesItem = screen.getByText('Ticket Sales').closest('a');
      const foodCombosItem = screen.getByText('Food & Combos').closest('a');
      const checkInItem = screen.getByText('Check-in').closest('a');

      expect(dashboardItem).toContainElement(screen.getByTestId('dashboard-icon'));
      expect(moviesItem).toContainElement(screen.getByTestId('movies-icon'));
      expect(ticketSalesItem).toContainElement(screen.getByTestId('ticket-icon'));
      expect(foodCombosItem).toContainElement(screen.getByTestId('food-icon'));
      expect(checkInItem).toContainElement(screen.getByTestId('qr-scan-icon'));
    });
  });
}); 