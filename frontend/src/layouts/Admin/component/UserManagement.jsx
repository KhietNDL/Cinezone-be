import {
  ChevronLeft,
  ChevronRight,
  Edit,
  Search,
  Trash2,
  Upload,
  UserPlus,
} from "lucide-react";
import React, { useState } from "react";
import { FaRegEdit } from "react-icons/fa";
import { GoPlus } from "react-icons/go";
import { IoMdPersonAdd } from "react-icons/io";
import { IoCloseSharp, IoSearchOutline, IoTime } from "react-icons/io5";
import { MdPeopleAlt } from "react-icons/md";
import { RiDeleteBin5Line } from "react-icons/ri";

export const UserManagement = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const [users, setUsers] = useState([
    {
      id: 1,
      avatar: "/api/placeholder/40/40",
      fullName: "john.doe",
      identityNumber: "123456789000",
      dateOfBirth: "18/5/1990",
      gender: "Male",
      email: "john.doe@email.com",
      phone: "0283701854",
      score: "100đ",
      registerDate: "18/4/2022",
    },
    {
      id: 2,
      avatar: "/api/placeholder/40/40",
      fullName: "sara.connor",
      identityNumber: "123456789000",
      dateOfBirth: "30/10/1987",
      gender: "Female",
      email: "sara.connor@email.com",
      phone: "0561028068",
      score: "50đ",
      registerDate: "12/1/2023",
    },
    {
      id: 3,
      avatar: "/api/placeholder/40/40",
      fullName: "alex.lee",
      identityNumber: "123456789000",
      dateOfBirth: "21/3/1995",
      gender: "Male",
      email: "alex.lee@email.com",
      phone: "0510010015",
      score: "200đ",
      registerDate: "1/5/2023",
    },
    {
      id: 4,
      avatar: "/api/placeholder/40/40",
      fullName: "emma.watson",
      identityNumber: "123456789000",
      dateOfBirth: "15/8/1992",
      gender: "Female",
      email: "emma.watson@email.com",
      phone: "0910001200",
      score: "500đ",
      registerDate: "22/10/2021",
    },
    {
      id: 5,
      avatar: "/api/placeholder/40/40",
      fullName: "james.smith",
      identityNumber: "123456789000",
      dateOfBirth: "21/3/1995",
      gender: "Male",
      email: "james.smith@email.com",
      phone: "0568000268",
      score: "10đ",
      registerDate: "1/5/2023",
    },
  ]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const [formData, setFormData] = useState({
    fullName: "",
    password: "",
    confirmPassword: "",
    dateOfBirth: "",
    gender: "",
    identityCard: "",
    email: "",
    address: "",
    phoneNumber: "",
    image: null,
  });

  const handleAddUser = () => {
    const newUser = {
      id: users.length + 1,
      avatar: "/api/placeholder/40/40",
      fullName: formData.fullName,
      identityNumber: formData.identityCard,
      dateOfBirth: formData.dateOfBirth,
      gender: formData.gender,
      email: formData.email,
      phone: formData.phoneNumber,
      score: "0đ",
      registerDate: new Date().toLocaleDateString("vi-VN"),
    };

    setUsers([...users, newUser]);
    setShowAddModal(false);
    resetForm();
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setFormData({
      fullName: user.fullName,
      password: "",
      confirmPassword: "",
      dateOfBirth: user.dateOfBirth,
      gender: user.gender,
      identityCard: user.identityNumber,
      email: user.email,
      address: "",
      phoneNumber: user.phone,
      image: null,
    });
    setShowEditModal(true);
  };

  const handleUpdateUser = () => {
    setUsers(
      users.map((user) =>
        user.id === selectedUser.id
          ? {
              ...user,
              fullName: formData.fullName,
              dateOfBirth: formData.dateOfBirth,
              gender: formData.gender,
              identityNumber: formData.identityCard,
              email: formData.email,
              phone: formData.phoneNumber,
            }
          : user
      )
    );
    setShowEditModal(false);
    resetForm();
  };

  const handleDeleteUser = (user) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  const confirmDeleteUser = () => {
    setUsers(users.filter((user) => user.id !== selectedUser.id));
    setShowDeleteModal(false);
    setSelectedUser(null);
  };

  const resetForm = () => {
    setFormData({
      fullName: "",
      password: "",
      confirmPassword: "",
      dateOfBirth: "",
      gender: "",
      identityCard: "",
      email: "",
      address: "",
      phoneNumber: "",
      image: null,
    });
  };
  const filteredUsers = users.filter(
    (user) =>
      user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const itemsPerPage = 5;
  // Calculate pagination
  const totalItems = filteredUsers.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentUser = filteredUsers.slice(startIndex, endIndex);
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="flex items-center h-full justify-between">
      <div className="w-[90%] space-y-4">
        {/* Stats Cards */}
        <div className="flex items-center justify-between w-full">
          <div className="bg-white rounded-md p-3 w-[23%] shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-slate-500">Total User</p>
              <div className="p-2 bg-sky-100 rounded-full">
                <MdPeopleAlt size={20} className="text-blue-500" />
              </div>
            </div>
            <div className="text-[19px] font-bold text-gray-900">1200</div>
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
        {/* User Table */}
        <div className="w-full py-3 space-y-4">
          <div className="flex items-center justify-between">
            <div className="w-full">
              <div className="flex items-center p-1 px-2 w-2/4 rounded-xl bg-white shadow-sm">
                <div className="shrink-0">
                  <IoSearchOutline size={20} />
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                  }}
                  className="p-2 focus:outline-none w-full"
                  placeholder="Search by name or email"
                />
              </div>
            </div>
            <div className="flex items-center justify-between gap-2">
              <div
                role="button"
                onClick={() => setShowAddModal(true)}
                className="flex items-center text-[#6051F3] hover:bg-slate-50 p-2 rounded-md active:bg-slate-100 bg-white shadow-sm"
              >
                <GoPlus size={20} className="mr-2" />
                User
              </div>
            </div>
          </div>
          <div className="bg-white min-h-[340px] max-h-[340px] p-4 rounded-md shadow-sm">
            <table className="w-full table-auto border-collapse">
              <thead>
                <tr className="text-left text-slate-500 text-sm border-b border-slate-200">
                  <th className="py-2 text-center">Avatar</th>
                  <th className="py-2 text-center">Full Name</th>
                  <th className="py-2 text-center">Identity number</th>
                  <th className="py-2 text-center">Date of Birth</th>
                  <th className="py-2 text-center">Gender</th>
                  <th className="py-2 text-center">Email</th>
                  <th className="py-2 text-center">Phone</th>
                  <th className="py-2 text-center">Score</th>
                  <th className="py-2 text-center">Register Date</th>
                  <th className="py-2 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentUser.map((user) => (
                  <tr
                    key={user.id}
                    role="button"
                    className="border-b border-slate-200 hover:bg-slate-100 text-sm"
                  >
                    <td className="py-2 text-center">
                      <div className="w-10 h-10 bg-gray-600 rounded-full"></div>
                    </td>
                    <td className="py-2 text-center">{user.fullName}</td>
                    <td className="py-2 text-center">{user.identityNumber}</td>
                    <td className="py-2 text-center">{user.dateOfBirth}</td>
                    <td className="py-2 text-center">{user.gender}</td>
                    <td className="py-2 text-center">{user.email}</td>
                    <td className="py-2 text-center">{user.phone}</td>
                    <td className="py-2 text-center">{user.score}</td>
                    <td className="py-2 text-center">{user.registerDate}</td>
                    <td className="flex items-center justify-between py-2">
                      <div
                        role="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditUser(user);
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
                          handleDeleteUser(user);
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
          {/* Pagination */}
          <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200">
            <div className="text-sm text-gray-700">
              Showing {startIndex + 1}-{Math.min(endIndex, totalItems)} of{" "}
              {totalItems} promotions
            </div>
            <div className="flex items-center justify-end space-x-2 pt-4">
              <div
                role="button"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className={`px-3 py-1 text-sm cursor-pointer ${
                  currentPage === 1
                    ? "text-gray-300 cursor-not-allowed"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Previous
              </div>
              {pageNumbers.map((page) => (
                <div
                  role="button"
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-1 text-sm rounded cursor-pointer ${
                    currentPage === page
                      ? "bg-blue-500 text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {page}
                </div>
              ))}
              <div
                role="button"
                onClick={() =>
                  setCurrentPage(Math.min(totalPages, currentPage + 1))
                }
                disabled={currentPage === totalPages}
                className={`px-3 py-1 text-sm cursor-pointer ${
                  currentPage === totalPages
                    ? "text-gray-300 cursor-not-allowed"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Next
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white text-black rounded-lg p-6 w-96 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Add New User</h2>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Full Name*
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="Enter account"
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Password*
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Enter password"
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Confirm Password*
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Re-enter password"
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Full Name*
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="Enter full name"
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Date of Birth*
                  </label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Gender*
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="gender"
                      value="Male"
                      checked={formData.gender === "Male"}
                      onChange={handleInputChange}
                      className="mr-2"
                    />
                    Male
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="gender"
                      value="Female"
                      checked={formData.gender === "Female"}
                      onChange={handleInputChange}
                      className="mr-2"
                    />
                    Female
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Identity Card*
                  </label>
                  <input
                    type="text"
                    name="identityCard"
                    value={formData.identityCard}
                    onChange={handleInputChange}
                    placeholder="Enter identity card number"
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Email*
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter email address"
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Address*
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Enter address"
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Phone Number*
                  </label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    placeholder="Enter phone number"
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Image
                  </label>
                  <div className="border border-gray-300 rounded px-3 py-2 text-center">
                    <button className="text-blue-600 hover:text-blue-800">
                      <Upload className="w-4 h-4 inline mr-1" />
                      Choose file
                    </button>
                    <span className="text-gray-500 ml-2">No file chosen</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
              >
                Back
              </button>
              <button
                onClick={handleAddUser}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white text-black rounded-lg p-6 w-96 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Edit User</h2>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Full Name*
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="Enter account"
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Password*
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Enter password"
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Confirm Password*
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Re-enter password"
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Full Name*
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="Enter full name"
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Date of Birth*
                  </label>
                  <input
                    type="text"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                    placeholder="mm/dd/yyyy"
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Gender*
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="gender"
                      value="Male"
                      checked={formData.gender === "Male"}
                      onChange={handleInputChange}
                      className="mr-2"
                    />
                    Male
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="gender"
                      value="Female"
                      checked={formData.gender === "Female"}
                      onChange={handleInputChange}
                      className="mr-2"
                    />
                    Female
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Identity Card*
                  </label>
                  <input
                    type="text"
                    name="identityCard"
                    value={formData.identityCard}
                    onChange={handleInputChange}
                    placeholder="Enter identity card number"
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Email*
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter email address"
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Address*
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Enter address"
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Phone Number*
                  </label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    placeholder="Enter phone number"
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Image
                  </label>
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                    <button className="text-blue-600 hover:text-blue-800 text-sm">
                      Choose file
                    </button>
                    <span className="text-gray-500 text-sm">
                      No file chosen
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
              >
                Back
              </button>
              <button
                onClick={handleUpdateUser}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white text-black rounded-lg p-6 w-96">
            <h2 className="text-xl font-bold mb-4 text-red-600">Delete User</h2>
            <p className="mb-6">
              Are you sure you want to delete user{" "}
              <strong>{selectedUser?.fullName}</strong>? This action cannot be
              undone.
            </p>
            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteUser}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
