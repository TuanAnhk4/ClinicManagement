import { useEffect, useRef } from 'react';

/**
 * Custom Hook để chạy một hàm theo chu kỳ (tương tự setInterval)
 * nhưng an toàn hơn với React Lifecycle.
 * * @param callback Hàm cần chạy
 * @param delay Thời gian lặp (ms). Truyền null để dừng.
 */
export function useInterval(callback: () => void, delay: number | null) {
  const savedCallback = useRef(callback);

  // 1. Lưu callback mới nhất vào ref
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // 2. Thiết lập interval
  useEffect(() => {
    // Nếu delay là null thì không chạy (dừng interval)
    if (delay !== null) {
      const tick = () => {
        savedCallback.current();
      };
      
      const id = setInterval(tick, delay);
      
      // Cleanup khi unmount hoặc delay thay đổi
      return () => clearInterval(id);
    }
  }, [delay]);
}