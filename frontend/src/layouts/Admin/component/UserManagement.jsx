import React, { useState, useEffect } from "react";
import "react-toastify/dist/ReactToastify.css";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { FaUser } from "react-icons/fa6";
import Pagination from "../movieComponent/Pagination";
import StatsCards from "../userComponent/StatsCards";
import UserTable from "../userComponent/UserTable";
import UserFormModal from "../userComponent/UserFormModal";
import DeleteModal from "../userComponent/DeleteModal";
import { useUserManagement } from "../../../hooks/useUserManagement";
import {
  getUserAgeGroups,
  getAllUsers,
} from "../../../services/APIForAdmin/API";

const UserManagement = () => {
  const [ageGroupData, setAgeGroupData] = useState([]);
  const [activeFilter, setActiveFilter] = useState(null);
  const [userStats, setUserStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    new: 0,
  });
  // eslint-disable-next-line no-unused-vars
  const [allUsers, setAllUsers] = useState([]); // Store all users for statistics

  const {
    modals,
    userState,
    uiState,
    formData,
    handleModal,
    handleSort,
    handleEditUser,
    handleDeleteUser,
    handleUnbanUser,
    handlePageChange,
    handleSearchTermChange,
    handleFormDataChange,
    handleAddUser,
    handleUpdateUser,
    confirmDeleteUser,
    resetForm,
    formatDate,
  } = useUserManagement();

  // Calculate user statistics
  useEffect(() => {
    const fetchAllUsersForStats = async () => {
      try {
        // Fetch all users without pagination for statistics
        const response = await getAllUsers({
          page: 1,
          limit: 10000, // Large number to get all users
          sortBy: "UserId",
          sortOrder: "asc",
        });

        if (response && response.users) {
          setAllUsers(response.users);
          calculateStatsFromAllUsers(
            response.users,
            response.totalItems || response.users.length
          );
        }
      } catch (error) {
        console.error("Error fetching all users for stats:", error);
        // Fallback to current users if fetch fails
        calculateStatsFromCurrentUsers();
      }
    };

    const calculateStatsFromAllUsers = (users, totalCount) => {
      const today = new Date();
      const thirtyDaysAgo = new Date(
        today.getTime() - 30 * 24 * 60 * 60 * 1000
      );

      const stats = users.reduce(
        (acc, user) => {
          // Active/Inactive based on IsDeleted status
          if (user.IsDeleted === 0 || user.IsDeleted === false) {
            acc.active++;
          } else {
            acc.inactive++;
          }

          // New users (created in last 30 days)
          if (user.CreatedAt) {
            const createdDate = new Date(user.CreatedAt);
            if (createdDate >= thirtyDaysAgo) {
              acc.new++;
            }
          }

          return acc;
        },
        { total: totalCount, active: 0, inactive: 0, new: 0 }
      );

      console.log("Calculated stats from all users:", stats);
      console.log("Total users processed:", users.length);
      setUserStats(stats);
    };

    const calculateStatsFromCurrentUsers = () => {
      if (!userState.users || userState.users.length === 0) {
        console.log("No users data available, keeping current stats");
        return;
      }

      // This is a fallback - use current page users and totalItems
      const today = new Date();
      const thirtyDaysAgo = new Date(
        today.getTime() - 30 * 24 * 60 * 60 * 1000
      );

      const stats = userState.users.reduce(
        (acc, user) => {
          if (user.IsDeleted === 0 || user.IsDeleted === false) {
            acc.active++;
          } else {
            acc.inactive++;
          }

          if (user.CreatedAt) {
            const createdDate = new Date(user.CreatedAt);
            if (createdDate >= thirtyDaysAgo) {
              acc.new++;
            }
          }

          return acc;
        },
        { total: userState.totalItems || 0, active: 0, inactive: 0, new: 0 }
      );

      console.log("Fallback stats from current users:", stats);
      setUserStats(stats);
    };

    // Fetch all users for accurate statistics
    fetchAllUsersForStats();
  }, [userState.totalItems, userState.users]); // Re-run when user data changes

  // Handle filter changes
  const handleFilterChange = (filterType) => {
    setActiveFilter(filterType);
    handlePageChange(1); // Reset to first page when filter changes
  };

  // Filter users based on active filter
  const getFilteredUsers = () => {
    if (!activeFilter || activeFilter === "total") {
      return userState.users;
    }

    switch (activeFilter) {
      case "active":
        return userState.users.filter(
          (user) => user.IsDeleted === 0 || user.IsDeleted === false
        );
      case "inactive":
        return userState.users.filter(
          (user) => user.IsDeleted === 1 || user.IsDeleted === true
        );
      case "new": {
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        return userState.users.filter((user) => {
          if (user.CreatedAt) {
            const createdDate = new Date(user.CreatedAt);
            return createdDate >= thirtyDaysAgo;
          }
          return false;
        });
      }
      default:
        return userState.users;
    }
  };

  const filteredUsers = getFilteredUsers();

  useEffect(() => {
    const fetchUserAgeGroups = async () => {
      try {
        const response = await getUserAgeGroups();
        if (response && response.data) {
          setAgeGroupData(response.data);
        }
      } catch (error) {
        console.error("Error fetching age groups:", error);
        setAgeGroupData([]);
      }
    };

    fetchUserAgeGroups();
  }, []);

  const COLORS = [
    "#6366F1",
    "#8B5CF6",
    "#EC4899",
    "#10B981",
    "#F59E0B",
    "#EF4444",
  ];

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
                User Management
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 hidden sm:block">
                Admin Portal - Manage System Users
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
                value={uiState.searchTerm}
                onChange={(e) => {
                  handleSearchTermChange(e.target.value);
                  handlePageChange(1);
                }}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 hover:border-gray-300 shadow-sm"
                placeholder="Search users by name or email..."
              />
            </div>

            {/* Add User Button */}
            {!modals.showEdit && (
              <button
                onClick={() => {
                  resetForm();
                  handleModal("showAdd", true);
                }}
                className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl font-medium text-sm hover:from-purple-700 hover:to-purple-800 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 w-full sm:w-auto min-w-[120px] whitespace-nowrap"
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
                Add User
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center lg:items-start h-auto min-h-screen max-w-7xl w-full overflow-x-hidden">
        <div className="w-[90%] md:w-[95%] lg:w-full max-w-7xl space-y-4 sm:space-y-6">
          <StatsCards
            totalItems={userState.totalItems}
            activeUsers={userStats.active}
            inactiveUsers={userStats.inactive}
            newUsers={userStats.new}
            onFilterChange={handleFilterChange}
            activeFilter={activeFilter}
          />

          <div className="bg-white p-2 sm:p-3 md:p-4 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
            {/* Filter indicator */}
            {activeFilter && activeFilter !== "total" && (
              <div className="mb-4 p-3 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg border border-purple-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                    <span className="text-sm font-medium text-purple-700">
                      Filtering by:{" "}
                      {activeFilter === "active"
                        ? "Active Users"
                        : activeFilter === "inactive"
                        ? "Inactive Users"
                        : activeFilter === "new"
                        ? "New Users"
                        : ""}
                    </span>
                    <span className="text-xs text-purple-600 bg-purple-100 px-2 py-1 rounded-full">
                      {filteredUsers.length} users
                    </span>
                  </div>
                  <button
                    onClick={() => setActiveFilter(null)}
                    className="text-purple-600 hover:text-purple-800 text-sm font-medium hover:bg-purple-100 px-2 py-1 rounded transition-colors duration-200"
                  >
                    Clear Filter
                  </button>
                </div>
              </div>
            )}

            <UserTable
              users={filteredUsers}
              handleEditUser={handleEditUser}
              handleDeleteUser={handleDeleteUser}
              handleUnbanUser={handleUnbanUser}
              sortBy={uiState.sortBy}
              sortOrder={uiState.sortOrder}
              handleSort={handleSort}
              formatDate={formatDate}
              unbanLoading={uiState.unbanLoading}
            />
          </div>

          <Pagination
            currentPage={uiState.currentPage}
            totalPages={userState.totalPages}
            handlePageChange={handlePageChange}
          />
          {/* Age Distribution Chart */}
          <div className="w-full">
            <div className="bg-white p-5 sm:p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-indigo-50/30">
              <div className="mb-6">
                <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">
                  User Age Distribution
                </h3>
                <p className="text-sm text-gray-500">
                  Demographic breakdown of system users
                </p>
              </div>
              <div className="h-[250px] sm:h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={ageGroupData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ ageGroup, percent }) =>
                        `${ageGroup} (${(percent * 100).toFixed(1)}%)`
                      }
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="total"
                    >
                      {ageGroupData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value) => [value, "Users"]}
                      labelStyle={{ color: "#333" }}
                      contentStyle={{
                        backgroundColor: "#fff",
                        border: "1px solid #e5e7eb",
                        borderRadius: "8px",
                        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Summary Stats */}
              <div className="mt-6 pt-4 border-t border-gray-100">
                <div className="text-sm text-gray-600">
                  <div className="flex justify-between items-center mb-3 p-3 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg border border-purple-100">
                    <span className="font-medium text-gray-700">
                      Total Users:
                    </span>
                    <span className="font-bold text-lg text-purple-600">
                      {ageGroupData.reduce((sum, item) => sum + item.total, 0)}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {ageGroupData.map((group, index) => (
                      <div
                        key={group.ageGroup}
                        className="flex justify-between items-center p-3 hover:bg-gradient-to-r hover:from-purple-50 hover:to-indigo-50 rounded-lg transition-all duration-200 border border-transparent hover:border-purple-200"
                      >
                        <div className="flex items-center">
                          <div
                            className="w-3 h-3 rounded-full mr-2 shadow-sm"
                            style={{
                              backgroundColor: COLORS[index % COLORS.length],
                            }}
                          ></div>
                          <span className="font-medium">{group.ageGroup}:</span>
                        </div>
                        <span className="font-semibold text-gray-800">
                          {group.total} users
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <UserFormModal
        showAddModal={modals.showAdd}
        showEditModal={modals.showEdit}
        setShowAddModal={() => handleModal("showAdd", false)}
        setShowEditModal={() => handleModal("showEdit", false)}
        fullName={formData.fullName}
        setFullName={(value) => handleFormDataChange("fullName", value)}
        dateOfBirth={formData.dateOfBirth}
        setDateOfBirth={(value) => handleFormDataChange("dateOfBirth", value)}
        sex={formData.sex}
        setSex={(value) => handleFormDataChange("sex", value)}
        email={formData.email}
        setEmail={(value) => handleFormDataChange("email", value)}
        password={formData.password}
        setPassword={(value) => handleFormDataChange("password", value)}
        phoneNumber={formData.phoneNumber}
        setPhoneNumber={(value) => handleFormDataChange("phoneNumber", value)}
        address={formData.address}
        setAddress={(value) => handleFormDataChange("address", value)}
        cccd={formData.cccd}
        setCCCD={(value) => handleFormDataChange("cccd", value)}
        avatarUrl={formData.avatarUrl}
        setAvatarUrl={(value) => handleFormDataChange("avatarUrl", value)}
        avatarFile={formData.avatarFile}
        setAvatarFile={(value) => handleFormDataChange("avatarFile", value)}
        resetForm={resetForm}
        addLoading={uiState.addLoading}
        handleAddUser={handleAddUser}
        handleUpdateUser={handleUpdateUser}
      />
      <DeleteModal
        showDeleteModal={modals.showDelete}
        setShowDeleteModal={() => handleModal("showDelete", false)}
        selectedUser={userState.selectedUser}
        confirmDeleteUser={confirmDeleteUser}
        deleteLoading={uiState.deleteLoading}
      />
    </div>
  );
};

export default UserManagement;
