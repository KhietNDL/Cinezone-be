import React from "react";
import { Badge, CheckCircle, XCircle, Clock } from "lucide-react";

const StatsCards = ({ totalPromotions, promotions }) => {
  const now = new Date();
  const activePromotions = promotions.filter((p) => {
    const start = new Date(p.StartTime || p.startTime);
    const end = new Date(p.EndTime || p.endTime);
    return start <= now && now <= end;
  }).length;
  const expiredPromotions = promotions.filter((p) => {
    const end = new Date(p.EndTime || p.endTime);
    return end < now;
  }).length;
  const upcomingPromotions = promotions.filter((p) => {
    const start = new Date(p.StartTime || p.startTime);
    return start > now;
  }).length;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 w-full">
      <div className="bg-white rounded-xl p-4 sm:p-5 shadow-md border border-gray-100 hover:shadow-lg transition-all duration-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 text-sm font-medium">
              Total Promotions
            </p>
            <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">
              {totalPromotions}
            </p>
          </div>
          <div className="p-3 bg-gradient-to-r from-purple-100 to-purple-200 rounded-lg">
            <Badge className="w-6 h-6 text-purple-600" />
          </div>
        </div>
      </div>
      <div className="bg-white rounded-xl p-4 sm:p-5 shadow-md border border-gray-100 hover:shadow-lg transition-all duration-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 text-sm font-medium">
              Active Promotions
            </p>
            <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">
              {activePromotions}
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
            <p className="text-gray-600 text-sm font-medium">
              Expired Promotions
            </p>
            <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">
              {expiredPromotions}
            </p>
          </div>
          <div className="p-3 bg-gradient-to-r from-red-100 to-red-200 rounded-lg">
            <XCircle className="w-6 h-6 text-red-600" />
          </div>
        </div>
      </div>
      <div className="bg-white rounded-xl p-4 sm:p-5 shadow-md border border-gray-100 hover:shadow-lg transition-all duration-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 text-sm font-medium">Upcoming</p>
            <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">
              {upcomingPromotions}
            </p>
          </div>
          <div className="p-3 bg-gradient-to-r from-yellow-100 to-yellow-200 rounded-lg">
            <Clock className="w-6 h-6 text-yellow-600" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsCards;
