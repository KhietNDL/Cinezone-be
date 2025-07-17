import React from "react";
import { X, ShoppingBag, Star, Package, Clock, Gift } from "lucide-react";

const ComboDetailPopup = ({
  showComboDetail,
  setShowComboDetail,
  comboDetail,
}) => {
  if (!showComboDetail || !comboDetail) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[95vh] overflow-hidden border border-gray-100 animate-slideUp relative">
        {/* Close Button */}
        <button
          type="button"
          onClick={() => setShowComboDetail(false)}
          className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-all duration-200 z-10"
          aria-label="Close"
        >
          <X className="w-5 h-5 text-gray-600" />
        </button>

        {/* Header Section */}
        <div className="relative bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 pb-20">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-white/20 rounded-full p-2">
              <Gift className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold">
              {comboDetail.combo.ProductName}
            </h2>
          </div>

          <div className="flex items-center gap-2 text-indigo-100">
            <Package className="w-4 h-4" />
            <span className="text-sm">Combo Package</span>
          </div>
        </div>

        {/* Main Content */}
        <div className="relative -mt-16 mx-6 mb-6">
          {/* Product Image Card */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-gray-100">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-shrink-0">
                <img
                  src={comboDetail.combo.ImageUrl}
                  alt={comboDetail.combo.ProductName}
                  className="w-40 h-40 object-cover rounded-xl shadow-md"
                />
              </div>

              <div className="flex-1">
                <p className="text-gray-700 mb-4 leading-relaxed">
                  {comboDetail.combo.Description}
                </p>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-4 rounded-lg border border-emerald-200">
                    <div className="flex items-center gap-2 mb-1">
                      <ShoppingBag className="w-4 h-4 text-emerald-600" />
                      <span className="text-sm font-medium text-emerald-700">
                        Giá combo
                      </span>
                    </div>
                    <div className="text-2xl font-bold text-emerald-600">
                      {Number(comboDetail.combo.Price).toLocaleString("vi-VN")}{" "}
                      ₫
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
                    <div className="flex items-center gap-2 mb-1">
                      <Package className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium text-blue-700">
                        Số lượng
                      </span>
                    </div>
                    <div className="text-2xl font-bold text-blue-600">
                      {comboDetail.combo.Quantity}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Combo Items Section */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-r from-emerald-100 to-teal-100 rounded-full p-2">
                  <Star className="w-5 h-5 text-emerald-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">
                  Sản phẩm trong combo
                </h3>
                <div className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm font-medium">
                  {comboDetail.children.length} sản phẩm
                </div>
              </div>
            </div>

            <div className="max-h-40 overflow-y-auto">
              <div className="p-6 space-y-4">
                {comboDetail.children.map((item, index) => (
                  <div
                    key={item.ComboProductId}
                    className="group flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 transition-all duration-200 border border-gray-100 hover:border-gray-200 hover:shadow-sm"
                  >
                    <div className="relative">
                      <img
                        src={item.ImageUrl}
                        alt={item.ProductName}
                        className="w-16 h-16 object-cover rounded-lg shadow-sm"
                      />
                      <div className="absolute -top-2 -right-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                        {index + 1}
                      </div>
                    </div>

                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800 mb-1 group-hover:text-indigo-600 transition-colors">
                        {item.ProductName}
                      </h4>
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                        {item.Description}
                      </p>

                      <div className="flex items-center gap-4 text-xs">
                        <div className="flex items-center gap-1 bg-blue-50 text-blue-700 px-2 py-1 rounded-full">
                          <Package className="w-3 h-3" />
                          <span className="font-medium">
                            Đơn vị: {item.Unit}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 bg-emerald-50 text-emerald-700 px-2 py-1 rounded-full">
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
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-gray-600">
              <Star className="w-4 h-4" />
              <span className="text-sm">Combo tiết kiệm & tiện lợi</span>
            </div>
            <button
              onClick={() => setShowComboDetail(false)}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 py-2 rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComboDetailPopup;
