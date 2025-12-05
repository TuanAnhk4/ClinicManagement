import { useEffect, RefObject } from 'react';

type Event = MouseEvent | TouchEvent;

/**
 * Hook phát hiện click ra ngoài một phần tử
 * @param ref - Ref của phần tử cần theo dõi (ví dụ: cái menu dropdown)
 * @param handler - Hàm sẽ được gọi khi click ra ngoài
 */
export const useOnClickOutside = <T extends HTMLElement = HTMLElement>(
  ref: RefObject<T>,
  handler: (event: Event) => void
) => {
  useEffect(() => {
    const listener = (event: Event) => {
      const el = ref.current;

      // Không làm gì nếu:
      // 1. Element chưa được mount
      // 2. Click vào chính element đó hoặc con của nó
      if (!el || el.contains((event.target as Node) || null)) {
        return;
      }

      // Gọi hàm xử lý nếu click ra ngoài
      handler(event);
    };

    // Lắng nghe sự kiện chuột và cảm ứng (cho mobile)
    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    // Cleanup function: Gỡ bỏ lắng nghe khi component unmount
    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler]); // Re-run nếu ref hoặc handler thay đổi
};