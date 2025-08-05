import React from "react";
import { Package, CheckCircle, AlertTriangle, XCircle } from "lucide-react";

const StatsCards = ({ totalProducts, products }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 w-full">
      <div className="bg-white rounded-xl p-4 sm:p-5 shadow-md border border-gray-100 hover:shadow-lg transition-all duration-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 text-sm font-medium">Total Products</p>
            <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">
              {totalProducts}
            </p>
          </div>
          <div className="p-3 bg-gradient-to-r from-purple-100 to-purple-200 rounded-lg">
            <Package className="w-6 h-6 text-purple-600" />
          </div>
        </div>
      </div>
      <div className="bg-white rounded-xl p-4 sm:p-5 shadow-md border border-gray-100 hover:shadow-lg transition-all duration-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 text-sm font-medium">In Stock</p>
            <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">
              {products.filter((p) => p.Quantity > 10).length}
            </p>
          </div>
          <div className="p-3 bg-gradient-to-r from-green-100 to-green-200 rounded-lg">
            <CheckCircle className="w-6 h-6 text-green-600" />
          </div>
        </div>
      </div>
      <div className="bg-white rounded-xl p-4 sm:p-5 shadow-md border border-gray-100 hover:shadow-lg transition-all duration-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 text-sm font-medium">Low Stock</p>
            <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">
              {
                products.filter((p) => p.Quantity > 0 && p.Quantity <= 10)
                  .length
              }
            </p>
          </div>
          <div className="p-3 bg-gradient-to-r from-yellow-100 to-yellow-200 rounded-lg">
            <AlertTriangle className="w-6 h-6 text-yellow-600" />
          </div>
        </div>
      </div>
      <div className="bg-white rounded-xl p-4 sm:p-5 shadow-md border border-gray-100 hover:shadow-lg transition-all duration-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 text-sm font-medium">Out of Stock</p>
            <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">
              {products.filter((p) => p.Quantity === 0).length}
            </p>
          </div>
          <div className="p-3 bg-gradient-to-r from-red-100 to-red-200 rounded-lg">
            <XCircle className="w-6 h-6 text-red-600" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsCards;
