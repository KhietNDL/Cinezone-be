import React, { useMemo, useState } from "react";
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
import EmployeeForm from "../employeeComponent/EmployeeForm";

const EmployeeManagement = () => {
  const [employees, setEmployees] = useState([
    {
      idEmployee: 1,
      username: "john.doe",
      fullName: "Lê Thị Minh",
      dateOfBirth: "1990-05-19",
      gender: "Male",
      email: "john.doe@email.com",
      identityCard: "ID123456789",
      phone: "0215206154",
      address: "123 Main St, NY",
      registerDate: "2022-04-15",
      absences: 2,
      image: "https://www.w3schools.com/howto/img_avatar.png",
    },
    {
      idEmployee: 2,
      username: "sara.connor",
      fullName: "Vũ Văn An",
      dateOfBirth: "1987-11-30",
      gender: "Female",
      email: "sara.connor@email.com",
      identityCard: "ID876543210",
      phone: "0551026066",
      address: "456 Oak Ave, LA",
      registerDate: "2023-01-12",
      absences: 1,
      image: "https://www.w3schools.com/howto/img_avatar.png",
    },
    {
      idEmployee: 3,
      username: "alex.lee",
      fullName: "Nguyễn Văn Bình",
      dateOfBirth: "1995-03-21",
      gender: "Male",
      email: "alex.lee@email.com",
      identityCard: "ID321654987",
      phone: "0510005051",
      address: "789 Pine Rd, SF",
      registerDate: "2024-05-01",
      absences: 0,
      image: "https://www.w3schools.com/howto/img_avatar.png",
    },
    {
      idEmployee: 4,
      username: "emma.watson",
      fullName: "Phạm Thị Hương",
      dateOfBirth: "1992-08-15",
      gender: "Female",
      email: "emma.watson@email.com",
      identityCard: "ID987123654",
      phone: "0510050051",
      address: "321 Cedar St, TX",
      registerDate: "2021-10-22",
      absences: 3,
      image: "https://www.w3schools.com/howto/img_avatar.png",
    },
    {
      idEmployee: 5,
      username: "emma.watson",
      fullName: "Vũ Quân",
      dateOfBirth: "1992-08-15",
      gender: "Female",
      email: "emma.watson@email.com",
      identityCard: "ID987123654",
      phone: "0511239456",
      address: "321 Cedar St, TX",
      registerDate: "2021-10-22",
      absences: 4,
      image: "https://www.w3schools.com/howto/img_avatar.png",
    },
    {
      idEmployee: 6,
      username: "sara.connor",
      fullName: "Akira Phan",
      dateOfBirth: "1987-11-30",
      gender: "Female",
      email: "sara.connor@email.com",
      identityCard: "ID876543210",
      phone: "0145789456",
      address: "456 Oak Ave, LA",
      registerDate: "2023-01-12",
      absences: 5,
      image: "https://www.w3schools.com/howto/img_avatar.png",
    },
    {
      idEmployee: 7,
      username: "john.doe",
      fullName: "Lê Thị Minh",
      dateOfBirth: "1990-05-19",
      gender: "Male",
      email: "john.doe@email.com",
      identityCard: "ID123456789",
      phone: "0215206154",
      address: "123 Main St, NY",
      registerDate: "2022-04-15",
      absences: 2,
      image: "https://www.w3schools.com/howto/img_avatar.png",
    },
    {
      idEmployee: 8,
      username: "sara.connor",
      fullName: "Vũ Văn An",
      dateOfBirth: "1987-11-30",
      gender: "Female",
      email: "sara.connor@email.com",
      identityCard: "ID876543210",
      phone: "0551026066",
      address: "456 Oak Ave, LA",
      registerDate: "2023-01-12",
      absences: 1,
      image: "https://www.w3schools.com/howto/img_avatar.png",
    },
    {
      idEmployee: 9,
      username: "alex.lee",
      fullName: "Nguyễn Văn Bình",
      dateOfBirth: "1995-03-21",
      gender: "Male",
      email: "alex.lee@email.com",
      identityCard: "ID321654987",
      phone: "0510005051",
      address: "789 Pine Rd, SF",
      registerDate: "2024-05-01",
      absences: 0,
      image: "https://www.w3schools.com/howto/img_avatar.png",
    },
    {
      idEmployee: 10,
      username: "emma.watson",
      fullName: "Phạm Thị Hương",
      dateOfBirth: "1992-08-15",
      gender: "Female",
      email: "emma.watson@email.com",
      identityCard: "ID987123654",
      phone: "0510050051",
      address: "321 Cedar St, TX",
      registerDate: "2021-10-22",
      absences: 3,
      image: "https://www.w3schools.com/howto/img_avatar.png",
    },
    {
      idEmployee: 11,
      username: "emma.watson",
      fullName: "Vũ Quân",
      dateOfBirth: "1992-08-15",
      gender: "Female",
      email: "emma.watson@email.com",
      identityCard: "ID987123654",
      phone: "0511239456",
      address: "321 Cedar St, TX",
      registerDate: "2021-10-22",
      absences: 4,
      image: "https://www.w3schools.com/howto/img_avatar.png",
    },
    {
      idEmployee: 12,
      username: "sara.connor",
      fullName: "Akira Phan",
      dateOfBirth: "1987-11-30",
      gender: "Female",
      email: "sara.connor@email.com",
      identityCard: "ID876543210",
      phone: "0145789456",
      address: "456 Oak Ave, LA",
      registerDate: "2023-01-12",
      absences: 5,
      image: "https://www.w3schools.com/howto/img_avatar.png",
    },
  ]);
  const [page, setPage] = useState(1);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedEmployeeForTooltip, setSelectedEmployeeForTooltip] =
    useState(null); // New state for clicked tooltip
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 }); // Track tooltip position
  const itemsPerPage = 7;
  const [searchEmployee, setSearchEmployee] = useState("");

  // Filter employees based on search term
  const filteredEmployees = useMemo(() => {
    return employees.filter(
      (emp) =>
        (emp.fullName &&
          emp.fullName.toLowerCase().includes(searchEmployee.toLowerCase())) ||
        (emp.email &&
          emp.email.toLowerCase().includes(searchEmployee.toLowerCase()))
    );
  }, [employees, searchEmployee]);

  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);

  const [formData, setFormData] = useState({
    idEmployee: "",
    username: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    dateOfBirth: "",
    gender: "Male",
    identityCard: "",
    email: "",
    address: "",
    phone: "",
    image: "https://www.w3schools.com/howto/img_avatar.png",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAdd = () => {
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords don't match!");
      return;
    }

    const newEmployee = {
      ...formData,
      idEmployee: Date.now(),
      registerDate: new Date().toISOString().split("T")[0],
    };

    setEmployees((prev) => [...prev, newEmployee]);
    resetForm();
    setShowAddForm(false);
  };

  const handleEdit = (employee) => {
    setSelectedEmployee(employee);
    setFormData({ ...employee, password: "", confirmPassword: "" });
    setShowEditForm(true);
  };

  const handleUpdate = () => {
    setEmployees((prev) =>
      prev.map((emp) =>
        emp.idEmployee === selectedEmployee.idEmployee
          ? {
              ...formData,
              idEmployee: selectedEmployee.idEmployee,
              registerDate: selectedEmployee.registerDate,
            }
          : emp
      )
    );
    setShowEditForm(false);
    setSelectedEmployee(null);
    resetForm();
  };

  // ✅ SỬA LỖI: Hàm handleDelete nhận đúng object employee
  const handleDelete = (employee) => {
    setSelectedEmployee(employee);
    setSelectedEmployeeForTooltip(null);
    setShowDeletePopup(true);
  };

  // ✅ SỬA LỖI: Hàm confirmDelete thực hiện xóa
  const confirmDelete = () => {
    console.log("Deleting employee with ID:", selectedEmployee.idEmployee);
    console.log(
      "Current employees:",
      employees.map((emp) => emp.idEmployee)
    );

    setEmployees((prev) => {
      const updated = prev.filter(
        (emp) => emp.idEmployee !== selectedEmployee.idEmployee
      );
      console.log(
        "After deletion:",
        updated.map((emp) => emp.idEmployee)
      );
      return updated;
    });

    setShowDeletePopup(false);
    setSelectedEmployee(null);
  };

  // Handle row click to show tooltip for specific employee
  const handleRowClick = (employee, event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setTooltipPosition({
      x: rect.right + 10,
      y: rect.top + window.scrollY,
    });
    setSelectedEmployeeForTooltip(employee);
  };

  // Close tooltip when clicking outside
  const handleOutsideClick = (e) => {
    if (!e.target.closest("tr") && !e.target.closest(".tooltip")) {
      setSelectedEmployeeForTooltip(null);
    }
  };

  const resetForm = () => {
    setFormData({
      username: "",
      password: "",
      confirmPassword: "",
      fullName: "",
      dateOfBirth: "",
      gender: "Male",
      identityCard: "",
      email: "",
      address: "",
      phone: "",
      image: "https://www.w3schools.com/howto/img_avatar.png",
    });
  };

  const EmployeeTooltip = ({ employee, onClose }) => (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50">
      <div className="bg-white rounded-2xl shadow-2xl p-6 w-[600px] max-w-[90vw] max-h-[90vh] overflow-y-auto transform transition-all duration-300 scale-100">
        {/* Header Section */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-start space-x-4">
            <div className="relative">
              <img
                src={
                  employee.image ||
                  "https://www.w3schools.com/howto/img_avatar.png"
                }
                alt="Employee"
                className="w-20 h-20 rounded-full object-cover border-4 border-blue-100 shadow-lg"
              />
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 border-2 border-white rounded-full"></div>
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-1">
                {employee.fullName}
              </h2>
              <p className="text-blue-600 font-medium text-sm mb-1">
                @{employee.username}
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

        {/* Employee Information Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* Date of Birth */}
          <div className="flex items-center p-3 bg-purple-50 rounded-lg border border-purple-100">
            <div className="flex items-center justify-center w-10 h-10 bg-purple-100 rounded-full mr-3">
              <IoCalendarOutline size={18} className="text-purple-600" />
            </div>
            <div className="flex-1">
              <span className="text-xs font-medium text-purple-800 block uppercase tracking-wide">
                Date of Birth
              </span>
              <span className="text-sm text-purple-700 font-semibold">
                {employee.dateOfBirth || "Not provided"}
              </span>
            </div>
          </div>

          {/* Gender */}
          <div className="flex items-center p-3 bg-pink-50 rounded-lg border border-pink-100">
            <div className="flex items-center justify-center w-10 h-10 bg-pink-100 rounded-full mr-3">
              <IoPersonOutline size={18} className="text-pink-600" />
            </div>
            <div className="flex-1">
              <span className="text-xs font-medium text-pink-800 block uppercase tracking-wide">
                Gender
              </span>
              <span className="text-sm text-pink-700 font-semibold">
                {employee.gender || "Not specified"}
              </span>
            </div>
          </div>

          {/* Email */}
          <div className="flex items-center p-3 bg-blue-50 rounded-lg border border-blue-100">
            <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full mr-3">
              <IoMailOutline size={18} className="text-blue-600" />
            </div>
            <div className="flex-1">
              <span className="text-xs font-medium text-blue-800 block uppercase tracking-wide">
                Email Address
              </span>
              <span className="text-sm text-blue-700 font-semibold truncate">
                {employee.email || "Not provided"}
              </span>
            </div>
          </div>

          {/* Phone */}
          <div className="flex items-center p-3 bg-green-50 rounded-lg border border-green-100">
            <div className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-full mr-3">
              <IoCallOutline size={18} className="text-green-600" />
            </div>
            <div className="flex-1">
              <span className="text-xs font-medium text-green-800 block uppercase tracking-wide">
                Phone Number
              </span>
              <span className="text-sm text-green-700 font-semibold">
                {employee.phone || "Not provided"}
              </span>
            </div>
          </div>

          {/* ID Card */}
          <div className="flex items-center p-3 bg-orange-50 rounded-lg border border-orange-100">
            <div className="flex items-center justify-center w-10 h-10 bg-orange-100 rounded-full mr-3">
              <IoCardOutline size={18} className="text-orange-600" />
            </div>
            <div className="flex-1">
              <span className="text-xs font-medium text-orange-800 block uppercase tracking-wide">
                ID Card
              </span>
              <span className="text-sm text-orange-700 font-semibold">
                {employee.identityCard || "Not provided"}
              </span>
            </div>
          </div>

          {/* Register Date */}
          <div className="flex items-center p-3 bg-indigo-50 rounded-lg border border-indigo-100">
            <div className="flex items-center justify-center w-10 h-10 bg-indigo-100 rounded-full mr-3">
              <IoTimeOutline size={18} className="text-indigo-600" />
            </div>
            <div className="flex-1">
              <span className="text-xs font-medium text-indigo-800 block uppercase tracking-wide">
                Register Date
              </span>
              <span className="text-sm text-indigo-700 font-semibold">
                {employee.registerDate || "Not available"}
              </span>
            </div>
          </div>
        </div>

        {/* Address Section */}
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
                {employee.address || "Address not provided"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Delete Popup Component
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
            <strong>{selectedEmployee?.fullName}</strong>? This action cannot be
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
      className="p-[20px] flex items-center h-full justify-between"
      onClick={handleOutsideClick}
    >
      <div className="w-[70%] space-y-4">
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
            <div className="font-bold text-[19px]">25,340</div>
          </div>
          <div className="bg-white rounded-md p-3 w-[23%] shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-slate-500">New Hires</p>
              <div className="p-2 bg-sky-100 rounded-full">
                <IoMdPersonAdd size={20} className="text-blue-500" />
              </div>
            </div>
            <div className="font-bold text-[19px]">25,340</div>
          </div>
          <div className="bg-white rounded-md p-3 w-[23%] shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-slate-500">Resigned</p>
              <div className="p-2 bg-rose-50 rounded-full">
                <IoCloseSharp size={20} className="text-red-500" />
              </div>
            </div>
            <div className="font-bold text-[19px]">25,340</div>
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
            <div className="flex items-center justify-between gap-2">
              <div
                role="button"
                onClick={() => setShowAddForm(true)}
                className="flex items-center text-[#6051F3] hover:bg-slate-50 p-2 rounded-md active:bg-slate-100 bg-white shadow-sm"
              >
                <GoPlus size={20} className="mr-2" />
                Employee
              </div>
            </div>
          </div>
          <div className="bg-white min-h-[340px] max-h-[340px] p-4 rounded-md shadow-sm">
            <table className="w-full table-auto border-collapse">
              <thead>
                <tr className="text-left text-slate-500 text-sm border-b border-slate-200">
                  <th className="py-2">Full Name</th>
                  <th className="py-2 text-center">Date of Birth</th>
                  <th className="py-2 text-center">Gender</th>
                  <th className="py-2 pl-2">Email</th>
                  <th className="py-2 text-center">Phone</th>
                  <th className="py-2 text-center">Register Date</th>
                  <th className="py-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredEmployees
                  .slice((page - 1) * itemsPerPage, page * itemsPerPage)
                  .map((emp) => (
                    <tr
                      key={emp.idEmployee}
                      role="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRowClick(emp, e);
                      }}
                      className="border-b border-slate-200 hover:bg-slate-100 text-sm"
                    >
                      <td className="py-2">{emp.fullName}</td>
                      <td className="py-2 text-center">{emp.dateOfBirth}</td>
                      <td className="py-2 text-center">{emp.gender}</td>
                      <td className="py-2 pl-2">{emp.email}</td>
                      <td className="py-2 text-center">{emp.phone}</td>
                      <td className="py-2 text-center">{emp.registerDate}</td>
                      <td className="flex items-center justify-between py-2">
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

          {/* pagination */}
          <div className="flex items-center justify-end space-x-2 pt-4">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
              className="px-3 py-1 bg-white shadow-sm rounded hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
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
                    : "bg-white hover:bg-slate-100"
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              disabled={page === totalPages}
              className="px-3 py-1 bg-white shadow-sm rounded hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      </div>
      <div className="flex items-center right-[-40px] top-[25%] justify-end w-[30%]">
        <div className="flex items-center w-[90%] ">
          <div className="bg-white p-6 rounded-[20px] shadow-sm w-full max-w-md">
            {/* Header */}
            <div className="space-y-2 mb-6">
              <h2 className="text-xl font-bold text-gray-800">
                Attendance Overview
              </h2>
              <div
                role="button"
                className="bg-blue-100 w-fit text-blue-600 px-3 py-1 rounded-lg text-sm font-medium flex items-center"
              >
                <svg
                  className="w-4 h-4 shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                    clipRule="evenodd"
                  />
                </svg>
                This Week
              </div>
            </div>

            {/* Table Header */}
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-200">
              <div className="flex items-center">
                <span className="text-gray-500 text-sm font-medium mr-4">
                  #
                </span>
                <span className="text-gray-500 text-sm font-medium">
                  Employee
                </span>
              </div>
              <span className="text-gray-500 text-center text-sm font-medium">
                Absences
              </span>
            </div>

            {/* Employee List */}
            <div className="space-y-3">
              {employees.slice(0, 4).map((employee) => (
                <div
                  key={employee.idEmployee}
                  className="flex items-center justify-between pr-6 py-2"
                >
                  <div className="flex items-center">
                    <span className="text-gray-600 font-medium mr-4 w-4">
                      {employee.idEmployee}
                    </span>
                    <div className="flex items-center">
                      <img
                        src={employee.image}
                        alt={employee.fullName}
                        className="w-10 h-10 rounded-full object-cover mr-3"
                      />
                      <span className="text-gray-800 font-medium">
                        {employee.fullName}
                      </span>
                    </div>
                  </div>
                  <span className="text-red-500 font-bold text-center text-lg">
                    {employee.absences}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {showAddForm && (
        <EmployeeForm
          formData={formData}
          handleInputChange={handleInputChange}
          handleAdd={handleAdd}
          handleUpdate={handleUpdate}
          setShowAddForm={setShowAddForm}
          setShowEditForm={setShowEditForm}
          resetForm={resetForm}
        />
      )}
      {showEditForm && (
        <EmployeeForm
          isEdit={true}
          formData={formData}
          handleInputChange={handleInputChange}
          handleUpdate={handleUpdate}
          setShowEditForm={setShowEditForm}
          resetForm={resetForm}
        />
      )}
      {showDeletePopup && <DeletePopup />}
      {selectedEmployeeForTooltip && (
        <EmployeeTooltip
          employee={selectedEmployeeForTooltip}
          position={tooltipPosition}
        />
      )}
    </div>
  );
};

export default EmployeeManagement;
