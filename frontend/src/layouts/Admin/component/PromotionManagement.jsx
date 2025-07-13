import React, { useState, useEffect, useRef } from "react";
import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBin5Line } from "react-icons/ri";
import { IoSearchOutline } from "react-icons/io5";
import { GoPlus } from "react-icons/go";
import {
  getPromotion,
  createPromotion,
  deletePromotion,
  updatePromotion,
  searchPromotion,
} from "../../../services/API";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { MdOutlineClose } from "react-icons/md";
import Pagination from "../movieComponent/Pagination";

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
      <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
        <div className="w-[90%] md:w-[95%] lg:w-[95%] max-w-7xl space-y-4">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 lg:gap-4 w-full">
            <div className="bg-white rounded-md p-2 sm:p-3 flex-1 shadow-sm">
              <div className="flex items-center justify-between">
                <p className="text-slate-500 text-sm sm:text-base">
                  Total Promotion
                </p>
                <div className="p-1 sm:p-2 bg-blue-100 rounded-lg flex items-center justify-center">
                  <div className="w-4 h-4 sm:w-5 sm:h-5 bg-blue-500 rounded"></div>
                </div>
              </div>
              <p className="font-bold text-base sm:text-[19px]">
                {totalPromotions}
              </p>
            </div>
            <div className="bg-white rounded-md p-2 sm:p-3 flex-1 shadow-sm">
              <div className="flex items-center justify-between">
                <p className="text-slate-500 text-sm sm:text-base">
                  Active Promotion
                </p>
                <div className="p-1 sm:p-2 bg-green-100 rounded-lg flex items-center justify-center">
                  <div className="w-4 h-4 sm:w-5 sm:h-5 bg-green-500 rounded"></div>
                </div>
              </div>
              <p className="font-bold text-base sm:text-[19px]">
                {
                  promotions.filter((p) => {
                    const now = new Date();
                    const start = new Date(p.StartTime || p.startTime);
                    const end = new Date(p.EndTime || p.endTime);
                    return start <= now && now <= end;
                  }).length
                }
              </p>
            </div>
            <div className="bg-white rounded-md p-2 sm:p-3 flex-1 shadow-sm">
              <div className="flex items-center justify-between">
                <p className="text-slate-500 text-sm">Expired Promotion</p>
                <div className="p-1 sm:p-2 bg-red-100 rounded-lg flex items-center justify-center">
                  <div className="w-4 h-4 sm:w-5 sm:h-5 bg-red-500 rounded"></div>
                </div>
              </div>
              <p className="font-bold text-base sm:text-[19px]">
                {
                  promotions.filter((p) => {
                    const now = new Date();
                    const end = new Date(p.EndTime || p.endTime);
                    return end < now;
                  }).length
                }
              </p>
            </div>
            <div className="bg-white rounded-md p-2 sm:p-3 flex-1 shadow-sm">
              <div className="flex items-center justify-between">
                <p className="text-slate-500 text-sm sm:text-base">Upcoming</p>
                <div className="p-1 sm:p-2 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <div className="w-4 h-4 sm:w-5 sm:h-5 bg-yellow-500 rounded"></div>
                </div>
              </div>
              <p className="font-bold text-base sm:text-[19px]">
                {
                  promotions.filter((p) => {
                    const now = new Date();
                    const start = new Date(p.StartTime || p.startTime);
                    return start > now;
                  }).length
                }
              </p>
            </div>
          </div>

          {/* Search and Add Button */}
          <div className="flex flex-col sm:flex-row items-center justify-between mb-4 gap-2 w-full">
            <div className="flex items-center p-1 px-2 w-full max-w-[400px] rounded-xl bg-white shadow-sm">
              <IoSearchOutline size={20} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="p-1 sm:p-2 focus:outline-none w-full text-sm sm:text-base"
                placeholder="Search by name"
              />
            </div>
            {!isEdit && (
              <button
                onClick={() => {
                  resetForm();
                  setShowFormPopup(true);
                }}
                className="flex items-center text-[#6051F3] hover:bg-slate-50  p-2 rounded-md active:bg-slate-100 bg-white shadow-sm w-full sm:w-auto text-sm sm:text-base"
              >
                <GoPlus size={18} className="mr-1 sm:mr-2" />
                Add Promotion
              </button>
            )}
          </div>

          {/* Table for Tablet and Desktop, Cards for Mobile */}
          <div className="bg-white p-2 sm:p-4 rounded-md shadow-sm">
            {/* Table Layout for sm and above */}
            <div className="hidden sm:block">
              <table className="w-full table-auto border-collapse">
                <thead>
                  <tr className="text-left text-slate-500 text-sm border-b border-slate-200">
                    <th className="py-2 text-center w-[200px] shrink-0">
                      Image
                    </th>
                    <th className="py-2 px-2 w-[200px] shrink-0">
                      Promotion Name
                    </th>
                    <th className="py-2 text-center w-[150px] shrink-0">
                      Value
                    </th>
                    <th className="py-2 text-center w-[60px] md:w-[100px] shrink-0">
                      Start Date
                    </th>
                    <th className="py-2 text-center w-[60px] md:w-[100px] shrink-0">
                      End Date
                    </th>
                    <th className="py-2 text-center w-[100px] shrink-0">
                      Status
                    </th>
                    <th className="py-2 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {promotions.map((promotion) => {
                    const now = new Date();
                    const start = new Date(
                      promotion.StartTime || promotion.startTime
                    );
                    const end = new Date(
                      promotion.EndTime || promotion.endTime
                    );
                    let status = "";
                    let statusClass = "";
                    if (end < now) {
                      status = "Expired";
                      statusClass = "bg-rose-200 text-red-700";
                    } else if (start <= now && now <= end) {
                      status = "Active";
                      statusClass = "bg-green-100 text-green-700";
                    } else {
                      status = "Upcoming";
                      statusClass = "bg-yellow-100 text-yellow-700";
                    }
                    return (
                      <tr
                        key={promotion.PromotionId}
                        className="border-b border-slate-200 hover:bg-slate-100 hover:rounded-lg cursor-pointer text-sm"
                      >
                        <td className="py-2 text-center w-[200px] shrink-0">
                          {promotion.Image ? (
                            <img
                              src={promotion.Image}
                              alt={promotion.Title}
                              className="w-30 h-24 object-cover rounded mx-auto"
                            />
                          ) : (
                            <span className="text-gray-400 italic">
                              No image
                            </span>
                          )}
                        </td>
                        <td className="px-2 py-2 whitespace-nowrap w-[200px] shrink-0">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {promotion.Title}
                            </div>
                            <div className="text-sm text-gray-500">
                              {promotion.Detail}
                            </div>
                          </div>
                        </td>
                        <td className="py-2 text-center w-[150px] shrink-0">
                          {promotion.DiscountValue
                            ? Number(promotion.DiscountValue) % 1 === 0
                              ? Number(promotion.DiscountValue) + "%"
                              : Number(promotion.DiscountValue)
                                  .toFixed(2)
                                  .replace(/\.00$/, "") + "%"
                            : ""}
                        </td>
                        <td className="py-2 text-center">
                          <div className="text-sm text-gray-900 w-[60px] md:w-[100px] shrink-0">
                            {formatDate(promotion.StartTime)}
                          </div>
                        </td>
                        <td className="py-2 text-center">
                          <div className="text-sm text-gray-900 w-[60px] md:w-[100px] shrink-0">
                            {formatDate(promotion.EndTime)}
                          </div>
                        </td>
                        <td className="py-2 text-center w-[100px] shrink-0">
                          <span
                            className={`px-3 py-1 rounded-full font-semibold text-xs ${statusClass}`}
                          >
                            {status}
                          </span>
                        </td>
                        <td className="px-6 py-2 text-sm font-medium w-[100px] shrink-0">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => handleEdit(promotion)}
                              className="text-blue-500 hover:text-blue-700 cursor-pointer"
                              title="Edit"
                              aria-label="Edit promotion"
                            >
                              <FaRegEdit size={20} />
                            </button>
                            <button
                              onClick={() => {
                                setSelectedPromotion(promotion);
                                setShowDeletePopup(true);
                              }}
                              className="text-red-400 hover:text-red-600 cursor-pointer"
                              title="Delete"
                              aria-label="Delete promotion"
                            >
                              <RiDeleteBin5Line size={20} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {/* Card Layout for Mobile */}
            <div className="block sm:hidden space-y-4">
              {promotions.map((promotion) => {
                const now = new Date();
                const start = new Date(
                  promotion.StartTime || promotion.startTime
                );
                const end = new Date(promotion.EndTime || promotion.endTime);
                const status =
                  end < now ? "Expired" : start <= now ? "Active" : "Upcoming";
                const statusClass =
                  status === "Expired"
                    ? "bg-rose-200 text-red-700"
                    : status === "Active"
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700";

                return (
                  <article
                    key={promotion.PromotionId}
                    className="bg-white p-4 rounded-lg shadow-sm border border-slate-200"
                  >
                    <div className="flex items-center gap-4">
                      {promotion.Image ? (
                        <img
                          src={promotion.Image}
                          alt={promotion.Title}
                          className="w-20 h-20 object-cover rounded"
                        />
                      ) : (
                        <span className="text-gray-400 italic">No image</span>
                      )}
                      <div className="flex-1">
                        <h3 className="text-sm font-medium text-gray-900 truncate">
                          {promotion.Title}
                        </h3>
                        <p className="text-xs text-gray-500 truncate">
                          {promotion.Detail}
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 text-xs grid grid-cols-2 space-x-2 space-y-4 text-gray-700">
                      <p>
                        <strong>Value:</strong>{" "}
                        {(
                          Number(promotion.DiscountValue) * 1000
                        ).toLocaleString("vi-VN")}{" "}
                        VND
                      </p>
                      <p>
                        <strong>Start:</strong>{" "}
                        {formatDate(promotion.StartTime)}
                      </p>
                      <p>
                        <strong>End:</strong> {formatDate(promotion.EndTime)}
                      </p>
                      <p>
                        <strong>Status:</strong>{" "}
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${statusClass}`}
                        >
                          {status}
                        </span>
                      </p>
                    </div>
                    <div className="flex gap-2 mt-2 ">
                      <button
                        onClick={() => handleEdit(promotion)}
                        className="text-blue-500 hover:text-blue-700"
                        aria-label="Edit promotion"
                      >
                        <FaRegEdit size={16} />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedPromotion(promotion);
                          setShowDeletePopup(true);
                        }}
                        className="text-red-400 hover:text-red-600"
                        aria-label="Delete promotion"
                      >
                        <RiDeleteBin5Line size={16} />
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            handlePageChange={handlePageChange}
          />
        </div>

        {/* Delete Popup */}
        {showDeletePopup && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999] p-2">
            <div className="bg-white rounded-lg p-4 sm:p-6 flex flex-col items-center shadow-xl min-w-[280px] max-w-[90vw]">
              <RiDeleteBin5Line className="text-red-500" size={32} />
              <div className="font-semibold text-base sm:text-lg text-gray-700 my-2 text-center">
                Are you sure you want to delete this promotion?
              </div>
              <div className="flex gap-2 sm:gap-3 mt-3 sm:mt-4">
                <button
                  onClick={() => setShowDeletePopup(false)}
                  className="px-4 sm:px-6 py-2 sm:py-3 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 text-sm sm:text-base"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 sm:px-6 py-2 sm:py-3 bg-red-500 text-white rounded-md hover:bg-red-600 text-sm sm:text-base"
                  disabled={loading}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Form Popup */}
        {showFormPopup && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full min-w-[300px] max-w-[90vw] sm:max-w-xl max-h-[95vh] overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-4 sm:px-6 py-3 sm:py-4 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg sm:text-2xl font-bold">
                      {isEdit ? "Edit Promotion" : "Add New Promotion"}
                    </h2>
                    <p className="text-blue-100 text-xs sm:text-sm mt-1">
                      {isEdit
                        ? "Update the details below to edit the promotion"
                        : "Fill in the details below to add a promotion"}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setShowFormPopup(false);
                      resetForm();
                    }}
                    className="p-1 sm:p-2 hover:bg-white/10 rounded-full transition-colors"
                    aria-label="Close"
                  >
                    <MdOutlineClose size={30} />
                  </button>
                </div>
              </div>
              <div className="p-4 sm:p-6 overflow-y-auto max-h-[calc(95vh-170px)]">
                <form
                  className="space-y-4 sm:space-y-6"
                  onSubmit={handleSubmit}
                >
                  <div className="bg-gray-50 p-3 sm:p-4 rounded-lg grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label
                        htmlFor="title"
                        className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1 sm:mb-2"
                      >
                        Promotion Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="title"
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                        placeholder="Enter promotion name"
                        required
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="discountValue"
                        className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1 sm:mb-2"
                      >
                        Value <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="discountValue"
                        type="number"
                        value={discountValue}
                        onChange={(e) => setDiscountValue(e.target.value)}
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                        placeholder="e.g. 25 or 10"
                        required
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="startTime"
                        className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1 sm:mb-2"
                      >
                        Start Date <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="startTime"
                        type="date"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                        required
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="endTime"
                        className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1 sm:mb-2"
                      >
                        End Date <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="endTime"
                        type="date"
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                        required
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label
                        htmlFor="detail"
                        className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1 sm:mb-2"
                      >
                        Detail
                      </label>
                      <input
                        id="detail"
                        type="text"
                        value={detail}
                        onChange={(e) => setDetail(e.target.value)}
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                        placeholder="Promotion detail"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label
                        htmlFor="image"
                        className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1 sm:mb-2"
                      >
                        Image
                      </label>
                      <div className="flex items-center gap-3 sm:gap-4">
                        <label className="cursor-pointer flex flex-col items-center">
                          <span className="px-3 sm:px-4 py-1 sm:py-2 bg-blue-50 border border-blue-200 rounded-lg text-blue-700 hover:bg-blue-100 text-sm sm:text-base">
                            Choose Image
                          </span>
                          <input
                            id="image"
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                          />
                        </label>
                        {imagePreview && (
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded border border-gray-200"
                          />
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 sm:gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setShowFormPopup(false);
                        resetForm();
                      }}
                      className="px-4 sm:px-6 py-2 sm:py-3 text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg text-sm sm:text-base"
                      disabled={loading}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg text-sm sm:text-base"
                      disabled={loading}
                    >
                      {isEdit ? "Save Promotion" : "Add Promotion"}
                    </button>
                  </div>
                </form>
              </div>
              {loading && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                  <div className="bg-white rounded-lg p-4 sm:p-6 flex flex-col items-center shadow-xl">
                    <svg
                      className="animate-spin h-6 sm:h-8 w-6 sm:w-8 text-blue-600 mb-3 sm:mb-4"
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
                    <div className="font-semibold text-base sm:text-lg text-blue-700">
                      {isEdit
                        ? "Đang cập nhật khuyến mãi..."
                        : "Đang thêm khuyến mãi..."}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Loading Overlay */}
        {!showFormPopup && loading && (
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
        <ToastContainer position="top-right" autoClose={2000} />
      </div>
    </div>
  );
};

export default PromotionManagement;
