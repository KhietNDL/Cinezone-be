import { useState, useRef, useCallback, useEffect } from "react";
import { toast } from "react-toastify";
import {
  getAllUsers,
  createUser,
  editUser,
  deleteUser,
  searchUserByName,
} from "../services/APIForAdmin/API";

// Constants
const ITEMS_PER_PAGE = 5;
const SEARCH_DEBOUNCE_DELAY = 300;

// Initial form state
const INITIAL_FORM_STATE = {
  fullName: "",
  dateOfBirth: "",
  sex: "",
  email: "",
  password: "",
  phoneNumber: "",
  address: "",
  cccd: "",
  avatarUrl: "",
  avatarFile: null,
};

// Validation utilities
const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const validatePhoneNumber = (phone) => phone.length >= 10;

export const useUserManagement = () => {
  // Modal states
  const [modals, setModals] = useState({
    showAdd: false,
    showEdit: false,
    showDelete: false,
  });

  // User management states
  const [userState, setUserState] = useState({
    users: [],
    selectedUser: null,
    totalPages: 0,
    totalItems: 0,
  });

  // UI states
  const [uiState, setUiState] = useState({
    loading: true,
    deleteLoading: false,
    addLoading: false,
    currentPage: 1,
    searchTerm: "",
    sortBy: "FullName",
    sortOrder: "asc",
  });

  // Form state
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);

  const searchTimeout = useRef();
  const isSearchTermChanging = useRef(false);

  // Utility functions
  const resetForm = useCallback(() => {
    setFormData(INITIAL_FORM_STATE);
  }, []);

  const validateForm = useCallback((data) => {
    if (
      !data.fullName ||
      !data.dateOfBirth ||
      !data.password ||
      !data.sex ||
      !data.email ||
      !data.phoneNumber ||
      !data.address ||
      !data.cccd
    ) {
      toast.error("Please fill in all required fields");
      return false;
    }

    if (!validateEmail(data.email)) {
      toast.error("Please enter a valid email address");
      return false;
    }

    if (!validatePhoneNumber(data.phoneNumber)) {
      toast.error("Please enter a valid phone number");
      return false;
    }

    return true;
  }, []);

  const formatDateToYYYYMMDD = useCallback((dateStr) => {
    if (!dateStr) return "";
    if (dateStr.includes("-")) return dateStr.replace(/-/g, "/");
    if (dateStr.includes("/")) {
      const parts = dateStr.split("/");
      if (parts[2]?.length === 4) {
        return `${parts[2]}/${parts[1]}/${parts[0]}`;
      }
    }
    return dateStr;
  }, []);

  const formatDate = useCallback(
    (dateString) => (dateString ? dateString.split("T")[0] : ""),
    []
  );

  // Modal handlers
  const handleModal = useCallback((modalType, isOpen, user = null) => {
    setModals((prev) => ({ ...prev, [modalType]: isOpen }));
    if (user) {
      setUserState((prev) => ({ ...prev, selectedUser: user }));
    }
  }, []);

  // Sort handler
  const handleSort = useCallback((column) => {
    setUiState((prev) => {
      const newSortOrder =
        prev.sortBy === column && prev.sortOrder === "asc" ? "desc" : "asc";
      return {
        ...prev,
        sortBy: column,
        sortOrder: newSortOrder,
        currentPage: 1,
      };
    });
  }, []);

  const loadUsers = useCallback(async () => {
    setUiState((prev) => ({ ...prev, loading: true }));
    try {
      const params = {
        page: uiState.currentPage,
        limit: ITEMS_PER_PAGE,
        sortBy: uiState.sortBy,
        sortOrder: uiState.sortOrder,
      };

      const res = await getAllUsers(params);

      if (res.users) {
        setUserState((prev) => ({
          ...prev,
          users: res.users,
          totalPages: res.pagination?.totalPages || 0,
          totalItems: res.pagination?.total || 0,
        }));
      }
    } catch (error) {
      console.error("Load users error:", error);
      toast.error("Failed to load users");
      setUserState((prev) => ({
        ...prev,
        users: [],
        totalPages: 0,
        totalItems: 0,
      }));
    } finally {
      setUiState((prev) => ({ ...prev, loading: false }));
    }
  }, [uiState.currentPage, uiState.sortBy, uiState.sortOrder]);

  const handleSearchUser = useCallback(
    async (keyword) => {
      try {
        const params = {
          page: uiState.currentPage,
          limit: ITEMS_PER_PAGE,
          sortBy: uiState.sortBy,
          sortOrder: uiState.sortOrder,
        };

        let res;
        if (keyword && keyword.trim()) {
          res = await searchUserByName(keyword, params);
        } else {
          res = await getAllUsers(params);
        }

        if (res.users) {
          setUserState((prev) => ({
            ...prev,
            users: res.users,
            totalPages:
              res.pagination?.totalPages ||
              Math.ceil(res.users.length / ITEMS_PER_PAGE),
            totalItems: res.pagination?.total || res.users.length,
          }));
        }
      } catch (error) {
        console.error("Search error:", error);
        toast.error("Failed to search users");
        setUserState((prev) => ({
          ...prev,
          users: [],
          totalPages: 0,
          totalItems: 0,
        }));
      }
    },
    [uiState.currentPage, uiState.sortBy, uiState.sortOrder]
  );

  useEffect(() => {
    if (!isSearchTermChanging.current) {
      if (uiState.searchTerm?.trim()) {
        handleSearchUser(uiState.searchTerm);
      } else {
        loadUsers();
      }
    }
  }, [
    uiState.currentPage,
    uiState.sortBy,
    uiState.sortOrder,
    uiState.searchTerm,
    handleSearchUser,
    loadUsers,
  ]);

  // Effect riêng cho search term thay đổi
  const prevSearchTerm = useRef("");
  useEffect(() => {
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => {
      if (uiState.searchTerm?.trim()) {
        handleSearchUser(uiState.searchTerm);
      }
      prevSearchTerm.current = uiState.searchTerm;
    }, SEARCH_DEBOUNCE_DELAY);

    return () => clearTimeout(searchTimeout.current);
  }, [uiState.searchTerm, handleSearchUser, loadUsers]);

  const handleAddUser = async () => {
    try {
      setUiState((prev) => ({ ...prev, addLoading: true }));

      if (!validateForm(formData)) return;

      const formDataToSend = new FormData();
      formDataToSend.append("fullName", formData.fullName.trim());
      formDataToSend.append(
        "dateOfBirth",
        formatDateToYYYYMMDD(formData.dateOfBirth)
      );
      formDataToSend.append("password", formData.password);
      formDataToSend.append("sex", parseInt(formData.sex));
      formDataToSend.append("email", formData.email.trim());
      formDataToSend.append("phoneNumber", formData.phoneNumber.trim());
      formDataToSend.append("address", formData.address.trim());
      formDataToSend.append("cccd", formData.cccd.trim());

      if (formData.avatarFile) {
        formDataToSend.append("avatar", formData.avatarFile);
      }

      const response = await createUser(formDataToSend);
      if (response) {
        if (uiState.searchTerm?.trim()) {
          await handleSearchUser(uiState.searchTerm);
        } else {
          await loadUsers();
        }
        handleModal("showAdd", false);
        resetForm();
        toast.success("User created successfully");
      }
    } catch (error) {
      toast.error(
        "Failed to create user: " + (error.message || "Unknown error")
      );
    } finally {
      setUiState((prev) => ({ ...prev, addLoading: false }));
    }
  };

  const handleUpdateUser = async () => {
    if (!userState.selectedUser) return;
    try {
      setUiState((prev) => ({ ...prev, addLoading: true }));

      const formDataToSend = new FormData();
      formDataToSend.append("fullName", formData.fullName.trim());
      formDataToSend.append(
        "dateOfBirth",
        formatDateToYYYYMMDD(formData.dateOfBirth)
      );
      if (formData.password)
        formDataToSend.append("password", formData.password);
      formDataToSend.append("sex", parseInt(formData.sex));
      formDataToSend.append("email", formData.email.trim());
      formDataToSend.append("phoneNumber", formData.phoneNumber.trim());
      formDataToSend.append("address", formData.address.trim());
      formDataToSend.append("cccd", formData.cccd.trim());

      if (formData.avatarFile) {
        formDataToSend.append("avatar", formData.avatarFile);
      }

      await editUser(userState.selectedUser.UserId, formDataToSend);

      if (uiState.searchTerm?.trim()) {
        await handleSearchUser(uiState.searchTerm);
      } else {
        await loadUsers();
      }

      handleModal("showEdit", false);
      resetForm();
      toast.success("User updated successfully");
    } catch (error) {
      toast.error(
        "Failed to update user: " + (error.message || "Unknown error")
      );
    } finally {
      setUiState((prev) => ({ ...prev, addLoading: false }));
    }
  };

  const confirmDeleteUser = async () => {
    if (!userState.selectedUser) return;
    try {
      setUiState((prev) => ({ ...prev, deleteLoading: true }));
      await deleteUser(userState.selectedUser.UserId);
      toast.success("User deleted successfully");

      handleModal("showDelete", false);

      if (uiState.searchTerm?.trim()) {
        await handleSearchUser(uiState.searchTerm);
      } else {
        await loadUsers();
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete user");
    } finally {
      setUiState((prev) => ({ ...prev, deleteLoading: false }));
    }
  };

  const handleEditUser = useCallback(
    (user) => {
      setUserState((prev) => ({ ...prev, selectedUser: user }));

      let dob = "";
      if (user.DateOfBirth) {
        if (user.DateOfBirth.includes("/")) {
          const [day, month, year] = user.DateOfBirth.split("/");
          dob = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
        } else {
          dob = user.DateOfBirth.slice(0, 10);
        }
      }

      let gender = "";
      if (user.originalData?.Sex !== undefined) {
        gender = String(user.originalData.Sex);
      } else if (user.Sex === 1 || user.Sex === "1" || user.Sex === "Male") {
        gender = "1";
      } else if (user.Sex === 2 || user.Sex === "2" || user.Sex === "Female") {
        gender = "2";
      }

      setFormData({
        fullName: user.FullName || "",
        dateOfBirth: dob,
        sex: gender,
        email: user.Email || "",
        password: "",
        phoneNumber: user.PhoneNumber || "",
        address: user.Address || "",
        cccd: user.CCCD || "",
        avatarUrl: user.avatar_url || "",
        avatarFile: null,
      });

      handleModal("showEdit", true);
    },
    [handleModal]
  );

  const handleDeleteUser = useCallback(
    (user) => {
      setUserState((prev) => ({ ...prev, selectedUser: user }));
      handleModal("showDelete", true);
    },
    [handleModal]
  );

  const handlePageChange = useCallback(
    (page) => {
      if (page >= 1 && page <= userState.totalPages) {
        setUiState((prev) => ({ ...prev, currentPage: page }));
      }
    },
    [userState.totalPages]
  );

  const handleSearchTermChange = useCallback((term) => {
    setUiState((prev) => ({ ...prev, searchTerm: term, currentPage: 1 }));
  }, []);

  const handleFormDataChange = useCallback((field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, []);

  return {
    // States
    modals,
    userState,
    uiState,
    formData,

    // Handlers
    handleModal,
    handleSort,
    handleEditUser,
    handleDeleteUser,
    handlePageChange,
    handleSearchTermChange,
    handleFormDataChange,

    // Actions
    handleAddUser,
    handleUpdateUser,
    confirmDeleteUser,
    resetForm,

    // Utilities
    formatDate,
  };
};
