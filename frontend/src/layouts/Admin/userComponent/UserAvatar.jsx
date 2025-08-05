import React, { useState } from "react";

const UserAvatar = ({
  avatarUrl,
  fullName,
  size = "md",
  className = "",
  showHover = true,
}) => {
  const [imageError, setImageError] = useState(false);
  // Lấy chữ cái đầu từ tên
  const getInitials = (name) => {
    if (!name) return "U";
    const names = name.trim().split(" ");
    if (names.length === 1) {
      return names[0].charAt(0).toUpperCase();
    }
    return (
      names[0].charAt(0) + names[names.length - 1].charAt(0)
    ).toUpperCase();
  };

  // Màu gradient dựa trên tên
  const getGradientColor = (name) => {
    if (!name) return "from-purple-400 to-purple-600";

    const colors = [
      "from-purple-400 to-purple-600",
      "from-blue-400 to-blue-600",
      "from-green-400 to-green-600",
      "from-pink-400 to-pink-600",
      "from-indigo-400 to-indigo-600",
      "from-teal-400 to-teal-600",
      "from-orange-400 to-orange-600",
      "from-red-400 to-red-600",
      "from-yellow-400 to-yellow-600",
      "from-cyan-400 to-cyan-600",
    ];

    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }

    return colors[Math.abs(hash) % colors.length];
  };

  // Kích thước
  const sizeClasses = {
    sm: "w-6 h-6 text-xs",
    md: "w-8 sm:w-10 h-8 sm:h-10 text-xs sm:text-sm",
    lg: "w-12 h-12 text-base",
    xl: "w-16 h-16 text-lg",
  };

  const baseClasses = `
    rounded-full object-cover mx-auto shadow-sm transition-all duration-200 
    ${showHover ? "group-hover:shadow-md group-hover:scale-105" : ""}
    ${sizeClasses[size]}
    ${className}
  `;

  if (avatarUrl && !imageError) {
    return (
      <img
        src={avatarUrl}
        alt={fullName || "Avatar"}
        loading="lazy"
        className={baseClasses}
        onError={() => {
          setImageError(true);
        }}
      />
    );
  }

  return (
    <div
      className={`
        ${baseClasses}
        bg-gradient-to-br ${getGradientColor(fullName)}
        flex items-center justify-center font-semibold text-white
        border-2 border-white shadow-lg
      `}
      title={fullName || "User"}
    >
      {getInitials(fullName)}
    </div>
  );
};

export default UserAvatar;
