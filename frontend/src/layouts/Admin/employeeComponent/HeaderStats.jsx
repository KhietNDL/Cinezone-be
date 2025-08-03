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
  const statsData = [
    {
      id: "total",
      title: "Total Employees",
      value: totalEmployees,
      icon: MdPeopleAlt,
      colors: {
        bg: "from-white to-gray-50",
        activeColors: "from-purple-100 to-purple-200",
        iconBg: "from-blue-100 to-blue-200",
        iconColor: "text-blue-600",
        textColor: "text-blue-700",
      },
      isClickable: false,
    },
    {
      id: "active",
      title: "Active Staff",
      value: activeEmployees,
      icon: MdPeopleAlt,
      colors: {
        bg: "from-white to-gray-50",
        activeColors: "from-green-100 to-green-200",
        iconBg: "from-green-100 to-green-200",
        iconColor: "text-green-600",
        textColor: "text-green-700",
      },
      isClickable: true,
    },
    {
      id: "inactive",
      title: "Inactive Staff",
      value: inactiveEmployees,
      icon: IoCloseSharp,
      colors: {
        bg: "from-white to-gray-50",
        activeColors: "from-red-100 to-red-200",
        iconBg: "from-red-100 to-red-200",
        iconColor: "text-red-600",
        textColor: "text-red-700",
      },
      isClickable: true,
    },
    {
      id: "newHires",
      title: "New Hires",
      value: newHires,
      icon: IoMdPersonAdd,
      colors: {
        bg: "from-white to-gray-50",
        activeColors: "from-blue-100 to-blue-200",
        iconBg: "from-blue-100 to-blue-200",
        iconColor: "text-blue-600",
        textColor: "text-blue-700",
      },
      isClickable: true,
    },
  ];

  return (
    <div className="grid select-none grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6 w-full">
      {statsData.map((card, index) => {
        const IconComponent = card.icon;
        const isActive = activeFilter === card.id;

        return (
          <div
            key={index}
            onClick={() => card.isClickable && handleCardClick(card.id)}
            className={`
                rounded-xl p-4 sm:p-6 flex-1 shadow-lg border transition-all duration-300 transform
                ${
                  card.isClickable
                    ? "cursor-pointer hover:scale-105"
                    : "cursor-default hover:scale-102"
                }
                ${
                  isActive
                    ? `bg-gradient-to-br ${card.colors.activeColors} text-gray-800 border-transparent shadow-xl scale-105`
                    : `bg-gradient-to-br ${card.colors.bg} hover:border-gray-200 border-gray-100 hover:shadow-xl`
                }
                group
              `}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex-1">
                <p
                  className={`text-xs sm:text-sm font-semibold mb-2 ${
                    isActive ? "text-purple-800" : "text-gray-600"
                  }`}
                >
                  {card.title}
                </p>
                <p
                  className={`text-2xl sm:text-3xl font-bold ${
                    isActive ? "text-purple-900" : card.colors.textColor
                  }`}
                >
                  {card.value}
                </p>
              </div>
              <div
                className={`
                  w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br ${
                    isActive
                      ? "from-purple-200 to-purple-300"
                      : card.colors.iconBg
                  } 
                  flex items-center justify-center shadow-md
                  group-hover:shadow-lg transition-all duration-300 group-hover:scale-110
                `}
              >
                <IconComponent
                  size={24}
                  className={
                    isActive ? "text-purple-700" : card.colors.iconColor
                  }
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default HeaderStats;
