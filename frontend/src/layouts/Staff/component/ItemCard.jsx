import React from "react";


const ItemCard = ({ item, type, onSelect, selected }) => {

  const truncateText = (text, maxLength = 20) => {
    if (!text) return "";
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  };


  const displayName =
    type === "movie"
      ? truncateText(item.NameOfEnglish)
      : truncateText(item.name);
  const fullName =
    type === "movie" ? item.NameOfEnglish : item.name;

  return (
    <div
      onClick={() => onSelect(item)}
      className={`cursor-pointer rounded-xl border border-gray-300 transition-transform  w-[250px] min-h-[350px]
        ${selected ? 'shadow-[0_10px_10px_gray]' : 'none'}
        ${type === 'movie' ? 'h-[440px]' : 'h-[350px]'}
        `}
      title={fullName}
    >
      {type === 'movie' ?
        <img
          alt={item.NameOfEnglish}
          src={item.PosterImage}
          loading="lazy"
          className="w-full h-[350px] object-cover rounded-tl-md rounded-tr-md mx-auto"
        />
        : <img
          alt={item.name}
          src={item.image}
          className="w-full h-[250px] object-cover rounded-tl-md rounded-tr-md mx-auto"
        />}

      <div className="mt-2 text-sm p-2 font-semibold text-center uppercase text-gray-700">
        {/* {type === 'movie' ? item.NameOfEnglish : item.name} */}
        {displayName}
      </div>

      {type === 'combo' && (
        <div className="mt-2 text-xl p-2 font-bold text-center uppercase text-green-700">
          ${item.price}
        </div>
      )
      }
    </div>
  );
};

export default ItemCard;