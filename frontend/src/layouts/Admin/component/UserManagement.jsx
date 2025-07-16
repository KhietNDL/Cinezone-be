import React, { useEffect, useState, useRef } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  getAllUsers,
  createUser,
  editUser,
  deleteUser,
  searchUserByName,
} from "../../../services/APIForAdmin/API";
import Pagination from "../movieComponent/Pagination";
import StatsCards from "../userComponent/StatsCards";
import SearchAndAdd from "../userComponent/SearchAndAdd";
import UserTable from "../userComponent/UserTable";
import UserCards from "../userComponent/UserCards";
import UserFormModal from "../userComponent/UserFormModal";
import DeleteModal from "../userComponent/DeleteModal";

const UserManagement = () => {
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
  const itemsPerPage = 5;
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
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
  const [sortBy, setSortBy] = useState("FullName");
  const [sortOrder, setSortOrder] = useState("asc");

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

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
    setCurrentPage(1);
  };

  const loadUsers = async () => {
    setLoading(true);
    try {
      const params = {
        page: currentPage,
        limit: itemsPerPage,
        sortBy,
        sortOrder,
      };
      const res = await getAllUsers(params);
      if (res.users) {
        setUsers(res.users);
        if (res.pagination) {
          setTotalPages(res.pagination.totalPages);
          setTotalItems(res.pagination.total);
        }
      }
    } catch (error) {
      console.error("Load users error:", error);
      toast.error("Failed to load users");
      setUsers([]);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, [currentPage, sortBy, sortOrder]);

  const searchTimeout = useRef();
  useEffect(() => {
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => {
      handleSearchUser(searchTerm);
    }, 400);
    return () => clearTimeout(searchTimeout.current);
  }, [searchTerm]);

  const handleSearchUser = async (keyword) => {
    try {
      const params = {
        page: currentPage,
        limit: itemsPerPage,
        sortBy,
        sortOrder,
      };
      let res;
      if (keyword && keyword.trim()) {
        res = await searchUserByName(keyword, params);
      } else {
        res = await getAllUsers(params);
      }
      if (res.users) {
        setUsers(res.users);
        if (res.pagination) {
          setTotalPages(res.pagination.totalPages);
          setTotalItems(res.pagination.total);
        } else {
          setTotalPages(Math.ceil(res.users.length / itemsPerPage));
          setTotalItems(res.users.length);
        }
        setCurrentPage(1);
      }
    } catch (error) {
      console.error("Search error:", error);
      toast.error("Failed to search users");
      setUsers([]);
      setTotalPages(0);
      setTotalItems(0);
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
      toast.success("User deleted successfully");
      setShowDeleteModal(false);
      await loadUsers();
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

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="h-full">
      <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
        <div className="w-[90%] md:w-[95%] lg:w-[95%] max-w-7xl space-y-4">
          {loading ? (
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
                  Loading users, please wait...
                </div>
              </div>
            </div>
          ) : (
            <>
              <StatsCards totalItems={totalItems} />
              <SearchAndAdd
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                showEditModal={showEditModal}
                setShowAddModal={setShowAddModal}
                resetForm={resetForm}
                setCurrentPage={setCurrentPage}
              />
              <div className="bg-white p-2 sm:p-3 md:p-4 rounded-lg shadow-sm">
                <UserTable
                  users={users}
                  handleEditUser={handleEditUser}
                  handleDeleteUser={handleDeleteUser}
                  sortBy={sortBy}
                  sortOrder={sortOrder}
                  handleSort={handleSort}
                  formatDate={formatDate}
                />
                <UserCards
                  users={users}
                  handleEditUser={handleEditUser}
                  handleDeleteUser={handleDeleteUser}
                  formatDate={formatDate}
                />
              </div>
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                handlePageChange={handlePageChange}
              />
            </>
          )}
          <UserFormModal
            showAddModal={showAddModal}
            showEditModal={showEditModal}
            setShowAddModal={setShowAddModal}
            setShowEditModal={setShowEditModal}
            fullName={fullName}
            setFullName={setFullName}
            dateOfBirth={dateOfBirth}
            setDateOfBirth={setDateOfBirth}
            sex={sex}
            setSex={setSex}
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            phoneNumber={phoneNumber}
            setPhoneNumber={setPhoneNumber}
            address={address}
            setAddress={setAddress}
            cccd={cccd}
            setCCCD={setCCCD}
            avatarUrl={avatarUrl}
            setAvatarUrl={setAvatarUrl}
            avatarFile={avatarFile}
            setAvatarFile={setAvatarFile}
            resetForm={resetForm}
            addLoading={addLoading}
            handleAddUser={handleAddUser}
            handleUpdateUser={handleUpdateUser}
          />
          <DeleteModal
            showDeleteModal={showDeleteModal}
            setShowDeleteModal={setShowDeleteModal}
            selectedUser={selectedUser}
            confirmDeleteUser={confirmDeleteUser}
            deleteLoading={deleteLoading}
          />
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
