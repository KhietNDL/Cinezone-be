// PromotionCard.jsx - Component tối ưu cho promotion
import React, { memo, useCallback } from "react";
import { Copy, Gift, Percent, Sparkles } from "lucide-react";

const PromotionCard = memo(
  ({ item, isHovered, onMouseEnter, onMouseLeave, onCopyPromotion }) => {
    const handleMouseEnter = useCallback(() => {
      onMouseEnter(item.PromotionId);
    }, [item.PromotionId, onMouseEnter]);

    const handleCopyClick = useCallback(() => {
      onCopyPromotion(item);
    }, [item, onCopyPromotion]);

    return (
      <div
        className="w-full flex flex-col justify-center items-center pb-2 rounded-xl space-y-2"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        <div className="relative h-[180px] w-full md:h-[200px] lg:h-[180px]">
          <img
            src={item.Image}
            alt={item.Title}
            className="w-full rounded-md h-full object-cover transition-transform duration-300"
            loading="lazy"
          />

          {/* Hover: Show code/title */}
          {isHovered && (
            <div
              className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-md cursor-pointer transition"
              onClick={handleCopyClick}
            >
              <span className="text-white text-lg font-bold bg-black/60 px-4 py-2 rounded shadow">
                {item.Title || item.title}
              </span>
            </div>
          )}

          {/* Decorative circles and dashed line */}
          <div className="absolute w-[40px] md:w-[60px] h-[40px] md:h-[60px] lg:w-[50px] lg:h-[50px] rounded-full bg-black top-[-20px] md:top-[-30px] md:right-[10%] lg:right-[20%] right-[20%] transform translate-x-1/2 md:translate-x-0"></div>
          <div className="absolute w-[40px] md:w-[60px] h-[40px] md:h-[60px] lg:w-[50px] lg:h-[50px] rounded-full bg-black bottom-[-20px] md:bottom-[-30px] lg:right-[20%] md:right-[10%] right-[20%] transform translate-x-1/2 md:translate-x-0"></div>
          <div className="absolute h-[75%] top-[12%] border-dashed border-black border-2 md:right-[45px] right-[70px] lg:right-[35%] xl:right-[27%]"></div>
        </div>
      </div>
    );
  }
);

PromotionCard.displayName = "PromotionCard";

export default PromotionCard;
