import React from "react";
import { X, ShoppingBag, Star, Package, Clock, Gift } from "lucide-react";

const ComboDetailPopup = ({
  showComboDetail,
  setShowComboDetail,
  comboDetail,
}) => {
  if (!showComboDetail || !comboDetail) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[9999] p-2 sm:p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[95vh] overflow-y-auto border border-gray-100 relative">
        {/* Close Button */}
        <button
          type="button"
          onClick={() => setShowComboDetail(false)}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-xl bg-purple-100 hover:bg-purple-200 transition-all duration-200 z-10"
          aria-label="Close"
        >
          <X className="w-4 h-4 text-purple-600" />
        </button>

        {/* Header Section */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-4 sm:px-6 py-3 sm:py-4 text-white rounded-t-xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold">
                {comboDetail.combo.ProductName}
              </h2>
              <p className="text-purple-100 text-xs sm:text-sm mt-1 flex items-center gap-2">
                <Package className="w-4 h-4" />
                Combo Package Details
              </p>
            </div>
            <div className="bg-white/20 rounded-lg p-2">
              <Gift className="w-5 sm:w-6 h-5 sm:h-6" />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-4 sm:p-6">
          {/* Product Image Card */}
          <div className="bg-gradient-to-br from-purple-50 to-indigo-50 p-4 sm:p-6 rounded-xl border border-purple-100 mb-4 sm:mb-6">
            <div className="flex flex-col md:flex-row gap-4 sm:gap-6">
              <div className="flex-shrink-0">
                <img
                  src={comboDetail.combo.ImageUrl}
                  alt={comboDetail.combo.ProductName}
                  className="w-32 sm:w-40 h-32 sm:h-40 object-cover rounded-xl shadow-md mx-auto md:mx-0"
                />
              </div>

              <div className="flex-1">
                <p className="text-gray-700 mb-4 leading-relaxed text-sm sm:text-base">
                  {comboDetail.combo.Description}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="bg-white p-3 sm:p-4 rounded-lg border border-purple-200 shadow-sm">
                    <div className="flex items-center gap-2 mb-1">
                      <ShoppingBag className="w-4 h-4 text-purple-600" />
                      <span className="text-xs sm:text-sm font-medium text-purple-700">
                        Giá combo
                      </span>
                    </div>
                    <div className="text-lg sm:text-2xl font-bold text-purple-600">
                      {Number(comboDetail.combo.Price).toLocaleString("vi-VN")}{" "}
                      ₫
                    </div>
                  </div>

                  <div className="bg-white p-3 sm:p-4 rounded-lg border border-purple-200 shadow-sm">
                    <div className="flex items-center gap-2 mb-1">
                      <Package className="w-4 h-4 text-purple-600" />
                      <span className="text-xs sm:text-sm font-medium text-purple-700">
                        Số lượng
                      </span>
                    </div>
                    <div className="text-lg sm:text-2xl font-bold text-purple-600">
                      {comboDetail.combo.Quantity}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Combo Items Section */}
          <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl border border-purple-100">
            <div className="p-4 sm:p-6 border-b border-purple-200">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-purple-700 rounded-lg flex items-center justify-center">
                  <Star className="w-4 sm:w-5 h-4 sm:h-5 text-white" />
                </div>
                <h3 className="text-base sm:text-xl font-bold text-gray-800">
                  Sản phẩm trong combo
                </h3>
                <div className="bg-purple-100 text-purple-700 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium">
                  {comboDetail.children.length} sản phẩm
                </div>
              </div>
            </div>

            <div className="max-h-60 overflow-y-auto">
              <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
                {comboDetail.children.map((item, index) => (
                  <div
                    key={item.ComboProductId}
                    className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl bg-white border border-purple-200 hover:shadow-sm transition-all duration-200"
                  >
                    <div className="relative">
                      <img
                        src={item.ImageUrl}
                        alt={item.ProductName}
                        className="w-12 sm:w-16 h-12 sm:h-16 object-cover rounded-lg shadow-sm"
                      />
                      <div className="absolute -top-1 -right-1 bg-gradient-to-r from-purple-600 to-purple-700 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                        {index + 1}
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-800 mb-1 text-sm sm:text-base truncate">
                        {item.ProductName}
                      </h4>
                      <p className="text-xs sm:text-sm text-gray-600 mb-2 line-clamp-2">
                        {item.Description}
                      </p>

                      <div className="flex items-center gap-2 sm:gap-4 text-xs">
                        <div className="flex items-center gap-1 bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                          <Package className="w-3 h-3" />
                          <span className="font-medium">{item.Unit}</span>
                        </div>
                        <div className="flex items-center gap-1 bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                          <Clock className="w-3 h-3" />
                          <span className="font-medium">
                            SL: {item.Quantity}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gradient-to-r from-gray-50 to-purple-50/30 px-4 sm:px-6 py-4 sm:py-5 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0 rounded-b-xl">
          <div className="flex items-center gap-2 text-gray-600">
            <Star className="w-4 h-4" />
            <span className="text-xs sm:text-sm">
              Combo tiết kiệm & tiện lợi
            </span>
          </div>
          <button
            onClick={() => setShowComboDetail(false)}
            className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white rounded-xl font-medium transition-all duration-200 shadow-md hover:shadow-lg text-xs sm:text-sm"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default ComboDetailPopup;
