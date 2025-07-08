import React, { useState, useEffect, useRef } from "react";
import { FaRegEdit } from "react-icons/fa";
import { GoPlus } from "react-icons/go";
import {
  IoEyeOutline,
  IoSearchOutline,
  IoTime,
  IoCloseSharp,
} from "react-icons/io5";
import { MdPeopleAlt } from "react-icons/md";
import { RiDeleteBin5Line } from "react-icons/ri";
import {
  getAllUsers,
  createUser,
  editUser,
  deleteUser,
  searchUserByName,
} from "../../../services/APIForAdmin/API";
import { toast } from "react-toastify";
import { IoMdPersonAdd } from "react-icons/io";

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
  const [allUsers, setAllUsers] = useState([]);

  // Form states
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

  const formatDate = (dateString) =>
    dateString ? dateString.split("T")[0] : "";

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
        !cccd
      ) {
        toast.error("Please fill in all required fields");
        return;
      }
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
      formData.append("dateOfBirth", formatDateToYYYYMMDD(dateOfBirth));
      formData.append("password", password);
      formData.append("sex", parseInt(sex));
      formData.append("email", email.trim());
      formData.append("phoneNumber", phoneNumber.trim());
      formData.append("address", address.trim());
      formData.append("cccd", cccd.trim());
      if (avatarFile) {
        formData.append("avatar", avatarFile);
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
      const formData = new FormData();
      formData.append("fullName", fullName.trim());
      formData.append("dateOfBirth", formatDateToYYYYMMDD(dateOfBirth));
      if (password) formData.append("password", password);
      formData.append("sex", parseInt(sex));
      formData.append("email", email.trim());
      formData.append("phoneNumber", phoneNumber.trim());
      formData.append("address", address.trim());
      formData.append("cccd", cccd.trim());
      if (avatarFile) {
        formData.append("avatar", avatarFile);
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

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setFullName(user.FullName || "");
    let dob = "";
    if (user.DateOfBirth) {
      if (user.DateOfBirth.includes("/")) {
        const [day, month, year] = user.DateOfBirth.split("/");
        dob = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
      } else {
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
    setAvatarFile(null);
    setShowEditModal(true);
  };

  const handleDeleteUser = (user) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  const itemsPerPage = 5;
  const totalItems = users.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentUsers = users.slice(startIndex, endIndex);

  const renderPaginationButtons = () => {
    const maxVisibleButtons = window.innerWidth < 640 ? 3 : 5;
    const halfVisible = Math.floor(maxVisibleButtons / 2);
    let startPage = Math.max(1, currentPage - halfVisible);
    let endPage = Math.min(totalPages, currentPage + halfVisible);

    if (currentPage <= halfVisible) {
      endPage = Math.min(maxVisibleButtons, totalPages);
    }
    if (currentPage + halfVisible >= totalPages) {
      startPage = Math.max(1, totalPages - maxVisibleButtons + 1);
    }

    const pages = [];
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={`page-${i}`}
          onClick={() => setCurrentPage(i)}
          className={`px-2 sm:px-3 py-1 sm:py-2 rounded-lg text-sm sm:text-base font-medium transition-colors ${
            currentPage === i
              ? "bg-indigo-600 text-white shadow-sm"
              : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 shadow-sm"
          }`}
          aria-label={`Page ${i}`}
          aria-current={currentPage === i ? "true" : undefined}
        >
          {i}
        </button>
      );
    }

    if (startPage > 1) {
      pages.unshift(
        <span
          key="ellipsis-start"
          className="px-2 sm:px-3 py-1 sm:py-2 text-gray-500 text-sm sm:text-base"
        >
          ...
        </span>
      );
      pages.unshift(
        <button
          key="page-1"
          onClick={() => setCurrentPage(1)}
          className={`px-2 sm:px-3 py-1 sm:py-2 rounded-lg text-sm sm:text-base font-medium transition-colors ${
            currentPage === 1
              ? "bg-indigo-600 text-white shadow-sm"
              : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 shadow-sm"
          }`}
          aria-label="Page 1"
        >
          1
        </button>
      );
    }
    if (endPage < totalPages) {
      pages.push(
        <span
          key="ellipsis-end"
          className="px-2 sm:px-3 py-1 sm:py-2 text-gray-500 text-sm sm:text-base"
        >
          ...
        </span>
      );
      pages.push(
        <button
          key={`page-${totalPages}`}
          onClick={() => setCurrentPage(totalPages)}
          className={`px-2 sm:px-3 py-1 sm:py-2 rounded-lg text-sm sm:text-base font-medium transition-colors ${
            currentPage === totalPages
              ? "bg-indigo-600 text-white shadow-sm"
              : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 shadow-sm"
          }`}
          aria-label={`Page ${totalPages}`}
        >
          {totalPages}
        </button>
      );
    }

    return pages.length > 0 ? (
      pages
    ) : (
      <span className="text-gray-500 text-sm">No pages to display</span>
    );
  };

  if (addLoading || deleteLoading || loading) {
    return (
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

  return (
    <div className="h-full">
      <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
        <div className="w-[90%] md:w-[95%] lg:w-[95%] max-w-7xl space-y-4">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 lg:gap-4 w-full">
            <div className="bg-white rounded-lg p-2 sm:p-3 flex-1 shadow-sm">
              <div className="flex items-center justify-between">
                <p className="text-slate-500 text-sm sm:text-base">
                  Total Users
                </p>
                <div className="p-1 sm:p-2 bg-sky-100 rounded-lg flex items-center justify-center">
                  <MdPeopleAlt size={20} className="text-blue-500" />
                </div>
              </div>
              <p className="font-bold text-base sm:text-[19px]">
                {users.length}
              </p>
            </div>
            <div className="bg-white rounded-lg p-2 sm:p-3 flex-1 shadow-sm">
              <div className="flex items-center justify-between">
                <p className="text-slate-500 text-sm sm:text-base">On Leave</p>
                <div className="p-1 sm:p-2 bg-rose-50 rounded-lg flex items-center justify-center">
                  <IoTime size={20} className="text-red-500" />
                </div>
              </div>
              <p className="font-bold text-base sm:text-[19px]">25,340</p>
            </div>
            <div className="bg-white rounded-lg p-2 sm:p-3 flex-1 shadow-sm">
              <div className="flex items-center justify-between">
                <p className="text-slate-500 text-sm sm:text-base">New Hires</p>
                <div className="p-1 sm:p-2 bg-sky-100 rounded-lg flex items-center justify-center">
                  <IoMdPersonAdd size={20} className="text-blue-500" />
                </div>
              </div>
              <p className="font-bold text-base sm:text-[19px]">25,340</p>
            </div>
            <div className="bg-white rounded-lg p-2 sm:p-3 flex-1 shadow-sm">
              <div className="flex items-center justify-between">
                <p className="text-slate-500 text-sm sm:text-base">Resigned</p>
                <div className="p-1 sm:p-2 bg-rose-50 rounded-lg flex items-center justify-center">
                  <IoCloseSharp size={20} className="text-red-500" />
                </div>
              </div>
              <p className="font-bold text-base sm:text-[19px]">25,340</p>
            </div>
          </div>

          {/* Search and Add */}
          <div className="flex flex-col sm:flex-row items-center justify-between mb-4 gap-2 w-full">
            <div className="flex items-center p-1 px-2 w-full max-w-[400px] rounded-lg bg-white shadow-sm">
              <IoSearchOutline size={20} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="p-1 sm:p-2 focus:outline-none w-full text-sm sm:text-base"
                placeholder="Search by name or email"
              />
            </div>
            {!showEditModal && (
              <button
                onClick={() => {
                  resetForm();
                  setShowAddModal(true);
                }}
                className="flex items-center text-indigo-600 hover:bg-gray-50 p-2 rounded-lg active:bg-gray-100 bg-white shadow-sm w-full sm:w-auto text-sm sm:text-base"
              >
                <GoPlus size={18} className="mr-1 sm:mr-2" />
                Add User
              </button>
            )}
          </div>

          {/* Table and Card Layout */}
          <div className="bg-white p-2 sm:p-3 md:p-4 rounded-lg shadow-sm">
            {/* Table Layout for sm and above */}
            <div className="hidden sm:block">
              <table className="w-full table-auto border-collapse">
                <thead>
                  <tr className="text-left text-slate-500 text-xs sm:text-sm border-b border-gray-200">
                    <th className="py-2 px-2 sm:px-4 w-[60px] sm:w-[80px] shrink-0 text-center">
                      Avatar
                    </th>
                    <th className="py-2 px-2 sm:px-4 w-[150px] sm:w-[180px] md:w-[200px] shrink-0">
                      Full Name
                    </th>
                    <th className="py-2 px-2 sm:px-4 w-[100px] sm:w-[120px] shrink-0 text-center hidden xl:table-cell">
                      DOB
                    </th>
                    <th className="py-2 px-2 sm:px-4 w-[80px] sm:w-[100px] shrink-0 text-center hidden xl:table-cell">
                      Gender
                    </th>
                    <th className="py-2 px-2 sm:px-4 w-[150px] sm:w-[180px] md:w-[200px] shrink-0 text-center hidden md:table-cell">
                      Email
                    </th>
                    <th className="py-2 px-2 sm:px-4 w-[100px] sm:w-[120px] shrink-0 text-center">
                      Phone
                    </th>
                    <th className="py-2 px-2 sm:px-4 w-[80px] shrink-0 text-center">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentUsers.map((user) => (
                    <tr
                      key={user.UserId}
                      onClick={() => handleEditUser(user)}
                      className="border-b cursor-pointer border-gray-200 hover:bg-gray-50 text-xs sm:text-sm transition-colors"
                    >
                      <td className="py-2 px-2 sm:px-4 w-[60px] sm:w-[80px] shrink-0 text-center">
                        <img
                          src={user.avatar_url || "/default-avatar.png"}
                          alt={user.FullName || "Avatar"}
                          loading="lazy"
                          className="w-8 sm:w-10 h-8 sm:h-10 rounded-full object-cover mx-auto"
                        />
                      </td>
                      <td className="py-2 px-2 sm:px-4 w-[150px] sm:w-[180px] md:w-[200px] shrink-0">
                        <span className="block ">
                          {user.FullName?.length > 20 ? (
                            <span title={user.FullName}>
                              {user.FullName.slice(0, 20) + "..."}
                            </span>
                          ) : (
                            user.FullName || "N/A"
                          )}
                        </span>
                      </td>
                      <td className="py-2 px-2 sm:px-4 w-[100px] sm:w-[120px] shrink-0 text-center hidden xl:table-cell">
                        {formatDate(user.DateOfBirth)}
                      </td>
                      <td className="py-2 px-2 sm:px-4 w-[80px] sm:w-[100px] shrink-0 text-center hidden xl:table-cell">
                        {user.Sex === 1 ||
                        user.Sex === "1" ||
                        user.Sex === "Male"
                          ? "Male"
                          : user.Sex === 2 ||
                            user.Sex === "2" ||
                            user.Sex === "Female"
                          ? "Female"
                          : "Other"}
                      </td>
                      <td className="py-2 px-2 sm:px-4 w-[150px] sm:w-[180px] md:w-[200px] shrink-0 text-center hidden md:table-cell">
                        <span className="block text-center">
                          {user.Email?.length > 20 ? (
                            <span title={user.Email}>
                              {user.Email.slice(0, 20) + "..."}
                            </span>
                          ) : (
                            user.Email || "N/A"
                          )}
                        </span>
                      </td>
                      <td className="py-2 px-2 sm:px-4 w-[100px] sm:w-[120px] shrink-0 text-center">
                        {user.PhoneNumber || "N/A"}
                      </td>
                      <td className="py-2 px-2 sm:px-4 w-[80px] shrink-0 text-center">
                        <div className="flex justify-center space-x-2 sm:space-x-3">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditUser(user);
                            }}
                            className="text-blue-500 hover:text-blue-700 p-1 sm:p-2"
                            title="Edit"
                            aria-label={`Edit ${user.FullName || "user"}`}
                          >
                            <FaRegEdit size={18} sm={20} />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteUser(user);
                            }}
                            className="text-red-400 hover:text-red-600 p-1 sm:p-2"
                            title="Delete"
                            aria-label={`Delete ${user.FullName || "user"}`}
                          >
                            <RiDeleteBin5Line size={18} sm={20} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Card Layout for Mobile */}
            <div className="block sm:hidden space-y-4">
              {currentUsers.map((user) => (
                <article
                  key={user.UserId}
                  className="bg-white p-4 rounded-lg shadow-sm border border-slate-200"
                  onClick={() => handleEditUser(user)}
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={user.avatar_url || "/default-avatar.png"}
                      alt={user.FullName || "Avatar"}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-gray-900 truncate">
                        {user.FullName?.length > 20 ? (
                          <span title={user.FullName}>
                            {user.FullName.slice(0, 20) + "..."}
                          </span>
                        ) : (
                          user.FullName || "N/A"
                        )}
                      </h3>
                      <p className="text-xs text-gray-500 truncate">
                        {user.Email?.length > 20 ? (
                          <span title={user.Email}>
                            {user.Email.slice(0, 20) + "..."}
                          </span>
                        ) : (
                          user.Email || "N/A"
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 text-xs grid grid-cols-2 gap-x-2 gap-y-4 text-gray-700">
                    <p>
                      <strong>DOB:</strong> {formatDate(user.DateOfBirth)}
                    </p>
                    <p>
                      <strong>Gender:</strong>{" "}
                      {user.Sex === 1 || user.Sex === "1" || user.Sex === "Male"
                        ? "Male"
                        : user.Sex === 2 ||
                          user.Sex === "2" ||
                          user.Sex === "Female"
                        ? "Female"
                        : "Other"}
                    </p>
                    <p>
                      <strong>Phone:</strong> {user.PhoneNumber || "N/A"}
                    </p>
                  </div>
                  <div className="flex justify-center space-x-2 sm:space-x-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditUser(user);
                      }}
                      className="text-blue-500 hover:text-blue-700"
                      aria-label={`Edit ${user.FullName || "user"}`}
                    >
                      <FaRegEdit size={16} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteUser(user);
                      }}
                      className="text-red-400 hover:text-red-600"
                      aria-label={`Delete ${user.FullName || "user"}`}
                    >
                      <RiDeleteBin5Line size={16} />
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>

          {/* Pagination */}
          {totalItems > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-between px-4 sm:px-6 py-4 border-t border-gray-200">
              <div className="text-sm text-gray-700 mb-2 sm:mb-0">
                Showing {startIndex + 1}-{Math.min(endIndex, totalItems)} of{" "}
                {totalItems} users
              </div>
              <div className="flex items-center space-x-1 sm:space-x-2">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(1, prev - 1))
                  }
                  disabled={currentPage === 1}
                  className="px-3 sm:px-4 py-1 sm:py-2 rounded-lg text-sm sm:text-base font-medium bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  aria-label="Previous page"
                >
                  Previous
                </button>
                {renderPaginationButtons()}
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="px-3 sm:px-4 py-1 sm:py-2 rounded-lg text-sm sm:text-base font-medium bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  aria-label="Next page"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Add/Edit User Modal */}
        {(showAddModal || showEditModal) && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-lg sm:max-w-xl max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="bg-indigo-600 px-4 sm:px-6 py-3 sm:py-4 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold">
                      {showEditModal ? "Edit User" : "Add New User"}
                    </h2>
                    <p className="text-indigo-100 text-xs sm:text-sm mt-1">
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
                    className="p-1 sm:p-2 hover:bg-indigo-700 rounded-full transition-colors"
                    aria-label="Close modal"
                  >
                    <svg
                      className="w-5 sm:w-6 h-5 sm:h-6"
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
              <div className="p-4 sm:p-6">
                <div className="space-y-4 sm:space-y-6">
                  <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4 flex items-center">
                      <svg
                        className="w-4 sm:w-5 h-4 sm:h-5 mr-2 text-indigo-600"
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
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <div>
                        <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                          Full Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="Enter full name"
                          className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-xs sm:text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                          Date of Birth <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="date"
                          value={dateOfBirth}
                          onChange={(e) => setDateOfBirth(e.target.value)}
                          className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-xs sm:text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                          Gender <span className="text-red-500">*</span>
                        </label>
                        <div className="flex gap-3 sm:gap-4 mt-2">
                          <label className="flex items-center text-xs sm:text-sm">
                            <input
                              type="radio"
                              name="Sex"
                              value="1"
                              checked={sex === "1"}
                              onChange={(e) => setSex(e.target.value)}
                              className="mr-1 sm:mr-2"
                            />
                            Male
                          </label>
                          <label className="flex items-center text-xs sm:text-sm">
                            <input
                              type="radio"
                              name="Sex"
                              value="2"
                              checked={sex === "2"}
                              onChange={(e) => setSex(e.target.value)}
                              className="mr-1 sm:mr-2"
                            />
                            Female
                          </label>
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                          Identity Card <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={cccd}
                          onChange={(e) => setCCCD(e.target.value)}
                          placeholder="Enter identity card number"
                          className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-xs sm:text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                          Email <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Enter email address"
                          className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-xs sm:text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                          Phone Number <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="tel"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          placeholder="Enter phone number"
                          className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-xs sm:text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                          Address <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          placeholder="Enter address"
                          className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-xs sm:text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
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
                          className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-xs sm:text-sm"
                        />
                      </div>
                      <div className="flex flex-col items-center justify-center gap-2">
                        <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2 w-full">
                          Avatar
                        </label>
                        <div className="w-full flex flex-col items-center">
                          <div className="relative w-20 sm:w-24 h-20 sm:h-24 rounded-full border border-gray-300 bg-white flex items-center justify-center overflow-hidden mb-2">
                            {avatarUrl ? (
                              <img
                                src={avatarUrl}
                                alt="Avatar"
                                className="object-cover w-full h-full"
                                onError={(e) =>
                                  (e.target.src = "/default-avatar.png")
                                }
                              />
                            ) : (
                              <span className="text-gray-400 text-xs sm:text-sm">
                                No Image
                              </span>
                            )}
                            {avatarUrl && (
                              <button
                                type="button"
                                onClick={() => {
                                  setAvatarUrl("");
                                  setAvatarFile(null);
                                }}
                                className="absolute top-1 right-1 bg-white rounded-full p-1 shadow hover:bg-red-100 transition"
                                title="Remove image"
                                aria-label="Remove avatar"
                              >
                                <svg
                                  className="w-3 sm:w-4 h-3 sm:h-4 text-red-500"
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
                            className="px-3 sm:px-4 py-1 sm:py-2 bg-indigo-600 text-white rounded-lg cursor-pointer hover:bg-indigo-700 transition text-xs sm:text-sm"
                          >
                            Upload Image
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Footer */}
              <div className="bg-gray-50 px-4 sm:px-6 py-3 sm:py-4 border-t border-gray-200 flex justify-end space-x-2 sm:space-x-3">
                <button
                  onClick={() => {
                    if (showAddModal) setShowAddModal(false);
                    if (showEditModal) setShowEditModal(false);
                    resetForm();
                  }}
                  className="px-4 sm:px-6 py-2 sm:py-3 text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg font-medium transition-colors text-xs sm:text-sm"
                  aria-label="Cancel"
                >
                  Cancel
                </button>
                <button
                  disabled={addLoading}
                  onClick={showEditModal ? handleUpdateUser : handleAddUser}
                  className="px-4 sm:px-6 py-2 sm:py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-all shadow-sm hover:shadow-md flex items-center text-xs sm:text-sm"
                  aria-label={showEditModal ? "Update user" : "Add user"}
                >
                  {addLoading ? (
                    <>
                      <svg
                        className="animate-spin h-4 sm:h-5 w-4 sm:w-5 mr-1 sm:mr-2 text-white"
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
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-2 sm:p-4">
            <div className="bg-white text-black rounded-lg p-4 sm:p-6 w-full max-w-sm sm:max-w-md">
              <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-red-600">
                Delete User
              </h2>
              <p className="mb-4 sm:mb-6 text-xs sm:text-sm">
                Are you sure you want to delete user{" "}
                <strong>{selectedUser?.FullName || "this user"}</strong>? This
                action cannot be undone.
              </p>
              <div className="flex justify-end gap-2 sm:gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  disabled={deleteLoading}
                  className="px-3 sm:px-4 py-1 sm:py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 text-xs sm:text-sm"
                  aria-label="Cancel"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDeleteUser}
                  disabled={deleteLoading}
                  className="px-3 sm:px-4 py-1 sm:py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center text-xs sm:text-sm"
                  aria-label="Delete user"
                >
                  {deleteLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-3 sm:h-4 w-3 sm:w-4 border-b-2 border-white mr-1 sm:mr-2"></div>
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
    </div>
  );
};
