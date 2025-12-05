/**
 * Định nghĩa các key dùng để lưu trữ trong LocalStorage / Cookies
 * Giúp tránh typo và quản lý tập trung.
 */

export const STORAGE_KEYS = {
  // 1. Authentication
  ACCESS_TOKEN: 'access_token', // Token đăng nhập
  REFRESH_TOKEN: 'refresh_token', // Token làm mới (nếu có dùng)
  
  // 2. User Information
  USER_INFO: 'user_info', // Thông tin cơ bản của user (để hiển thị nhanh)
  USER_ROLE: 'user_role', // Vai trò (để phân quyền nhanh ở frontend)

  // 3. Settings / Preferences (Cấu hình người dùng)
  THEME: 'theme_mode', // 'light' | 'dark'
  LANGUAGE: 'app_language', // 'vi' | 'en'
  SIDEBAR_COLLAPSED: 'sidebar_collapsed', // Trạng thái thu gọn menu

  // 4. Temporary Data (Dữ liệu tạm)
  // Ví dụ: Lưu tạm form đặt lịch khi chưa login xong
  BOOKING_TEMP_DATA: 'booking_temp_data',
} as const;

// Type helper để gợi ý code khi dùng
export type StorageKey = typeof STORAGE_KEYS[keyof typeof STORAGE_KEYS];
