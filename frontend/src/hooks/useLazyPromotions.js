import { useState, useEffect } from "react";
import { getPromotion } from "../services/API";

// Hook for Promotions - lazy load
export const usePromotions = (shouldFetch = false) => {
  const [promotionData, setPromotionData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!shouldFetch) return;

    const fetchPromotions = async () => {
      try {
        setIsLoading(true);
        const response = await getPromotion({});

        // Filter active promotions
        const now = new Date();
        const activePromotions = (response.data || []).filter((item) => {
          const start = new Date(item.StartTime || item.startTime);
          const end = new Date(item.EndTime || item.endTime);
          return start <= now && now <= end;
        });

        setPromotionData(activePromotions);
      } catch (err) {
        console.error("Error fetching promotions:", err);
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPromotions();
  }, [shouldFetch]);

  return { promotionData, isLoading, error };
};
