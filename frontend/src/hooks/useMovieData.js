// useMovieData.js - Custom hook để quản lý data fetching
import { useState, useCallback, useEffect } from "react";
import {
  getCurrentMovies,
  getMovies,
  getPromotion,
  getUpcomingMovies,
} from "../services/API";

export const useMovieData = (itemsPerPage = 5, currentPage = 1) => {
  const [movieData, setMovieData] = useState([]);
  const [currentMovies, setCurrentMovies] = useState([]);
  const [upcomingMovies, setUpcomingMovies] = useState([]);
  const [promotionData, setPromotionData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Optimized API calls
  const fetchPromotions = useCallback(async () => {
    try {
      const res = await getPromotion();
      if (res?.data) {
        setPromotionData(res.data);
      }
    } catch (error) {
      console.error("Error fetching promotions:", error);
      setPromotionData([]);
      setError(error);
    }
  }, []);

  const getMovie = useCallback(async () => {
    try {
      const response = await getMovies({
        limit: itemsPerPage,
        page: currentPage,
      });
      if (response?.data) {
        setMovieData(response.data);
      }
    } catch (error) {
      console.error("Error fetching movies:", error);
      setError(error);
    }
  }, [itemsPerPage, currentPage]);

  const getCurrentMovie = useCallback(async () => {
    try {
      const response = await getCurrentMovies({
        limit: itemsPerPage,
        page: currentPage,
      });
      if (response?.data) {
        setCurrentMovies(response.data);
      }
    } catch (error) {
      console.error("Error fetching current movies:", error);
      setError(error);
    }
  }, [itemsPerPage, currentPage]);

  const getUpcomingMovie = useCallback(async () => {
    try {
      const response = await getUpcomingMovies({
        limit: itemsPerPage,
        page: currentPage,
      });
      if (response?.data) {
        setUpcomingMovies(response.data);
      }
    } catch (error) {
      console.error("Error fetching upcoming movies:", error);
      setError(error);
    }
  }, [itemsPerPage, currentPage]);

  // Gộp tất cả API calls vào một hàm để giảm số lần render
  const fetchAllData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Sử dụng Promise.allSettled để tránh fail toàn bộ nếu 1 API lỗi
      const results = await Promise.allSettled([
        getCurrentMovie(),
        getUpcomingMovie(),
        getMovie(),
        fetchPromotions(),
      ]);

      // Log errors nếu có
      results.forEach((result, index) => {
        if (result.status === "rejected") {
          const apiNames = [
            "getCurrentMovie",
            "getUpcomingMovie",
            "getMovie",
            "fetchPromotions",
          ];
          console.error(`${apiNames[index]} failed:`, result.reason);
        }
      });
    } catch (error) {
      console.error("Error fetching data:", error);
      setError(error);
    } finally {
      setIsLoading(false);
    }
  }, [getCurrentMovie, getUpcomingMovie, getMovie, fetchPromotions]);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  return {
    movieData,
    currentMovies,
    upcomingMovies,
    promotionData,
    isLoading,
    error,
    refetch: fetchAllData,
  };
};
