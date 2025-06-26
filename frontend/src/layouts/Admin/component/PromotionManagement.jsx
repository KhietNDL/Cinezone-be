import React, { useState, useEffect } from "react";
import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBin5Line } from "react-icons/ri";
import { IoSearchOutline } from "react-icons/io5";
import { GoPlus } from "react-icons/go";
import {
  getPromotion,
  createPromotion,
  deletePromotion,
  updatePromotion,
} from "../../../services/API";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { MdOutlineClose } from "react-icons/md";
import Pagination from "../movieComponent/Pagination";
const PromotionManagement = () => {
  // State cho form
  const [promotionId, setPromotionId] = useState("");
  const [title, setTitle] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [discountValue, setDiscountValue] = useState("");
  const [detail, setDetail] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null); // Thêm vào đầu component PromotionManagement
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 2; // Số lượng khuyến mãi hiển thị trên mỗi trang
  const [searchTerm, setSearchTerm] = useState("");
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [selectedPromotion, setSelectedPromotion] = useState(null);
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [showFormPopup, setShowFormPopup] = useState(false);
  const [pagination, setPagination] = useState({
    total: 0,
    currentPage: 1,
    totalPages: 1,
    limit: itemsPerPage,
  });
  const fetchPromotions = async (page = currentPage) => {
    setLoading(true);
    try {
      const response = await getPromotion({
        currentPage: page,
        limit: itemsPerPage,
      });
      if (response.data) setPromotions(response.data);
      if (response.pagination) setPagination(response.pagination);
      setCurrentPage(page);
    } catch (error) {
      console.error("Error fetching promotions:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch promotions
  useEffect(() => {
    fetchPromotions(currentPage);
    // eslint-disable-next-line
  }, [currentPage]);

  const handlePageChange = (page) => {
    if (page !== currentPage && page >= 1 && page <= pagination.totalPages) {
      fetchPromotions(page);
    }
  };
  // Reset form
  const resetForm = () => {
    setPromotionId("");
    setTitle("");
    setStartTime("");
    setEndTime("");
    setDiscountValue("");
    setDetail("");
    setImage(null);
    setImagePreview(null); // Thêm dòng này
    setIsEdit(false);
  };

  // Handle add or edit submit
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
        setIsEdit(false);
        setPromotionId("");
      } else {
        await createPromotion(formData);
        toast.success("Promotion created successfully!");
        setIsEdit(false);
        setPromotionId("");
      }
      resetForm();
      setShowFormPopup(false); // Thêm dòng này để tắt popup sau khi submit thành công
      fetchPromotions();
    } catch (error) {
      console.error("Error saving promotion:", error);
      toast.error("Failed to save promotion. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle edit button
  const handleEdit = (promotion) => {
    console.log("Promotion object:", promotion); // Thêm dòng này để kiểm tra
    setPromotionId(promotion.PromotionId);
    setTitle(promotion.Title || "");
    setStartTime(promotion.StartTime ? promotion.StartTime.split("T")[0] : "");
    setEndTime(promotion.EndTime ? promotion.EndTime.split("T")[0] : "");
    setDiscountValue(promotion.DiscountValue || "");
    setDetail(promotion.Detail || "");
    setImage(null);
    setImagePreview(promotion.Image || null); // Thêm dòng này
    setIsEdit(true);
    setShowFormPopup(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Handle delete
  const handleDelete = async () => {
    setLoading(true);
    try {
      await deletePromotion(selectedPromotion.PromotionId);
      setShowDeletePopup(false);
      setSelectedPromotion(null);
      fetchPromotions();
    } catch (error) {
      console.error("Error deleting promotion:", error);
    } finally {
      setLoading(false);
    }
  };

  // Format date
  const formatDate = (dateString) =>
    dateString ? dateString.split("T")[0] : "";

  // Filter promotions by search term
  const filteredPromotions = promotions.filter((p) =>
    p.Title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Khi chọn ảnh mới:
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  return (
    <div className="flex items-center h-full justify-between">
      <div className="w-[90%] space-y-4 h-[calc(100vh_-_7rem)] overflow-auto">
        <div className="flex items-center justify-between w-full">
          <div className="bg-white rounded-md p-3 w-[23%] shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-slate-500">Total Promotion</p>
              <div className="p-2 bg-blue-100 rounded-lg flex items-center justify-center">
                <div className="w-[20px] h-[20px] bg-blue-500 rounded"></div>
              </div>
            </div>
            <p className="font-bold text-[19px]">{filteredPromotions.length}</p>
          </div>

          <div className="bg-white rounded-md p-3 w-[23%] shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-slate-500">Active Promotion</p>
              <div className="p-2 bg-green-100 rounded-lg flex items-center justify-center">
                <div className="w-[20px] h-[20px] bg-green-500 rounded"></div>
              </div>
            </div>
            <p className="font-bold text-[19px]">
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

          <div className="bg-white rounded-md p-3 w-[23%] shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-slate-500 text-sm">Expired Promotion</p>
              <div className="p-2 bg-red-100 rounded-lg flex items-center justify-center">
                <div className="w-[20px] h-[20px] bg-red-500 rounded"></div>
              </div>
            </div>
            <p className="font-bold text-[19px]">
              {
                promotions.filter((p) => {
                  const now = new Date();
                  const end = new Date(p.EndTime || p.endTime);
                  return end < now;
                }).length
              }
            </p>
          </div>

          <div className="bg-white rounded-md p-3 w-[23%] shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-slate-500">Upcoming</p>
              <div className="p-2 bg-yellow-100 rounded-lg flex items-center justify-center">
                <div className="w-[20px] h-[20px] bg-yellow-500 rounded"></div>
              </div>
            </div>
            <p className="font-bold text-[19px]">
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
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center p-1 px-2 w-2/4 rounded-xl bg-white shadow-sm">
            <IoSearchOutline size={20} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="p-2 focus:outline-none w-full"
              placeholder="Search by name"
            />
          </div>
          {!isEdit && (
            <button
              onClick={() => {
                resetForm();
                setShowFormPopup(true);
              }}
              className="flex items-center text-[#6051F3] hover:bg-slate-50 p-2 rounded-md active:bg-slate-100 bg-white shadow-sm"
            >
              <GoPlus size={20} className="mr-2" />
              Add Promotion
            </button>
          )}
        </div>

        {/* Table */}
        <div className=" bg-white p-4 rounded-md mb-2 shadow-sm">
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="text-left text-slate-500 text-sm border-b border-slate-200">
                <th className="py-2 text-center w-[50px] shrink-0">#</th>
                <th className="py-2 text-center w-[200px] shrink-0">Image</th>
                <th className="py-2 px-2 w-[200px] shrink-0">Promotion Name</th>
                <th className="py-2 text-center w-[150px] shrink-0">Value</th>
                <th className="py-2 text-center w-[100px] shrink-0">
                  Start Date
                </th>
                <th className="py-2 text-center w-[100px] shrink-0">
                  End Date
                </th>
                <th className="py-2 text-center w-[100px] shrink-0">Status</th>
                <th className="py-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPromotions.map((promotion, index) => {
                const now = new Date();
                const start = new Date(
                  promotion.StartTime || promotion.startTime
                );
                const end = new Date(promotion.EndTime || promotion.endTime);
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
                    <td className="py-2 text-center w-[50px] shrink-0">
                      {index + 1}
                    </td>
                    <td className="py-2 text-center w-[200px] shrink-0">
                      {promotion.Image ? (
                        <img
                          src={promotion.Image}
                          alt={promotion.Title}
                          className="w-30 h-24 object-cover rounded mx-auto"
                        />
                      ) : (
                        <span className="text-gray-400 italic">No image</span>
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
                      {promotion.DiscountValue}
                    </td>
                    <td className="py-2 text-center">
                      <div className="text-sm text-gray-900 w-[150px] shrink-0">
                        {formatDate(promotion.StartTime)}
                      </div>
                    </td>
                    <td className="py-2 text-center">
                      <div className="text-sm text-gray-900 w-[150px] shrink-0">
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
                          onClick={() => {
                            handleEdit(promotion);
                            setShowFormPopup(true);
                          }}
                          className="text-blue-500 hover:text-blue-700 cursor-pointer"
                          title="Edit"
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
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            handlePageChange={handlePageChange}
          />
        </div>
      </div>

      {/* Delete Popup */}
      {showDeletePopup && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999]">
          <div className="bg-white rounded-lg p-6 flex flex-col items-center shadow-xl">
            <RiDeleteBin5Line className="text-red-500" size={40} />
            <div className="font-semibold text-lg text-gray-700 my-2">
              Are you sure you want to delete this promotion?
            </div>
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => setShowDeletePopup(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                disabled={loading}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Form Add/Edit Promotion */}
      {showFormPopup && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-xl max-h-[95vh] overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">
                    {isEdit ? "Edit Promotion" : "Add New Promotion"}
                  </h2>
                  <p className="text-blue-100 text-sm mt-1">
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
                  className="p-2 hover:bg-white/10 rounded-full transition-colors"
                  aria-label="Close"
                >
                  <MdOutlineClose size={24} />
                </button>
              </div>
            </div>
            {/* Form Body */}
            <div className="p-6 overflow-y-auto max-h-[calc(95vh-170px)]">
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="bg-gray-50 p-4 rounded-lg grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Promotion Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Enter promotion name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Value <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      value={discountValue}
                      onChange={(e) => setDiscountValue(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="e.g. 25 or 10"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Start Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      End Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Detail
                    </label>
                    <input
                      type="text"
                      value={detail}
                      onChange={(e) => setDetail(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Promotion detail"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Image
                    </label>
                    <div className="flex items-center gap-4">
                      <label className="cursor-pointer flex flex-col items-center">
                        <span className="px-4 py-2 bg-blue-50 border border-blue-200 rounded-lg text-blue-700 hover:bg-blue-100 transition-colors">
                          Choose Image
                        </span>
                        <input
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
                          className="w-24 h-24 object-cover rounded border border-gray-200"
                        />
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowFormPopup(false);
                      resetForm();
                    }}
                    className="px-6 py-3 text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg font-medium transition-colors"
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg font-medium transition-all shadow-md hover:shadow-lg"
                    disabled={loading}
                  >
                    {isEdit ? "Save Promotion" : "Add Promotion"}
                  </button>
                </div>
              </form>
            </div>
            {loading && (
              <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 flex flex-col items-center shadow-xl">
                  <svg
                    className="animate-spin h-8 w-8 text-blue-600 mb-4"
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
                  <div className="font-semibold text-lg text-blue-700">
                    {isEdit
                      ? "Đang cập nhật khuyến mãi, vui lòng chờ..."
                      : "Đang thêm khuyến mãi, vui lòng chờ..."}
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
          <div className="bg-white rounded-lg p-6 flex flex-col items-center shadow-xl">
            <svg
              className="animate-spin h-8 w-8 text-indigo-600 mb-4"
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
            <div className="font-semibold text-lg text-indigo-700">
              Đang xử lý, vui lòng chờ...
            </div>
          </div>
        </div>
      )}
      <ToastContainer position="top-right" autoClose={2000} />
    </div>
  );
};

export default PromotionManagement;
