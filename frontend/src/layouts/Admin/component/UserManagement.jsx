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
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#8884d8",
    "#82ca9d",
  ];

  return (
    <div className="h-full">
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
          <div className="bg-white p-2 sm:p-3 md:p-4 rounded-lg shadow-sm">
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
          <div className="w-full ">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h3 className="text-lg font-bold text-center text-gray-800">
                User Age Distribution
              </h3>
              <div className="h-[250px]">
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
                      outerRadius={100}
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
                        border: "1px solid #ccc",
                        borderRadius: "8px",
                      }}
                    />
                    {/* <Legend
                      verticalAlign="bottom"
                      height={36}
                      iconType="circle"
                      wrapperStyle={{ paddingTop: "20px" }}
                    /> */}
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Summary Stats */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="text-sm text-gray-600">
                  <div className="flex justify-start items-center mb-2">
                    <span className="font-medium">Total Users:</span>
                    <span className="font-bold text-gray-800">
                      {ageGroupData.reduce((sum, item) => sum + item.total, 0)}
                    </span>
                  </div>
                  <div className="space-y-1">
                    {ageGroupData.map((group, index) => (
                      <div
                        key={group.ageGroup}
                        className="flex justify-start items-center"
                      >
                        <div className="flex items-center">
                          <div
                            className="w-3 h-3 rounded-full mr-2"
                            style={{
                              backgroundColor: COLORS[index % COLORS.length],
                            }}
                          ></div>
                          <span>{group.ageGroup}:</span>
                        </div>
                        <span className="font-medium ml-[5px]">
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
