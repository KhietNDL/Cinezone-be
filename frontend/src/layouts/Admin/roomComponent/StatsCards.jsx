import React from "react";
import { Building, Users, TrendingUp } from "lucide-react";

const StatsCards = ({
  totalRooms = 0,
  totalSeats = 0,
  averageRate = "0%",
  onFilterChange,
  activeFilter = null,
}) => {
  const handleCardClick = (filterType) => {
    // Nếu đã chọn filter hiện tại thì bỏ chọn, ngược lại chọn filter mới
    const newFilter = activeFilter === filterType ? null : filterType;
    if (onFilterChange) {
      onFilterChange(newFilter);
    }
  };

  const cardData = [
    {
      id: "total",
      title: "Total Rooms",
      value: totalRooms,
      icon: Building,
      isClickable: false,
      colors: {
        bg: "from-white to-blue-50/50",
        iconBg: "from-blue-100 to-indigo-100",
        iconColor: "text-blue-600",
        textHover: "group-hover:text-blue-700",
        activeColors: "from-blue-200 to-blue-300",
      },
    },
    {
      id: "seats",
      title: "Total Seats",
      value: totalSeats,
      icon: Users,
      isClickable: false,
      colors: {
        bg: "from-white to-green-50/50",
        iconBg: "from-green-100 to-emerald-100",
        iconColor: "text-green-600",
        textHover: "group-hover:text-green-700",
        activeColors: "from-green-200 to-emerald-300",
      },
    },
    {
      id: "rate",
      title: "Avg Rate",
      value: averageRate,
      icon: TrendingUp,
      isClickable: false,
      colors: {
        bg: "from-white to-orange-50/50",
        iconBg: "from-orange-100 to-amber-100",
        iconColor: "text-orange-600",
        textHover: "group-hover:text-orange-700",
        activeColors: "from-orange-200 to-amber-300",
      },
    },
  ];

  return (
    <div className="grid select-none grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-6 w-full">
      {cardData.map((card) => {
        const Icon = card.icon;
        const isActive = activeFilter === card.id;

        return (
          <div
            key={card.id}
            onClick={() => card.isClickable && handleCardClick(card.id)}
            className={`
              bg-white rounded-xl p-4 sm:p-6 flex-1 shadow-lg border border-gray-100 
              hover:shadow-xl transition-all duration-300 transform hover:scale-105
              ${card.isClickable ? "cursor-pointer" : "cursor-default"}
              ${
                isActive
                  ? `bg-gradient-to-br ${card.colors.activeColors} text-gray-800 border-transparent shadow-xl scale-105`
                  : `bg-gradient-to-br ${card.colors.bg} hover:border-gray-200`
              }
              group
            `}
          >
            <div className="flex items-center justify-between">
              <div>
                <p
                  className={`text-sm sm:text-base font-medium mb-2 ${
                    isActive ? "text-gray-700" : "text-slate-600"
                  }`}
                >
                  {card.title}
                </p>
                <p
                  className={`font-bold text-xl sm:text-2xl transition-colors duration-300 ${
                    isActive
                      ? "text-gray-800"
                      : `text-gray-800 ${card.colors.textHover}`
                  }`}
                >
                  {typeof card.value === "number"
                    ? card.value?.toLocaleString()
                    : card.value || "0"}
                </p>
                {isActive && card.isClickable && (
                  <p className="text-xs text-gray-600 mt-1 font-medium">
                    Click to clear filter
                  </p>
                )}
              </div>
              <div
                className={`
                p-3 sm:p-4 rounded-xl flex items-center justify-center 
                shadow-md group-hover:shadow-lg transition-all duration-300 group-hover:scale-110
                ${
                  isActive
                    ? "bg-white/80 backdrop-blur-sm"
                    : `bg-gradient-to-r ${card.colors.iconBg}`
                }
              `}
              >
                <Icon
                  size={20}
                  className={isActive ? "text-gray-600" : card.colors.iconColor}
                />
              </div>
            </div>

            {/* Active indicator */}
            {isActive && card.isClickable && (
              <div className="absolute top-2 right-2 w-3 h-3 bg-gray-600 rounded-full animate-pulse"></div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default StatsCards;
