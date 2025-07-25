import { useState, useEffect } from "react";
import {
  getMovies,
  getCurrentMovies,
  getUpcomingMovies,
} from "../services/API";

// Hook for Hero Section - load immediately
export const useHeroMovies = () => {
  const [movieData, setMovieData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHeroMovies = async () => {
      try {
        setIsLoading(true);
        const response = await getMovies({ page: 1, limit: 5 }); // Get first 5 movies for hero
        setMovieData(response.data || []);
      } catch (err) {
        console.error("Error fetching hero movies:", err);
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHeroMovies();
  }, []);

  return { movieData, isLoading, error };
};

// Hook for Current Movies - lazy load
export const useCurrentMovies = (shouldFetch = false) => {
  const [currentMovies, setCurrentMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!shouldFetch) return;

    const fetchCurrentMovies = async () => {
      try {
        setIsLoading(true);
        const response = await getCurrentMovies({ page: 1, limit: 5 });
        setCurrentMovies(response.data || []);
      } catch (err) {
        console.error("Error fetching current movies:", err);
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCurrentMovies();
  }, [shouldFetch]);

  return { currentMovies, isLoading, error };
};

// Hook for Upcoming Movies - lazy load
export const useUpcomingMovies = (shouldFetch = false) => {
  const [upcomingMovies, setUpcomingMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!shouldFetch) return;

    const fetchUpcomingMovies = async () => {
      try {
        setIsLoading(true);
        const response = await getUpcomingMovies({ page: 1, limit: 5 });
        setUpcomingMovies(response.data || []);
      } catch (err) {
        console.error("Error fetching upcoming movies:", err);
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUpcomingMovies();
  }, [shouldFetch]);

  return { upcomingMovies, isLoading, error };
};
