/* eslint-disable no-undef */
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import UserCards from "../../../layouts/Admin/userComponent/UserCards";
// Mock the react-icons
jest.mock("react-icons/fa", () => ({
  FaRegEdit: ({ size, ...props }) => (
    <div data-testid="edit-icon" data-size={size} {...props} />
  ),
}));

jest.mock("react-icons/ri", () => ({
  RiDeleteBin5Line: ({ size, ...props }) => (
    <div data-testid="delete-icon" data-size={size} {...props} />
  ),
}));

describe("UserCards Component", () => {
  const mockUsers = [
    {
      UserId: 1,
      FullName: "John Doe",
      Email: "john.doe@example.com",
      DateOfBirth: "1990-01-01",
      Sex: 1,
      PhoneNumber: "123-456-7890",
      avatar_url: "https://example.com/avatar1.jpg",
    },
    {
      UserId: 2,
      FullName: "Jane Smith With Very Long Name That Exceeds Twenty Characters",
      Email: "jane.smith.with.very.long.email@example.com",
      DateOfBirth: "1985-05-15",
      Sex: 2,
      PhoneNumber: "987-654-3210",
      avatar_url: null,
    },
    {
      UserId: 3,
      FullName: "Alex Johnson",
      Email: "alex@example.com",
      DateOfBirth: "1992-12-25",
      Sex: "Other",
      PhoneNumber: null,
      avatar_url: "https://example.com/avatar3.jpg",
    },
  ];

  const defaultProps = {
    users: mockUsers,
    handleEditUser: jest.fn(),
    handleDeleteUser: jest.fn(),
    formatDate: jest.fn((date) => (date ? "01/01/1990" : "N/A")),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Rendering", () => {
    it("renders all user cards", () => {
      render(<UserCards {...defaultProps} />);

      const articles = screen.getAllByRole("article");
      expect(articles).toHaveLength(3);
    });

    it("renders empty div when no users provided", () => {
      const props = { ...defaultProps, users: [] };
      const { container } = render(<UserCards {...props} />);

      const userCardsContainer = container.firstChild;
      expect(userCardsContainer).toHaveClass("block", "sm:hidden", "space-y-4");
      expect(userCardsContainer.children).toHaveLength(0);
    });

    it("applies correct CSS classes to container", () => {
      const { container } = render(<UserCards {...defaultProps} />);

      const mainDiv = container.firstChild;
      expect(mainDiv).toHaveClass("block", "sm:hidden", "space-y-4");
    });

    it("applies correct CSS classes to each article", () => {
      render(<UserCards {...defaultProps} />);

      const articles = screen.getAllByRole("article");
      articles.forEach((article) => {
        expect(article).toHaveClass(
          "bg-white",
          "p-4",
          "rounded-lg",
          "shadow-sm",
          "border",
          "border-slate-200"
        );
      });
    });
  });

  describe("User Information Display", () => {
    it("displays user avatar with correct src and alt attributes", () => {
      render(<UserCards {...defaultProps} />);

      const avatars = screen.getAllByRole("img");
      expect(avatars[0]).toHaveAttribute(
        "src",
        "https://example.com/avatar1.jpg"
      );
      expect(avatars[0]).toHaveAttribute("alt", "John Doe");
      expect(avatars[0]).toHaveClass(
        "w-16",
        "h-16",
        "rounded-full",
        "object-cover"
      );
    });

    it("displays default avatar when avatar_url is null", () => {
      render(<UserCards {...defaultProps} />);

      const avatars = screen.getAllByRole("img");
      expect(avatars[1]).toHaveAttribute("src", "/default-avatar.png");
      expect(avatars[1]).toHaveAttribute(
        "alt",
        "Jane Smith With Very Long Name That Exceeds Twenty Characters"
      );
    });

    it("displays full name when less than 20 characters", () => {
      render(<UserCards {...defaultProps} />);

      expect(screen.getByText("John Doe")).toBeInTheDocument();
      expect(screen.getByText("Alex Johnson")).toBeInTheDocument();
    });

    it("truncates long full names and shows tooltip", () => {
      render(<UserCards {...defaultProps} />);

      const truncatedName = screen.getByText("Jane Smith With Very...");
      expect(truncatedName).toBeInTheDocument();
      expect(truncatedName).toHaveAttribute(
        "title",
        "Jane Smith With Very Long Name That Exceeds Twenty Characters"
      );
    });

    it('displays "N/A" when FullName is null', () => {
      const usersWithNullName = [
        {
          ...mockUsers[0],
          FullName: null,
        },
      ];
      const props = { ...defaultProps, users: usersWithNullName };

      render(<UserCards {...props} />);
      expect(screen.getByText("N/A")).toBeInTheDocument();
    });

    it("displays full email when less than 20 characters", () => {
      render(<UserCards {...defaultProps} />);

      expect(screen.getByText("alex@example.com")).toBeInTheDocument();
    });

    it("truncates long emails and shows tooltip", () => {
      render(<UserCards {...defaultProps} />);

      const truncatedEmail = screen.getByText("jane.smith.with.very...");
      expect(truncatedEmail).toBeInTheDocument();
      expect(truncatedEmail).toHaveAttribute(
        "title",
        "jane.smith.with.very.long.email@example.com"
      );
    });
  });

  describe("User Details Grid", () => {
    it("displays formatted date of birth", () => {
      render(<UserCards {...defaultProps} />);

      const dobElements = screen.getAllByText(/DOB:/);
      expect(dobElements).toHaveLength(3);
      expect(defaultProps.formatDate).toHaveBeenCalledWith("1990-01-01");
    });

    it("displays correct gender for male (numeric 1)", () => {
      render(<UserCards {...defaultProps} />);

      expect(screen.getByText("Male")).toBeInTheDocument();
    });

    it("displays correct gender for female (numeric 2)", () => {
      render(<UserCards {...defaultProps} />);

      expect(screen.getByText("Female")).toBeInTheDocument();
    });

    it('displays "Other" for non-standard gender values', () => {
      render(<UserCards {...defaultProps} />);

      expect(screen.getByText("Other")).toBeInTheDocument();
    });

    it("displays phone number when available", () => {
      render(<UserCards {...defaultProps} />);

      expect(screen.getByText("123-456-7890")).toBeInTheDocument();
      expect(screen.getByText("987-654-3210")).toBeInTheDocument();
    });

    it('displays "N/A" when phone number is null', () => {
      render(<UserCards {...defaultProps} />);

      const phoneElements = screen.getAllByText(/Phone:/);
      const naElements = screen.getAllByText("N/A");

      expect(phoneElements).toHaveLength(3);
      expect(naElements.length).toBeGreaterThan(0);
    });
  });

  describe("Gender Display Logic", () => {
    it('handles string "1" as Male', () => {
      const userWithStringSex = [{ ...mockUsers[0], Sex: "1" }];
      const props = { ...defaultProps, users: userWithStringSex };

      render(<UserCards {...props} />);
      expect(screen.getByText("Male")).toBeInTheDocument();
    });

    it('handles string "Male" as Male', () => {
      const userWithStringSex = [{ ...mockUsers[0], Sex: "Male" }];
      const props = { ...defaultProps, users: userWithStringSex };

      render(<UserCards {...props} />);
      expect(screen.getByText("Male")).toBeInTheDocument();
    });

    it('handles string "2" as Female', () => {
      const userWithStringSex = [{ ...mockUsers[0], Sex: "2" }];
      const props = { ...defaultProps, users: userWithStringSex };

      render(<UserCards {...props} />);
      expect(screen.getByText("Female")).toBeInTheDocument();
    });

    it('handles string "Female" as Female', () => {
      const userWithStringSex = [{ ...mockUsers[0], Sex: "Female" }];
      const props = { ...defaultProps, users: userWithStringSex };

      render(<UserCards {...props} />);
      expect(screen.getByText("Female")).toBeInTheDocument();
    });
  });

  describe("Action Buttons", () => {
    it("renders edit and delete buttons for each user", () => {
      render(<UserCards {...defaultProps} />);

      const editIcons = screen.getAllByTestId("edit-icon");
      const deleteIcons = screen.getAllByTestId("delete-icon");

      expect(editIcons).toHaveLength(3);
      expect(deleteIcons).toHaveLength(3);
    });

    it("applies correct CSS classes to edit button", () => {
      render(<UserCards {...defaultProps} />);

      const editButtons = screen.getAllByLabelText(/Edit/);
      editButtons.forEach((button) => {
        expect(button).toHaveClass("text-blue-500", "hover:text-blue-700");
      });
    });

    it("applies correct CSS classes to delete button", () => {
      render(<UserCards {...defaultProps} />);

      const deleteButtons = screen.getAllByLabelText(/Delete/);
      deleteButtons.forEach((button) => {
        expect(button).toHaveClass("text-red-400", "hover:text-red-600");
      });
    });

    it("has correct aria-labels for accessibility", () => {
      render(<UserCards {...defaultProps} />);

      expect(screen.getByLabelText("Edit John Doe")).toBeInTheDocument();
      expect(screen.getByLabelText("Delete John Doe")).toBeInTheDocument();
      expect(screen.getByLabelText("Edit Alex Johnson")).toBeInTheDocument();
      expect(screen.getByLabelText("Delete Alex Johnson")).toBeInTheDocument();
    });

    it('uses "user" as fallback in aria-label when FullName is null', () => {
      const usersWithNullName = [{ ...mockUsers[0], FullName: null }];
      const props = { ...defaultProps, users: usersWithNullName };

      render(<UserCards {...props} />);

      expect(screen.getByLabelText("Edit user")).toBeInTheDocument();
      expect(screen.getByLabelText("Delete user")).toBeInTheDocument();
    });
  });

  describe("Click Interactions", () => {
    it("calls handleEditUser when article is clicked", () => {
      render(<UserCards {...defaultProps} />);

      const firstArticle = screen.getAllByRole("article")[0];
      fireEvent.click(firstArticle);

      expect(defaultProps.handleEditUser).toHaveBeenCalledWith(mockUsers[0]);
      expect(defaultProps.handleEditUser).toHaveBeenCalledTimes(1);
    });

    it("calls handleEditUser when edit button is clicked", () => {
      render(<UserCards {...defaultProps} />);

      const editButtons = screen.getAllByLabelText(/Edit/);
      fireEvent.click(editButtons[0]);

      expect(defaultProps.handleEditUser).toHaveBeenCalledWith(mockUsers[0]);
      expect(defaultProps.handleEditUser).toHaveBeenCalledTimes(1);
    });

    it("calls handleDeleteUser when delete button is clicked", () => {
      render(<UserCards {...defaultProps} />);

      const deleteButtons = screen.getAllByLabelText(/Delete/);
      fireEvent.click(deleteButtons[1]);

      expect(defaultProps.handleDeleteUser).toHaveBeenCalledWith(mockUsers[1]);
      expect(defaultProps.handleDeleteUser).toHaveBeenCalledTimes(1);
    });

    it("prevents event propagation when edit button is clicked", () => {
      render(<UserCards {...defaultProps} />);

      const editButtons = screen.getAllByLabelText(/Edit/);
      fireEvent.click(editButtons[0]);

      // handleEditUser should only be called once (from the button click, not from article click)
      expect(defaultProps.handleEditUser).toHaveBeenCalledTimes(1);
    });

    it("prevents event propagation when delete button is clicked", () => {
      render(<UserCards {...defaultProps} />);

      const deleteButtons = screen.getAllByLabelText(/Delete/);
      fireEvent.click(deleteButtons[0]);

      // handleDeleteUser should be called once, handleEditUser should not be called
      expect(defaultProps.handleDeleteUser).toHaveBeenCalledTimes(1);
      expect(defaultProps.handleEditUser).not.toHaveBeenCalled();
    });
  });

  describe("Icon Props", () => {
    it("passes correct size prop to edit icons", () => {
      render(<UserCards {...defaultProps} />);

      const editIcons = screen.getAllByTestId("edit-icon");
      editIcons.forEach((icon) => {
        expect(icon).toHaveAttribute("data-size", "16");
      });
    });

    it("passes correct size prop to delete icons", () => {
      render(<UserCards {...defaultProps} />);

      const deleteIcons = screen.getAllByTestId("delete-icon");
      deleteIcons.forEach((icon) => {
        expect(icon).toHaveAttribute("data-size", "16");
      });
    });
  });

  describe("Edge Cases", () => {
    it("handles users with missing properties gracefully", () => {
      const incompleteUser = [
        {
          UserId: 999,
          FullName: null,
          Email: null,
          DateOfBirth: null,
          Sex: null,
          PhoneNumber: null,
          avatar_url: null,
        },
      ];
      const props = { ...defaultProps, users: incompleteUser };

      expect(() => render(<UserCards {...props} />)).not.toThrow();

      const article = screen.getByRole("article");
      expect(article).toBeInTheDocument();
    });

    it("handles formatDate returning null", () => {
      const propsWithNullFormat = {
        ...defaultProps,
        formatDate: jest.fn(() => null),
      };

      expect(() =>
        render(<UserCards {...propsWithNullFormat} />)
      ).not.toThrow();
    });

    it("handles undefined users array", () => {
      const props = { ...defaultProps, users: undefined };

      expect(() => render(<UserCards {...props} />)).toThrow();
    });
  });

  describe("Key Prop", () => {
    it("uses UserId as key for each article", () => {
      const { container } = render(<UserCards {...defaultProps} />);

      const articles = container.querySelectorAll("article");
      // We can't directly test the key prop, but we can ensure each article renders uniquely
      expect(articles).toHaveLength(3);

      // Verify that each user's unique data is rendered
      expect(screen.getByText("John Doe")).toBeInTheDocument();
      expect(screen.getByText("Alex Johnson")).toBeInTheDocument();
    });
  });
});
