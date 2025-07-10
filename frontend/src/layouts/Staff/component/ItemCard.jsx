import React from "react";

const ItemCard = ({ item, type, onSelect, selected, small }) => {

  const formatPrice = (price) => {
    return price?.toLocaleString('vi-VN');
  };

  if (!item) return null; // An toàn hơn

  const truncateText = (text, maxLength) => {
    if (!text) return "";
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  };

  const displayNameEN =
    type === "movie"
      ? truncateText(item?.NameOfEnglish, small ? 15 : 20)
      : truncateText(item?.name, small ? 15 : 20);

  const displayNameVN =
    type === "movie"
      ? truncateText(item?.NameOfVietnamese, small ? 15 : 20)
      : null;

  const fullName = type === "movie" ? item?.NameOfEnglish : item?.name;

  return (
    <div
      onClick={() => onSelect && onSelect(item)}
      className={`cursor-pointer rounded-xl border border-gray-300 transition-transform
        ${selected ? "shadow-[0_10px_10px_gray]" : "none"}
        ${type === "movie"
          ? small
            ? "w-[170px] h-[270px] min-h-[220px]"
            : "w-[250px] h-[420px] min-h-[350px]"
          : small
            ? "w-[140px] h-[180px]"
            : "w-[250px] h-[380px]"
        }`}
      title={fullName}
    >
      {type === "movie" ? (
        <img
          alt={item?.NameOfEnglish}
          src={item?.PosterImage}
          loading="lazy"
          className={`w-full ${small ? "h-[230px]" : "h-[350px]"} 
          object-cover rounded-tl-xl rounded-tr-xl mx-auto`}
        />
      ) : (
        <img
          alt={item?.name}
          src={item?.image}
          className={`w-full ${small ? "h-[100px]" : "h-[250px]"} 
          object-cover rounded-tl-xl rounded-tr-xl mx-auto`}
        />
      )}

      <div
        className={`p-1 font-semibold text-center uppercase flex flex-col text-gray-700 ${small ? "text-[11px]" : "text-md"
          }`}
      >
        <div>{displayNameEN}</div>
        <div>{displayNameVN}</div>
      </div>

      {type === "combo" && (
        <div className="flex flex-col items-center justify-center">
          <div className="text-xl p-2 font-bold text-center uppercase text-green-700">
            {formatPrice(item?.price?.toFixed ? item.price : item.price)} VNĐ
          </div>
          <div className="p-2">
            Quantity: {item?.quantity}
          </div>
        </div>
      )}
    </div>
  );
};

export default ItemCard;

// import React from "react";

// const ItemCard = ({ item, type, onSelect, selected, small }) => {
//   const formatPrice = (price) => {
//     return price?.toLocaleString('vi-VN');
//   };

//   if (!item) return null;

//   const truncateText = (text, maxLength) => {
//     if (!text) return "";
//     return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
//   };

//   const displayNameEN =
//     type === "movie"
//       ? truncateText(item?.NameOfEnglish, 15) // Luôn giới hạn độ dài cho mobile
//       : truncateText(item?.name, 15);

//   const displayNameVN =
//     type === "movie"
//       ? truncateText(item?.NameOfVietnamese, 15)
//       : null;

//   const fullName = type === "movie" ? item?.NameOfEnglish : item?.name;

//   return (
//     <div
//       onClick={() => onSelect && onSelect(item)}
//       className={`cursor-pointer rounded-xl border border-gray-300 transition-transform
//         ${selected ? "shadow-[0_10px_10px_gray]" : "none"}
//         ${
//           type === "movie"
//             ? "w-[120px] h-[200px] min-h-[200px] md:w-[170px] md:h-[270px] md:min-h-[220px] lg:w-[250px] lg:h-[420px] lg:min-h-[350px]"
//             : "w-[100px] h-[150px] md:w-[140px] md:h-[180px] lg:w-[250px] lg:h-[380px]"
//         }`}
//       title={fullName}
//     >
//       {type === "movie" ? (
//         <img
//           alt={item?.NameOfEnglish}
//           src={item?.PosterImage}
//           loading="lazy"
//           className={`w-full h-[150px] md:h-[230px] lg:h-[350px] object-cover rounded-tl-xl rounded-tr-xl mx-auto`}
//         />
//       ) : (
//         <img
//           alt={item?.name}
//           src={item?.image}
//           className={`w-full h-[80px] md:h-[100px] lg:h-[250px] object-cover rounded-tl-xl rounded-tr-xl mx-auto`}
//         />
//       )}

//       <div
//         className={`p-1 font-semibold text-center uppercase flex flex-col text-gray-700 text-[11px] md:text-lg`}
//       >
//         <div>{displayNameEN}</div>
//         <div>{displayNameVN}</div>
//       </div>

//       {type === "combo" && (
//         <div className="flex flex-col items-center justify-center">
//           <div className="text-sm p-1 md:text-xl md:p-2 font-bold text-center uppercase text-green-700">
//             {formatPrice(item?.price?.toFixed ? item.price : item.price)} VNĐ
//           </div>
//           <div className="p-1 md:p-2 text-xs md:text-base">
//             Quantity: {item?.quantity}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ItemCard;
