import React from "react";
import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBin5Line } from "react-icons/ri";

const PromotionTable = ({
  promotions,
  handleEdit,
  setSelectedPromotion,
  setShowDeletePopup,
  formatDate,
}) => {
  const getStatus = (startTime, endTime) => {
    const now = new Date();
    const start = new Date(startTime);
    const end = new Date(endTime);
    if (end < now)
      return { status: "Expired", class: "bg-rose-200 text-red-700" };
    if (start <= now && now <= end)
      return { status: "Active", class: "bg-green-100 text-green-700" };
    return { status: "Upcoming", class: "bg-yellow-100 text-yellow-700" };
  };

  return (
    <div className="hidden sm:block">
      <table className="w-full table-auto border-collapse">
        <thead>
          <tr className="text-left text-slate-500 text-sm border-b border-slate-200">
            <th className="py-2 text-center w-[200px] shrink-0">Image</th>
            <th className="py-2 px-2 w-[200px] shrink-0">Promotion Name</th>
            <th className="py-2 text-center w-[150px] shrink-0">Value</th>
            <th className="py-2 text-center w-[60px] md:w-[100px] shrink-0">
              Start Date
            </th>
            <th className="py-2 text-center w-[60px] md:w-[100px] shrink-0">
              End Date
            </th>
            <th className="py-2 text-center w-[100px] shrink-0">Status</th>
            <th className="py-2 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {promotions.map((promotion) => {
            const { status, class: statusClass } = getStatus(
              promotion.StartTime || promotion.startTime,
              promotion.EndTime || promotion.endTime
            );
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
  );
};

export default PromotionTable;
