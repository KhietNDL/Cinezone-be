import React from "react";
import { Package, CheckCircle, AlertTriangle, XCircle } from "lucide-react";

const StatsCards = ({
  totalProducts,
  products,
  activeFilter,
  handleFilterChange,
}) => {
  const handleCardClick = (filter) => {
    if (handleFilterChange) {
      handleFilterChange(filter);
    }
  };

  const cardData = [
    {
      id: "all",
      title: "Total Products",
      value: totalProducts,
      icon: Package,
      isClickable: true,
      colors: {
        bg: "from-white to-purple-50/50",
        iconBg: "from-purple-100 to-purple-200",
        iconColor: "text-purple-600",
        textHover: "group-hover:text-purple-700",
        activeColors: "from-purple-200 to-purple-300",
      },
    },
    {
      id: "in_stock",
      title: "In Stock",
      value: products.filter((p) => p.Quantity > 10).length,
      icon: CheckCircle,
      isClickable: true,
      colors: {
        bg: "from-white to-green-50/50",
        iconBg: "from-green-100 to-green-200",
        iconColor: "text-green-600",
        textHover: "group-hover:text-green-700",
        activeColors: "from-green-200 to-green-300",
      },
    },
    {
      id: "low_stock",
      title: "Low Stock",
      value: products.filter((p) => p.Quantity > 0 && p.Quantity <= 10).length,
      icon: AlertTriangle,
      isClickable: true,
      colors: {
        bg: "from-white to-yellow-50/50",
        iconBg: "from-yellow-100 to-yellow-200",
        iconColor: "text-yellow-600",
        textHover: "group-hover:text-yellow-700",
        activeColors: "from-yellow-200 to-yellow-300",
      },
    },
    {
      id: "out_of_stock",
      title: "Out of Stock",
      value: products.filter((p) => p.Quantity === 0).length,
      icon: XCircle,
      isClickable: true,
      colors: {
        bg: "from-white to-red-50/50",
        iconBg: "from-red-100 to-red-200",
        iconColor: "text-red-600",
        textHover: "group-hover:text-red-700",
        activeColors: "from-red-200 to-red-300",
      },
    },
  ];

  return (
    <div className="grid select-none grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 w-full">
      {cardData.map((card) => {
        const Icon = card.icon;
        const isActive = activeFilter === card.id;

        return (
          <div
            key={card.id}
            onClick={() => card.isClickable && handleCardClick(card.id)}
            className={`
              bg-white rounded-xl p-4 sm:p-5 shadow-md border border-gray-100 
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
                  className={`text-gray-600 text-sm font-medium ${
                    isActive ? "text-gray-700" : ""
                  } ${card.colors.textHover}`}
                >
                  {card.title}
                </p>
                <p
                  className={`text-2xl sm:text-3xl font-bold mt-1 ${
                    isActive ? "text-gray-800" : "text-gray-900"
                  }`}
                >
                  {card.value}
                </p>
              </div>
              <div
                className={`p-3 rounded-lg ${
                  isActive
                    ? card.colors.activeColors
                    : `bg-gradient-to-r ${card.colors.iconBg}`
                }`}
              >
                <Icon className={`w-6 h-6 ${card.colors.iconColor}`} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StatsCards;
