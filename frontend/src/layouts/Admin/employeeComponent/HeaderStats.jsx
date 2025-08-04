import React from "react";
import { MdPeopleAlt } from "react-icons/md";
import { IoTime, IoCloseSharp } from "react-icons/io5";
import { IoMdPersonAdd } from "react-icons/io";

const HeaderStats = ({
  totalEmployees,
  activeEmployees = 0,
  inactiveEmployees = 0,
  newHires = 0,
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
      title: "Total Employees",
      value: totalEmployees,
      icon: MdPeopleAlt,
      isClickable: false,
      colors: {
        bg: "from-white to-blue-50/50",
        iconBg: "from-blue-100 to-indigo-100",
        iconColor: "text-blue-600",
        textHover: "group-hover:text-blue-700",
        activeColors: "from-blue-200 to-blue-300",
      },
      description: "All employees in database",
    },
    {
      id: "active",
      title: "Active Employees",
      value: activeEmployees,
      icon: MdPeopleAlt,
      isClickable: true,
      colors: {
        bg: "from-white to-green-50/50",
        iconBg: "from-green-100 to-emerald-100",
        iconColor: "text-green-600",
        textHover: "group-hover:text-green-700",
        activeColors: "from-green-200 to-emerald-300",
      },
      description: "Employees with IsDeleted = 0",
    },
    {
      id: "inactive",
      title: "Inactive Employees",
      value: inactiveEmployees,
      icon: IoTime,
      isClickable: true,
      colors: {
        bg: "from-white to-red-50/50",
        iconBg: "from-red-100 to-rose-100",
        iconColor: "text-red-600",
        textHover: "group-hover:text-red-700",
        activeColors: "from-red-200 to-rose-300",
      },
      description: "Employees with IsDeleted = 1",
    },
    {
      id: "newHires",
      title: "New Hires (30 days)",
      value: newHires,
      icon: IoMdPersonAdd,
      isClickable: true,
      colors: {
        bg: "from-white to-purple-50/50",
        iconBg: "from-purple-100 to-violet-100",
        iconColor: "text-purple-600",
        textHover: "group-hover:text-purple-700",
        activeColors: "from-purple-200 to-violet-300",
      },
      description: "Based on JoinedDate",
    },
  ];

  return (
    <div className="grid select-none grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6 w-full">
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
                  {card.value?.toLocaleString() || "0"}
                </p>
                {/* Description */}

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

export default HeaderStats;
