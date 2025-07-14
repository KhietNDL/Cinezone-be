import React, { useEffect, useState, useRef } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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
  const [searchTerm, setSearchTerm] = useState("");
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [selectedPromotion, setSelectedPromotion] = useState(null);
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [showFormPopup, setShowFormPopup] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [totalPromotions, setTotalPromotions] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const searchTimeout = useRef();

  const fetchPromotions = async (page) => {
    setLoading(true);
    try {
      const response = await getPromotion({ page, limit: itemsPerPage });
      setPromotions(response.data);
      if (response.pagination) {
        setTotalPages(response.pagination.totalPages);
        setTotalPromotions(response.pagination.total);
      }
    } catch (error) {
      console.error("Error fetching promotions:", error);
      toast.error("Failed to fetch promotions.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!searchTerm) {
      fetchPromotions(currentPage);
      return;
    }
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(async () => {
      setLoading(true);
      try {
        const data = await searchPromotion(searchTerm);
        setPromotions(data.promotions || []);
        setTotalPages(1);
        setTotalPromotions(data?.length || 0);
        setCurrentPage(1);
      } catch (error) {
        console.error("Error searching promotions:", error);
        setPromotions([]);
        setTotalPages(1);
        setTotalPromotions(0);
        toast.error("Failed to search promotions.");
      } finally {
        setLoading(false);
      }
    }, 500);
  }, [searchTerm, currentPage]);

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
      fetchPromotions(currentPage);
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
    setStartTime(promotion.StartTime ? promotion.StartTime.split("T")[0] : "");
    setEndTime(promotion.EndTime ? promotion.EndTime.split("T")[0] : "");
    setDiscountValue(promotion.DiscountValue || "");
    setDetail(promotion.Detail || "");
    setImage(null);
    setImagePreview(promotion.Image || null);
    setIsEdit(true);
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
      fetchPromotions(currentPage);
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
    <div className="h-full">
      <ToastContainer position="top-right" autoClose={2000} />
      <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
        <div className="w-[90%] md:w-[95%] lg:w-[95%] max-w-7xl space-y-4">
          <StatsCards
            totalPromotions={totalPromotions}
            promotions={promotions}
          />
          <SearchAndAdd
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            isEdit={isEdit}
            setShowFormPopup={setShowFormPopup}
            resetForm={resetForm}
          />
          <div className="bg-white p-2 sm:p-4 rounded-md shadow-sm">
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
          image={image}
          setImage={setImage}
          imagePreview={imagePreview}
          setImagePreview={setImagePreview}
          handleSubmit={handleSubmit}
          handleImageChange={handleImageChange}
          resetForm={resetForm}
          loading={loading}
        />
        {loading && !showFormPopup && (
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
                Đang xử lý, vui lòng chờ...
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PromotionManagement;
