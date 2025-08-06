/* eslint-disable no-undef */
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import EmployeeForm from "../../../layouts/Admin/employeeComponent/EmployeeForm";

describe("EmployeeForm Component", () => {
  const mockProps = {
    showEditForm: false,
    fullName: "",
    dateOfBirth: "",
    password: "",
    sex: 1,
    cccd: "",
    email: "",
    phoneNumber: "",
    address: "",
    avatarPreview: null,
    avatarUploadRef: { current: null },
    setFullName: jest.fn(),
    setDateOfBirth: jest.fn(),
    setPassword: jest.fn(),
    setSex: jest.fn(),
    setCccd: jest.fn(),
    setEmail: jest.fn(),
    setPhoneNumber: jest.fn(),
    setAddress: jest.fn(),
    handleAvatarChange: jest.fn(),
    handleAdd: jest.fn(),
    handleUpdate: jest.fn(),
    setShowAddForm: jest.fn(),
    setShowEditForm: jest.fn(),
    setSelectedEmployee: jest.fn(),
    resetForm: jest.fn(),
    setAvatarFile: jest.fn(),
    setAvatarPreview: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Rendering Tests", () => {
    it('displays "Add New Employee" title when showEditForm is false', () => {
      render(<EmployeeForm {...mockProps} />);

      expect(screen.getByText("Add New Employee")).toBeInTheDocument();
      expect(
        screen.getByText("Fill in the details below to add a new employee")
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /add employee/i })
      ).toBeInTheDocument();
    });

    it('displays "Edit Employee" title when showEditForm is true', () => {
      const editProps = { ...mockProps, showEditForm: true };
      render(<EmployeeForm {...editProps} />);

      expect(screen.getByText("Edit Employee")).toBeInTheDocument();
      expect(
        screen.getByText("Update the details below to edit the employee record")
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /save changes/i })
      ).toBeInTheDocument();
    });

    it("renders all form sections", () => {
      render(<EmployeeForm {...mockProps} />);

      expect(screen.getByText("Personal Information")).toBeInTheDocument();
      expect(screen.getByText("Contact Information")).toBeInTheDocument();
      expect(screen.getByText("Security Information")).toBeInTheDocument();
    });
  });

  describe("Form Input Tests", () => {
    it("calls setFullName when full name input changes", () => {
      render(<EmployeeForm {...mockProps} />);

      const fullNameInput = screen.getByPlaceholderText(/enter full name/i);
      fireEvent.change(fullNameInput, { target: { value: "John Doe" } });

      expect(mockProps.setFullName).toHaveBeenCalledWith("John Doe");
    });

    it("calls setCccd when CCCD input changes", () => {
      render(<EmployeeForm {...mockProps} />);

      const cccdInput = screen.getByPlaceholderText(/enter id card number/i);
      fireEvent.change(cccdInput, { target: { value: "123456789" } });

      expect(mockProps.setCccd).toHaveBeenCalledWith("123456789");
    });

    it("calls setEmail when email input changes", () => {
      render(<EmployeeForm {...mockProps} />);

      const emailInput = screen.getByPlaceholderText(/enter email address/i);
      fireEvent.change(emailInput, { target: { value: "john@example.com" } });

      expect(mockProps.setEmail).toHaveBeenCalledWith("john@example.com");
    });

    it("calls setPhoneNumber when phone input changes", () => {
      render(<EmployeeForm {...mockProps} />);

      const phoneInput = screen.getByPlaceholderText(/enter phone number/i);
      fireEvent.change(phoneInput, { target: { value: "0123456789" } });

      expect(mockProps.setPhoneNumber).toHaveBeenCalledWith("0123456789");
    });

    it("calls setAddress when address textarea changes", () => {
      render(<EmployeeForm {...mockProps} />);

      const addressTextarea =
        screen.getByPlaceholderText(/enter full address/i);
      fireEvent.change(addressTextarea, { target: { value: "123 Main St" } });

      expect(mockProps.setAddress).toHaveBeenCalledWith("123 Main St");
    });

    it("calls setPassword when password input changes", () => {
      render(<EmployeeForm {...mockProps} />);

      const passwordInput = screen.getByPlaceholderText(/enter password/i);
      fireEvent.change(passwordInput, { target: { value: "newpassword" } });

      expect(mockProps.setPassword).toHaveBeenCalledWith("newpassword");
    });
  });

  describe("Form Values Display Tests", () => {
    it("displays form values correctly", () => {
      const propsWithValues = {
        ...mockProps,
        fullName: "John Doe",
        dateOfBirth: "1990-01-01",
        password: "password123",
        sex: 2,
        cccd: "123456789",
        email: "john@example.com",
        phoneNumber: "0123456789",
        address: "123 Main St",
      };

      render(<EmployeeForm {...propsWithValues} />);

      expect(screen.getByDisplayValue("John Doe")).toBeInTheDocument();
      expect(screen.getByDisplayValue("1990-01-01")).toBeInTheDocument();
      expect(screen.getByDisplayValue("password123")).toBeInTheDocument();
      expect(screen.getByDisplayValue("123456789")).toBeInTheDocument();
      expect(screen.getByDisplayValue("john@example.com")).toBeInTheDocument();
      expect(screen.getByDisplayValue("0123456789")).toBeInTheDocument();
      expect(screen.getByDisplayValue("123 Main St")).toBeInTheDocument();
    });

    it("shows correct gender option selected", () => {
      const propsWithFemale = { ...mockProps, sex: 2 };
      render(<EmployeeForm {...propsWithFemale} />);

      const genderSelect = screen.getByRole("combobox");
      expect(genderSelect.value).toBe("2");
    });
  });

  describe("Avatar Upload Tests", () => {
    it("displays avatar upload area when no preview", () => {
      render(<EmployeeForm {...mockProps} />);

      expect(screen.getByText("Click to upload avatar")).toBeInTheDocument();
      expect(screen.getByText("PNG, JPG up to 10MB")).toBeInTheDocument();
    });

    it("displays avatar preview when avatarPreview is provided", () => {
      const propsWithAvatar = {
        ...mockProps,
        avatarPreview: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ...",
      };

      render(<EmployeeForm {...propsWithAvatar} />);

      const avatarImage = screen.getByAltText("Avatar Preview");
      expect(avatarImage).toBeInTheDocument();
      expect(avatarImage.src).toBe(
        "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ..."
      );
    });

    it("calls handleAvatarChange when file input changes", () => {
      render(<EmployeeForm {...mockProps} />);

      const fileInput = screen.getByLabelText(/click to upload avatar/i);
      const file = new File(["test"], "test.jpg", { type: "image/jpeg" });

      fireEvent.change(fileInput, { target: { files: [file] } });

      expect(mockProps.handleAvatarChange).toHaveBeenCalled();
    });

    it("removes avatar preview when remove button is clicked", () => {
      const mockRef = { current: { value: "" } };
      const propsWithAvatar = {
        ...mockProps,
        avatarPreview: "data:image/jpeg;base64,test",
        avatarUploadRef: mockRef,
      };

      render(<EmployeeForm {...propsWithAvatar} />);

      const removeButton = screen.getByRole("button", { name: "✕" });
      fireEvent.click(removeButton);

      expect(mockProps.setAvatarFile).toHaveBeenCalledWith(null);
      expect(mockProps.setAvatarPreview).toHaveBeenCalledWith(null);
    });
  });

  describe("Button Actions Tests", () => {
    it("calls handleAdd when Add Employee button is clicked", () => {
      render(<EmployeeForm {...mockProps} />);

      const addButton = screen.getByRole("button", { name: /add employee/i });
      fireEvent.click(addButton);

      expect(mockProps.handleAdd).toHaveBeenCalled();
    });

    it("calls handleUpdate when Save Changes button is clicked in edit mode", () => {
      const editProps = { ...mockProps, showEditForm: true };
      render(<EmployeeForm {...editProps} />);

      const saveButton = screen.getByRole("button", { name: /save changes/i });
      fireEvent.click(saveButton);

      expect(mockProps.handleUpdate).toHaveBeenCalled();
    });

    it("calls close functions when Cancel button is clicked", () => {
      render(<EmployeeForm {...mockProps} />);

      const cancelButton = screen.getByRole("button", { name: /cancel/i });
      fireEvent.click(cancelButton);

      expect(mockProps.setShowAddForm).toHaveBeenCalledWith(false);
      expect(mockProps.setShowEditForm).toHaveBeenCalledWith(false);
      expect(mockProps.setSelectedEmployee).toHaveBeenCalledWith(null);
      expect(mockProps.resetForm).toHaveBeenCalled();
    });

    it("calls close functions when X button is clicked", () => {
      render(<EmployeeForm {...mockProps} />);

      const closeButton = screen.getByRole("button", { name: "" }); // X button has no text
      fireEvent.click(closeButton);

      expect(mockProps.setShowAddForm).toHaveBeenCalledWith(false);
      expect(mockProps.setShowEditForm).toHaveBeenCalledWith(false);
      expect(mockProps.setSelectedEmployee).toHaveBeenCalledWith(null);
      expect(mockProps.resetForm).toHaveBeenCalled();
    });
  });

  describe("Password Field Tests", () => {
    it("shows required asterisk for password in add mode", () => {
      render(<EmployeeForm {...mockProps} />);

      const passwordLabel = screen.getByText(/password/i).closest("label");
      expect(passwordLabel).toHaveTextContent("*");
    });
  });

  describe("Form Validation Display Tests", () => {
    it("displays required field indicators", () => {
      render(<EmployeeForm {...mockProps} />);

      // Check that required fields have asterisks
      const requiredFields = screen.getAllByText("*");
      expect(requiredFields.length).toBeGreaterThan(0);
    });
  });

  describe("Gender Options Tests", () => {
    it("renders all gender options", () => {
      render(<EmployeeForm {...mockProps} />);

      expect(screen.getByText("Male")).toBeInTheDocument();
      expect(screen.getByText("Female")).toBeInTheDocument();
      expect(screen.getByText("Other")).toBeInTheDocument();
    });
  });

  describe("Accessibility Tests", () => {
    it("has proper form labels", () => {
      render(<EmployeeForm {...mockProps} />);

      // Check labels exist by text content
      expect(screen.getByText(/full name/i)).toBeInTheDocument();
      expect(screen.getByText(/identity card/i)).toBeInTheDocument();
      expect(screen.getByText(/date of birth/i)).toBeInTheDocument();
      expect(screen.getByText(/gender/i)).toBeInTheDocument();
      expect(screen.getByText(/email/i)).toBeInTheDocument();
      expect(screen.getByText(/phone number/i)).toBeInTheDocument();
      expect(screen.getByText(/address/i)).toBeInTheDocument();
      expect(screen.getByText(/password/i)).toBeInTheDocument();
    });
  });

  describe("Modal Styling Tests", () => {
    it("applies correct CSS classes for modal", () => {
      const { container } = render(<EmployeeForm {...mockProps} />);

      const backdrop = container.firstChild;
      expect(backdrop).toHaveClass(
        "fixed",
        "inset-0",
        "bg-black/40",
        "backdrop-blur-sm",
        "z-50"
      );

      const modal = backdrop.firstChild;
      expect(modal).toHaveClass(
        "bg-white",
        "rounded-xl",
        "shadow-2xl",
        "max-w-2xl"
      );
    });
  });
});
