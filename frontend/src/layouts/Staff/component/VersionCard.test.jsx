/* eslint-disable no-undef */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import '@testing-library/jest-dom';
import VersionCard from './VersionCard';
import sellingSlice from '../../../redux/features/sellingSlice';

// Create a mock store
const createMockStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      selling: sellingSlice,
    },
    preloadedState: {
      selling: {
        selectedVersion: null,
        ...initialState,
      },
    },
  });
};

// Wrapper component to provide Redux context
const renderWithRedux = (component, { initialState = {} } = {}) => {
  const store = createMockStore(initialState);
  return {
    ...render(
      <Provider store={store}>
        {component}
      </Provider>
    ),
    store,
  };
};

describe('VersionCard Component', () => {
  const defaultProps = {
    version: '2D',
    selectedVersion: null,
    children: null,
    readonly: false,
    className: '',
  };

  describe('Rendering', () => {
    it('renders version text correctly', () => {
      renderWithRedux(<VersionCard {...defaultProps} version="IMAX" />);
      
      expect(screen.getByText('IMAX')).toBeInTheDocument();
    });

    it('renders children when not readonly', () => {
      const testChildren = <span data-testid="test-children">Test Content</span>;
      renderWithRedux(
        <VersionCard {...defaultProps} children={testChildren} />
      );

      expect(screen.getByTestId('test-children')).toBeInTheDocument();
    });

    it('does not render children when readonly', () => {
      const testChildren = <span data-testid="test-children">Test Content</span>;
      renderWithRedux(
        <VersionCard {...defaultProps} readonly={true} children={testChildren} />
      );

      expect(screen.queryByTestId('test-children')).not.toBeInTheDocument();
    });

    it('applies custom className', () => {
      renderWithRedux(
        <VersionCard {...defaultProps} className="custom-class" />
      );

      const versionCard = screen.getByText('2D').closest('div');
      expect(versionCard).toHaveClass('custom-class');
    });

    it('has correct title attribute', () => {
      renderWithRedux(<VersionCard {...defaultProps} version="3D" />);
      
      const versionCard = screen.getByText('3D').closest('div');
      expect(versionCard).toHaveAttribute('title', '3D');
    });
  });

  describe('Gradient Styling', () => {
    it('applies IMAX gradient correctly', () => {
      renderWithRedux(<VersionCard {...defaultProps} version="IMAX" />);
      
      const versionCard = screen.getByText('IMAX').closest('div');
      expect(versionCard).toHaveClass(
        'bg-gradient-to-r',
        'from-[#004897]',
        'to-[#0AF7FB]',
        'text-white'
      );
    });

    it('applies 4DX gradient correctly', () => {
      renderWithRedux(<VersionCard {...defaultProps} version="4DX" />);
      
      const versionCard = screen.getByText('4DX').closest('div');
      expect(versionCard).toHaveClass(
        'bg-gradient-to-r',
        'from-[#680000]',
        'to-[#F26969]',
        'text-white'
      );
    });

    it('applies 3D gradient correctly', () => {
      renderWithRedux(<VersionCard {...defaultProps} version="3D" />);
      
      const versionCard = screen.getByText('3D').closest('div');
      expect(versionCard).toHaveClass(
        'bg-gradient-to-r',
        'from-[#C88200]',
        'to-[#FFE606]',
        'text-white'
      );
    });

    it('applies 2D gradient correctly', () => {
      renderWithRedux(<VersionCard {...defaultProps} version="2D" />);
      
      const versionCard = screen.getByText('2D').closest('div');
      expect(versionCard).toHaveClass(
        'bg-gradient-to-r',
        'from-[#147800]',
        'to-[#5EFF41]',
        'text-white'
      );
    });

    it('applies default gradient for unknown version', () => {
      renderWithRedux(<VersionCard {...defaultProps} version="UNKNOWN" />);
      
      const versionCard = screen.getByText('UNKNOWN').closest('div');
      expect(versionCard).toHaveClass(
        'bg-gradient-to-tr',
        'from-[#f7bbd3]',
        'via-[#c7a6f2]',
        'via-[#97ccf1]',
        'to-[#ffcfbe]',
        'text-white'
      );
    });
  });

  describe('Selection State', () => {
    it('applies selected styles when version is selected', () => {
      renderWithRedux(
        <VersionCard {...defaultProps} version="2D" selectedVersion="2D" />
      );
      
      const versionCard = screen.getByText('2D').closest('div');
      expect(versionCard).toHaveClass('scale-107', 'shadow-lg', 'shadow-gray-400');
    });

    it('does not apply selected styles when version is not selected', () => {
      renderWithRedux(
        <VersionCard {...defaultProps} version="2D" selectedVersion="3D" />
      );
      
      const versionCard = screen.getByText('2D').closest('div');
      expect(versionCard).not.toHaveClass('scale-107', 'shadow-lg', 'shadow-gray-400');
    });

    it('does not apply selected styles when readonly', () => {
      renderWithRedux(
        <VersionCard 
          {...defaultProps} 
          version="2D" 
          selectedVersion="2D" 
          readonly={true} 
        />
      );
      
      const versionCard = screen.getByText('2D').closest('div');
      expect(versionCard).not.toHaveClass('scale-107', 'shadow-lg', 'shadow-gray-400');
    });
  });

  describe('User Interactions', () => {
    it('dispatches setSelectedVersion when clicked and not readonly', () => {
      const { store } = renderWithRedux(
        <VersionCard {...defaultProps} version="3D" />
      );

      const versionCard = screen.getByText('3D').closest('div');
      fireEvent.click(versionCard);

      const state = store.getState();
      expect(state.selling.selectedVersion).toBe('3D');
    });

    it('does not dispatch when readonly', () => {
      const { store } = renderWithRedux(
        <VersionCard {...defaultProps} version="3D" readonly={true} />
      );

      const versionCard = screen.getByText('3D').closest('div');
      fireEvent.click(versionCard);

      const state = store.getState();
      expect(state.selling.selectedVersion).toBe(null);
    });

    it('has cursor pointer when not readonly', () => {
      renderWithRedux(<VersionCard {...defaultProps} />);
      
      const versionCard = screen.getByText('2D').closest('div');
      expect(versionCard).toHaveClass('cursor-pointer');
    });

    // it('does not have cursor pointer when readonly', () => {
    //   renderWithRedux(<VersionCard {...defaultProps} readonly={true} />);
      
    //   const versionCard = screen.getByText('2D').closest('div');
    //   expect(versionCard).not.toHaveClass('cursor-pointer');
    // });
  });

  describe('Styling and Classes', () => {
    it('applies base classes correctly', () => {
      renderWithRedux(<VersionCard {...defaultProps} />);
      
      const versionCard = screen.getByText('2D').closest('div');
      expect(versionCard).toHaveClass(
        'font-bold',
        'px-5',
        'py-1.5',
        'rounded-lg',
        'cursor-pointer',
        'transition-all',
        'duration-300'
      );
    });

    it('applies container classes correctly', () => {
      renderWithRedux(<VersionCard {...defaultProps} />);
      
      const container = screen.getByText('2D').closest('.flex.flex-col.items-center.justify-center');
      expect(container).toBeInTheDocument();
    });

    it('combines custom className with existing classes', () => {
      renderWithRedux(
        <VersionCard {...defaultProps} className="my-custom-class" />
      );
      
      const versionCard = screen.getByText('2D').closest('div');
      expect(versionCard).toHaveClass('my-custom-class');
      expect(versionCard).toHaveClass('font-bold', 'px-5', 'py-1.5', 'rounded-lg');
    });
  });

  describe('Edge Cases', () => {
    // it('handles empty version string', () => {
    //   renderWithRedux(<VersionCard {...defaultProps} version="" />);
      
    //   expect(screen.getByText('')).toBeInTheDocument();
    // });

    it('handles null children', () => {
      expect(() => {
        renderWithRedux(<VersionCard {...defaultProps} children={null} />);
      }).not.toThrow();
    });

    it('handles undefined className', () => {
      expect(() => {
        renderWithRedux(<VersionCard {...defaultProps} className={undefined} />);
      }).not.toThrow();
    });

    it('handles missing props gracefully', () => {
      expect(() => {
        renderWithRedux(<VersionCard />);
      }).not.toThrow();
    });
  });

  describe('Accessibility', () => {
    it('has proper title attribute for screen readers', () => {
      renderWithRedux(<VersionCard {...defaultProps} version="IMAX" />);
      
      const versionCard = screen.getByTitle('IMAX');
      expect(versionCard).toBeInTheDocument();
    });

    it('has proper semantic structure', () => {
      renderWithRedux(<VersionCard {...defaultProps} />);
      
      const container = screen.getByText('2D').closest('.flex.flex-col.items-center.justify-center');
      expect(container).toBeInTheDocument();
    });
  });

  describe('Redux Integration', () => {
    it('updates Redux state when clicked', () => {
      const { store } = renderWithRedux(
        <VersionCard {...defaultProps} version="4DX" />
      );

      const versionCard = screen.getByText('4DX').closest('div');
      fireEvent.click(versionCard);

      const state = store.getState();
      expect(state.selling.selectedVersion).toBe('4DX');
    });

    it('maintains existing Redux state when not clicked', () => {
      const initialState = { selectedVersion: '3D' };
      const { store } = renderWithRedux(
        <VersionCard {...defaultProps} version="2D" />,
        { initialState }
      );

      const state = store.getState();
      expect(state.selling.selectedVersion).toBe('3D');
    });
  });

  describe('Component Structure', () => {
    it('renders with correct nested structure', () => {
      const testChildren = <span data-testid="nested-content">Nested</span>;
      renderWithRedux(
        <VersionCard {...defaultProps} children={testChildren} />
      );

      const container = screen.getByText('2D').closest('.flex.flex-col.items-center.justify-center');
      const versionCard = screen.getByText('2D').closest('div');
      const nestedContent = screen.getByTestId('nested-content');

      expect(container).toContainElement(versionCard);
      expect(versionCard).toContainElement(nestedContent);
    });

    it('renders version text in correct position', () => {
      renderWithRedux(<VersionCard {...defaultProps} version="3D" />);
      
      const versionCard = screen.getByText('3D').closest('div');
      expect(versionCard).toHaveTextContent('3D');
    });
  });
}); 