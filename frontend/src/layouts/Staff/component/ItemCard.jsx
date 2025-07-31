import React from "react";
import { FaClock, FaStar, FaCheckCircle } from "react-icons/fa";
import { IoTicketOutline } from "react-icons/io5";

const ItemCard = ({ item, type, onSelect, selected, small, disabled }) => {
  const handleClick = () => {
    if (!disabled) {
      onSelect && onSelect(item);
    }
  };

  if (!item) return null;

  const truncateText = (text, maxLength) => {
    if (!text) return "";
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  };

  // FIX: Sử dụng đúng field names
  const displayNameEN =
    type === "movie"
      ? truncateText(item?.Title || item?.NameOfEnglish, small ? 12 : 18)
      : truncateText(item?.name, small ? 12 : 18);

  const displayNameVN =
    type === "movie"
      ? truncateText(item?.NameOfVietnamese, small ? 12 : 18)
      : null;

  const fullName =
    type === "movie" ? item?.Title || item?.NameOfEnglish : item?.name;

  return (
    <div
      onClick={handleClick}
      className={`
        relative cursor-pointer rounded-xl overflow-hidden
        transition-all duration-300 ease-in-out
        ${
          selected
            ? "ring-2 ring-purple-500 shadow-xl transform translate-y-[-4px] bg-gradient-to-br from-purple-50 to-purple-100"
            : "hover:shadow-lg hover:translate-y-[-2px] bg-white border border-gray-200 hover:border-purple-300"
        }
        ${disabled ? "opacity-50 cursor-not-allowed" : ""}
        ${
          type === "movie"
            ? small
              ? "w-[200px] h-[320px]"
              : "w-[250px] h-[360px]"
            : small
            ? "w-[180px] h-[260px]"
            : "w-[240px] h-[320px]"
        }
      `}
      title={fullName}
    >
      {/* Selection Indicator */}
      {selected && (
        <div className="absolute top-2 right-2 z-20">
          <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center shadow-lg">
            <FaCheckCircle className="text-white text-xs" />
          </div>
        </div>
      )}

      {/* Image Section - FIX: Better image fit */}
      <div className="relative overflow-hidden">
        <img
          alt={displayNameEN}
          src={item?.PosterImage || item?.image}
          loading="lazy"
          onError={(e) => {
            e.target.src =
              "https://via.placeholder.com/250x350/f0f0f0/666?text=No+Image";
          }}
          className={`w-full object-cover object-center ${
            small ? "h-[200px]" : type === "movie" ? "h-[300px]" : "h-[240px]"
          }`}
          style={{
            objectPosition: "center top", // Đảm bảo focus vào phần trên của poster
          }}
        />

        {/* Overlay with rating for movies or quantity for combo */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
          {type === "movie" && item?.AverageRating ? (
            <div className="flex items-center justify-center gap-1 text-yellow-400 text-xs">
              <FaStar />
              <span className="text-white font-medium">
                {item.AverageRating}
              </span>
            </div>
          ) : type === "combo" && item?.quantity !== undefined ? (
            <div className="flex items-center justify-center gap-1 text-xs">
              <span className="text-white font-medium">
                {item.quantity > 0 ? `Stock: ${item.quantity}` : "Out of Stock"}
              </span>
            </div>
          ) : null}
        </div>
      </div>

      {/* Content Section - Clean Layout */}
      <div className="p-3 h-[60px] flex flex-col justify-between">
        {/* Title */}
        <h3
          className={`font-semibold text-gray-800 text-center leading-tight ${
            small ? "text-xs" : "text-sm"
          }`}
          title={fullName}
        >
          {displayNameEN}
        </h3>
        {/* Vietnamese name for movies only */}
        {type === "movie" && displayNameVN && (
          <p className="text-xs text-gray-500 text-center mt-1">
            {displayNameVN}
          </p>
        )}
        {/* Price for combo items */}
        {type === "combo" && item?.price && (
          <div className="bg-purple-100 rounded-md px-2 py-1 mt-2">
            <p
              className={`text-purple-700 font-bold text-center ${
                small ? "text-xs" : "text-sm"
              }`}
            >
              {item.price.toLocaleString("vi-VN")} ₫
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ItemCard;
