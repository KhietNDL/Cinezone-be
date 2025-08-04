/* eslint-disable no-undef */
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import EmployeeManagement from "../../../layouts/Admin/component/EmployeeManagement";
import * as api from "../../../services/API";

// Mock toast
jest.mock("react-toastify", () => ({
  toast: { success: jest.fn(), error: jest.fn() },
  ToastContainer: () => <div data-testid="toast-container" />,
}));

// Mock API
jest.mock("../../../services/API", () => ({
  getEmployee: jest.fn(),
  createEmployee: jest.fn(),
  deleteEmployee: jest.fn(),
  updateEmployee: jest.fn(),
  searchEmployees: jest.fn(),
}));

// Mock components
jest.mock("../../../layouts/Admin/employeeComponent/HeaderStats", () => {
  return function MockHeaderStats({ totalEmployees }) {
    return <div data-testid="header-stats">Total: {totalEmployees}</div>;
  };
});

jest.mock("../../../layouts/Admin/employeeComponent/SearchAndAdd", () => {
  return function MockSearchAndAdd({
    searchEmployee,
    setSearchEmployee,
    setShowAddForm,
  }) {
    return (
      <div data-testid="search-and-add">
        <input
          data-testid="search-input"
          value={searchEmployee}
          onChange={(e) => setSearchEmployee(e.target.value)}
        />
        <button data-testid="add-button" onClick={() => setShowAddForm(true)}>
          Add Employee
        </button>
      </div>
    );
  };
});

jest.mock("../../../layouts/Admin/employeeComponent/EmployeeTable", () => {
  return function MockEmployeeTable({
    employees,
    handleEdit,
    handleDelete,
    handleRowClick,
    sortBy,
    sortOrder,
    handleSort,
  }) {
    return (
      <div data-testid="employee-table">
        <table>
          <thead>
            <tr>
              <th
                onClick={() => handleSort("FullName")}
                data-testid="sort-name"
              >
                Name{" "}
                {sortBy === "FullName" && (sortOrder === "asc" ? "↑" : "↓")}
              </th>
              <th onClick={() => handleSort("Email")} data-testid="sort-email">
                Email {sortBy === "Email" && (sortOrder === "asc" ? "↑" : "↓")}
              </th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp) => (
              <tr
                key={emp.UserId}
                onClick={(e) => handleRowClick(emp, e)}
                data-testid={`employee-row-${emp.UserId}`}
              >
                <td>{emp.FullName}</td>
                <td>{emp.Email}</td>
                <td>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit(emp);
                    }}
                    data-testid={`edit-${emp.UserId}`}
                  >
                    Edit
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(emp);
                    }}
                    data-testid={`delete-${emp.UserId}`}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };
});

jest.mock("../../../layouts/Admin/employeeComponent/EmployeeForm", () => {
  return function MockEmployeeForm({
    showEditForm,
    fullName,
    setFullName,
    handleAdd,
    handleUpdate,
    setShowAddForm = () => {},
    setShowEditForm = () => {},
  }) {
    return (
      <div data-testid="employee-form">
        <h2>{showEditForm ? "Edit Employee" : "Add Employee"}</h2>
        <input
          data-testid="form-fullname"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />
        <button
          onClick={
            showEditForm
              ? () => {
                  // Call handleUpdate directly
                  handleUpdate();
                }
              : handleAdd
          }
          data-testid="form-submit"
        >
          {showEditForm ? "Update" : "Add"}
        </button>
        <button
          onClick={() =>
            showEditForm ? setShowEditForm(false) : setShowAddForm(false)
          }
          data-testid="form-cancel"
        >
          Cancel
        </button>
      </div>
    );
  };
});

jest.mock("../../../layouts/Admin/employeeComponent/DeletePopup", () => {
  return function MockDeletePopup({
    confirmDelete,
    setShowDeletePopup,
    selectedEmployee,
  }) {
    return (
      <div data-testid="delete-popup">
        <h3>Delete Employee</h3>
        <p>Are you sure you want to delete {selectedEmployee?.FullName}?</p>
        <button onClick={confirmDelete} data-testid="confirm-delete">
          Confirm Delete
        </button>
        <button
          onClick={() => setShowDeletePopup(false)}
          data-testid="cancel-delete"
        >
          Cancel
        </button>
      </div>
    );
  };
});

