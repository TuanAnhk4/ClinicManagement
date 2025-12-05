import { useEffect, useState } from 'react';

/**
 * Hook trì hoãn việc cập nhật giá trị (Debounce)
 * @param value Giá trị cần theo dõi (thường là state của ô input)
 * @param delay Thời gian trì hoãn (ms) - Mặc định 500ms
 * @returns Giá trị đã được debounce
 */
export function useDebounce<T>(value: T, delay = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Thiết lập timer để cập nhật giá trị sau khoảng thời gian delay
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cleanup function: Hủy timer nếu value thay đổi trước khi hết thời gian delay
    // (Nghĩa là người dùng vẫn đang gõ tiếp)
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]); // Re-run khi value hoặc delay thay đổi

  return debouncedValue;
}