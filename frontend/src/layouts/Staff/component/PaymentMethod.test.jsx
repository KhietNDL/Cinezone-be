/* eslint-disable no-undef */
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import PaymentMethod from "./PaymentMethod";

// Mocks (nếu bạn dùng toast hay navigate thì thêm ở đây)

// Helper render với wrapper nếu cần (BrowserRouter, context...)
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
    // expect(screen.getByText("VNPay")).toBeInTheDocument();
    expect(screen.getByText("Visa")).toBeInTheDocument();
    expect(screen.getByText("ZaloPay")).toBeInTheDocument();
  });

  it("calls onChange with correct value when a method is clicked", () => {
    const onChange = jest.fn();
    renderComponent({ onChange });

    // fireEvent.click(screen.getByText("VNPay").closest("label"));
    // expect(onChange).toHaveBeenCalledWith("VNPay");
    fireEvent.click(screen.getByText("Visa").closest("label"));
    expect(onChange).toHaveBeenCalledWith("Visa");

    fireEvent.click(screen.getByText("Momo").closest("label"));
    expect(onChange).toHaveBeenCalledWith("Momo");
  });

  it("highlights the selected payment method", () => {
    renderComponent({ value: "Momo" });

    const momoLabel = screen.getByText("Momo").closest("label");
    expect(momoLabel).toHaveClass("ring-4");

    const cashLabel = screen.getByText("Cash").closest("label");
    expect(cashLabel).not.toHaveClass("ring-4 ring-purple-500");
  });
});
