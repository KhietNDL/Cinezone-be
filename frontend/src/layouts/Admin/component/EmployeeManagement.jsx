import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  createEmployee,
  deleteEmployee,
  getEmployee,
  searchEmployees,
  updateEmployee,
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
import { FaRegEdit } from "react-icons/fa";
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
  // eslint-disable-next-line no-unused-vars
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

  const getEmployees = async () => {
    try {
      setLoading(true);
      const response = await getEmployee({ page: page, limit: itemsPerPage });
      if (response.data) {
        setEmployees(response.data);
        if (response.pagination) {
          setTotalPages(response.pagination.totalPages);
          setTotalEmployees(response.pagination.total);
        }
      }
    } catch (error) {
      console.error("Failed to fetch employees:", error);
      toast.error("Failed to fetch employees!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getEmployees();
  }, [itemsPerPage, page]);

  const handleSearchEmployees = async (searchTerm) => {
    try {
      setLoading(true);
      if (searchTerm.trim() === "") {
        getEmployees();
      } else {
        const response = await searchEmployees(searchTerm);
        if (response.employees) {
          setEmployees(response.employees);
          // Calculate total pages based on search results
          const total = response.employees.length;
          setTotalEmployees(total);
          setTotalPages(Math.ceil(total / itemsPerPage));
          setPage(1); // Reset to first page on search
        }
      }
    } catch (error) {
      console.error("Failed to search employees:", error);
      toast.error("Failed to search employees!");
      setEmployees([]);
      setTotalPages(0);
      setTotalEmployees(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const debounceSearch = setTimeout(
      () => handleSearchEmployees(searchEmployee),
      300
    );
    return () => clearTimeout(debounceSearch);
  }, [searchEmployee]);

  const filteredEmployees = useMemo(() => {
    return employees.filter(
      (emp) =>
        (emp.FullName &&
          emp.FullName.toLowerCase().includes(searchEmployee.toLowerCase())) ||
        (emp.Email &&
          emp.Email.toLowerCase().includes(searchEmployee.toLowerCase()))
    );
  }, [employees, searchEmployee]);

  // Paginate filtered employees
  const paginatedEmployees = useMemo(() => {
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredEmployees.slice(startIndex, endIndex);
  }, [filteredEmployees, page, itemsPerPage]);

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
      getEmployees(); // Refresh the list to update pagination
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
      getEmployees(); // Refresh the list to update pagination
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

  const confirmDelete = async () => {
    try {
      await deleteEmployee(selectedEmployee.UserId);
      setEmployees((prev) =>
        prev.filter((emp) => emp.UserId !== selectedEmployee.UserId)
      );
      setShowDeletePopup(false);
      setSelectedEmployee(null);
      toast.success("Employee deleted successfully!");
      getEmployees(); // Refresh the list to update pagination
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

  const handleOutsideClick = (e) => {
    if (!e.target.closest("tr") && !e.target.closest(".tooltip"))
      setSelectedEmployeeForTooltip(null);
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

  return (
    <div className="h-full">
      <div
        className="flex flex-col lg:flex-row items-center justify-between gap-6"
        onClick={handleOutsideClick}
      >
        {loading && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999]">
            <div className="bg-white rounded-lg p-4 sm:p-6 flex flex-col items-center shadow-xl">
              <svg
                className="animate-spin h-6 sm:h-8 w-6 sm:w-8 text-indigo-600 mb-3 sm:mb-4"
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
              <div className="font-semibold text-base sm:text-lg text-indigo-700">
                {showEditForm
                  ? "Updating employee, please wait..."
                  : "Adding employee, please wait..."}
              </div>
            </div>
          </div>
        )}
        <div className="w-[90%] md:w-[95%] lg:w-[95%] max-w-7xl space-y-4">
          <HeaderStats totalEmployees={totalEmployees} />
          <SearchAndAdd
            searchEmployee={searchEmployee}
            setSearchEmployee={setSearchEmployee}
            setPage={setPage}
            resetForm={resetForm}
            setShowAddForm={setShowAddForm}
            showEditForm={showEditForm}
          />
          <div className="bg-white rounded-md shadow-sm">
            {/* Table Layout for sm and above */}
            <div className="hidden sm:block">
              <EmployeeTable
                employees={paginatedEmployees} // Use paginated data
                page={page}
                itemsPerPage={itemsPerPage}
                handleEdit={handleEdit}
                handleDelete={handleDelete}
                handleRowClick={handleRowClick}
                formatDate={formatDate}
              />
            </div>
            {/* Card Layout for Mobile */}
            <div className="block sm:hidden space-y-4">
              {paginatedEmployees.map((emp) => (
                <article
                  key={emp.UserId}
                  className="bg-white p-4 rounded-lg shadow-sm border border-slate-200"
                  onClick={(e) => handleRowClick(emp, e)}
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={emp.avatar_url || "/default-avatar.png"}
                      alt={emp.FullName}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-gray-900 truncate">
                        {emp.FullName}
                      </h3>
                      <p className="text-xs text-gray-500 truncate">
                        {emp.Email}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 text-xs grid grid-cols-2 gap-x-2 gap-y-4 text-gray-700">
                    <p>
                      <strong>DOB:</strong> {formatDate(emp.DateOfBirth)}
                    </p>
                    <p>
                      <strong>Gender:</strong>{" "}
                      {emp.Sex === 1
                        ? "Male"
                        : emp.Sex === 2
                        ? "Female"
                        : "Other"}
                    </p>
                    <p>
                      <strong>Phone:</strong> {emp.PhoneNumber}
                    </p>
                    <p>
                      <strong>Joined:</strong> {formatDate(emp.CreatedAt)}
                    </p>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRowClick(emp, e);
                      }}
                      className="text-blue-500 hover:text-blue-700"
                      aria-label={`View ${emp.FullName}`}
                    >
                      <IoEyeOutline size={16} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(emp);
                      }}
                      className="text-blue-500 hover:text-blue-700"
                      aria-label={`Edit ${emp.FullName}`}
                    >
                      <FaRegEdit size={16} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(emp);
                      }}
                      className="text-red-400 hover:text-red-600"
                      aria-label={`Delete ${emp.FullName}`}
                    >
                      <RiDeleteBin5Line size={16} />
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            handlePageChange={handlePageChange}
          />
        </div>
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
    </div>
  );
};

export default EmployeeManagement;
