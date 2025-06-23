import { useEffect, useMemo, useState } from "react";
import { GoPlus } from "react-icons/go";
import {
  IoCloseSharp,
  IoTime,
  IoSearchOutline,
  IoClose,
  IoMailOutline,
  IoCallOutline,
  IoCardOutline,
  IoPersonOutline,
  IoCalendarOutline,
  IoTimeOutline,
  IoLocationOutline,
} from "react-icons/io5";
import { IoMdPersonAdd } from "react-icons/io";
import { MdPeopleAlt, MdDeleteForever } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBin5Line } from "react-icons/ri";
import {
  createEmployee,
  deleteEmployee,
  getEmployee,
  searchEmployees,
  updateEmployee,
} from "../../../services/API";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EmployeeManagement = () => {
  const [employees, setEmployees] = useState([]);
  const [page, setPage] = useState(1);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedEmployeeForTooltip, setSelectedEmployeeForTooltip] =
    useState(null);
  // eslint-disable-next-line no-unused-vars
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const itemsPerPage = 7;
  const [searchEmployee, setSearchEmployee] = useState("");

  // Individual state for each field
  const [fullName, setFullName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [password, setPassword] = useState("");
  const [sex, setSex] = useState(1);
  const [cccd, setCccd] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");

  const getEmployees = async () => {
    try {
      const response = await getEmployee({
        page: page,
        limit: itemsPerPage,
      });
      if (response.employees) {
        setEmployees(response.employees);
      }
    } catch (error) {
      console.error("Failed to fetch employees:", error);
      toast.error("Failed to fetch employees!");
    }
  };

  useEffect(() => {
    getEmployees();
  }, [itemsPerPage, page]);

  const handleSearchEmployees = async (searchTerm) => {
    try {
      if (searchTerm.trim() === "") {
        getEmployees();
      } else {
        const response = await searchEmployees(searchTerm);
        if (response.employees) {
          setEmployees(response.employees);
        }
      }
    } catch (error) {
      console.error("Failed to search employees:", error);
      toast.error("Failed to search employees!");
    }
  };

  useEffect(() => {
    const debounceSearch = setTimeout(() => {
      handleSearchEmployees(searchEmployee);
    }, 300);
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

  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);

  const validateForm = () => {
    if (!fullName || fullName.length < 6 || fullName.length > 100) {
      toast.error("Full name must be between 6 and 100 characters!");
      return false;
    }
    if (!dateOfBirth || !/^\d{4}-\d{2}-\d{2}$/.test(dateOfBirth)) {
      toast.error("Date of birth must be in YYYY-MM-DD format!");
      return false;
    }
    if (
      !showEditForm &&
      (!password || password.length < 8 || password.length > 128)
    ) {
      toast.error("Password must be between 8 and 128 characters!");
      return false;
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

    try {
      const employeeData = {
        FullName: fullName,
        DateOfBirth: dateOfBirth,
        Password: password,
        Sex: sex,
        CCCD: cccd,
        Email: email,
        PhoneNumber: phoneNumber,
        Address: address,
      };

      const response = await createEmployee(employeeData);
      const newEmployee = {
        ...employeeData,
        UserId: response.UserId || Date.now(),
        CreatedAt: response.CreatedAt || new Date().toISOString(),
        UserName: response.UserName || email.split("@")[0],
      };
      setEmployees((prev) => [...prev, newEmployee]);
      resetForm();
      setShowAddForm(false);
      toast.success("Employee added successfully!");
    } catch (error) {
      console.error("Failed to add employee:", error);
      const errorMessage =
        error.response?.data?.errors?.[0]?.msg ||
        error.message ||
        "Please try again.";
      toast.error(`Failed to add employee: ${errorMessage}`);
    }
  };

  const handleEdit = (employee) => {
    setSelectedEmployee(employee);
    setFullName(employee.FullName || "");
    setDateOfBirth(employee.DateOfBirth || "");
    setPassword("");
    setSex(employee.Sex !== undefined ? employee.Sex : 1);
    setCccd(employee.CCCD || "");
    setEmail(employee.Email || "");
    setPhoneNumber(employee.PhoneNumber || "");
    setAddress(employee.Address || "");
    setShowEditForm(true);
  };

  const handleUpdate = async () => {
    if (!validateForm()) return;

    try {
      const employeeData = {
        FullName: fullName,
        DateOfBirth: dateOfBirth,
        Password: password || undefined,
        Sex: sex,
        CCCD: cccd,
        Email: email,
        PhoneNumber: phoneNumber,
        Address: address,
      };
      await updateEmployee(selectedEmployee.UserId, employeeData);
      setEmployees((prev) =>
        prev.map((emp) =>
          emp.UserId === selectedEmployee.UserId
            ? { ...emp, ...employeeData, CreatedAt: emp.CreatedAt }
            : emp
        )
      );
      setShowEditForm(false);
      setSelectedEmployee(null);
      resetForm();
      toast.success("Employee updated successfully!");
    } catch (error) {
      console.error("Failed to update employee:", error);
      const errorMessage =
        error.response?.data?.errors?.[0]?.msg ||
        error.message ||
        "Please try again.";
      toast.error(`Failed to update employee: ${errorMessage}`);
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
    } catch (error) {
      console.error("Failed to delete employee:", error);
      toast.error(
        `Failed to delete employee: ${error.message || "Please try again."}`
      );
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return dateString.split("T")[0];
  };

  const handleRowClick = (employee, event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setTooltipPosition({
      x: rect.right + 10,
      y: rect.top + window.scrollY,
    });
    setSelectedEmployeeForTooltip(employee);
  };

  const handleOutsideClick = (e) => {
    if (!e.target.closest("tr") && !e.target.closest(".tooltip")) {
      setSelectedEmployeeForTooltip(null);
    }
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

  const EmployeeTooltip = ({ employee, onClose }) => (
    <div className="absolute inset-0 flex justify-center items-center backdrop-blur-sm z-50">
      <div className="bg-white rounded-2xl shadow-2xl p-6 w-[600px] max-w-[90vw] max-h-[90vh] overflow-y-auto transform transition-all duration-300 scale-100">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-start space-x-4">
            <div className="relative">
              <img
                src="https://www.w3schools.com/howto/img_avatar.png"
                alt="Employee"
                className="w-20 h-20 rounded-full object-cover border-4 border-blue-100 shadow-lg"
              />
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 border-2 border-white rounded-full"></div>
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-1">
                {employee.FullName}
              </h2>
              <p className="text-blue-600 font-medium text-sm mb-1">
                @{employee.UserName || "Unknown"}
              </p>
              <span className="inline-block bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
                Active Employee
              </span>
            </div>
          </div>
          <div
            role="button"
            onClick={onClose}
            className="p-2 rounded-2xl hover:bg-slate-100 active:bg-slate-200 transition-all duration-200 hover:scale-110 active:scale-95"
          >
            <IoClose size={24} className="text-gray-600" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="flex items-center p-3 bg-purple-50 rounded-lg border border-purple-100">
            <div className="flex items-center justify-center w-10 h-10 bg-purple-100 rounded-full mr-3">
              <IoCalendarOutline size={18} className="text-purple-600" />
            </div>
            <div className="flex-1">
              <span className="text-xs font-medium text-purple-800 block uppercase tracking-wide">
                Date of Birth
              </span>
              <span className="text-sm text-purple-700 font-semibold">
                {formatDate(employee.DateOfBirth) || "Not provided"}
              </span>
            </div>
          </div>

          <div className="flex items-center p-3 bg-pink-50 rounded-lg border border-pink-100">
            <div className="flex items-center justify-center w-10 h-10 bg-pink-100 rounded-full mr-3">
              <IoPersonOutline size={18} className="text-pink-600" />
            </div>
            <div className="flex-1">
              <span className="text-xs font-medium text-pink-800 block uppercase tracking-wide">
                Gender
              </span>
              <span className="text-sm text-pink-800 font-semibold">
                {employee.Sex === 0
                  ? "Male"
                  : employee.Sex === 1
                  ? "Female"
                  : "Unknown"}
              </span>
            </div>
          </div>

          <div className="flex items-center p-3 bg-blue-50 rounded-lg border border-blue-100">
            <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full mr-3">
              <IoMailOutline size={18} className="text-blue-600" />
            </div>
            <div className="flex-1">
              <span className="text-xs font-medium text-blue-800 block uppercase tracking-wide">
                Email Address
              </span>
              <span className="text-sm text-blue-700 font-semibold truncate">
                {employee.Email || "Not provided"}
              </span>
            </div>
          </div>

          <div className="flex items-center p-3 bg-green-50 rounded-lg border border-green-100">
            <div className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-full mr-3">
              <IoCallOutline size={18} className="text-green-600" />
            </div>
            <div className="flex-1">
              <span className="text-xs font-medium text-green-800 block uppercase tracking-wide">
                Phone Number
              </span>
              <span className="text-sm text-green-700 font-semibold">
                {employee.PhoneNumber || "Not provided"}
              </span>
            </div>
          </div>

          <div className="flex items-center p-3 bg-orange-50 rounded-lg border border-orange-100">
            <div className="flex items-center justify-center w-10 h-10 bg-orange-100 rounded-full mr-3">
              <IoCardOutline size={18} className="text-orange-600" />
            </div>
            <div className="flex-1">
              <span className="text-xs font-medium text-orange-800 block uppercase tracking-wide">
                ID Card
              </span>
              <span className="text-sm text-orange-700 font-semibold">
                {employee.CCCD || "Not provided"}
              </span>
            </div>
          </div>

          <div className="flex items-center p-3 bg-indigo-50 rounded-lg border border-indigo-100">
            <div className="flex items-center justify-center w-10 h-10 bg-indigo-100 rounded-full mr-3">
              <IoTimeOutline size={18} className="text-indigo-600" />
            </div>
            <div className="flex-1">
              <span className="text-xs font-medium text-indigo-800 block uppercase tracking-wide">
                Register Date
              </span>
              <span className="text-sm text-indigo-800 font-semibold">
                {formatDate(employee.CreatedAt)}
              </span>
            </div>
          </div>
        </div>

        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 mb-6">
          <div className="flex items-start">
            <div className="flex items-center justify-center w-10 h-10 bg-gray-200 rounded-full mr-3 mt-1">
              <IoLocationOutline size={18} className="text-gray-600" />
            </div>
            <div className="flex-1">
              <span className="text-xs font-medium text-gray-700 block uppercase tracking-wide mb-1">
                Address
              </span>
              <p className="text-sm text-gray-800 leading-relaxed">
                {employee.Address || "Address not provided"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const DeletePopup = () => (
    <div className="fixed inset-0 bg-black/30 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-[400px]">
        <div className="text-center">
          <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <MdDeleteForever className="text-red-500" size={24} />
          </div>
          <h3 className="text-lg font-semibold mb-2">Delete Employee</h3>
          <p className="text-gray-600 mb-6">
            Are you sure you want to delete{" "}
            <strong>{selectedEmployee?.FullName}</strong>? This action cannot be
            undone.
          </p>
          <div className="flex justify-center space-x-3">
            <button
              onClick={() => setShowDeletePopup(false)}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              onClick={confirmDelete}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div
      className="flex items-center h-full justify-between"
      onClick={handleOutsideClick}
    >
      <div className="w-[90%] space-y-4">
        <div className="flex items-center justify-between w-full">
          <div className="bg-white rounded-md p-3 w-[23%] shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-slate-500">Total Employees</p>
              <div className="p-2 bg-sky-100 rounded-full">
                <MdPeopleAlt size={20} className="text-blue-500" />
              </div>
            </div>
            <div className="font-bold text-[19px]">{employees.length}</div>
          </div>
          <div className="bg-white rounded-md p-3 w-[23%] shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-slate-500">On Leave</p>
              <div className="p-2 bg-rose-50 rounded-full">
                <IoTime size={20} className="text-red-500" />
              </div>
            </div>
            <div className="font-bold text-[19px]">2500</div>
          </div>
          <div className="bg-white rounded-md p-3 w-[23%] shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-slate-500">New Hires</p>
              <div className="p-2 bg-sky-100 rounded-full">
                <IoMdPersonAdd size={20} className="text-blue-500" />
              </div>
            </div>
            <div className="font-bold text-[19px]">300</div>
          </div>
          <div className="bg-white rounded-md p-3 w-[23%] shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-slate-500">Resigned</p>
              <div className="p-2 bg-rose-50 rounded-full">
                <IoCloseSharp size={20} className="text-red-500" />
              </div>
            </div>
            <div className="font-bold text-[19px]">100</div>
          </div>
        </div>
        <div className="w-full py-3 space-y-4">
          <div className="flex items-center justify-between">
            <div className="w-full">
              <div className="flex items-center p-1 px-2 w-2/4 rounded-xl bg-white shadow-sm">
                <div className="shrink-0">
                  <IoSearchOutline size={20} />
                </div>
                <input
                  type="text"
                  value={searchEmployee}
                  onChange={(e) => {
                    setPage(1);
                    setSearchEmployee(e.target.value);
                  }}
                  className="p-2 focus:outline-none w-full"
                  placeholder="Search by name or email"
                />
              </div>
            </div>
            <div className="flex shrink-0 items-center justify-between gap-2">
              <div
                role="button"
                onClick={() => {
                  resetForm();
                  setShowAddForm(true);
                }}
                className="flex items-center text-[#6051F3] hover:bg-slate-50 p-2 rounded-md active:bg-slate-100 bg-white shadow-sm"
              >
                <GoPlus size={20} className="mr-2" />
                Add Employee
              </div>
            </div>
          </div>
          <div className="bg-white min-h-[340px] max-h-[340px] p-4 rounded-md shadow-sm overflow-x-auto">
            <table className="w-full table-auto border-collapse">
              <thead>
                <tr className="text-left text-slate-500 text-sm border-b border-gray-200">
                  <th className="py-2 px-4">Full Name</th>
                  <th className="py-2 px-4 text-center">Date of Birth</th>
                  <th className="py-2 px-4 text-center">Gender</th>
                  <th className="py-2 px-4">Email</th>
                  <th className="py-2 px-4 text-center">Phone</th>
                  <th className="py-2 px-4 text-center">Register Date</th>
                  <th className="py-2 px-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {employees
                  .slice((page - 1) * itemsPerPage, page * itemsPerPage)
                  .map((emp) => (
                    <tr
                      key={emp.UserId}
                      role="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRowClick(emp, e);
                      }}
                      className="border-b border-gray-200 hover:bg-gray-50 text-sm"
                    >
                      <td className="py-2 px-4">{emp.FullName}</td>
                      <td className="py-2 px-4 text-center">
                        {formatDate(emp.DateOfBirth)}
                      </td>
                      <td className="py-2 px-4 text-center">
                        {emp.Sex === 0
                          ? "Male"
                          : emp.Sex === 1
                          ? "Female"
                          : "Unknown"}
                      </td>
                      <td className="py-2 px-4">{emp.Email}</td>
                      <td className="py-2 px-4 text-center">
                        {emp.PhoneNumber}
                      </td>
                      <td className="py-2 px-4 text-center">
                        {formatDate(emp.CreatedAt)}
                      </td>
                      <td className="py-2 px-4 flex justify-center space-x-2">
                        <div
                          role="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(emp);
                          }}
                          className="text-blue-500 hover:text-blue-700"
                          title="Edit"
                        >
                          <FaRegEdit size={20} />
                        </div>
                        <div
                          role="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(emp);
                          }}
                          className="text-red-400 hover:text-red-600"
                          title="Delete"
                        >
                          <RiDeleteBin5Line size={20} />
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-end space-x-2 pt-4">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
              className="px-3 py-1 bg-white shadow-sm rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`px-3 py-1 rounded shadow-sm ${
                  page === i + 1
                    ? "bg-[#6051F3] text-white"
                    : "bg-white hover:bg-gray-100"
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              disabled={page === totalPages}
              className="px-3 py-1 bg-white shadow-sm rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {(showAddForm || showEditForm) && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[95vh] overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 px-6 py-4 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">
                    {showEditForm ? "Edit Employee" : "Add New Employee"}
                  </h2>
                  <p className="text-indigo-100 text-sm mt-1">
                    {showEditForm
                      ? "Update the details below to edit the employee record"
                      : "Fill in the details below to add a new employee"}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setShowAddForm(false);
                    setShowEditForm(false);
                    setSelectedEmployee(null);
                    resetForm();
                  }}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(95vh-170px)]">
              <div className="space-y-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <svg
                      className="w-5 h-5 mr-2 text-indigo-600"
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
                    Personal Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="FullName"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                        placeholder="Enter full name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Date of Birth <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        name="DateOfBirth"
                        value={dateOfBirth}
                        onChange={(e) => setDateOfBirth(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Gender <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="Sex"
                        value={sex}
                        onChange={(e) => setSex(parseInt(e.target.value))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                      >
                        <option value="0">Male</option>
                        <option value="1">Female</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Identity Card <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="CCCD"
                        value={cccd}
                        onChange={(e) => setCccd(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                        placeholder="Enter ID card number"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <svg
                      className="w-5 h-5 mr-2 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    Contact Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        name="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                        placeholder="Enter email address"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Phone Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        name="PhoneNumber"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                        placeholder="Enter phone number"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Address <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        name="Address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none transition-all"
                        placeholder="Enter full address"
                        rows="3"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <svg
                      className="w-5 h-5 mr-2 text-red-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                    Security Information
                  </h3>
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Password{" "}
                        {showEditForm ? (
                          ""
                        ) : (
                          <span className="text-red-500">*</span>
                        )}
                      </label>
                      <input
                        type="password"
                        name="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                        placeholder={
                          showEditForm
                            ? "Enter new password (leave blank to keep current)"
                            : "Enter password"
                        }
                      />
                      {showEditForm && (
                        <p className="text-xs text-gray-500 mt-1">
                          Leave blank to keep the current password
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 px-6 py-4 border-slate-300 border-t flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowAddForm(false);
                  setShowEditForm(false);
                  setSelectedEmployee(null);
                  resetForm();
                }}
                className="px-6 py-3 text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={showEditForm ? handleUpdate : handleAdd}
                className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white rounded-lg font-medium transition-all shadow-md hover:shadow-lg"
              >
                {showEditForm ? "Save Changes" : "Add Employee"}
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeletePopup && <DeletePopup />}
      {selectedEmployeeForTooltip && (
        <EmployeeTooltip
          employee={selectedEmployeeForTooltip}
          onClose={() => setSelectedEmployeeForTooltip(null)}
        />
      )}

      <ToastContainer
        position="top-right"
        autoClose={3000}
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
