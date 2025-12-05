import { useState, useEffect } from 'react';

/**
 * Custom Hook để kiểm tra Media Query (Responsive)
 * @param query Chuỗi media query (VD: '(min-width: 768px)')
 * @returns true nếu khớp, false nếu không
 */
export function useMediaQuery(query: string): boolean {
  // Khởi tạo state là false để tránh lỗi Hydration mismatch (Server luôn là false)
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    // Chỉ chạy ở client-side
    if (typeof window !== 'undefined') {
      const media = window.matchMedia(query);

      // Cập nhật trạng thái ban đầu
      if (media.matches !== matches) {
        setMatches(media.matches);
      }

      // Hàm lắng nghe sự thay đổi kích thước màn hình
      const listener = () => setMatches(media.matches);

      // Thêm sự kiện lắng nghe
      media.addEventListener('change', listener);

      // Cleanup khi component unmount
      return () => media.removeEventListener('change', listener);
    }
  }, [query]);

  return matches;
}