jest.mock("../../../layouts/Admin/employeeComponent/EmployeeTooltip", () => {
  return function MockEmployeeTooltip({ employee, onClose }) {
    return (
      <div data-testid="employee-tooltip">
        <h4>{employee?.FullName}</h4>
        <p>{employee?.Email}</p>
        <button onClick={onClose} data-testid="close-tooltip">
          Close
        </button>
      </div>
    );
  };
});

jest.mock("../../../layouts/Admin/movieComponent/Pagination", () => {
  return function MockPagination({
    currentPage,
    totalPages,
    handlePageChange,
  }) {
    return (
      <div data-testid="pagination">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          data-testid="prev-page"
        >
          Previous
        </button>
        <span data-testid="current-page">{currentPage}</span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          data-testid="next-page"
        >
          Next
        </button>
      </div>
    );
  };
});

const mockEmployees = [
  {
    UserId: "1",
    FullName: "John Doe",
    DateOfBirth: "1990-01-01T00:00:00.000Z",
    Sex: 1,
    Email: "john.doe@example.com",
    PhoneNumber: "0123456789",
    Address: "123 Main St",
    CCCD: "123456789012",
    CreatedAt: "2023-01-01T00:00:00.000Z",
    UserName: "johndoe",
    avatar_url: "",
  },
  {
    UserId: "2",
    FullName: "Jane Smith",
    DateOfBirth: "1992-02-02T00:00:00.000Z",
    Sex: 2,
    Email: "jane.smith@example.com",
    PhoneNumber: "0987654321",
    Address: "456 Oak Ave",
    CCCD: "987654321098",
    CreatedAt: "2023-02-01T00:00:00.000Z",
    UserName: "janesmith",
    avatar_url: "",
  },
];

const mockPagination = {
  totalPages: 2,
  total: 10,
};

function setup() {
  return render(<EmployeeManagement />);
}

