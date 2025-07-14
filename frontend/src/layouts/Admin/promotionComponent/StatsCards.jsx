import React from "react";

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
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 lg:gap-4 w-full">
      <div className="bg-white rounded-md p-2 sm:p-3 flex-1 shadow-sm">
        <div className="flex items-center justify-between">
          <p className="text-slate-500 text-sm sm:text-base">Total Promotion</p>
          <div className="p-1 sm:p-2 bg-blue-100 rounded-lg flex items-center justify-center">
            <div className="w-4 h-4 sm:w-5 sm:h-5 bg-blue-500 rounded"></div>
          </div>
        </div>
        <p className="font-bold text-base sm:text-[19px]">{totalPromotions}</p>
      </div>
      <div className="bg-white rounded-md p-2 sm:p-3 flex-1 shadow-sm">
        <div className="flex items-center justify-between">
          <p className="text-slate-500 text-sm sm:text-base">
            Active Promotion
          </p>
          <div className="p-1 sm:p-2 bg-green-100 rounded-lg flex items-center justify-center">
            <div className="w-4 h-4 sm:w-5 sm:h-5 bg-green-500 rounded"></div>
          </div>
        </div>
        <p className="font-bold text-base sm:text-[19px]">{activePromotions}</p>
      </div>
      <div className="bg-white rounded-md p-2 sm:p-3 flex-1 shadow-sm">
        <div className="flex items-center justify-between">
          <p className="text-slate-500 text-sm">Expired Promotion</p>
          <div className="p-1 sm:p-2 bg-red-100 rounded-lg flex items-center justify-center">
            <div className="w-4 h-4 sm:w-5 sm:h-5 bg-red-500 rounded"></div>
          </div>
        </div>
        <p className="font-bold text-base sm:text-[19px]">
          {expiredPromotions}
        </p>
      </div>
      <div className="bg-white rounded-md p-2 sm:p-3 flex-1 shadow-sm">
        <div className="flex items-center justify-between">
          <p className="text-slate-500 text-sm sm:text-base">Upcoming</p>
          <div className="p-1 sm:p-2 bg-yellow-100 rounded-lg flex items-center justify-center">
            <div className="w-4 h-4 sm:w-5 sm:h-5 bg-yellow-500 rounded"></div>
          </div>
        </div>
        <p className="font-bold text-base sm:text-[19px]">
          {upcomingPromotions}
        </p>
      </div>
    </div>
  );
};

export default StatsCards;
