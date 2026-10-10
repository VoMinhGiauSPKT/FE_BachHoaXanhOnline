import { useState, useEffect } from 'react';

/**
 * Hook tùy biến trì hoãn giá trị đầu vào (Debounce)
 * Thích hợp cho ô tìm kiếm sản phẩm real-time
 */
export const useDebounce = (value, delay = 400) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

export default useDebounce;
