import React from "react";

const ItemCard = ({ item, type, onSelect, selected, small, disabled }) => {

  const handleClick = () => {
    if (!disabled) {
      onSelect && onSelect(item);
    }
  };

  const formatPrice = (price) => {
    return price?.toLocaleString('vi-VN');
  };

  if (!item) return null;

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

  // Xác định màu cho quantity
  let quantityColor = "text-green-700";
  if (item?.quantity === 0) {
    quantityColor = "text-gray-700";
  } else if (item?.quantity < 5) {
    quantityColor = "text-red-600";
  } else if (item?.quantity < 10) {
    quantityColor = "text-orange-500";
  } else if (item?.quantity >= 11) {
    quantityColor = "text-green-700";
  }

  return (
    <div
      onClick={handleClick}
      className={`cursor-pointer rounded-xl border border-gray-300 
                 transition-transform duration-300 ease-in-out hover:scale-105
        ${selected ? "shadow-[0_10px_10px_gray]" : "none"}
        ${type === "movie"
          ? small
            ? "w-[170px] h-[280px] min-h-[220px]"
            : "w-[250px] h-[420px] min-h-[350px]"
          : small
            ? "w-[140px] h-[180px]"
            : "w-[250px] h-[380px]"
        }`}
      title={fullName}
      style={{ position: "relative", overflow: "hidden" }}
    >
      {type === "movie" ? (
        <img
          alt={item?.NameOfEnglish}
          src={item?.PosterImage}
          loading="lazy"
          className={`w-full ${small ? "h-[230px]" : "h-[350px]"} object-cover rounded-tl-xl rounded-tr-xl mx-auto`}
        />
      ) : (
        <div style={{ position: "relative" }}>
          <img
            alt={item?.name}
            src={item?.image}
            className={`w-full object-cover rounded-tl-xl rounded-tr-xl mx-auto
                      ${small ? "h-[100px] max-h-[100px]" : "h-[250px] max-h-[250px]"}
                      ${item?.quantity === 0 ? "opacity-40 grayscale" : ""}`
            }
          />
          {item?.quantity === 0 && (
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: small ? "100px" : "250px",
                background: "rgba(0,0,0,0.5)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                fontWeight: "bold",
                fontSize: small ? 24 : 40,
                letterSpacing: 2,
                zIndex: 2,
                borderRadius: "12px"
              }}
            >
              SOLD
            </div>
          )}
        </div>
      )}

      <div
        className={`p-2 font-semibold text-center uppercase flex flex-col text-gray-700 ${small ? "text-[11px]" : "text-md"
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
          <div className={`p-2 font-bold ${quantityColor}`}>
            Quantity: {item?.quantity}
          </div>
        </div>
      )}
    </div>
  );
};

export default ItemCard;