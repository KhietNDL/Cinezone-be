import React, { useEffect } from "react";
import { FaMedal } from "react-icons/fa";

const getTierInfo = (points) => {
  if (points >= 7000)
    return { tier: "Diamond", discount: 10, currentMin: 7000, nextMin: null, nextTier: null };
  if (points >= 3000)
    return { tier: "Gold", discount: 5, currentMin: 3000, nextMin: 7000, nextTier: "Diamond" };
  if (points >= 1000)
    return { tier: "Silver", discount: 3, currentMin: 1000, nextMin: 3000, nextTier: "Gold" };
  return { tier: "None", discount: 0, currentMin: 0, nextMin: 1000, nextTier: "Silver" };
};

const MembershipProgress = ({ points , onTierChange }) => {
  const tierInfo = getTierInfo(points);
  const { tier, discount, currentMin, nextMin, nextTier } = tierInfo;

  const progress = nextMin
    ? ((points - currentMin) / (nextMin - currentMin)) * 100
    : 100;

useEffect(() => {
  if (typeof points === "number" && onTierChange) {
    const tierInfo = getTierInfo(points);
    console.log("points =", points, "→ tierInfo:", tierInfo);
    onTierChange(tierInfo);
  }
}, [points]);
  const getTierGradient = () => {
    switch (tier) {
      case "Silver":
        return "from-gray-400 to-gray-500";
      case "Gold":
        return "from-yellow-400 to-orange-500";
      case "Diamond":
        return "from-blue-400 to-purple-500";
      default:
        return "from-purple-500 via-pink-500 to-yellow-400";
    }
  };

  const getTierShadow = () => {
    switch (tier) {
      case "Silver":
        return "0 0 15px rgba(156, 163, 175, 0.6)";
      case "Gold":
        return "0 0 15px rgba(251, 191, 36, 0.6)";
      case "Diamond":
        return "0 0 15px rgba(147, 51, 234, 0.6)";
      default:
        return "0 0 15px rgba(168, 85, 247, 0.6)";
    }
  };

  return (
   <div className="mt-6 p-4 rounded-2xl bg-white/5 border border-white/10">
            <div className="flex items-center gap-2 mb-3">
                <FaMedal className="text-amber-300" /> 
                <span className="font-semibold">{tier !== "Không có hạng" ? `${tier} Member` : "Chưa có hạng"}</span>
                <span className="text-xs text-gray-400">
                    {nextTier
                        ? `${nextMin - points} points to up ${nextTier} Member`
                        : `Highest member class `}
                </span>
            </div>

            {/* Slim Progress Bar */}
            <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden backdrop-blur-sm shadow-inner relative mb-3">
                <div
                    className={`h-full rounded-full bg-gradient-to-r ${getTierGradient()} transition-all duration-700 ease-out relative`}
                    style={{ 
                        width: `${Math.min(progress, 100)}%`,
                        boxShadow: getTierShadow()
                    }}
                >
                    {/* Shimmer effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-pulse"></div>
                    
                    {/* Moving light streak */}
                    <div 
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent w-4 h-full"
                        style={{ 
                            animation: 'shimmer 2s infinite',
                            transform: `translateX(${Math.sin(Date.now() / 1000) * 10}px)`
                        }}
                    ></div>
                </div>

                {/* Progress dot */}
                {progress > 0 && progress < 100 && (
                    <div
                        className="absolute top-1/2 w-1.5 h-1.5 bg-white rounded-full transform -translate-y-1/2 -translate-x-0.5 transition-all duration-700 animate-pulse"
                        style={{ 
                            left: `${Math.min(progress, 100)}%`,
                            boxShadow: getTierShadow()
                        }}
                    ></div>
                )}
            </div>

            <div className="text-xs text-gray-400 space-y-1">
                <p>
                    Member Points:{" "}
                    <span className="font-bold text-white">{points}</span>
                </p>
                <p>
                    Discount:{" "}
                    <span className="font-bold text-white">{discount}%</span>
                </p>
            </div>

            <style jsx>{`
                @keyframes shimmer {
                    0% { transform: translateX(-20px); }
                    100% { transform: translateX(100px); }
                }
            `}</style>
        </div>
  );
};

export default MembershipProgress;
