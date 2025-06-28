import React, { useState, useEffect } from "react";
import { FaRegEdit } from "react-icons/fa";
import { GoPlus } from "react-icons/go";
import { IoMdPersonAdd } from "react-icons/io";
import { IoCloseSharp, IoSearchOutline, IoTime } from "react-icons/io5";
import { MdPeopleAlt } from "react-icons/md";
import { RiDeleteBin5Line } from "react-icons/ri";
import {
  getUserAdmin,
  deleteUserAdmin,
  createUserAdmin,
  updateUserAdmin,
} from "../../../services/APIForAdmin/API";
import { toast } from "react-toastify";

export const UserManagement = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    FullName: "",
    DateOfBirth: "",
    Sex: "",
    Email: "",
    Password: "",
    PhoneNumber: "",
    Address: "",
    CCCD: "",
    avatar_url: "",
    CreatedAt: "",
  });
  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await getUserAdmin();

      if (response && response.users) {
        const transformedUsers = response.users.map((user, index) => ({
          id: user.UserId || index + 1,
          avatar: user.avatar_url || "/api/placeholder/40/40",
          fullName: user.FullName || "",
          identityNumber: user.CCCD || "",
          dateOfBirth: user.DateOfBirth
            ? new Date(user.DateOfBirth).toLocaleDateString("vi-VN")
            : "",
          sex: user.sex === 1 ? "Male" : user.Sex === 0 ? "Female" : "",
          email: user.Email || "",
          phone: user.PhoneNumber || "",
          address: user.Address || "",
          registerDate: user.CreatedAt
            ? new Date(user.CreatedAt).toLocaleDateString("vi-VN")
            : "",
          originalData: user,
        }));
        setUsers(transformedUsers);
      }
    } catch (error) {
      console.error("Error loading users:", error);
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleAddUser = async () => {
    try {
      setAddLoading(true);
      if (
        !formData.FullName ||
        !formData.DateOfBirth ||
        !formData.Password ||
        !formData.Sex ||
        !formData.Email ||
        !formData.PhoneNumber ||
        !formData.Address ||
        !formData.CCCD ||
        !formData.avatar_url
      ) {
        toast.error("Please fill in all required fields");
        return;
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.Email)) {
        toast.error("Please enter a valid email address");
        return;
      }
      if (formData.PhoneNumber.length < 10) {
        toast.error("Please enter a valid phone number");
        return;
      }

      const userData = {
        FullName: formData.FullName.trim(),
        DateOfBirth: formData.DateOfBirth,
        Password: formData.Password,
        Sex: parseInt(formData.Sex), // Đảm bảo Sex là number
        Email: formData.Email.trim(),
        PhoneNumber: formData.PhoneNumber.trim(),
        avatar_url: formData.avatar_url.trim() || "",
        Address: formData.Address.trim(),
        CCCD: formData.CCCD.trim(),
      };

      console.log("Sending user data:", userData);
      const response = await createUserAdmin(userData);

      if (response) {
        await loadUsers();
        setShowAddModal(false);
        resetForm();

        toast.success("User created successfully");
        console.log("User created successfully:", response);
      }
    } catch (error) {
      console.error("Error adding user:", error);
      toast.error(
        "Failed to create user: " + (error.message || "Unknown error")
      );
    } finally {
      setAddLoading(false);
    }
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setFormData({
      FullName: user.fullName,
      Password: "",
      DateOfBirth: user.originalData?.DateOfBirth
        ? user.originalData.DateOfBirth.split("T")[0]
        : user.dateOfBirth,
      Sex: user.sex === "Male" ? "1" : user.sex === "Female" ? "0" : "",
      CCCD: user.identityNumber,
      Email: user.email,
      Address: user.address,
      PhoneNumber: user.phone,
      avatar_url:
        user.avatar && user.avatar !== "/api/placeholder/40/40"
          ? user.avatar
          : "",
    });
    setShowEditModal(true);
  };

  const handleUpdateUser = async () => {
    try {
      setAddLoading(true);
      if (
        !formData.FullName ||
        !formData.DateOfBirth ||
        !formData.Sex ||
        !formData.Email ||
        !formData.PhoneNumber ||
        !formData.Address ||
        !formData.CCCD ||
        !formData.avatar_url
      ) {
        toast.error("Please fill in all required fields");
        return;
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.Email)) {
        toast.error("Please enter a valid email address");
        return;
      }

      if (formData.PhoneNumber.length < 10) {
        toast.error("Please enter a valid phone number");
        return;
      }
      const userData = {
        FullName: formData.FullName.trim(),
        DateOfBirth: formData.DateOfBirth,
        Sex: parseInt(formData.Sex),
        Email: formData.Email.trim(),
        PhoneNumber: formData.PhoneNumber.trim(),
        avatar_url: formData.avatar_url.trim() || "",
        Address: formData.Address.trim(),
        CCCD: formData.CCCD.trim(),
      };
      if (formData.Password && formData.Password.trim() !== "") {
        userData.Password = formData.Password;
      }
      const userId = selectedUser.originalData?.UserId || selectedUser.id;

      const response = await updateUserAdmin({ userId, user: userData });
      if (response) {
        await loadUsers();
        setShowEditModal(false);
        resetForm();
        toast.success("User updated successfully");
      }
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error(
        "Failed to update user: " + (error.message || "Unknown error")
      );
    } finally {
      setAddLoading(false);
    }
  };

  const handleDeleteUser = (user) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  const confirmDeleteUser = async () => {
    if (!selectedUser) return;

    try {
      setDeleteLoading(true);
      const userId = selectedUser.originalData?.UserId || selectedUser.id;
      const response = await deleteUserAdmin(userId);

      if (response !== null) {
        setUsers(users.filter((user) => user.id !== selectedUser.id));
        setShowDeleteModal(false);
        setSelectedUser(null);
        toast.success("User deleted successfully");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Failed to delete user");
    } finally {
      setDeleteLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      FullName: "",
      Password: "",
      DateOfBirth: "",
      Sex: "",
      CCCD: "",
      Email: "",
      Address: "",
      PhoneNumber: "",
      avatar_url: "",
    });
  };

  const filteredUsers = users.filter(
    (user) =>
      user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const itemsPerPage = 5;
  const totalItems = filteredUsers.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentUser = filteredUsers.slice(startIndex, endIndex);
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  if (loading) {
    return (
      <div className="p-[20px] flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
          <p className="mt-4 text-gray-600">Loading users...</p>
        </div>
      </div>
    );
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
            <div className="text-3xl font-bold text-gray-900">1200</div>
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
                    setCurrentPage(1);
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
                Add
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-md shadow-sm w-full max-w-4xl mx-auto">
            {currentUser.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-500">No users found</p>
              </div>
            ) : (
              <table className="w-full table-auto border-collapse">
                <thead>
                  <tr className="text-left text-slate-500 text-sm border-b border-slate-200">
                    <th className="py-2 text-center">Avatar</th>
                    <th className="py-2 text-center">Full Name</th>
                    <th className="py-2 text-center">Identity number</th>
                    <th className="py-2 text-center">Date of Birth</th>
                    <th className="py-2 text-center">Gender</th>
                    <th className="py-2 text-center">Email</th>
                    <th className="py-2 text-center">Address</th>
                    <th className="py-2 text-center">Phone</th>
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
                        <div className="flex justify-center">
                          {user.avatar &&
                          user.avatar !== "/api/placeholder/40/40" ? (
                            <img
                              src={user.avatar}
                              alt={user.fullName}
                              className="w-10 h-10 rounded-full object-cover"
                              onError={(e) => {
                                e.target.src = "/api/placeholder/40/40";
                              }}
                            />
                          ) : (
                            <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center">
                              <span className="text-white text-xs">
                                {user.fullName?.charAt(0)?.toUpperCase() || "U"}
                              </span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="py-2 text-center">{user.fullName}</td>
                      <td className="py-2 text-center">
                        {user.identityNumber}
                      </td>
                      <td className="py-2 text-center">{user.dateOfBirth}</td>
                      <td className="py-2 text-center">{user.sex}</td>
                      <td className="py-2 text-center max-w-[150px] break-words whitespace-pre-line">
                        {user.email}
                      </td>
                      <td className="py-2 text-center">{user.address}</td>
                      <td className="py-2 text-center">{user.phone}</td>
                      <td className="py-2 text-center">{user.registerDate}</td>
                      <td className="py-2 text-center">
                        <div className="flex items-center justify-center gap-3">
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
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Pagination */}
          {totalItems > 0 && (
            <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200">
              <div className="text-sm text-gray-700">
                Showing {startIndex + 1}-{Math.min(endIndex, totalItems)} of{" "}
                {totalItems} users
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
          )}
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
                    name="FullName"
                    value={formData.FullName}
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
                    name="DateOfBirth"
                    value={formData.DateOfBirth}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Password*
                </label>
                <input
                  type="password"
                  name="Password"
                  value={formData.Password}
                  onChange={handleInputChange}
                  placeholder="Enter password"
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Gender*
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="Sex"
                      value="1"
                      checked={formData.Sex === "1"}
                      onChange={handleInputChange}
                      className="mr-2"
                    />
                    Male
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="Sex"
                      value="0"
                      checked={formData.Sex === "0"}
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
                    name="CCCD"
                    value={formData.CCCD}
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
                    name="Email"
                    value={formData.Email}
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
                  name="Address"
                  value={formData.Address}
                  onChange={handleInputChange}
                  placeholder="Enter address"
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Phone Number*
                </label>
                <input
                  type="tel"
                  name="PhoneNumber"
                  value={formData.PhoneNumber}
                  onChange={handleInputChange}
                  placeholder="Enter phone number"
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Avatar URL
                </label>
                <input
                  type="url"
                  name="avatar_url"
                  value={formData.avatar_url}
                  onChange={handleInputChange}
                  placeholder="Enter avatar image URL"
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  resetForm();
                }}
                disabled={addLoading}
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAddUser}
                disabled={addLoading}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 flex items-center"
              >
                {addLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creating...
                  </>
                ) : (
                  "Add User"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
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
                    name="FullName"
                    value={formData.FullName}
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
                    name="DateOfBirth"
                    value={formData.DateOfBirth}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Password
                </label>
                <input
                  type="password"
                  name="Password"
                  value={formData.Password}
                  onChange={handleInputChange}
                  placeholder="Enter new password (leave blank to keep current)"
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Gender*
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="Sex"
                      value="1"
                      checked={formData.Sex === "1"}
                      onChange={handleInputChange}
                      className="mr-2"
                    />
                    Male
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="Sex"
                      value="0"
                      checked={formData.Sex === "0"}
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
                    name="CCCD"
                    value={formData.CCCD}
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
                    name="Email"
                    value={formData.Email}
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
                  name="Address"
                  value={formData.Address}
                  onChange={handleInputChange}
                  placeholder="Enter address"
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Phone Number*
                </label>
                <input
                  type="tel"
                  name="PhoneNumber"
                  value={formData.PhoneNumber}
                  onChange={handleInputChange}
                  placeholder="Enter phone number"
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Avatar URL
                </label>
                <input
                  type="url"
                  name="avatar_url"
                  value={formData.avatar_url}
                  onChange={handleInputChange}
                  placeholder="Enter avatar image URL"
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => {
                  setShowEditModal(false);
                  resetForm();
                }}
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateUser}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete User Modal */}
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
                disabled={deleteLoading}
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteUser}
                disabled={deleteLoading}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 flex items-center"
              >
                {deleteLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Deleting...
                  </>
                ) : (
                  "Delete"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
