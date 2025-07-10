// useDebounce.js
import { useState, useEffect } from "react";

export function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);

    return () => clearTimeout(timer); // Cleanup nếu value thay đổi trước timeout
  }, [value, delay]);

  return debouncedValue;
}
