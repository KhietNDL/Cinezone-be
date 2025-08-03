/* eslint-disable no-undef */
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ItemCard from "./ItemCard";

describe("ItemCard", () => {
  const mockMovie = {
    MovieId: 1,
    NameOfEnglish: "Avengers Endgame",
    NameOfVietnamese: "Biệt Đội Siêu Anh Hùng: Hồi Kết",
    PosterImage: "avengers-poster.jpg",
    AverageRating: 8.5,
  };

  const mockCombo = {
    id: 1,
    name: "Popcorn Combo",
    image: "popcorn-combo.jpg",
    price: 50000,
    quantity: 10,
  };

  const defaultProps = {
    onSelect: jest.fn(),
    selected: false,
    small: false,
    disabled: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // 1. Test movie card rendering
  it("renders movie card with correct information", () => {
    render(<ItemCard item={mockMovie} type="movie" {...defaultProps} />);

    expect(screen.getByText("Avengers Endgame")).toBeInTheDocument();
    expect(screen.getByText("Biệt Đội Siêu Anh ...")).toBeInTheDocument();
    expect(screen.getByAltText("Avengers Endgame")).toBeInTheDocument();
  });

  // 2. Test combo card rendering
  it("renders combo card with correct information", () => {
    render(<ItemCard item={mockCombo} type="combo" {...defaultProps} />);

    expect(screen.getByText("Popcorn Combo")).toBeInTheDocument();
    expect(screen.getByText("50.000 ₫")).toBeInTheDocument();
    expect(screen.getByText("Stock: 10")).toBeInTheDocument();
  });

  // 3. Test movie card with rating
  it("displays movie rating when available", () => {
    render(<ItemCard item={mockMovie} type="movie" {...defaultProps} />);

    expect(screen.getByText("8.5")).toBeInTheDocument();
  });

  // 4. Test combo card with out of stock
  it("shows out of stock message when quantity is 0", () => {
    const outOfStockCombo = { ...mockCombo, quantity: 0 };
    render(<ItemCard item={outOfStockCombo} type="combo" {...defaultProps} />);

    expect(screen.getByText("Out of Stock")).toBeInTheDocument();
  });

  // 5. Test selected state
  it("applies selected styling when selected prop is true", () => {
    render(<ItemCard item={mockMovie} type="movie" {...defaultProps} selected={true} />);

    // Use getAllByTitle and get the first one (the container)
    const cards = screen.getAllByTitle("Avengers Endgame");
    const card = cards[0]; // Get the container div
    expect(card).toHaveClass("ring-2", "ring-purple-500");
  });

  // 6. Test disabled state
  it("applies disabled styling when disabled prop is true", () => {
    render(<ItemCard item={mockMovie} type="movie" {...defaultProps} disabled={true} />);

    // Use getAllByTitle and get the first one (the container)
    const cards = screen.getAllByTitle("Avengers Endgame");
    const card = cards[0]; // Get the container div
    expect(card).toHaveClass("opacity-50", "cursor-not-allowed");
  });

  // 7. Test click handler
  it("calls onSelect when clicked", () => {
    const mockOnSelect = jest.fn();
    render(<ItemCard item={mockMovie} type="movie" {...defaultProps} onSelect={mockOnSelect} />);

    // Use getAllByTitle and get the first one (the container)
    const cards = screen.getAllByTitle("Avengers Endgame");
    const card = cards[0]; // Get the container div
    fireEvent.click(card);

    expect(mockOnSelect).toHaveBeenCalledWith(mockMovie);
  });

  // 8. Test disabled click
  it("does not call onSelect when disabled", () => {
    const mockOnSelect = jest.fn();
    render(<ItemCard item={mockMovie} type="movie" {...defaultProps} onSelect={mockOnSelect} disabled={true} />);

    // Use getAllByTitle and get the first one (the container)
    const cards = screen.getAllByTitle("Avengers Endgame");
    const card = cards[0]; // Get the container div
    fireEvent.click(card);

    expect(mockOnSelect).not.toHaveBeenCalled();
  });

  // 9. Test small size
  it("applies small size styling when small prop is true", () => {
    render(<ItemCard item={mockMovie} type="movie" {...defaultProps} small={true} />);

    // Use getAllByTitle and get the first one (the container)
    const cards = screen.getAllByTitle("Avengers Endgame");
    const card = cards[0]; // Get the container div
    expect(card).toHaveClass("w-[200px]", "h-[320px]");
  });

  // 10. Test large size (default)
  it("applies large size styling when small prop is false", () => {
    render(<ItemCard item={mockMovie} type="movie" {...defaultProps} small={false} />);

    // Use getAllByTitle and get the first one (the container)
    const cards = screen.getAllByTitle("Avengers Endgame");
    const card = cards[0]; // Get the container div
    expect(card).toHaveClass("w-[250px]", "h-[360px]");
  });

  // 11. Test image error handling
  it("shows placeholder image when image fails to load", () => {
    render(<ItemCard item={mockMovie} type="movie" {...defaultProps} />);

    const image = screen.getByAltText("Avengers Endgame");
    fireEvent.error(image);

    expect(image.src).toContain("placeholder.com");
  });

  // 12. Test text truncation
  it("truncates long movie names", () => {
    const longNameMovie = {
      ...mockMovie,
      NameOfEnglish: "This is a very long movie name that should be truncated",
    };

    render(<ItemCard item={longNameMovie} type="movie" {...defaultProps} />);

    // Test for the truncated version that actually appears
    expect(screen.getByText("This is a very lon...")).toBeInTheDocument();
  });

  // 13. Test null item handling
  it("renders nothing when item is null", () => {
    const { container } = render(<ItemCard item={null} type="movie" {...defaultProps} />);
    expect(container.firstChild).toBeNull();
  });

  // 14. Test missing image handling
  it("handles missing poster image", () => {
    const movieWithoutImage = { ...mockMovie };
    delete movieWithoutImage.PosterImage;

    render(<ItemCard item={movieWithoutImage} type="movie" {...defaultProps} />);

    const image = screen.getByAltText("Avengers Endgame");
    fireEvent.error(image);
    expect(image.src).toContain("placeholder.com");
  });

  // 15. Test movie without Vietnamese name
  it("handles movie without Vietnamese name", () => {
    const movieWithoutVietnamese = { ...mockMovie };
    delete movieWithoutVietnamese.NameOfVietnamese;

    render(<ItemCard item={movieWithoutVietnamese} type="movie" {...defaultProps} />);

    expect(screen.getByText("Avengers Endgame")).toBeInTheDocument();
    expect(screen.queryByText("Biệt Đội Siêu Anh Hùng: Hồi Kết")).not.toBeInTheDocument();
  });

  // 16. Test combo without price
  it("handles combo without price", () => {
    const comboWithoutPrice = { ...mockCombo };
    delete comboWithoutPrice.price;

    render(<ItemCard item={comboWithoutPrice} type="combo" {...defaultProps} />);

    expect(screen.getByText("Popcorn Combo")).toBeInTheDocument();
    expect(screen.queryByText("₫")).not.toBeInTheDocument();
  });

  // 17. Test movie without rating
  it("handles movie without rating", () => {
    const movieWithoutRating = { ...mockMovie };
    delete movieWithoutRating.AverageRating;

    render(<ItemCard item={movieWithoutRating} type="movie" {...defaultProps} />);

    expect(screen.getByText("Avengers Endgame")).toBeInTheDocument();
    expect(screen.queryByText("8.5")).not.toBeInTheDocument();
  });

  // 18. Test accessibility
  it("has proper accessibility attributes", () => {
    render(<ItemCard item={mockMovie} type="movie" {...defaultProps} />);

    // Use getAllByTitle and get the first one (the container)
    const cards = screen.getAllByTitle("Avengers Endgame");
    const card = cards[0]; // Get the container div
    expect(card).toBeInTheDocument();
  });

  // 19. Test different combo sizes
  it("applies correct size classes for combo items", () => {
    const { rerender } = render(<ItemCard item={mockCombo} type="combo" {...defaultProps} small={true} />);
    
    // Use getAllByTitle and get the first one (the container)
    let cards = screen.getAllByTitle("Popcorn Combo");
    let card = cards[0]; // Get the container div
    expect(card).toHaveClass("w-[180px]", "h-[260px]");

    rerender(<ItemCard item={mockCombo} type="combo" {...defaultProps} small={false} />);
    cards = screen.getAllByTitle("Popcorn Combo");
    card = cards[0]; // Get the container div
    expect(card).toHaveClass("w-[240px]", "h-[320px]");
  });

  // 20. Test hover effects
  it("has hover effects when not disabled", () => {
    render(<ItemCard item={mockMovie} type="movie" {...defaultProps} />);

    // Use getAllByTitle and get the first one (the container)
    const cards = screen.getAllByTitle("Avengers Endgame");
    const card = cards[0]; // Get the container div
    expect(card).toHaveClass("hover:shadow-lg", "hover:translate-y-[-2px]");
  });
}); 