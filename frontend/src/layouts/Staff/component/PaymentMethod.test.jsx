/* eslint-disable no-undef */
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import PaymentMethod from "./PaymentMethod";

// Mock the image imports
jest.mock("../../../assets/momo-seeklogo.png", () => "mocked-momo-image");
jest.mock("../../../assets/zalopay-seeklogo.svg", () => "mocked-zalopay-image");
jest.mock("../../../assets/Stripe-Symbol.png", () => "mocked-stripe-image");

// Mock react-icons
jest.mock("react-icons/fa6", () => ({
  FaMoneyBillWave: ({ className }) => (
    <div data-testid="cash-icon" className={className}>
      Cash Icon
    </div>
  ),
}));

const renderComponent = (props = {}) => {
  const defaultProps = {
    value: "Cash",
    onChange: jest.fn(),
  };
  return render(<PaymentMethod {...defaultProps} {...props} />);
};

describe("PaymentMethod", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders all payment methods", () => {
    renderComponent();
    expect(screen.getByText("Cash")).toBeInTheDocument();
    expect(screen.getByText("Momo")).toBeInTheDocument();
    expect(screen.getByText("Stripe")).toBeInTheDocument();
    expect(screen.getByText("ZaloPay")).toBeInTheDocument();
  });

  it("calls onChange with correct value when a method is clicked", () => {
    const onChange = jest.fn();
    renderComponent({ onChange });
    
    fireEvent.click(screen.getByText("Stripe").closest("label"));
    expect(onChange).toHaveBeenCalledWith("Stripe");

    fireEvent.click(screen.getByText("Momo").closest("label"));
    expect(onChange).toHaveBeenCalledWith("Momo");
  });

  it("highlights the selected payment method", () => {
    renderComponent({ value: "Momo" });

    const momoLabel = screen.getByText("Momo").closest("label");
    expect(momoLabel).toHaveClass("ring-2", "ring-purple-500");

    const cashLabel = screen.getByText("Cash").closest("label");
    expect(cashLabel).not.toHaveClass("ring-2", "ring-purple-500");
  });

  it("renders payment method icons correctly", () => {
    renderComponent();
    
    // Test Cash icon
    expect(screen.getByTestId("cash-icon")).toBeInTheDocument();
    expect(screen.getByTestId("cash-icon")).toHaveClass("text-3xl", "mx-auto", "mb-2", "text-purple-600");
    
    // Test image icons
    expect(screen.getByAltText("Momo")).toBeInTheDocument();
    expect(screen.getByAltText("Stripe")).toBeInTheDocument();
    expect(screen.getByAltText("ZaloPay")).toBeInTheDocument();
  });

  it("applies correct styling for selected and unselected methods", () => {
    const { rerender } = renderComponent({ value: "Cash" });
    
    // Test selected method styling
    const cashLabel = screen.getByText("Cash").closest("label");
    expect(cashLabel).toHaveClass(
      "ring-2",
      "ring-purple-500",
      "shadow-xl",
      "transform",
      "translate-y-[-4px]",
      "bg-gradient-to-br",
      "from-purple-50",
      "to-purple-100",
      "border-purple-500"
    );
    
    // Test unselected method styling
    const momoLabel = screen.getByText("Momo").closest("label");
    expect(momoLabel).toHaveClass("bg-white", "border-gray-200");
    expect(momoLabel).not.toHaveClass("ring-2", "ring-purple-500");
    
    // Test rerender with different selection
    rerender(<PaymentMethod value="Stripe" onChange={jest.fn()} />);
    const stripeLabel = screen.getByText("Stripe").closest("label");
    expect(stripeLabel).toHaveClass("ring-2", "ring-purple-500");
  });

  it("shows card type selection when showCardType is true", () => {
    renderComponent({ 
      showCardType: true, 
      cardType: "visa",
      onCardTypeChange: jest.fn() 
    });
    
    expect(screen.getByText("Select Card Type")).toBeInTheDocument();
    expect(screen.getByText("*")).toBeInTheDocument(); // Required indicator
    expect(screen.getByText("Visa")).toBeInTheDocument();
    expect(screen.getByText("MasterCard")).toBeInTheDocument();
    expect(screen.getByText("JCB")).toBeInTheDocument();
    expect(screen.getByText("American Express")).toBeInTheDocument();
  });

  it("handles card type selection correctly", () => {
    const onCardTypeChange = jest.fn();
    renderComponent({ 
      showCardType: true, 
      cardType: "visa",
      onCardTypeChange 
    });
    
    // Test initial selection
    const visaRadio = screen.getByDisplayValue("visa");
    expect(visaRadio).toBeChecked();
    
    // Test changing selection
    const mastercardRadio = screen.getByDisplayValue("mastercard");
    fireEvent.click(mastercardRadio);
    expect(onCardTypeChange).toHaveBeenCalledWith("mastercard");
  });

  it("displays card type error when provided", () => {
    const errorMessage = "Please select a card type";
    renderComponent({ 
      showCardType: true,
      cardTypeError: errorMessage 
    });
    
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
    const errorDiv = screen.getByText(errorMessage).closest("div");
    expect(errorDiv).toHaveClass("text-red-600", "text-sm", "font-medium");
  });

  it("applies correct styling to selected card type", () => {
    renderComponent({ 
      showCardType: true, 
      cardType: "visa" 
    });
    
    const visaLabel = screen.getByDisplayValue("visa").closest("label");
    expect(visaLabel).toHaveClass(
      "bg-purple-100", 
      "border-purple-500", 
      "text-purple-700", 
      "shadow-md"
    );
    
    const mastercardLabel = screen.getByDisplayValue("mastercard").closest("label");
    expect(mastercardLabel).toHaveClass(
      "bg-white", 
      "border-gray-200", 
      "text-gray-700"
    );
    expect(mastercardLabel).not.toHaveClass("bg-purple-100", "border-purple-500");
  });

  it("handles custom card types prop", () => {
    const customCardTypes = [
      {
        value: "custom",
        label: "Custom Card",
        icon: "https://example.com/custom-icon.png"
      }
    ];
    
    renderComponent({ 
      showCardType: true, 
      cardTypes: customCardTypes 
    });
    
    expect(screen.getByText("Custom Card")).toBeInTheDocument();
    expect(screen.queryByText("Visa")).not.toBeInTheDocument();
  });
});
