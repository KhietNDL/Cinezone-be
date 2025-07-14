import React from "react";

const StatsCards = ({ totalProducts, products }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 lg:gap-4 w-full">
      <div className="bg-white rounded-md p-2 sm:p-3 flex-1 shadow-sm">
        <div className="flex items-center justify-between">
          <p className="text-slate-500 text-sm sm:text-base">Total Products</p>
          <div className="p-1 sm:p-2 bg-blue-100 rounded-lg flex items-center justify-center">
            <div className="w-4 h-4 sm:wLisa-5 sm:h-5 bg-blue-500 rounded"></div>
          </div>
        </div>
        <p className="font-bold text-base sm:text-[19px]">{totalProducts}</p>
      </div>
      <div className="bg-white rounded-md p-2 sm:p-3 flex-1 shadow-sm">
        <div className="flex items-center justify-between">
          <p className="text-slate-500 text-sm sm:text-base">In Stock</p>
          <div className="p-1 sm:p-2 bg-green-100 rounded-lg flex items-center justify-center">
            <div className="w-4 h-4 sm:w-5 sm:h-5 bg-green-500 rounded"></div>
          </div>
        </div>
        <p className="font-bold text-base sm:text-[19px]">
          {products.filter((p) => p.Quantity > 10).length}
        </p>
      </div>
      <div className="bg-white rounded-md p-2 sm:p-3 flex-1 shadow-sm">
        <div className="flex items-center justify-between">
          <p className="text-slate-500 text-sm">Low Stock</p>
          <div className="p-1 sm:p-2 bg-yellow-100 rounded-lg flex items-center justify-center">
            <div className="w-4 h-4 sm:w-5 sm:h-5 bg-yellow-500 rounded"></div>
          </div>
        </div>
        <p className="font-bold text-base sm:text-[19px]">
          {products.filter((p) => p.Quantity > 0 && p.Quantity <= 10).length}
        </p>
      </div>
      <div className="bg-white rounded-md p-2 sm:p-3 flex-1 shadow-sm">
        <div className="flex items-center justify-between">
          <p className="text-slate-500 text-sm sm:text-base">Out of Stock</p>
          <div className="p-1 sm:p-2 bg-red-100 rounded-lg flex items-center justify-center">
            <div className="w-4 h-4 sm:w-5 sm:h-5 bg-red-500 rounded"></div>
          </div>
        </div>
        <p className="font-bold text-base sm:text-[19px]">
          {products.filter((p) => p.Quantity === 0).length}
        </p>
      </div>
    </div>
  );
};

export default StatsCards;
