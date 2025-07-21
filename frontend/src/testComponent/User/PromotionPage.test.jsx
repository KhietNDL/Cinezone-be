/* eslint-disable */
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import MoviePromotions from "../../layouts/User/component/PromotionPage";
import * as api from "../../services/API";

// Mock API
jest.mock("../../services/API", () => ({
  getPromotion: jest.fn(),
  searchPromotion: jest.fn(),
}));

describe("MoviePromotions", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders page title", async () => {
    api.getPromotion.mockResolvedValue({ data: [] });
    render(<MoviePromotions />);
    expect(await screen.findByText(/movie promotions/i)).toBeInTheDocument();
  });

  it("shows loading state", () => {
    api.getPromotion.mockReturnValue(new Promise(() => {}));
    render(<MoviePromotions />);
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
    render(<MoviePromotions />);
    expect(await screen.findByText(/discount 10%/i)).toBeInTheDocument();
    expect(screen.getByText(/promo1/i)).toBeInTheDocument();
  });

  it("shows no promotions available message", async () => {
    api.getPromotion.mockResolvedValue({ data: [] });
    render(<MoviePromotions />);
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
    render(<MoviePromotions />);
    // Mở search box
    fireEvent.click(screen.getByLabelText(/open search/i));
    // Nhập từ khóa
    fireEvent.change(screen.getByPlaceholderText(/search magical deals/i), {
      target: { value: "PROMO2" },
    });
    // Đợi debounce và fetch
    expect(await screen.findByText(/discount 20%/i)).toBeInTheDocument();
    expect(screen.getAllByText(/promo2/i).length).toBeGreaterThan(0);
  });

  it("shows no promotions found when search returns empty", async () => {
    api.getPromotion.mockResolvedValue({ data: [] });
    api.searchPromotion.mockResolvedValue({ promotions: [] });
    render(<MoviePromotions />);
    fireEvent.click(screen.getByLabelText(/open search/i));
    fireEvent.change(screen.getByPlaceholderText(/search magical deals/i), {
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
    // Mock clipboard
    Object.assign(navigator, {
      clipboard: { writeText: jest.fn() },
    });
    render(<MoviePromotions />);
    expect(await screen.findByText(/discount 30%/i)).toBeInTheDocument();
    const copyBtn = screen.getByTitle(/copy code/i);
    fireEvent.click(copyBtn);
    await waitFor(() => {
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith("PROMO3");
    });
  });
});
