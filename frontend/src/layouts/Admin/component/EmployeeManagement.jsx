import React, { useMemo, useState } from "react";
import { GoPlus } from "react-icons/go";
import { IoCloseSharp, IoTime, IoSearchOutline } from "react-icons/io5";
import { IoMdPersonAdd, IoMdRefresh } from "react-icons/io";
import { MdPeopleAlt, MdDeleteForever } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBin5Line } from "react-icons/ri";
import { FaUpload } from "react-icons/fa";
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
  const [hoveredEmployee, setHoveredEmployee] = useState(null);
  const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 });
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

  // ✅ SỬA LỖI: handleMouseEnter và handleMouseLeave chỉ xử lý tooltip
  const handleMouseEnter = (employee, event) => {
    setHoveredEmployee(employee);
    const rect = event.currentTarget.getBoundingClientRect();
    setHoverPosition({
      x: rect.right + 10,
      y: rect.top,
    });
  };

  const handleMouseLeave = () => {
    setHoveredEmployee(null);
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

  const EmployeeTooltip = ({ employee, position }) => (
    <div
      className="fixed bg-white border ml-3 border-gray-200 rounded-lg shadow-lg p-4 z-50 w-80"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: "translateY(-20px)",
      }}
    >
      {/* Triangle Arrow */}
      <div
        className="absolute -left-2 top-6 w-0 h-0 border-t-8 border-b-8 border-r-8 border-t-transparent border-b-transparent border-r-white"
        style={{
          filter: "drop-shadow(-1px 0px 1px rgba(0,0,0,0.1))",
        }}
      />
      <div className="flex items-start space-x-4">
        <img
          src={
            employee.image || "https://www.w3schools.com/howto/img_avatar.png"
          }
          alt="Employee"
          className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
        />
        <div className="flex-1">
          <h3 className="font-semibold text-lg text-gray-800">
            {employee.fullName}
          </h3>
          <p className="text-sm text-gray-500 mb-2">@{employee.username}</p>
        </div>
      </div>

      <div className="mt-4 space-y-2">
        <div className="flex justify-between">
          <span className="text-sm font-medium text-gray-600">
            Date of Birth:
          </span>
          <span className="text-sm text-gray-800">{employee.dateOfBirth}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm font-medium text-gray-600">Gender:</span>
          <span className="text-sm text-gray-800">{employee.gender}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm font-medium text-gray-600">Email:</span>
          <span className="text-sm text-gray-800 truncate">
            {employee.email}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm font-medium text-gray-600">Phone:</span>
          <span className="text-sm text-gray-800">{employee.phone}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm font-medium text-gray-600">ID Card:</span>
          <span className="text-sm text-gray-800">{employee.identityCard}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm font-medium text-gray-600">
            Register Date:
          </span>
          <span className="text-sm text-gray-800">{employee.registerDate}</span>
        </div>
        <div className="pt-2 border-t border-gray-200">
          <span className="text-sm font-medium text-gray-600">Address:</span>
          <p className="text-sm text-gray-800 mt-1">{employee.address}</p>
        </div>
      </div>
    </div>
  );

  // Employee Form Component
  const EmployeeForm = ({ isEdit = false }) => (
    <div className="fixed inset-0 bg-black/30 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-[600px] max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">
          {isEdit ? "Edit Employee" : "Add New Employee"}
        </h2>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter username"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter password"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Confirm password"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Full Name</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter full name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Date of Birth
            </label>
            <input
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Gender</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Identity Card
            </label>
            <input
              type="text"
              name="identityCard"
              value={formData.identityCard}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter ID card number"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter email"
            />
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-medium mb-1">Address</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter address"
              rows="2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter phone number"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Image</label>
            <div className="flex items-center space-x-2">
              <input
                type="url"
                name="image"
                value={formData.image}
                onChange={handleInputChange}
                className="flex-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter image URL"
              />
              <button className="p-2 bg-gray-100 rounded hover:bg-gray-200">
                <FaUpload size={16} />
              </button>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3 mt-6">
          <button
            onClick={() => {
              setShowAddForm(false);
              setShowEditForm(false);
              resetForm();
            }}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
          >
            Back
          </button>
          <button
            onClick={isEdit ? handleUpdate : handleAdd}
            className="px-4 py-2 bg-[#6051F3] text-white rounded hover:bg-[#5041E3]"
          >
            {isEdit ? "Update" : "Add"}
          </button>
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
    <div className="p-[20px] flex items-center h-full justify-between ">
      <div className="w-[70%] space-y-4">
        <div className="flex items-center justify-between w-full">
          <div className="bg-white rounded-md p-3  w-[23%] shadow-sm ">
            <div className="flex items-center justify-between">
              <p className="text-slate-500">Total Employees</p>
              <div className="p-2 bg-sky-100 rounded-full">
                <MdPeopleAlt size={20} className="text-blue-500" />
              </div>
            </div>
            <div className="font-bold text-[19px]">{employees.length}</div>
          </div>
          <div className="bg-white rounded-md p-3  w-[23%] shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-slate-500">On Leave</p>
              <div className="p-2 bg-rose-50 rounded-full">
                <IoTime size={20} className="text-red-500" />
              </div>
            </div>
            <div className="font-bold text-[19px]">25,340</div>
          </div>
          <div className="bg-white rounded-md p-3  w-[23%] shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-slate-500">New Hires</p>
              <div className="p-2 bg-sky-100 rounded-full">
                <IoMdPersonAdd size={20} className="text-blue-500" />
              </div>
            </div>
            <div className="font-bold text-[19px]">25,340</div>
          </div>
          <div className="bg-white rounded-md p-3  w-[23%] shadow-sm">
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
                      onMouseEnter={(e) => handleMouseEnter(emp, e)}
                      onMouseLeave={handleMouseLeave}
                      className="border-b border-slate-200 hover:bg-slate-100 text-sm"
                    >
                      <td className="py-2">{emp.fullName}</td>
                      <td className="py-2 text-center">{emp.dateOfBirth}</td>
                      <td className="py-2 text-center">{emp.gender}</td>
                      <td className="py-2 pl-2">{emp.email}</td>
                      <td className="py-2 text-center">{emp.phone}</td>
                      <td className="py-2 text-center">{emp.registerDate}</td>
                      <td className="flex items-center justify-between py-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(emp);
                          }}
                          className="text-blue-500 hover:text-blue-700"
                          title="Edit"
                        >
                          <FaRegEdit size={20} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(emp); // ✅ Truyền đúng object emp
                          }}
                          className="text-red-400 hover:text-red-600"
                          title="Delete"
                        >
                          <RiDeleteBin5Line size={20} />
                        </button>
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
      <div className="flex items-center fixed right-[-40px] top-[25%] justify-center w-[30%]">
        <div className="flex items-center justify-center   p-4">
          <div className="bg-white p-6 rounded-[20px] shadow-sm w-full max-w-md">
            {/* Header */}
            <div className="flex items-center space-x-2 justify-between mb-6">
              <h2 className="text-lg font-bold text-gray-800">
                Attendance Overview
              </h2>
              <button className="bg-blue-100 text-blue-600 px-3 py-1 rounded-lg text-sm font-medium flex items-center gap-1">
                <svg
                  className="w-4 h-4"
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
              </button>
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
                  key={employee.id}
                  className="flex items-center justify-between pr-6 py-2"
                >
                  <div className="flex items-center">
                    <span className="text-gray-600 font-medium mr-4 w-4">
                      {employee.idEmployee}
                    </span>
                    <div className="flex items-center">
                      <img
                        src={employee.avatar}
                        alt={employee.name}
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
      {showAddForm && <EmployeeForm />}
      {showEditForm && <EmployeeForm isEdit={true} />}
      {showDeletePopup && <DeletePopup />}
      {hoveredEmployee && (
        <EmployeeTooltip employee={hoveredEmployee} position={hoverPosition} />
      )}
    </div>
  );
};

export default EmployeeManagement;
