/* eslint-disable */
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import MoviePromotions from "../../layouts/User/component/PromotionPage";
import * as api from "../../services/API";
import { BrowserRouter } from "react-router-dom";

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

// Mock API
jest.mock("../../services/API", () => ({
  getPromotion: jest.fn(),
  searchPromotion: jest.fn(),
}));

describe("MoviePromotions", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock clipboard API
    Object.assign(navigator, {
      clipboard: { writeText: jest.fn() },
    });
  });

  const renderWithRouter = (component) => {
    return render(<BrowserRouter>{component}</BrowserRouter>);
  };

  it("renders page title", async () => {
    api.getPromotion.mockResolvedValue({ data: [] });
    renderWithRouter(<MoviePromotions />);
    expect(await screen.findByText(/movie promotions/i)).toBeInTheDocument();
  });

  it("shows loading state", () => {
    api.getPromotion.mockReturnValue(new Promise(() => {}));
    renderWithRouter(<MoviePromotions />);
    expect(screen.getByText(/loading promotions/i)).toBeInTheDocument();
  });

  it("shows promotions after fetch", async () => {
    api.getPromotion.mockResolvedValue({
      data: [
        {
          PromotionId: 1,
          Title: "PROMO1",
          Detail: "Discount 10%",
          DiscountValue: 10,
          StartTime: new Date(Date.now() - 1000000).toISOString(),
          EndTime: new Date(Date.now() + 1000000).toISOString(),
          Image: "",
        },
      ],
    });
    renderWithRouter(<MoviePromotions />);
    expect(await screen.findByText(/discount 10%/i)).toBeInTheDocument();
    expect(screen.getByText(/promo1/i)).toBeInTheDocument();
  });

  it("shows no promotions available message", async () => {
    api.getPromotion.mockResolvedValue({ data: [] });
    renderWithRouter(<MoviePromotions />);
    expect(
      await screen.findByText(/no promotions available/i)
    ).toBeInTheDocument();
  });

  it("searches and shows results", async () => {
    api.getPromotion.mockResolvedValue({ data: [] });
    api.searchPromotion.mockResolvedValue({
      promotions: [
        {
          PromotionId: 2,
          Title: "PROMO2",
          Detail: "Discount 20%",
          DiscountValue: 20,
          StartTime: new Date(Date.now() - 1000000).toISOString(),
          EndTime: new Date(Date.now() + 1000000).toISOString(),
          Image: "",
        },
      ],
    });
    renderWithRouter(<MoviePromotions />);
    // Tìm search input
    const searchInput = screen.getByPlaceholderText(
      /search for amazing movie deals/i
    );
    fireEvent.change(searchInput, {
      target: { value: "PROMO2" },
    });
    // Đợi debounce và fetch
    expect(await screen.findByText(/discount 20%/i)).toBeInTheDocument();
    expect(screen.getAllByText(/promo2/i).length).toBeGreaterThan(0);
  });

  it("shows no promotions found when search returns empty", async () => {
    api.getPromotion.mockResolvedValue({ data: [] });
    api.searchPromotion.mockResolvedValue({ promotions: [] });
    renderWithRouter(<MoviePromotions />);
    const searchInput = screen.getByPlaceholderText(
      /search for amazing movie deals/i
    );
    fireEvent.change(searchInput, {
      target: { value: "NOTFOUND" },
    });
    expect(await screen.findByText(/no promotions found/i)).toBeInTheDocument();
  });

  it("copies promo code when copy button is clicked", async () => {
    api.getPromotion.mockResolvedValue({
      data: [
        {
          PromotionId: 3,
          Title: "PROMO3",
          Detail: "Discount 30%",
          DiscountValue: 30,
          StartTime: new Date(Date.now() - 1000000).toISOString(),
          EndTime: new Date(Date.now() + 1000000).toISOString(),
          Image: "",
        },
      ],
    });
    renderWithRouter(<MoviePromotions />);
    expect(await screen.findByText(/discount 30%/i)).toBeInTheDocument();
    const copyBtn = screen.getByTitle(/copy code/i);
    fireEvent.click(copyBtn);
    await waitFor(() => {
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith("PROMO3");
    });
  });
});
