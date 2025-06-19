import React from "react";

const ItemCard = ({ item, type, onSelect, selected, small }) => {
  const truncateText = (text, maxLength) => {
    if (!text) return "";
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  };

  const displayNameEN =
    type === "movie"
      ? truncateText(item.NameOfEnglish, small ? 15 : 20)
      : truncateText(item.name, small ? 15 : 20);

  const displayNameVN =
    type === "movie"
      ? truncateText(item.NameOfVietnamese, small ? 15 : 20)
      : null;

  const fullName = type === "movie" ? item.NameOfEnglish : item.name;

  return (
    <div
      onClick={() => onSelect && onSelect(item)}
      className={`cursor-pointer rounded-xl border border-gray-300 transition-transform
        ${selected ? "shadow-[0_10px_10px_gray]" : "none"}
        ${
          type === "movie"
            ? small
              ? "w-[150px] h-[240px] min-h-[240px]"
              : "w-[250px] h-[440px] min-h-[350px]"
            : small
            ? "w-[140px] h-[180px]"
            : "w-[250px] h-[350px]"
        }
        `}
      title={fullName}
    >
      {type === "movie" ? (
        <img
          alt={item.NameOfEnglish}
          src={item.PosterImage}
          loading="lazy"
          className={`w-full ${
            small ? "h-[180px]" : "h-[350px]"
          } object-cover rounded-tl-md rounded-tr-md mx-auto`}
        />
      ) : (
        <img
          alt={item.name}
          src={item.image}
          className={`w-full ${
            small ? "h-[100px]" : "h-[250px]"
          } object-cover rounded-tl-md rounded-tr-md mx-auto`}
        />
      )}
      <div
        className={`mt-2 p-1 font-semibold text-center uppercase flex flex-col text-gray-700 ${
          small ? "text-[11px]" : "text-md"
        }`}
      >
        <div>{displayNameEN}</div>
        <div>{displayNameVN}</div>
      </div>
      {type === "combo" && (
        <div className="mt-2 text-xl p-2 font-bold text-center uppercase text-green-700">
          ${item.price}
        </div>
      )}
    </div>
  );
};

export default ItemCard;