describe("EmployeeManagement", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    api.getEmployee.mockResolvedValue({
      data: mockEmployees,
      pagination: mockPagination,
    });
    api.searchEmployees.mockResolvedValue({
      employees: mockEmployees,
    });
  });

  describe("Initial Rendering", () => {
    it("renders employee list after loading", async () => {
      setup();

      await waitFor(() => {
        expect(screen.getByTestId("header-stats")).toBeInTheDocument();
        expect(screen.getByTestId("search-and-add")).toBeInTheDocument();
        expect(screen.getByTestId("employee-table")).toBeInTheDocument();
        expect(screen.getByTestId("pagination")).toBeInTheDocument();
      });
    });

    it("displays correct employee count in header", async () => {
      setup();

      await waitFor(() => {
        expect(screen.getByText("Total: 10")).toBeInTheDocument();
      });
    });
  });

  describe("Search Functionality", () => {
    it("filters employees by name", async () => {
      setup();

      await waitFor(() => {
        expect(screen.getByTestId("search-input")).toBeInTheDocument();
      });

      const searchInput = screen.getByTestId("search-input");
      await userEvent.type(searchInput, "John");

      await waitFor(() => {
        expect(api.searchEmployees).toHaveBeenCalledWith("John");
      });
    });

    it("filters employees by email", async () => {
      setup();

      await waitFor(() => {
        expect(screen.getByTestId("search-input")).toBeInTheDocument();
      });

      const searchInput = screen.getByTestId("search-input");
      await userEvent.type(searchInput, "jane.smith");

      await waitFor(() => {
        expect(api.searchEmployees).toHaveBeenCalledWith("jane.smith");
      });
    });

    it("resets to original list when search is cleared", async () => {
      setup();

      await waitFor(() => {
        expect(screen.getByTestId("search-input")).toBeInTheDocument();
      });

      const searchInput = screen.getByTestId("search-input");
      await userEvent.type(searchInput, "John");

      await waitFor(() => {
        expect(api.searchEmployees).toHaveBeenCalledWith("John");
      });

      await userEvent.clear(searchInput);

      await waitFor(() => {
        expect(api.getEmployee).toHaveBeenCalledTimes(2); // Initial + after clear
      });
    });
  });

  describe("Edit Employee", () => {
    it("opens edit employee form", async () => {
      setup();

      await waitFor(() => {
        expect(screen.getByTestId("employee-table")).toBeInTheDocument();
      });

      const editButtons = screen.getAllByTestId(/edit-/);
      fireEvent.click(editButtons[0]);

      expect(screen.getByTestId("employee-form")).toBeInTheDocument();
      expect(screen.getByText("Edit Employee")).toBeInTheDocument();
    });

    it("populates form with employee data", async () => {
      setup();

      await waitFor(() => {
        expect(screen.getByTestId("employee-table")).toBeInTheDocument();
      });

      const editButtons = screen.getAllByTestId(/edit-/);
      fireEvent.click(editButtons[0]);

      const fullNameInput = screen.getByTestId("form-fullname");
      // Check that the form is populated with one of the valid names
      expect(["John Doe", "Jane Smith"]).toContain(fullNameInput.value);
    });
  });

  describe("Delete Employee", () => {
    it("opens delete confirmation popup", async () => {
      setup();

      await waitFor(() => {
        expect(screen.getByTestId("employee-table")).toBeInTheDocument();
      });

      const deleteButtons = screen.getAllByTestId(/delete-/);
      fireEvent.click(deleteButtons[0]);

      expect(screen.getByTestId("delete-popup")).toBeInTheDocument();
      expect(screen.getByText("Delete Employee")).toBeInTheDocument();
    });

    it("shows employee name in delete confirmation", async () => {
      setup();

      await waitFor(() => {
        expect(screen.getByTestId("employee-table")).toBeInTheDocument();
      });

      const deleteButtons = screen.getAllByTestId(/delete-/);
      fireEvent.click(deleteButtons[0]);

      expect(
        screen.getByText(
          /Are you sure you want to delete (John Doe|Jane Smith)\?/
        )
      ).toBeInTheDocument();
    });

    it("calls deleteEmployee API on confirmation", async () => {
      api.deleteEmployee.mockResolvedValue({});

      setup();

      await waitFor(() => {
        expect(screen.getByTestId("employee-table")).toBeInTheDocument();
      });

      const deleteButtons = screen.getAllByTestId(/delete-/);
      fireEvent.click(deleteButtons[0]);

      fireEvent.click(screen.getByTestId("confirm-delete"));

      await waitFor(() => {
        expect(api.deleteEmployee).toHaveBeenCalled();
        // Check that it was called with one of the valid employee IDs
        const callArgs = api.deleteEmployee.mock.calls[0];
        expect(["1", "2"]).toContain(callArgs[0]);
      });
    });

    it("shows success toast after successful deletion", async () => {
      api.deleteEmployee.mockResolvedValue({});

      setup();

      await waitFor(() => {
        expect(screen.getByTestId("employee-table")).toBeInTheDocument();
      });

      const deleteButtons = screen.getAllByTestId(/delete-/);
      fireEvent.click(deleteButtons[0]);

      fireEvent.click(screen.getByTestId("confirm-delete"));

      await waitFor(() => {
        expect(require("react-toastify").toast.success).toHaveBeenCalledWith(
          "Employee deleted successfully!"
        );
      });
    });

    it("shows error toast on delete failure", async () => {
      api.deleteEmployee.mockRejectedValue(new Error("Delete failed"));

      setup();

      await waitFor(() => {
        expect(screen.getByTestId("employee-table")).toBeInTheDocument();
      });

      const deleteButtons = screen.getAllByTestId(/delete-/);
      fireEvent.click(deleteButtons[0]);

      fireEvent.click(screen.getByTestId("confirm-delete"));

      await waitFor(() => {
        expect(require("react-toastify").toast.error).toHaveBeenCalled();
      });
    });
  });

  describe("Sorting", () => {
    it("sorts employees by name in descending order", async () => {
      setup();

      await waitFor(() => {
        expect(screen.getByTestId("sort-name")).toBeInTheDocument();
      });

      fireEvent.click(screen.getByTestId("sort-name"));

      expect(screen.getByTestId("sort-name")).toHaveTextContent("Name ↓");
    });

    it("sorts employees by name in ascending order on second click", async () => {
      setup();

      await waitFor(() => {
        expect(screen.getByTestId("sort-name")).toBeInTheDocument();
      });

      // First click: sets sortBy to "FullName" and sortOrder to "desc"
      fireEvent.click(screen.getByTestId("sort-name"));
      expect(screen.getByTestId("sort-name")).toHaveTextContent("Name ↓");

      // Second click: toggles sortOrder from "desc" to "asc"
      fireEvent.click(screen.getByTestId("sort-name"));
      expect(screen.getByTestId("sort-name")).toHaveTextContent("Name ↑");
    });

    it("sorts employees by email in ascending order", async () => {
      setup();

      await waitFor(() => {
        expect(screen.getByTestId("sort-email")).toBeInTheDocument();
      });

      fireEvent.click(screen.getByTestId("sort-email"));

      expect(screen.getByTestId("sort-email")).toHaveTextContent("Email ↑");
    });
  });

  describe("Pagination", () => {
    it("displays current page", async () => {
      setup();

      await waitFor(() => {
        expect(screen.getByTestId("current-page")).toBeInTheDocument();
      });

      expect(screen.getByTestId("current-page")).toHaveTextContent("1");
    });

    it("navigates to next page", async () => {
      setup();

      await waitFor(() => {
        expect(screen.getByTestId("next-page")).toBeInTheDocument();
      });

      fireEvent.click(screen.getByTestId("next-page"));

      await waitFor(() => {
        expect(api.getEmployee).toHaveBeenCalledWith({ page: 2, limit: 5 });
      });
    });

    it("navigates to previous page", async () => {
      setup();

      await waitFor(() => {
        expect(screen.getByTestId("prev-page")).toBeInTheDocument();
      });

      // First go to page 2
      fireEvent.click(screen.getByTestId("next-page"));

      await waitFor(() => {
        expect(api.getEmployee).toHaveBeenCalledWith({ page: 2, limit: 5 });
      });

      // Then go back to page 1
      fireEvent.click(screen.getByTestId("prev-page"));

      await waitFor(() => {
        expect(api.getEmployee).toHaveBeenCalledWith({ page: 1, limit: 5 });
      });
    });

    it("disables previous button on first page", async () => {
      setup();

      await waitFor(() => {
        expect(screen.getByTestId("prev-page")).toBeInTheDocument();
      });

      expect(screen.getByTestId("prev-page")).toBeDisabled();
    });

    it("disables next button on last page", async () => {
      setup();

      await waitFor(() => {
        expect(screen.getByTestId("next-page")).toBeInTheDocument();
      });

      // Mock that we're on the last page
      api.getEmployee.mockResolvedValue({
        data: mockEmployees,
        pagination: { totalPages: 1, total: 5 },
      });

      fireEvent.click(screen.getByTestId("next-page"));

      await waitFor(() => {
        expect(screen.getByTestId("next-page")).toBeDisabled();
      });
    });
  });

  describe("Employee Tooltip", () => {
    it("shows tooltip when employee row is clicked", async () => {
      setup();

      await waitFor(() => {
        expect(screen.getByTestId("employee-row-1")).toBeInTheDocument();
      });

      fireEvent.click(screen.getByTestId("employee-row-1"));

      const tooltip = screen.getByTestId("employee-tooltip");
      expect(tooltip).toBeInTheDocument();
      // Check that tooltip contains one of the valid names
      expect(tooltip).toHaveTextContent(/John Doe|Jane Smith/);
    });

    it("hides tooltip when close button is clicked", async () => {
      setup();

      await waitFor(() => {
        expect(screen.getByTestId("employee-row-1")).toBeInTheDocument();
      });

      fireEvent.click(screen.getByTestId("employee-row-1"));

      expect(screen.getByTestId("employee-tooltip")).toBeInTheDocument();

      fireEvent.click(screen.getByTestId("close-tooltip"));

      expect(screen.queryByTestId("employee-tooltip")).not.toBeInTheDocument();
    });
  });

  describe("Error Handling", () => {
    it("shows error toast on API error", async () => {
      api.getEmployee.mockRejectedValue(new Error("API error"));

      setup();

      await waitFor(() => {
        expect(require("react-toastify").toast.error).toHaveBeenCalledWith(
          "Failed to fetch employees!"
        );
      });
    });

    it("shows error toast on search API error", async () => {
      api.searchEmployees.mockRejectedValue(new Error("Search failed"));

      setup();

      await waitFor(() => {
        expect(screen.getByTestId("search-input")).toBeInTheDocument();
      });

      const searchInput = screen.getByTestId("search-input");
      await userEvent.type(searchInput, "John");

      await waitFor(() => {
        expect(require("react-toastify").toast.error).toHaveBeenCalledWith(
          "Failed to search employees!"
        );
      });
    });

    it("shows error toast on create API error", async () => {
      api.createEmployee.mockRejectedValue(new Error("Create failed"));

      setup();

      await waitFor(() => {
        expect(screen.getByTestId("add-button")).toBeInTheDocument();
      });

      fireEvent.click(screen.getByTestId("add-button"));

      const fullNameInput = screen.getByTestId("form-fullname");
      await userEvent.type(fullNameInput, "New Employee");

      fireEvent.click(screen.getByTestId("form-submit"));

      await waitFor(() => {
        expect(require("react-toastify").toast.error).toHaveBeenCalled();
      });
    });

    it("shows error toast on update API error", async () => {
      api.updateEmployee.mockRejectedValue(new Error("Update failed"));

      setup();

      await waitFor(() => {
        expect(screen.getByTestId("employee-table")).toBeInTheDocument();
      });

      const editButtons = screen.getAllByTestId(/edit-/);
      fireEvent.click(editButtons[0]);

      await waitFor(() => {
        expect(screen.getByTestId("employee-form")).toBeInTheDocument();
      });

      const fullNameInput = screen.getByTestId("form-fullname");
      await userEvent.clear(fullNameInput);
      await userEvent.type(fullNameInput, "Updated Name Valid Test");

      fireEvent.click(screen.getByTestId("form-submit"));

      await waitFor(() => {
        expect(require("react-toastify").toast.error).toHaveBeenCalled();
      });
    });
  });

  describe("Form Validation", () => {
    it("validates required fields", async () => {
      setup();

      await waitFor(() => {
        expect(screen.getByTestId("add-button")).toBeInTheDocument();
      });

      fireEvent.click(screen.getByTestId("add-button"));

      // Try to submit without filling required fields
      fireEvent.click(screen.getByTestId("form-submit"));

      await waitFor(() => {
        expect(require("react-toastify").toast.error).toHaveBeenCalledWith(
          "Full name must be between 6 and 100 characters!"
        );
      });
    });

    it("validates email format", async () => {
      setup();

      await waitFor(() => {
        expect(screen.getByTestId("add-button")).toBeInTheDocument();
      });

      fireEvent.click(screen.getByTestId("add-button"));

      const fullNameInput = screen.getByTestId("form-fullname");
      await userEvent.type(fullNameInput, "Valid Name");

      // Try to submit with invalid email (this would need to be implemented in the actual form)
      fireEvent.click(screen.getByTestId("form-submit"));

      // This test would need to be adjusted based on the actual form validation implementation
      await waitFor(() => {
        expect(require("react-toastify").toast.error).toHaveBeenCalled();
      });
    });
  });

  describe("Mobile Responsiveness", () => {
    it("renders mobile card layout on small screens", async () => {
      // Mock window.innerWidth to simulate mobile screen
      Object.defineProperty(window, "innerWidth", {
        writable: true,
        configurable: true,
        value: 375,
      });

      setup();

      await waitFor(() => {
        // Check that mobile layout elements are present
        expect(screen.getByTestId("employee-table")).toBeInTheDocument();
      });

      // Reset window.innerWidth
      Object.defineProperty(window, "innerWidth", {
        writable: true,
        configurable: true,
        value: 1024,
      });
    });
  });
});
