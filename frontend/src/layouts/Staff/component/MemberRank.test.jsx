/* eslint-disable no-undef */
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import MemberRank from './MemberRank';

// Mock react-icons
jest.mock('react-icons/fa', () => ({
  FaMedal: ({ className }) => <div data-testid="fa-medal" className={className}>Medal</div>
}));

jest.mock('react-icons/io5', () => ({
  IoDiamond: ({ className }) => <div data-testid="io-diamond" className={className}>Diamond</div>
}));

jest.mock('react-icons/fa6', () => ({
  FaRankingStar: ({ className }) => <div data-testid="fa-ranking-star" className={className}>RankingStar</div>
}));

describe('MemberRank Component', () => {
  const defaultProps = {
    rank: 'Bronze',
    pointsMemberShip: 500
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render the component with basic elements', () => {
      render(<MemberRank {...defaultProps} />);
      
      expect(screen.getByText('Rank:')).toBeInTheDocument();
      expect(screen.getByText('Bronze')).toBeInTheDocument();
      expect(screen.getByText('500 pts')).toBeInTheDocument();
      expect(screen.getByTestId('fa-ranking-star')).toBeInTheDocument();
    });

    it('should render the ranking star icon with correct styling', () => {
      render(<MemberRank {...defaultProps} />);
      
      const rankingIcon = screen.getByTestId('fa-ranking-star');
      expect(rankingIcon).toHaveClass('text-purple-600');
    });
  });

  describe('Bronze Rank', () => {
    it('should display Bronze rank correctly', () => {
      render(<MemberRank rank="Bronze" pointsMemberShip={500} />);
      
      expect(screen.getByText('Bronze')).toBeInTheDocument();
      expect(screen.getByTestId('fa-medal')).toHaveClass('text-[#cd7f32]');
      expect(screen.getByText('Next: 1000 pts')).toBeInTheDocument();
    });

    it('should calculate correct progress for Bronze rank', () => {
      render(<MemberRank rank="Bronze" pointsMemberShip={500} />);
      
      const progressBar = document.querySelector('.bg-purple-500');
      expect(progressBar).toHaveStyle('width: 50%'); // (500-0)/(1000-0) * 100 = 50%
    });

    it('should show 0% progress for Bronze rank with 0 points', () => {
      render(<MemberRank rank="Bronze" pointsMemberShip={0} />);
      
      const progressBar = document.querySelector('.bg-purple-500');
      expect(progressBar).toHaveStyle('width: 0%');
    });

    it('should show 100% progress when at Bronze rank threshold', () => {
      render(<MemberRank rank="Bronze" pointsMemberShip={1000} />);
      
      const progressBar = document.querySelector('.bg-purple-500');
      expect(progressBar).toHaveStyle('width: 100%');
    });
  });

  describe('Silver Rank', () => {
    it('should display Silver rank correctly', () => {
      render(<MemberRank rank="Silver" pointsMemberShip={2000} />);
      
      expect(screen.getByText('Silver')).toBeInTheDocument();
      expect(screen.getByTestId('fa-medal')).toHaveClass('text-[#C0C0C0]');
      expect(screen.getByText('Next: 3000 pts')).toBeInTheDocument();
    });

    it('should calculate correct progress for Silver rank', () => {
      render(<MemberRank rank="Silver" pointsMemberShip={2000} />);
      
      const progressBar = document.querySelector('.bg-purple-500');
      expect(progressBar).toHaveStyle('width: 50%'); // (2000-1000)/(3000-1000) * 100 = 50%
    });
  });

  describe('Gold Rank', () => {
    it('should display Gold rank correctly', () => {
      render(<MemberRank rank="Gold" pointsMemberShip={5000} />);
      
      expect(screen.getByText('Gold')).toBeInTheDocument();
      expect(screen.getByTestId('fa-medal')).toHaveClass('text-[#FFD700]');
      expect(screen.getByText('Next: 7000 pts')).toBeInTheDocument();
    });

    it('should calculate correct progress for Gold rank', () => {
      render(<MemberRank rank="Gold" pointsMemberShip={5000} />);
      
      const progressBar = document.querySelector('.bg-purple-500');
      expect(progressBar).toHaveStyle('width: 50%'); // (5000-3000)/(7000-3000) * 100 = 50%
    });
  });

  describe('Diamond Rank', () => {
    // it('should display Diamond rank correctly', () => {
    //   render(<MemberRank rank="Diamond" pointsMemberShip={7000} />);
      
    //   expect(screen.getByText('Diamond')).toBeInTheDocument();
    //   expect(screen.getByTestId('io-diamond')).toHaveClass('text-[#00BFFF]');
    //   expect(screen.getByText('Max Rank')).toBeInTheDocument();
    // });

    it('should show 100% progress for Diamond rank (max rank)', () => {
      render(<MemberRank rank="Diamond" pointsMemberShip={10000} />);
      
      const progressBar = document.querySelector('.bg-purple-500');
      expect(progressBar).toHaveStyle('width: 100%');
    });
  });

  describe('Edge Cases', () => {
    it('should default to Bronze rank for invalid rank', () => {
      render(<MemberRank rank="InvalidRank" pointsMemberShip={500} />);
      
      expect(screen.getByText('InvalidRank')).toBeInTheDocument();
      expect(screen.getByTestId('fa-medal')).toHaveClass('text-[#cd7f32]');
      expect(screen.getByText('Next: 1000 pts')).toBeInTheDocument();
    });

    it('should handle undefined rank gracefully', () => {
      render(<MemberRank rank={undefined} pointsMemberShip={500} />);
      
      const progressBar = document.querySelector('.bg-purple-500');
      expect(progressBar).toHaveStyle('width: 50%');
    });

    // it('should handle negative points', () => {
    //   render(<MemberRank rank="Bronze" pointsMemberShip={-100} />);
      
    //   const progressBar = document.querySelector('.bg-purple-500');
    //   expect(progressBar).toHaveStyle('width: 0%'); // Should be clamped to 0%
    // });

    it('should handle points exceeding next threshold', () => {
      render(<MemberRank rank="Bronze" pointsMemberShip={1500} />);
      
      const progressBar = document.querySelector('.bg-purple-500');
      expect(progressBar).toHaveStyle('width: 100%'); // Should be clamped to 100%
    });

    it('should handle zero points', () => {
      render(<MemberRank rank="Bronze" pointsMemberShip={0} />);
      
      expect(screen.getByText('0 pts')).toBeInTheDocument();
      const progressBar = document.querySelector('.bg-purple-500');
      expect(progressBar).toHaveStyle('width: 0%');
    });
  });

  describe('Styling and Colors', () => {
    it('should apply correct color for Bronze rank', () => {
      render(<MemberRank rank="Bronze" pointsMemberShip={500} />);
      
      const rankText = screen.getByText('Bronze').closest('span');
      expect(rankText).toHaveStyle('color: #cd7f32');
    });

    it('should apply correct color for Silver rank', () => {
      render(<MemberRank rank="Silver" pointsMemberShip={2000} />);
      
      const rankText = screen.getByText('Silver').closest('span');
      expect(rankText).toHaveStyle('color: #C0C0C0');
    });

    it('should apply correct color for Gold rank', () => {
      render(<MemberRank rank="Gold" pointsMemberShip={5000} />);
      
      const rankText = screen.getByText('Gold').closest('span');
      expect(rankText).toHaveStyle('color: #FFD700');
    });

    // it('should apply correct color for Diamond rank', () => {
    //   render(<MemberRank rank="Diamond" pointsMemberShip={10000} />);
      
    //   const rankText = screen.getByText('Diamond').closest('span');
    //   expect(rankText).toHaveStyle('color: #00BFFF');
    // });

    it('should apply default color for unknown rank', () => {
      render(<MemberRank rank="Unknown" pointsMemberShip={500} />);
      
      const rankText = screen.getByText('Unknown').closest('span');
      expect(rankText).toHaveStyle('color: #333');
    });

    it('should have correct CSS classes for progress bar', () => {
      render(<MemberRank rank="Bronze" pointsMemberShip={500} />);
      
      const progressContainer = document.querySelector('.w-full.bg-gray-200.rounded-full.h-3');
      expect(progressContainer).toBeInTheDocument();
      
      const progressBar = document.querySelector('.bg-purple-500.h-3.rounded-full.transition-all');
      expect(progressBar).toBeInTheDocument();
    });
  });

  describe('Progress Calculations', () => {
    it('should calculate progress correctly for different Bronze values', () => {
      const { rerender } = render(<MemberRank rank="Bronze" pointsMemberShip={250} />);
      let progressBar = document.querySelector('.bg-purple-500');
      expect(progressBar).toHaveStyle('width: 25%');

      rerender(<MemberRank rank="Bronze" pointsMemberShip={750} />);
      progressBar = document.querySelector('.bg-purple-500');
      expect(progressBar).toHaveStyle('width: 75%');
    });

    it('should calculate progress correctly for different Silver values', () => {
      const { rerender } = render(<MemberRank rank="Silver" pointsMemberShip={1500} />);
      let progressBar = document.querySelector('.bg-purple-500');
      expect(progressBar).toHaveStyle('width: 25%'); // (1500-1000)/(3000-1000) = 25%

      rerender(<MemberRank rank="Silver" pointsMemberShip={2500} />);
      progressBar = document.querySelector('.bg-purple-500');
      expect(progressBar).toHaveStyle('width: 75%'); // (2500-1000)/(3000-1000) = 75%
    });

    it('should calculate progress correctly for different Gold values', () => {
      const { rerender } = render(<MemberRank rank="Gold" pointsMemberShip={4000} />);
      let progressBar = document.querySelector('.bg-purple-500');
      expect(progressBar).toHaveStyle('width: 25%'); // (4000-3000)/(7000-3000) = 25%

      rerender(<MemberRank rank="Gold" pointsMemberShip={6000} />);
      progressBar = document.querySelector('.bg-purple-500');
      expect(progressBar).toHaveStyle('width: 75%'); // (6000-3000)/(7000-3000) = 75%
    });
  });

  describe('Accessibility', () => {
    it('should have proper text content for screen readers', () => {
      render(<MemberRank rank="Gold" pointsMemberShip={5000} />);
      
      expect(screen.getByText('Rank:')).toBeInTheDocument();
      expect(screen.getByText('Gold')).toBeInTheDocument();
      expect(screen.getByText('5000 pts')).toBeInTheDocument();
      expect(screen.getByText('Next: 7000 pts')).toBeInTheDocument();
    });

    it('should display Max Rank text for Diamond rank', () => {
      render(<MemberRank rank="Diamond" pointsMemberShip={10000} />);
      
      expect(screen.getByText('Max Rank')).toBeInTheDocument();
      expect(screen.queryByText(/Next:/)).not.toBeInTheDocument();
    });
  });
});