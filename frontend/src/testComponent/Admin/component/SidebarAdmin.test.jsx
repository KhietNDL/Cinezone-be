import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { BrowserRouter as Router } from "react-router-dom";
import { describe, test, expect, jest } from "@jest/globals";
import SidebarAdmin from "../../../layouts/Admin/component/SidebarAdmin";

describe("SidebarAdmin", () => {
  const menuItems = [
    "Over View",
    "User Management",
    "Employee Management",
    "Movie Management",
    "Cinema Room Management",
    "Ticket Booking Management",
    "Product Management",
    "Promotion Management",
    "Blog Management",
  ];

  test("renders all menu items", () => {
    render(
      <Router>
        <SidebarAdmin onClose={() => {}} />
      </Router>
    );

    menuItems.forEach((item) => {
      expect(screen.getByText(item)).toBeInTheDocument();
    });
  });

  test("calls onClose when a menu item is clicked on mobile", () => {
    const onCloseMock = jest.fn();
    // Simulate mobile view
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 768,
    });

    render(
      <Router>
        <SidebarAdmin onClose={onCloseMock} />
      </Router>
    );

    fireEvent.click(screen.getByText("User Management"));
    expect(onCloseMock).toHaveBeenCalledTimes(1);
  });

  test("does not call onClose when a menu item is clicked on desktop", () => {
    const onCloseMock = jest.fn();
    // Simulate desktop view
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 1280,
    });

    render(
      <Router>
        <SidebarAdmin onClose={onCloseMock} />
      </Router>
    );

    fireEvent.click(screen.getByText("User Management"));
    expect(onCloseMock).not.toHaveBeenCalled();
  });

  test("calls onClose when the close button is clicked", () => {
    const onCloseMock = jest.fn();
    render(
      <Router>
        <SidebarAdmin onClose={onCloseMock} />
      </Router>
    );

    const closeButton = screen.getByRole("button", { name: /close menu/i });
    fireEvent.click(closeButton);
    expect(onCloseMock).toHaveBeenCalledTimes(1);
  });
});
