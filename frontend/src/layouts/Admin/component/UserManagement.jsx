import React, { useState, useEffect, useRef } from "react";
import { FaRegEdit } from "react-icons/fa";
import { GoPlus } from "react-icons/go";
import { IoMdPersonAdd } from "react-icons/io";
import { IoCloseSharp, IoSearchOutline, IoTime } from "react-icons/io5";
import { MdPeopleAlt } from "react-icons/md";
import { RiDeleteBin5Line } from "react-icons/ri";
// Import các API mới
import {
  getAllUsers,
  createUser,
  editUser,
  deleteUser,
  searchUserByName,
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
  const [allUsers, setAllUsers] = useState([]); // Thêm state này

  // Separate states for each field
  const [fullName, setFullName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [sex, setSex] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [cccd, setCCCD] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [createdAt, setCreatedAt] = useState("");

  const resetForm = () => {
    setFullName("");
    setDateOfBirth("");
    setSex("");
    setEmail("");
    setPassword("");
    setPhoneNumber("");
    setAddress("");
    setCCCD("");
    setAvatarUrl("");
    setAvatarFile(null);
    setCreatedAt("");
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const res = await getAllUsers();
      if (res.users) {
        setUsers(res.users);
        setAllUsers(res.users);
      }
    } catch (error) {
      console.error("Load users error:", error);
      toast.error("Failed to load users");
      setUsers([]);
      setAllUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const searchTimeout = useRef();
  useEffect(() => {
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => {
      if (searchTerm.trim() === "") {
        setUsers(allUsers);
      } else {
        handleSearchUser(searchTerm.trim());
      }
    }, 400);
    return () => clearTimeout(searchTimeout.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, allUsers]);

  const handleSearchUser = async (keyword) => {
    try {
      const res = await searchUserByName(keyword);
      if (res.users) {
        setUsers(res.users);
      }
    } catch (error) {
      console.error("Search error:", error);
      toast.error("Failed to search users");
      setUsers([]);
    }
  };
  const formatDateToYYYYMMDD = (dateStr) => {
    if (!dateStr) return "";
    if (dateStr.includes("-")) return dateStr.replace(/-/g, "/");
    if (dateStr.includes("/")) {
      const parts = dateStr.split("/");
      if (parts[2]?.length === 4) {
        return `${parts[2]}/${parts[1]}/${parts[0]}`;
      }
    }
    return dateStr;
  };

  const handleAddUser = async () => {
    try {
      setAddLoading(true);
      if (
        !fullName ||
        !dateOfBirth ||
        !password ||
        !sex ||
        !email ||
        !phoneNumber ||
        !address ||
        !cccd ||
        !avatarUrl
      ) {
        toast.error("Please fill in all required fields");
        return;
      }
      const dob = formatDateToYYYYMMDD(dateOfBirth);
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        toast.error("Please enter a valid email address");
        return;
      }
      if (phoneNumber.length < 10) {
        toast.error("Please enter a valid phone number");
        return;
      }
      const formData = new FormData();
      formData.append("fullName", fullName.trim());
      formData.append("dateOfBirth", dob);
      formData.append("password", password);
      formData.append("sex", parseInt(sex));
      formData.append("email", email.trim());
      formData.append("phoneNumber", phoneNumber.trim());
      formData.append("address", address.trim());
      formData.append("cccd", cccd.trim());
      if (avatarFile) {
        formData.append("avatar", avatarFile); // Truyền file gốc
      }
      const response = await createUser(formData);
      if (response) {
        await loadUsers();
        setShowAddModal(false);
        resetForm();
        toast.success("User created successfully");
      }
    } catch (error) {
      toast.error(
        "Failed to create user: " + (error.message || "Unknown error")
      );
    } finally {
      setAddLoading(false);
    }
  };

  const handleUpdateUser = async () => {
    if (!selectedUser) return;
    try {
      setAddLoading(true);
      const dob = formatDateToYYYYMMDD(dateOfBirth);
      const formData = new FormData();
      formData.append("fullName", fullName.trim());
      formData.append("dateOfBirth", dob);
      if (password) formData.append("password", password);
      formData.append("sex", parseInt(sex));
      formData.append("email", email.trim());
      formData.append("phoneNumber", phoneNumber.trim());
      formData.append("address", address.trim());
      formData.append("cccd", cccd.trim());
      if (avatarUrl instanceof File) {
        formData.append("avatar", avatarUrl);
      }
      await editUser(selectedUser.UserId, formData);
      await loadUsers();
      setShowEditModal(false);
      resetForm();
      toast.success("User updated successfully");
    } catch (error) {
      toast.error(
        "Failed to update user: " + (error.message || "Unknown error")
      );
    } finally {
      setAddLoading(false);
    }
  };

  const confirmDeleteUser = async () => {
    if (!selectedUser) return;
    try {
      setDeleteLoading(true);
      await deleteUser(selectedUser.UserId);
      setUsers(users.filter((user) => user.UserId !== selectedUser.UserId));
      setShowDeleteModal(false);
      setSelectedUser(null);
      toast.success("User deleted successfully");
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete user");
    } finally {
      setDeleteLoading(false);
    }
  };

  const itemsPerPage = 5;
  const totalItems = users.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentUser = users.slice(startIndex, endIndex);
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }
  if (addLoading || deleteLoading || loading) {
    return (
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999]">
        <div className="bg-white rounded-lg p-6 flex flex-col items-center shadow-xl">
          <svg
            className="animate-spin h-8 w-8 text-indigo-600 mb-4"
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
          <div className="font-semibold text-lg text-indigo-700">
            {addLoading
              ? showEditModal
                ? "Updating user, please wait..."
                : "Adding user, please wait..."
              : deleteLoading
              ? "Deleting user, please wait..."
              : "Loading users, please wait..."}
          </div>
        </div>
      </div>
    );
  }

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setFullName(user.FullName || "");
    let dob = "";
    if (user.DateOfBirth) {
      if (user.DateOfBirth.includes("/")) {
        const [day, month, year] = user.DateOfBirth.split("/");
        dob = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
      } else {
        // ISO string
        dob = user.DateOfBirth.slice(0, 10);
      }
    }
    setDateOfBirth(dob);
    let gender = "";
    if (user.originalData?.Sex !== undefined) {
      gender = String(user.originalData.Sex);
    } else if (user.Sex === 1 || user.Sex === "1" || user.Sex === "Male") {
      gender = "1";
    } else if (user.Sex === 2 || user.Sex === "2" || user.Sex === "Female") {
      gender = "2";
    }
    setSex(gender);

    setEmail(user.Email || "");
    setPassword("");
    setPhoneNumber(user.PhoneNumber || "");
    setAddress(user.Address || "");
    setCCCD(user.CCCD || "");
    setAvatarUrl(user.avatar_url || "");
    setCreatedAt(
      user.originalData?.CreatedAt
        ? new Date(user.originalData.CreatedAt).toLocaleDateString("en-GB")
        : ""
    );
    setShowEditModal(true);
  };

  const handleDeleteUser = (user) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };
  const formatDate = (dateString) =>
    dateString ? dateString.split("T")[0] : "";

  return (
    <div className="flex items-center h-full justify-between">
      <div className="w-[90%] space-y-4 h-[calc(100vh_-_7rem)] movie-management-page">
        {/* Stats Cards */}
        <div className="flex items-center justify-between w-full">
          <div className="bg-white rounded-md p-3 w-[23%] shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-slate-500">Total User</p>
              <div className="p-2 bg-sky-100 rounded-full">
                <MdPeopleAlt size={20} className="text-blue-500" />
              </div>
            </div>
            <div className="font-bold text-[19px]">1200</div>
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
        <div className="w-full  py-3 space-y-4">
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
            <div className="flex shrink-0 items-center justify-between gap-2">
              <div
                role="button"
                onClick={() => setShowAddModal(true)}
                className="flex items-center text-[#6051F3] hover:bg-slate-50 p-2 rounded-md active:bg-slate-100 bg-white shadow-sm"
              >
                <GoPlus size={20} className="mr-2" />
                Add User
              </div>
            </div>
          </div>

          <div className="bg-white min-h-[340px] max-h-[340px] p-4 rounded-md shadow-sm overflow-x-auto">
            <table className="w-full table-auto border-collapse">
              <thead>
                <tr className="text-left text-slate-500 text-sm border-b border-slate-200">
                  <th className="py-2 pl-4 text-center pr-4 w-[100px] shrink-0">
                    Avatar
                  </th>
                  <th className="py-2 cursor-pointer w-[200px] shrink-0 items-center gap-1">
                    Full Name
                  </th>

                  <th className="py-2 text-center cursor-pointer w-[100px] shrink-0">
                    Date of Birth
                  </th>
                  <th className="py-2 text-center cursor-pointer w-[100px] shrink-0">
                    Gender
                  </th>
                  <th className="py-2 text-center cursor-pointer w-[200px] shrink-0">
                    Email
                  </th>

                  <th className="py-2 text-center cursor-pointer w-[100px] shrink-0">
                    Phone
                  </th>

                  <th className="py-2 text-center cursor-pointer w-[100px] shrink-0">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentUser.map((user) => (
                  <tr
                    key={user.UserId}
                    role="button"
                    className="border-b cursor-pointer border-slate-200 hover:bg-slate-100 text-sm"
                  >
                    <td className="py-2 text-center w-[100px] shrink-0">
                      <div className="flex justify-center">
                        <img
                          src={user.avatar_url}
                          alt={user.FullName}
                          loading="lazy"
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      </div>
                    </td>
                    <td className="py-2 w-[200px] shrink-0">{user.FullName}</td>
                    <td className="py-2 text-center pr-4 w-[100px] shrink-0">
                      {formatDate(user.DateOfBirth)}
                    </td>
                    <td className="py-2 text-center pr-4 w-[100px] shrink-0">
                      {user.Sex === 1 || user.Sex === "1" || user.Sex === "Male"
                        ? "Male"
                        : user.Sex === 2 ||
                          user.Sex === "2" ||
                          user.Sex === "Female"
                        ? "Female"
                        : ""}
                    </td>
                    <td className="py-2 text-center pr-4 w-[200px] shrink-0">
                      {user.Email && user.Email.length > 30
                        ? user.Email.slice(0, 30) + "..."
                        : user.Email}
                    </td>
                    <td className="py-2 text-center w-[100px] shrink-0">
                      {user.PhoneNumber}
                    </td>

                    <td className="py-2 text-center w-[100px] shrink-0">
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
          </div>

          {/* Pagination */}
          {totalItems > 0 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
              <div className="text-sm text-gray-700">
                Showing {startIndex + 1}-{Math.min(endIndex, totalItems)} of{" "}
                {totalItems} users
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(1, prev - 1))
                  }
                  disabled={currentPage === 1}
                  className={`px-3 py-1 rounded border text-sm font-medium ${
                    currentPage === 1
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-white text-gray-700 hover:bg-blue-50 border-gray-300"
                  }`}
                >
                  Previous
                </button>
                {pageNumbers.map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-1 rounded border text-sm font-medium ${
                      currentPage === page
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-white text-gray-700 hover:bg-blue-50 border-gray-300"
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                  }
                  disabled={currentPage === totalPages}
                  className={`px-3 py-1 rounded border text-sm font-medium ${
                    currentPage === totalPages
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-white text-gray-700 hover:bg-blue-50 border-gray-300"
                  }`}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit User Modal */}
      {(showAddModal || showEditModal) && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-xl max-h-[95vh] overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">
                    {showEditModal ? "Edit User" : "Add New User"}
                  </h2>
                  <p className="text-blue-100 text-sm mt-1">
                    {showEditModal
                      ? "Update the details below to edit the user"
                      : "Fill in the details below to add a user"}
                  </p>
                </div>
                <button
                  onClick={() => {
                    if (showAddModal) setShowAddModal(false);
                    if (showEditModal) setShowEditModal(false);
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
            {/* Form */}
            <div className="p-6 overflow-y-auto max-h-[calc(95vh-170px)]">
              <div className="space-y-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <svg
                      className="w-5 h-5 mr-2 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2h4a1 1 0 110 2h-1v12a2 2 0 01-2 2H6a2 2 0 01-2-2V6H3a1 1 0 110-2h4z"
                      />
                    </svg>
                    User Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Enter full name"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Date of Birth <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        value={dateOfBirth}
                        onChange={(e) => setDateOfBirth(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Gender <span className="text-red-500">*</span>
                      </label>
                      <div className="flex gap-4 mt-2">
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="Sex"
                            value="1"
                            checked={sex === "1"}
                            onChange={(e) => setSex(e.target.value)}
                            className="mr-2"
                          />
                          Male
                        </label>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="Sex"
                            value="2"
                            checked={sex === "2"}
                            onChange={(e) => setSex(e.target.value)}
                            className="mr-2"
                          />
                          Female
                        </label>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Identity Card <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={cccd}
                        onChange={(e) => setCCCD(e.target.value)}
                        placeholder="Enter identity card number"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter email address"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Phone Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="Enter phone number"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Enter address"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </div>
                    {/* Avatar Upload & Preview */}
                    <div className="flex flex-col items-center justify-center gap-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-2 w-full">
                        Avatar
                      </label>
                      <div className="w-full flex flex-col items-center">
                        <div className="relative w-24 h-24 rounded-full border border-gray-300 bg-white flex items-center justify-center overflow-hidden mb-2">
                          {avatarUrl ? (
                            <img
                              src={avatarUrl}
                              alt="Avatar"
                              className="object-cover w-full h-full"
                              onError={(e) =>
                                (e.target.src = "/api/placeholder/40/40")
                              }
                            />
                          ) : (
                            <span className="text-gray-400">No Image</span>
                          )}
                          {avatarUrl && (
                            <button
                              type="button"
                              onClick={() => setAvatarUrl("")}
                              className="absolute top-1 right-1 bg-white rounded-full p-1 shadow hover:bg-red-100 transition"
                              title="Remove image"
                            >
                              <svg
                                className="w-4 h-4 text-red-500"
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
                          )}
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          id="avatar-upload"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) {
                              setAvatarFile(file);
                              const reader = new FileReader();
                              reader.onload = (ev) =>
                                setAvatarUrl(ev.target.result);
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                        <label
                          htmlFor="avatar-upload"
                          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded cursor-pointer hover:bg-blue-600 transition"
                        >
                          Upload Image
                        </label>
                        {avatarUrl && (
                          <button
                            type="button"
                            onClick={() => setAvatarUrl("")}
                            className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
                          >
                            Remove Image
                          </button>
                        )}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Password
                        {showEditModal ? "" : " "}
                      </label>
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder={
                          showEditModal
                            ? "Enter new password (leave blank to keep current)"
                            : "Enter password"
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Footer */}
            <div className="bg-gray-50 px-6 py-4 border-slate-300 border-t flex justify-end space-x-3">
              <button
                onClick={() => {
                  if (showAddModal) setShowAddModal(false);
                  if (showEditModal) setShowEditModal(false);
                  resetForm();
                }}
                className="px-6 py-3 text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                disabled={loading}
                onClick={showEditModal ? handleUpdateUser : handleAddUser}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg font-medium transition-all shadow-md hover:shadow-lg flex items-center"
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5 mr-2 text-white"
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
                    {showEditModal ? "Updating..." : "Creating..."}
                  </>
                ) : showEditModal ? (
                  "Update"
                ) : (
                  "Add User"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete User Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
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
