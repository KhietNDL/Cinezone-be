import React from "react";
import "react-toastify/dist/ReactToastify.css";
import Pagination from "../movieComponent/Pagination";
import StatsCards from "../userComponent/StatsCards";
import SearchAndAdd from "../userComponent/SearchAndAdd";
import UserTable from "../userComponent/UserTable";
import UserCards from "../userComponent/UserCards";
import UserFormModal from "../userComponent/UserFormModal";
import DeleteModal from "../userComponent/DeleteModal";
import { useUserManagement } from "../../../hooks/useUserManagement";

const UserManagement = () => {
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
