import React, { useEffect, useState, useCallback } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Tag } from "lucide-react";
import {
  getPromotion,
  createPromotion,
  deletePromotion,
  updatePromotion,
  searchPromotion,
} from "../../../services/API";
import Pagination from "../movieComponent/Pagination";
import StatsCards from "../promotionComponent/StatsCards";
import SearchAndAdd from "../promotionComponent/SearchAndAdd";
import PromotionTable from "../promotionComponent/PromotionTable";
import PromotionCards from "../promotionComponent/PromotionCards";
import DeletePopup from "../promotionComponent/DeletePopup";
import PromotionFormPopup from "../promotionComponent/PromotionFormPopup";

const PromotionManagement = () => {
  const [promotionId, setPromotionId] = useState("");
  const [title, setTitle] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [discountValue, setDiscountValue] = useState("");
  const [detail, setDetail] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [code, setCode] = useState("");
  const [updatedAt, setUpdatedAt] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [selectedPromotion, setSelectedPromotion] = useState(null);
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [showFormPopup, setShowFormPopup] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeFilter, setActiveFilter] = useState("all");
  const [allPromotionsForStats, setAllPromotionsForStats] = useState([]);
  const itemsPerPage = 5;

  // Helper function to map filter to backend status
  const getStatusFromFilter = (filter) => {
    switch (filter) {
      case "active":
        return "active";
      case "expired":
        return "expired";
      case "upcoming":
        return "upcoming";
      case "all":
      default:
        return null;
    }
  };

  const getPromotionData = useCallback(
    async (status = null) => {
      try {
        const params = {
          page: currentPage,
          limit: itemsPerPage,
          sortBy: "CreatedAt",
          sortOrder: "desc",
        };

        // Add status filter if provided
        if (status) {
          params.status = status;
        }

        const response = await getPromotion(params);
        setPromotions(response.data || []);
        if (response.pagination) {
          setTotalPages(response.pagination.totalPages);
        } else {
          const promotionsList = response.data || [];
          setTotalPages(Math.ceil(promotionsList.length / itemsPerPage));
        }
      } catch (error) {
        console.error("Error fetching promotions:", error);
        toast.error("Failed to fetch promotions.");
        setPromotions([]);
        setTotalPages(0);
      }
    },
    [currentPage, itemsPerPage]
  );

  const searchPromotionData = useCallback(
    async (searchTerm, status = null) => {
      if (!searchTerm.trim()) {
        getPromotionData(status);
        return;
      }

      try {
        const params = {
          page: currentPage,
          limit: itemsPerPage,
          sortBy: "CreatedAt",
          sortOrder: "desc",
        };

        // Add status filter if provided
        if (status) {
          params.status = status;
        }

        const response = await searchPromotion(searchTerm, params);
        if (response) {
          setPromotions(response.data || response.promotions || []);

          // Xử lý pagination từ response
          if (response.pagination) {
            setTotalPages(response.pagination.totalPages);
          } else {
            const promotionsList = response.data || response.promotions || [];
            setTotalPages(Math.ceil(promotionsList.length / itemsPerPage));
          }
        }
      } catch (error) {
        console.error("Error searching promotions:", error);
        setPromotions([]);
        setTotalPages(0);
      }
    },
    [currentPage, itemsPerPage, getPromotionData]
  );

  // Handle filter change for backend filtering
  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
    setCurrentPage(1); // Reset to page 1 when filter changes
    const status = getStatusFromFilter(filter);

    if (searchTerm.trim()) {
      searchPromotionData(searchTerm, status);
    } else {
      getPromotionData(status);
    }
  };

  // Fetch all promotions for statistics calculation
  const getAllPromotionsForStats = useCallback(async () => {
    try {
      const response = await getPromotion({
        page: 1,
        limit: 10000, // Large number to get all promotions
        sortBy: "CreatedAt",
        sortOrder: "desc",
      });

      if (response.data) {
        const allPromotionsArray = Array.isArray(response.data)
          ? response.data
          : [];
        setAllPromotionsForStats(allPromotionsArray);
      }
    } catch (error) {
      console.error("Error fetching all promotions for stats:", error);
      setAllPromotionsForStats([]);
    }
  }, []);

  // Load initial data when component mounts
  useEffect(() => {
    if (!searchTerm.trim()) {
      getPromotionData();
    }
    getAllPromotionsForStats();
  }, [getPromotionData, searchTerm, getAllPromotionsForStats]);

  // Effect riêng cho searchTerm để reset về trang 1
  useEffect(() => {
    if (searchTerm !== "") {
      setCurrentPage(1); // Reset về trang 1 khi có search term mới
    }
  }, [searchTerm]);

  // useEffect với debounce cho search
  useEffect(() => {
    const searchTimeout = setTimeout(() => {
      const status = getStatusFromFilter(activeFilter);

      if (searchTerm.trim()) {
        searchPromotionData(searchTerm, status);
      } else {
        getPromotionData(status);
        getAllPromotionsForStats(); // Reload stats when clearing search
      }
    }, 500);

    return () => clearTimeout(searchTimeout);
  }, [
    searchTerm,
    currentPage,
    activeFilter,
    searchPromotionData,
    getPromotionData,
    getAllPromotionsForStats,
  ]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const resetForm = () => {
    setPromotionId("");
    setTitle("");
    setStartTime("");
    setEndTime("");
    setDiscountValue("");
    setDetail("");
    setCode("");
    setUpdatedAt("");
    setImage(null);
    setImagePreview(null);
    setIsEdit(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("startTime", new Date(startTime).toISOString());
      formData.append("endTime", new Date(endTime).toISOString());
      formData.append("discountValue", discountValue);
      formData.append("detail", detail);
      formData.append("code", code);
      if (image) formData.append("image", image);

      if (isEdit) {
        if (!promotionId) {
          toast.error("Promotion ID is required for update.");
          setLoading(false);
          return;
        }
        await updatePromotion(promotionId, formData);
        toast.success("Promotion updated successfully!");
      } else {
        await createPromotion(formData);
        toast.success("Promotion created successfully!");
      }
      resetForm();
      setShowFormPopup(false);
      // Refresh current data with filter
      const status = getStatusFromFilter(activeFilter);
      if (searchTerm.trim()) {
        searchPromotionData(searchTerm, status);
      } else {
        getPromotionData(status);
      }
      getAllPromotionsForStats(); // Refresh stats
    } catch (error) {
      console.error("Error saving promotion:", error);
      toast.error("Failed to save promotion.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (promotion) => {
    setPromotionId(promotion.PromotionId);
    setTitle(promotion.Title || "");

    // Format dates properly for date input
    const formatDateForInput = (dateString) => {
      if (!dateString) return "";
      const date = new Date(dateString);
      return date.toISOString().split("T")[0];
    };

    setStartTime(formatDateForInput(promotion.StartTime));
    setEndTime(formatDateForInput(promotion.EndTime));
    setDiscountValue(promotion.DiscountValue || "");
    setDetail(promotion.Detail || "");
    setCode(promotion.Code || "");
    setUpdatedAt(promotion.UpdatedAt || "");
    setImage(null);
    setImagePreview(promotion.Image || null);
    setShowFormPopup(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      await deletePromotion(selectedPromotion.PromotionId);
      toast.success("Promotion deleted successfully!");
      setShowDeletePopup(false);
      setSelectedPromotion(null);
      // Refresh current data with filter
      const status = getStatusFromFilter(activeFilter);
      if (searchTerm.trim()) {
        searchPromotionData(searchTerm, status);
      } else {
        getPromotionData(status);
      }
      getAllPromotionsForStats(); // Refresh stats
    } catch (error) {
      console.error("Error deleting promotion:", error);
      toast.error("Failed to delete promotion.");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return dateString.includes("T")
      ? dateString.split("T")[0]
      : dateString.slice(0, 10);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="max-w-7xl select-none mx-auto px-3 sm:px-6 py-3 sm:py-4 bg-white shadow-md rounded-lg mb-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-3 lg:gap-4">
          {/* Left: Logo/Brand */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-purple-600 to-purple-700 rounded-lg flex items-center justify-center">
              <Tag className="text-white text-lg sm:text-xl" />
            </div>
            <div>
              <h1 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-purple-600 to-purple-700 bg-clip-text text-transparent">
                Promotion Management
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 hidden sm:block">
                Admin Portal - Manage Discounts & Offers
              </p>
            </div>
          </div>

          {/* Right: Search & Actions */}
          <div className="flex flex-col sm:flex-row items-center gap-3 lg:gap-4 w-full md:w-auto">
            <SearchAndAdd
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              isEdit={isEdit}
              setShowFormPopup={setShowFormPopup}
              resetForm={resetForm}
            />
          </div>
        </div>
      </div>

      <ToastContainer position="top-right" autoClose={2000} />
      <div className="flex flex-col items-center lg:items-start h-auto min-h-screen max-w-7xl w-full overflow-x-hidden mx-auto">
        <div className="w-[90%] md:w-[95%] lg:w-full max-w-7xl space-y-4 sm:space-y-6">
          <StatsCards
            totalPromotions={allPromotionsForStats.length}
            promotions={allPromotionsForStats}
            activeFilter={activeFilter}
            handleFilterChange={handleFilterChange}
          />
          <div className="bg-white rounded-xl shadow-md border border-gray-100">
            <PromotionTable
              promotions={promotions}
              handleEdit={handleEdit}
              setSelectedPromotion={setSelectedPromotion}
              setShowDeletePopup={setShowDeletePopup}
              formatDate={formatDate}
            />
            <PromotionCards
              promotions={promotions}
              handleEdit={handleEdit}
              setSelectedPromotion={setSelectedPromotion}
              setShowDeletePopup={setShowDeletePopup}
              formatDate={formatDate}
            />
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            handlePageChange={handlePageChange}
          />
        </div>
      </div>

      {/* Modal Components */}
      <DeletePopup
        showDeletePopup={showDeletePopup}
        setShowDeletePopup={setShowDeletePopup}
        handleDelete={handleDelete}
        loading={loading}
      />
      <PromotionFormPopup
        showFormPopup={showFormPopup}
        setShowFormPopup={setShowFormPopup}
        isEdit={isEdit}
        title={title}
        setTitle={setTitle}
        startTime={startTime}
        setStartTime={setStartTime}
        endTime={endTime}
        setEndTime={setEndTime}
        discountValue={discountValue}
        setDiscountValue={setDiscountValue}
        detail={detail}
        setDetail={setDetail}
        code={code}
        setCode={setCode}
        updatedAt={updatedAt}
        image={image}
        setImage={setImage}
        imagePreview={imagePreview}
        setImagePreview={setImagePreview}
        handleSubmit={handleSubmit}
        handleImageChange={handleImageChange}
        resetForm={resetForm}
        loading={loading}
      />
    </div>
  );
};

export default PromotionManagement;
