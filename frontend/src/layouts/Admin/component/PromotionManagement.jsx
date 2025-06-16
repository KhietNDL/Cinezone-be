import React, { useState } from "react";
import { Search, Plus, RefreshCw, Bell, X, Calendar } from "lucide-react";
import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBin5Line } from "react-icons/ri";
import { IoSearchOutline } from "react-icons/io5";
import { GoPlus } from "react-icons/go";

const PromotionManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedPromotion, setSelectedPromotion] = useState(null);
  const [editForm, setEditForm] = useState({
    name: "",
    type: "Percentage",
    value: "",
    code: "",
    startDate: "",
    endDate: "",
    status: "Active",
  });
  const [addForm, setAddForm] = useState({
    name: "",
    type: "Percentage",
    value: "",
    code: "",
    startDate: "",
    endDate: "",
    status: "Active",
  });

  const itemsPerPage = 5;

  const [promotions, setPromotions] = useState([
    {
      id: 1,
      name: "Summer Sale",
      description: "Movie ticket discount",
      code: "SUMMER25",
      type: "Percentage",
      value: "25%",
      status: "Active",
      validDate: "2024-06-01",
      expiry: "2024-09-01",
    },
    {
      id: 2,
      name: "Buy 1 Get 1",
      description: "BOGO on Friday",
      code: "FRIBOGO",
      type: "BOGO",
      value: "Free Ticket",
      status: "Active",
      validDate: "2024-05-01",
      expiry: "2024-12-31",
    },
    {
      id: 3,
      name: "Student Special",
      description: "Fixed Discount for Students",
      code: "STUDENT10",
      type: "Fixed",
      value: "$10",
      status: "Expired",
      validDate: "2023-09-01",
      expiry: "2024-01-31",
    },
    {
      id: 4,
      name: "Summer Sale",
      description: "Movie ticket discount",
      code: "SUMMER25",
      type: "Percentage",
      value: "25%",
      status: "Active",
      validDate: "2024-06-01",
      expiry: "2024-09-01",
    },
    {
      id: 5,
      name: "Buy 1 Get 1",
      description: "BOGO on Friday",
      code: "FRIBOGO",
      type: "BOGO",
      value: "Free Ticket",
      status: "Active",
      validDate: "2024-05-01",
      expiry: "2024-12-31",
    },
    {
      id: 6,
      name: "Student Special",
      description: "Fixed Discount for Students",
      code: "STUDENT10",
      type: "Fixed",
      value: "$10",
      status: "Expired",
      validDate: "2023-09-01",
      expiry: "2024-01-31",
    },
  ]);

  const expiringPromotions = [
    {
      name: "Combo Movie Night",
      code: "MOVIENIGHT23",
      expires: "29/06/2025",
    },
    {
      name: "Student Only Deal",
      code: "STUDENT2025",
      expires: "30/06/2025",
    },
    {
      name: "Early Bird Wednesday",
      code: "EARLYBIRD2025",
      expires: "31/06/2025",
    },
  ];

  // Filter promotions by search term
  const filteredPromotions = promotions.filter((promotion) =>
    promotion.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate pagination
  const totalItems = filteredPromotions.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPromotions = filteredPromotions.slice(startIndex, endIndex);

  const getStatusBadge = (status) => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
    switch (status) {
      case "Active":
        return `${baseClasses} bg-green-100 text-green-800`;
      case "Expired":
        return `${baseClasses} bg-red-100 text-red-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const getTypeBadge = (type) => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
    switch (type) {
      case "Percentage":
        return `${baseClasses} bg-blue-100 text-blue-800`;
      case "BOGO":
        return `${baseClasses} bg-orange-100 text-orange-800`;
      case "Fixed":
        return `${baseClasses} bg-purple-100 text-purple-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  const handleDelete = (promotion) => {
    setSelectedPromotion(promotion);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    setPromotions(promotions.filter((p) => p.id !== selectedPromotion.id));
    setShowDeleteModal(false);
    setSelectedPromotion(null);
  };

  const handleEdit = (promotion) => {
    setSelectedPromotion(promotion);
    setEditForm({
      name: promotion.name,
      type: promotion.type,
      value: promotion.value.replace("%", "").replace("$", ""),
      code: promotion.code,
      startDate: promotion.validDate,
      endDate: promotion.expiry,
      status: promotion.status,
    });
    setShowEditModal(true);
  };

  const handleSaveEdit = () => {
    const updatedPromotions = promotions.map((p) =>
      p.id === selectedPromotion.id
        ? {
            ...p,
            name: editForm.name,
            type: editForm.type,
            value:
              editForm.type === "Percentage"
                ? `${editForm.value}%`
                : editForm.type === "Fixed"
                ? `$${editForm.value}`
                : editForm.value,
            code: editForm.code,
            validDate: editForm.startDate,
            expiry: editForm.endDate,
            status: editForm.status,
          }
        : p
    );
    setPromotions(updatedPromotions);
    setShowEditModal(false);
    setSelectedPromotion(null);
  };

  const handleAddPromotion = () => {
    const newPromotion = {
      id: Math.max(...promotions.map((p) => p.id)) + 1,
      name: addForm.name,
      description: `${addForm.name} promotion`,
      code: addForm.code,
      type: addForm.type,
      value:
        addForm.type === "Percentage"
          ? `${addForm.value}%`
          : addForm.type === "Fixed"
          ? `$${addForm.value}`
          : addForm.value,
      status: addForm.status,
      validDate: addForm.startDate,
      expiry: addForm.endDate,
    };
    setPromotions([...promotions, newPromotion]);
    setShowAddModal(false);
    setAddForm({
      name: "",
      type: "Percentage",
      value: "",
      code: "",
      startDate: "",
      endDate: "",
      status: "Active",
    });
  };

  // Modal Component
  const Modal = ({ show, onClose, children, title }) => {
    if (!show) return null;

    return (
      <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">{title}</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>
          </div>
          {children}
        </div>
      </div>
    );
  };

  return (
    <div className="p-[20px] flex items-center h-full justify-between">
      {/* Header Stats */}
      <div className="w-[70%] space-y-4">
        <div className="flex items-center justify-between w-full">
          <div className="bg-white rounded-md p-3 w-[23%] shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-slate-500">Total Promotion</p>
              <div className="p-2 bg-blue-100 rounded-lg flex items-center justify-center">
                <div className="w-[20px] h-[20px] bg-blue-500 rounded"></div>
              </div>
            </div>
            <p className="font-bold text-[19px]">{totalItems}</p>
          </div>

          <div className="bg-white rounded-md p-3 w-[23%] shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-slate-500">Active Promotion</p>
              <div className="p-2 bg-green-100 rounded-lg flex items-center justify-center">
                <div className="w-[20px] h-[20px] bg-green-500 rounded"></div>
              </div>
            </div>
            <p className="font-bold text-[19px]">
              {promotions.filter((p) => p.status === "Active").length}
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
              {promotions.filter((p) => p.status === "Expired").length}
            </p>
          </div>

          <div className="bg-white rounded-md p-3 w-[23%] shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-slate-500">Upcoming</p>
              <div className="p-2 bg-yellow-100 rounded-lg flex items-center justify-center">
                <div className="w-[20px] h-[20px] bg-yellow-500 rounded"></div>
              </div>
            </div>
            <p className="font-bold text-[19px]">2</p>
          </div>
        </div>

        <div className="w-full py-3 space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="w-full">
              <div className="flex items-center p-1 px-2 w-2/4 rounded-xl bg-white shadow-sm">
                <div className="shrink-0">
                  <IoSearchOutline size={20} />
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => {
                    setCurrentPage(1);
                    setSearchTerm(e.target.value);
                  }}
                  className="p-2 focus:outline-none w-full"
                  placeholder="Search by name "
                />
              </div>
            </div>
            <div className="flex items-center justify-between gap-2">
              <div
                role="button"
                onClick={() => setShowAddModal(true)}
                className="flex items-center text-[#6051F3] hover:bg-slate-50 p-2 rounded-md active:bg-slate-100 bg-white shadow-sm"
              >
                <GoPlus size={20} className="mr-2" />
                Promotion
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white min-h-[340px] max-h-[340px] p-4 rounded-md shadow-sm ">
            <table className="w-full table-auto border-collapse">
              <thead>
                <tr className="text-left text-slate-500 text-sm border-b border-slate-200">
                  <th className="py-2 text-center">#</th>
                  <th className="py-2 px-6">Promotion Name</th>
                  <th className="py-2 text-center">Code</th>
                  <th className="py-2 text-center">Type</th>
                  <th className="py-2 text-center">Value</th>
                  <th className="py-2 text-center">Status</th>
                  <th className="py-2 text-center">Valid Date</th>
                  <th className="py-2 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentPromotions.map((promotion) => (
                  <tr
                    key={promotion.id}
                    className="border-b border-slate-200 hover:bg-slate-100 text-sm"
                  >
                    <td className="py-2 text-center">{promotion.id}</td>
                    <td className="px-6 py-2 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {promotion.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {promotion.description}
                        </div>
                      </div>
                    </td>
                    <td className="py-2 text-center">{promotion.code}</td>
                    <td className="py-2 text-center">
                      <span className={getTypeBadge(promotion.type)}>
                        {promotion.type}
                      </span>
                    </td>
                    <td className="py-2 text-center">{promotion.value}</td>
                    <td className="py-2 text-center">
                      <span className={getStatusBadge(promotion.status)}>
                        {promotion.status}
                      </span>
                    </td>
                    <td className="py-2 text-center">
                      <div className="text-sm text-gray-900">
                        {promotion.validDate}
                      </div>
                      <div className="text-sm text-gray-500">
                        to {promotion.expiry}
                      </div>
                    </td>
                    <td className="px-6 py-2 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <div
                          role="button"
                          onClick={() => handleEdit(promotion)}
                          className="text-blue-500 hover:text-blue-700 cursor-pointer"
                          title="Edit"
                        >
                          <FaRegEdit size={20} />
                        </div>
                        <div
                          role="button"
                          onClick={() => handleDelete(promotion)}
                          className="text-red-400 hover:text-red-600 cursor-pointer"
                          title="Delete"
                        >
                          <RiDeleteBin5Line size={20} />
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200">
            <div className="text-sm text-gray-700">
              Showing {startIndex + 1}-{Math.min(endIndex, totalItems)} of{" "}
              {totalItems} promotions
            </div>
            <div className="flex items-center justify-end space-x-2 pt-4">
              <div
                role="button"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className={`px-3 py-1 text-sm cursor-pointer ${
                  currentPage === 1
                    ? "text-gray-300 cursor-not-allowed"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Previous
              </div>
              {pageNumbers.map((page) => (
                <div
                  role="button"
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-1 text-sm rounded cursor-pointer ${
                    currentPage === page
                      ? "bg-blue-500 text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {page}
                </div>
              ))}
              <div
                role="button"
                onClick={() =>
                  setCurrentPage(Math.min(totalPages, currentPage + 1))
                }
                disabled={currentPage === totalPages}
                className={`px-3 py-1 text-sm cursor-pointer ${
                  currentPage === totalPages
                    ? "text-gray-300 cursor-not-allowed"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Next
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div className="flex items-center right-[-40px] top-[25%] justify-end w-[28%]">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Promotions Expiring Soon
            </h3>
            <Bell className="text-orange-500" size={20} />
          </div>

          <div className="space-y-4">
            {expiringPromotions.map((promo, index) => (
              <div
                key={index}
                className="border-l-4 border-orange-400 pl-4 py-2"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{promo.name}</p>
                    <p className="text-sm text-gray-500">{promo.code}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded">
                      Expires: {promo.expires}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Delete Modal */}
      <Modal
        show={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete promotion?"
      >
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
            <RiDeleteBin5Line className="text-red-500" size={24} />
          </div>
          <p className="text-gray-600 mb-2">
            Are you sure you want to delete this promotion?
          </p>
          <p className="text-sm text-gray-500 mb-6">
            This action cannot be undone.
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => setShowDeleteModal(false)}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={confirmDelete}
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>

      {/* Edit Modal */}
      <Modal
        show={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Promotion"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Promotion Name
            </label>
            <input
              type="text"
              value={editForm.name}
              onChange={(e) =>
                setEditForm({ ...editForm, name: e.target.value })
              }
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g Summer Sale discount"
            />
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Type
              </label>
              <select
                value={editForm.type}
                onChange={(e) =>
                  setEditForm({ ...editForm, type: e.target.value })
                }
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Percentage">Percentage %</option>
                <option value="Fixed">Fixed</option>
                <option value="BOGO">BOGO</option>
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Value
              </label>
              <input
                type="text"
                value={editForm.value}
                onChange={(e) =>
                  setEditForm({ ...editForm, value: e.target.value })
                }
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. 25 or 10"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Code
            </label>
            <input
              type="text"
              value={editForm.code}
              onChange={(e) =>
                setEditForm({ ...editForm, code: e.target.value })
              }
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. SAVE10"
            />
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date
              </label>
              <input
                type="date"
                value={editForm.startDate}
                onChange={(e) =>
                  setEditForm({ ...editForm, startDate: e.target.value })
                }
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Date
              </label>
              <input
                type="date"
                value={editForm.endDate}
                onChange={(e) =>
                  setEditForm({ ...editForm, endDate: e.target.value })
                }
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={editForm.status === "Active"}
                onChange={(e) =>
                  setEditForm({
                    ...editForm,
                    status: e.target.checked ? "Active" : "Inactive",
                  })
                }
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <label className="ml-2 text-sm text-gray-700">Active</label>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={() => setShowEditModal(false)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveEdit}
              className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Save Promotion
            </button>
          </div>
        </div>
      </Modal>
      <Modal
        show={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New Promotion"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Promotion Name
            </label>
            <input
              type="text"
              value={addForm.name}
              onChange={(e) => setAddForm({ ...addForm, name: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter promotion name"
            />
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Type
              </label>
              <select
                value={addForm.type}
                onChange={(e) =>
                  setAddForm({ ...addForm, type: e.target.value })
                }
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Percentage">Percentage %</option>
                <option value="Fixed">Fixed</option>
                <option value="BOGO">BOGO</option>
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Value
              </label>
              <input
                type="text"
                value={addForm.value}
                onChange={(e) =>
                  setAddForm({ ...addForm, value: e.target.value })
                }
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. 25 or 10"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Code
            </label>
            <input
              type="text"
              value={addForm.code}
              onChange={(e) => setAddForm({ ...addForm, code: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. SAVE10"
            />
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date
              </label>
              <input
                type="date"
                value={addForm.startDate}
                onChange={(e) =>
                  setAddForm({ ...addForm, startDate: e.target.value })
                }
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Date
              </label>
              <input
                type="date"
                value={addForm.endDate}
                onChange={(e) =>
                  setAddForm({ ...addForm, endDate: e.target.value })
                }
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={addForm.status === "Active"}
                onChange={(e) =>
                  setAddForm({
                    ...addForm,
                    status: e.target.checked ? "Active" : "Inactive",
                  })
                }
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <label className="ml-2 text-sm text-gray-700">Active</label>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={() => setShowAddModal(false)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleAddPromotion}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Add
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default PromotionManagement;
