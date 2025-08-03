import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  createEmployee,
  deleteEmployee,
  getEmployee,
  searchEmployeesByInfo,
  updateEmployee,
  unbanEmployee,
} from "../../../services/API";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import HeaderStats from "../employeeComponent/HeaderStats";
import SearchAndAdd from "../employeeComponent/SearchAndAdd";
import EmployeeTable from "../employeeComponent/EmployeeTable";
import EmployeeForm from "../employeeComponent/EmployeeForm";
import DeletePopup from "../employeeComponent/DeletePopup";
import EmployeeTooltip from "../employeeComponent/EmployeeTooltip";
import { IoEyeOutline } from "react-icons/io5";
import { FaRegEdit, FaUser, FaUnlock } from "react-icons/fa";
import { RiDeleteBin5Line } from "react-icons/ri";
import Pagination from "../movieComponent/Pagination";

const EmployeeManagement = () => {
  const [employees, setEmployees] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedEmployeeForTooltip, setSelectedEmployeeForTooltip] =
    useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const itemsPerPage = 5;
  const [searchEmployee, setSearchEmployee] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fullName, setFullName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [password, setPassword] = useState("");
  const [sex, setSex] = useState(1);
  const [cccd, setCccd] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [avatarPreview, setAvatarPreview] = useState(null);
  const avatarUploadRef = useRef(null);
  const initialLoadRef = useRef(false);
  const [sortBy, setSortBy] = useState("FullName");
  const [sortOrder, setSortOrder] = useState("asc");

  // Add filter state
  const [activeFilter, setActiveFilter] = useState(null);
  const [employeeStats, setEmployeeStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    newHires: 0,
  });
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  const handleSearchEmployees = useCallback(
    async (searchTerm) => {
      try {
        const params = {
          page: page,
          limit: itemsPerPage,
          sortBy: sortBy,
          sortOrder: sortOrder,
        };

        if (searchTerm.trim() === "") {
          const response = await getEmployee(params);

          if (response.data) {
            setEmployees(response.data);
            if (response.pagination) {
              setTotalPages(response.pagination.totalPages);
              setTotalEmployees(response.pagination.total);
            }
          } else {
            console.log("No response.data found");
          }
        } else {
          // Use new API that supports multiple search fields
          const searchInfo = {
            name: searchTerm.trim(),
            email: searchTerm.trim(),
            cccd: searchTerm.trim(),
            phone: searchTerm.trim(),
          };

          const response = await searchEmployeesByInfo(searchInfo, params);

          if (response.employees) {
            setEmployees(response.employees);
            if (response.pagination) {
              setTotalPages(response.pagination.totalPages);
              setTotalEmployees(response.pagination.total);
            } else {
              // Fallback for backward compatibility
              const total = response.employees.length;
              setTotalEmployees(total);
              setTotalPages(Math.ceil(total / itemsPerPage));
            }
          } else {
            console.log("No response.employees found in search");
            setEmployees([]);
            setTotalPages(0);
            setTotalEmployees(0);
          }
        }
      } catch (error) {
        console.error("Failed to search employees:", error);
        toast.error("Failed to search employees!");
        setEmployees([]);
        setTotalPages(0);
        setTotalEmployees(0);
      }
    },
    [page, itemsPerPage, sortBy, sortOrder] // Keep these dependencies stable
  );

  // Load initial data when component mounts
  useEffect(() => {
    if (!initialLoadRef.current && !searchEmployee.trim()) {
      initialLoadRef.current = true;
      handleSearchEmployees("");
    }
  }, [handleSearchEmployees, searchEmployee]);

  // Effect riêng cho searchEmployee để reset về trang 1
  useEffect(() => {
    if (searchEmployee !== "") {
      setPage(1); // Reset về trang 1 khi có search term mới
    }
  }, [searchEmployee]);

  // useEffect với debounce cho search và pagination - skip nếu đang initial load
  useEffect(() => {
    if (!initialLoadRef.current) return;

    const searchTimeout = setTimeout(() => {
      if (searchEmployee.trim()) {
        handleSearchEmployees(searchEmployee);
      } else {
        handleSearchEmployees("");
      }
    }, 300);

    return () => clearTimeout(searchTimeout);
  }, [searchEmployee, page, sortBy, sortOrder, handleSearchEmployees]);

  // Debug useEffect to track employees state changes
  useEffect(() => {
    console.log("Employees state updated:", {
      employeesLength: employees.length,
      employees: employees,
      page: page,
      totalPages: totalPages,
      totalEmployees: totalEmployees,
    });
  }, [employees, page, totalPages, totalEmployees]);

  // Close sort dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        showSortDropdown &&
        !event.target.closest(".sort-dropdown-container")
      ) {
        setShowSortDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showSortDropdown]);

  const validateForm = () => {
    if (!fullName || fullName.length < 6 || fullName.length > 100) {
      toast.error("Full name must be between 6 and 100 characters!");
      return false;
    }
    if (!dateOfBirth || !/^\d{4}-\d{2}-\d{2}$/.test(dateOfBirth)) {
      toast.error("Date of birth must be in YYYY-MM-DD format!");
      return false;
    }
    if (!password || password.length < 8 || password.length > 128) {
      toast.error("Password must be between 8 and 128 characters!");
      return false;
    }
    if (password) {
      if (!/[A-Z]/.test(password)) {
        toast.error("Password must contain at least one uppercase letter!");
        return false;
      }
      if (!/[a-z]/.test(password)) {
        toast.error("Password must contain at least one lowercase letter!");
        return false;
      }
      if (!/[0-9]/.test(password)) {
        toast.error("Password must contain at least one number!");
        return false;
      }
      if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        toast.error("Password must contain at least one special character!");
        return false;
      }
    }
    if (!cccd || !/^\d{12}$/.test(cccd)) {
      toast.error("Citizen ID must be 12 digits!");
      return false;
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Email must be in a valid format!");
      return false;
    }
    if (!phoneNumber || !/^\d{10}$/.test(phoneNumber)) {
      toast.error("Phone number must be 10 digits!");
      return false;
    }
    if (!address) {
      toast.error("Address is required!");
      return false;
    }
    return true;
  };

  const handleAdd = async () => {
    if (!validateForm()) return;
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("fullName", fullName);
      formData.append("dateOfBirth", dateOfBirth);
      formData.append("password", password);
      formData.append("sex", sex);
      formData.append("cccd", cccd);
      formData.append("email", email);
      formData.append("phoneNumber", phoneNumber);
      formData.append("address", address);
      const response = await createEmployee(formData);
      const newEmployee = {
        FullName: fullName,
        DateOfBirth: dateOfBirth,
        Password: password,
        Sex: sex,
        CCCD: cccd,
        Email: email,
        PhoneNumber: phoneNumber,
        Address: address,
        UserId: response.UserId || Date.now(),
        CreatedAt: response.CreatedAt || new Date().toISOString(),
        UserName: response.UserName || email.split("@")[0],
      };
      setEmployees((prev) => [...prev, newEmployee]);
      resetForm();
      setShowAddForm(false);
      toast.success("Employee added successfully!");
      handleSearchEmployees(searchEmployee); // Refresh current search results
    } catch (error) {
      console.error("Failed to add employee:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (employee) => {
    setSelectedEmployee(employee);
    setFullName(employee.FullName || "");
    setDateOfBirth(
      employee.DateOfBirth ? employee.DateOfBirth.split("T")[0] : ""
    );
    setPassword("");
    setSex(
      employee.Sex !== undefined && [1, 2, 3].includes(employee.Sex)
        ? employee.Sex
        : 1
    );
    setCccd(employee.CCCD || "");
    setEmail(employee.Email || "");
    setPhoneNumber(employee.PhoneNumber || "");
    setAddress(employee.Address || "");
    setAvatarFile(null);
    setAvatarPreview(employee.avatar_url);
    setShowEditForm(true);
  };

  const handleUpdate = async () => {
    if (!validateForm()) return;
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("fullName", fullName);
      formData.append("dateOfBirth", dateOfBirth);
      if (password) formData.append("password", password);
      formData.append("sex", sex);
      formData.append("cccd", cccd);
      formData.append("email", email);
      formData.append("phoneNumber", phoneNumber);
      formData.append("address", address);
      if (avatarFile) formData.append("avatar", avatarFile);
      await updateEmployee(selectedEmployee.UserId, formData);
      setEmployees((prev) =>
        prev.map((emp) =>
          emp.UserId === selectedEmployee.UserId
            ? {
                ...emp,
                FullName: fullName,
                DateOfBirth: dateOfBirth,
                Sex: sex,
                CCCD: cccd,
                Email: email,
                PhoneNumber: phoneNumber,
                Address: address,
                avatar_url: avatarFile ? avatarPreview : emp.avatar_url,
              }
            : emp
        )
      );
      setShowEditForm(false);
      setSelectedEmployee(null);
      resetForm();
      toast.success("Employee updated successfully!");
      handleSearchEmployees(searchEmployee); // Refresh current search results
    } catch (error) {
      console.error("Failed to update employee:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (employee) => {
    setSelectedEmployee(employee);
    setSelectedEmployeeForTooltip(null);
    setShowDeletePopup(true);
  };

  const handleUnban = async (employee) => {
    try {
      await unbanEmployee(employee.UserId);

      // Update local state immediately
      setEmployees((prev) =>
        prev.map((emp) =>
          emp.UserId === employee.UserId ? { ...emp, isDeleted: 0 } : emp
        )
      );

      toast.success("Employee unbanned successfully!");
      // Refresh current search results to get updated data
      handleSearchEmployees(searchEmployee);
    } catch (error) {
      console.error("Failed to unban employee:", error);
      toast.error(
        `Failed to unban employee: ${error.message || "Please try again."}`
      );
    }
  };

  const confirmDelete = async () => {
    try {
      await deleteEmployee(selectedEmployee.UserId);
      setEmployees((prev) =>
        prev.filter((emp) => emp.UserId !== selectedEmployee.UserId)
      );
      setShowDeletePopup(false);
      setSelectedEmployee(null);
      toast.success("Employee deleted successfully!");
      handleSearchEmployees(searchEmployee); // Refresh current search results
    } catch (error) {
      console.error("Failed to delete employee:", error);
      toast.error(
        `Failed to delete employee: ${error.message || "Please try again."}`
      );
    }
  };

  const formatDate = (dateString) =>
    dateString ? dateString.split("T")[0] : "";

  const handleRowClick = (employee, event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setTooltipPosition({ x: rect.right + 10, y: rect.top + window.scrollY });
    setSelectedEmployeeForTooltip(employee);
  };

  const resetForm = () => {
    setFullName("");
    setDateOfBirth("");
    setPassword("");
    setSex(1);
    setCccd("");
    setEmail("");
    setPhoneNumber("");
    setAddress("");
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setPage(page);
    }
  };
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    setAvatarFile(file);
    if (file) setAvatarPreview(URL.createObjectURL(file));
    else setAvatarPreview(null);
  };

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
    setPage(1); // Reset to first page when sorting changes
  };

  // Handle filter changes
  const handleFilterChange = (filterType) => {
    setActiveFilter(filterType);
    setPage(1); // Reset to first page when filter changes
  };

  // Calculate employee statistics from current employees data
  useEffect(() => {
    if (employees && employees.length > 0) {
      const today = new Date();
      const thirtyDaysAgo = new Date(
        today.getTime() - 30 * 24 * 60 * 60 * 1000
      );

      const stats = employees.reduce(
        (acc, employee) => {
          const createdDate = employee.CreatedAt
            ? new Date(employee.CreatedAt)
            : null;

          // New hires (created in last 30 days)
          if (
            createdDate &&
            createdDate >= thirtyDaysAgo &&
            (employee.isDeleted === 0 || employee.isDeleted === false)
          ) {
            acc.newHires++;
          }

          // Active employees (not deleted)
          if (employee.isDeleted === 0 || employee.isDeleted === false) {
            acc.active++;
          }

          // Inactive employees (deleted/banned)
          if (employee.isDeleted === 1 || employee.isDeleted === true) {
            acc.inactive++;
          }

          return acc;
        },
        { total: totalEmployees, active: 0, inactive: 0, newHires: 0 }
      );

      setEmployeeStats({
        total: totalEmployees,
        active: stats.active,
        inactive: stats.inactive,
        newHires: stats.newHires,
      });
    }
  }, [employees, totalEmployees]);

  // Filter employees based on active filter
  const getFilteredEmployees = () => {
    if (!activeFilter || activeFilter === "total") {
      return employees;
    }

    const today = new Date();
    const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

    switch (activeFilter) {
      case "active":
        return employees.filter(
          (employee) => employee.isDeleted === 0 || employee.isDeleted === false
        );
      case "inactive":
        return employees.filter(
          (employee) => employee.isDeleted === 1 || employee.isDeleted === true
        );
      case "newHires": {
        return employees.filter((employee) => {
          if (employee.CreatedAt) {
            const createdDate = new Date(employee.CreatedAt);
            return (
              createdDate >= thirtyDaysAgo &&
              (employee.isDeleted === 0 || employee.isDeleted === false)
            );
          }
          return false;
        });
      }
      default:
        return employees;
    }
  };

  const filteredEmployees = getFilteredEmployees();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="max-w-7xl select-none mx-auto px-3 sm:px-6 py-3 sm:py-4 bg-white shadow-md rounded-lg mb-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-3 lg:gap-4">
          {/* Left: Logo/Brand */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-purple-600 to-purple-700 rounded-lg flex items-center justify-center">
              <FaUser className="text-white text-lg sm:text-xl" />
            </div>
            <div>
              <h1 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-purple-600 to-purple-700 bg-clip-text text-transparent">
                Employee Management
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 hidden sm:block">
                Admin Portal - Manage Staff Members
              </p>
            </div>
          </div>

          {/* Right: Search & Actions */}
          <div className="flex flex-col sm:flex-row items-center gap-3 lg:gap-4 w-full md:w-auto">
            {/* Search Input */}
            <div className="relative flex items-center w-full md:w-[350px]">
              <div className="absolute left-3 z-10">
                <svg
                  className="w-4 h-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <input
                type="text"
                value={searchEmployee}
                onChange={(e) => {
                  setPage(1);
                  setSearchEmployee(e.target.value);
                }}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 hover:border-gray-300 shadow-sm"
                placeholder="Search employees by name or email..."
              />
            </div>

            {/* Add Employee Button */}
            {!showEditForm && (
              <button
                onClick={() => {
                  resetForm();
                  setShowAddForm(true);
                }}
                className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl font-medium text-sm hover:from-purple-700 hover:to-purple-800 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 w-full sm:w-auto min-w-[140px] whitespace-nowrap"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                Add Employee
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center lg:items-start max-w-7xl w-full overflow-x-hidden">
        <div className="w-[90%] md:w-[95%] lg:w-full max-w-7xl space-y-4 sm:space-y-6">
          {/* Stats Cards */}
          <HeaderStats
            totalEmployees={totalEmployees}
            activeEmployees={employeeStats.active}
            inactiveEmployees={employeeStats.inactive}
            newHires={employeeStats.newHires}
            onFilterChange={handleFilterChange}
            activeFilter={activeFilter}
          />{" "}
          {/* Employee Table */}
          <div className="bg-white p-2 sm:p-3 md:p-4 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
            {/* Table Layout for sm and above */}
            <div className="hidden sm:block">
              <EmployeeTable
                employees={filteredEmployees}
                handleEdit={handleEdit}
                handleDelete={handleDelete}
                handleUnban={handleUnban}
                handleRowClick={handleRowClick}
                formatDate={formatDate}
                sortBy={sortBy}
                sortOrder={sortOrder}
                handleSort={handleSort}
              />
            </div>

            {/* Card Layout for Mobile */}
            <div className="block sm:hidden space-y-4 sm:space-y-6">
              {filteredEmployees.map((emp) => (
                <article
                  key={emp.UserId}
                  className="bg-white p-4 sm:p-5 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 cursor-pointer hover:bg-gradient-to-r hover:from-purple-50/30 hover:to-indigo-50/30 group"
                  onClick={(e) => handleRowClick(emp, e)}
                >
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <img
                        src={emp.avatar_url || "/default-avatar.png"}
                        alt={emp.FullName}
                        className="w-16 h-16 rounded-xl object-cover shadow-md group-hover:shadow-lg transition-shadow duration-300 ring-2 ring-gray-100 group-hover:ring-purple-200"
                      />
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-gradient-to-r from-purple-600 to-purple-700 rounded-full flex items-center justify-center">
                        <svg
                          className="w-3 h-3 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-gray-900 truncate group-hover:text-purple-700 transition-colors duration-300">
                        {emp.FullName}
                      </h3>
                      <p className="text-xs text-gray-500 truncate group-hover:text-purple-600 transition-colors duration-300">
                        {emp.Email}
                      </p>
                      <div className="flex items-center mt-1">
                        <span
                          className={`inline-block text-xs font-medium px-2 py-1 rounded-full ${
                            emp.IsDeleted === 1 || emp.IsDeleted === true
                              ? "bg-red-100 text-red-700"
                              : "bg-green-100 text-green-700"
                          }`}
                        >
                          {emp.IsDeleted === 1 || emp.IsDeleted === true
                            ? "Inactive"
                            : "Active"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-3 text-xs text-gray-600">
                    <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-3 rounded-lg border border-purple-100">
                      <p className="font-medium text-purple-700">DOB</p>
                      <p className="text-purple-600">
                        {formatDate(emp.DateOfBirth)}
                      </p>
                    </div>
                    <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-3 rounded-lg border border-blue-100">
                      <p className="font-medium text-blue-700">Gender</p>
                      <p className="text-blue-600">
                        {emp.Sex === 1
                          ? "Male"
                          : emp.Sex === 2
                          ? "Female"
                          : "Other"}
                      </p>
                    </div>
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-3 rounded-lg border border-green-100">
                      <p className="font-medium text-green-700">Phone</p>
                      <p className="text-green-600">{emp.PhoneNumber}</p>
                    </div>
                    <div className="bg-gradient-to-r from-orange-50 to-amber-50 p-3 rounded-lg border border-orange-100">
                      <p className="font-medium text-orange-700">Joined</p>
                      <p className="text-orange-600">
                        {formatDate(emp.CreatedAt)}
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 mt-4 pt-3 border-t border-gray-100">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRowClick(emp, e);
                      }}
                      className="flex items-center justify-center w-8 h-8 text-blue-500 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-all duration-200 transform hover:scale-110 shadow-sm hover:shadow-md"
                      aria-label={`View ${emp.FullName}`}
                    >
                      <IoEyeOutline size={16} />
                    </button>

                    {/* Show unban button if employee is deleted/banned */}
                    {emp.IsDeleted === 1 || emp.IsDeleted === true ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleUnban(emp);
                        }}
                        className="flex items-center justify-center w-8 h-8 text-green-500 hover:text-green-700 bg-green-50 hover:bg-green-100 rounded-lg transition-all duration-200 transform hover:scale-110 shadow-sm hover:shadow-md"
                        aria-label={`Unban ${emp.FullName}`}
                      >
                        <FaUnlock size={16} />
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(emp);
                          }}
                          className="flex items-center justify-center w-8 h-8 text-blue-500 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-all duration-200 transform hover:scale-110 shadow-sm hover:shadow-md"
                          aria-label={`Edit ${emp.FullName}`}
                        >
                          <FaRegEdit size={16} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(emp);
                          }}
                          className="flex items-center justify-center w-8 h-8 text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 rounded-lg transition-all duration-200 transform hover:scale-110 shadow-sm hover:shadow-md"
                          aria-label={`Delete ${emp.FullName}`}
                        >
                          <RiDeleteBin5Line size={16} />
                        </button>
                      </>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </div>
          {/* Pagination */}
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            handlePageChange={handlePageChange}
          />
        </div>
      </div>

      {/* Loading Spinner */}
      {loading && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[9999]">
          <div className="bg-white rounded-xl p-6 flex flex-col items-center shadow-2xl border border-gray-100">
            <svg
              className="animate-spin h-8 w-8 text-purple-600 mb-4"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8z"
              />
            </svg>
            <div className="font-semibold text-lg text-purple-700">
              {showEditForm ? "Updating employee..." : "Adding employee..."}
            </div>
            <p className="text-sm text-gray-500 mt-1">Please wait</p>
          </div>
        </div>
      )}

      {/* Modals */}
      {(showAddForm || showEditForm) && (
        <EmployeeForm
          showEditForm={showEditForm}
          fullName={fullName}
          dateOfBirth={dateOfBirth}
          password={password}
          sex={sex}
          cccd={cccd}
          email={email}
          phoneNumber={phoneNumber}
          address={address}
          avatarPreview={avatarPreview}
          avatarUploadRef={avatarUploadRef}
          setFullName={setFullName}
          setDateOfBirth={setDateOfBirth}
          setPassword={setPassword}
          setSex={setSex}
          setCccd={setCccd}
          setEmail={setEmail}
          setPhoneNumber={setPhoneNumber}
          setAddress={setAddress}
          handleAvatarChange={handleAvatarChange}
          handleAdd={handleAdd}
          handleUpdate={handleUpdate}
          setShowAddForm={setShowAddForm}
          setShowEditForm={setShowEditForm}
          setSelectedEmployee={setSelectedEmployee}
          resetForm={resetForm}
          setAvatarFile={setAvatarFile}
          setAvatarPreview={setAvatarPreview}
        />
      )}

      {showDeletePopup && (
        <DeletePopup
          confirmDelete={confirmDelete}
          setShowDeletePopup={setShowDeletePopup}
          selectedEmployee={selectedEmployee}
        />
      )}

      {selectedEmployeeForTooltip && (
        <EmployeeTooltip
          employee={selectedEmployeeForTooltip}
          position={tooltipPosition}
          onClose={() => setSelectedEmployeeForTooltip(null)}
        />
      )}

      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
      />
    </div>
  );
};

export default EmployeeManagement;
