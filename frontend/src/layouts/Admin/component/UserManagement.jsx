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
import SearchAndAdd from "../userComponent/SearchAndAdd";
import UserTable from "../userComponent/UserTable";
import UserCards from "../userComponent/UserCards";
import UserFormModal from "../userComponent/UserFormModal";
import DeleteModal from "../userComponent/DeleteModal";
import { useUserManagement } from "../../../hooks/useUserManagement";
import { getUserAgeGroups } from "../../../services/APIForAdmin/API";

const UserManagement = () => {
  const [ageGroupData, setAgeGroupData] = useState([]);

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
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-3 sm:py-4 bg-white shadow-md rounded-lg mb-6">
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
        </div>
      </div>

      <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
        <div className="w-[90%] md:w-[95%] lg:w-[95%] max-w-7xl space-y-4">
          <StatsCards totalItems={userState.totalItems} />

          <SearchAndAdd
            searchTerm={uiState.searchTerm}
            setSearchTerm={handleSearchTermChange}
            showEditModal={modals.showEdit}
            setShowAddModal={() => handleModal("showAdd", true)}
            resetForm={resetForm}
            setCurrentPage={handlePageChange}
          />
          <div className="bg-white p-2 sm:p-3 md:p-4 rounded-xl shadow-sm border border-gray-100">
            <UserTable
              users={userState.users}
              handleEditUser={handleEditUser}
              handleDeleteUser={handleDeleteUser}
              handleUnbanUser={handleUnbanUser}
              sortBy={uiState.sortBy}
              sortOrder={uiState.sortOrder}
              handleSort={handleSort}
              formatDate={formatDate}
              unbanLoading={uiState.unbanLoading}
            />
            <UserCards
              users={userState.users}
              handleEditUser={handleEditUser}
              handleDeleteUser={handleDeleteUser}
              handleUnbanUser={handleUnbanUser}
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
            <div className="bg-white p-5 sm:p-6 rounded-xl shadow-sm border border-gray-100">
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
                  <div className="flex justify-between items-center mb-3 p-3 bg-gray-50 rounded-lg">
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
                        className="flex justify-between items-center p-2 hover:bg-gray-50 rounded-lg transition-colors duration-200"
                      >
                        <div className="flex items-center">
                          <div
                            className="w-3 h-3 rounded-full mr-2"
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
          <UserFormModal
            showAddModal={modals.showAdd}
            showEditModal={modals.showEdit}
            setShowAddModal={() => handleModal("showAdd", false)}
            setShowEditModal={() => handleModal("showEdit", false)}
            fullName={formData.fullName}
            setFullName={(value) => handleFormDataChange("fullName", value)}
            dateOfBirth={formData.dateOfBirth}
            setDateOfBirth={(value) =>
              handleFormDataChange("dateOfBirth", value)
            }
            sex={formData.sex}
            setSex={(value) => handleFormDataChange("sex", value)}
            email={formData.email}
            setEmail={(value) => handleFormDataChange("email", value)}
            password={formData.password}
            setPassword={(value) => handleFormDataChange("password", value)}
            phoneNumber={formData.phoneNumber}
            setPhoneNumber={(value) =>
              handleFormDataChange("phoneNumber", value)
            }
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
      </div>
    </div>
  );
};

export default UserManagement;
