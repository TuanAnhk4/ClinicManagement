export const AppConfig = {

    // BE connection
  API: {
    BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
    
    // Thời gian chờ tối đa cho một request (ms)
    TIMEOUT: 15000, // 15 s
  },

  // (Meta info)
  APP: {
    NAME: process.env.NEXT_PUBLIC_APP_NAME || 'Health Care',
    DESCRIPTION: 'Hệ thống quản lý phòng khám tư nhân toàn diện',
    VERSION: '1.0.0',
  },

  // ==============================
  // 3. Cấu hình Phân trang (Pagination)
  PAGINATION: {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 10, // Mặc định 10 dòng/trang
    LIMIT_OPTIONS: [5, 10, 20, 50], // Các tùy chọn trong Dropdown phân trang
  },

  // ==============================
  // (Date Formats)
  // ==============================
  DATE: {
    // Định dạng hiển thị cho người dùng Việt Nam
    DISPLAY: 'DD/MM/YYYY', 
    DISPLAY_WITH_TIME: 'DD/MM/YYYY HH:mm',
    
    // Định dạng chuẩn để gửi lên API hoặc so sánh
    API: 'YYYY-MM-DD', 
    ISO: 'YYYY-MM-DDTHH:mm:ss.SSSZ',
  },

  // ==============================
  // 5. Cấu hình Upload File
  // ==============================
  UPLOAD: {
    MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
    ACCEPTED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'],
  },

} as const; 
// 'as const' giúp TypeScript hiểu đây là các giá trị hằng số (Read-only), 
// giúp gợi ý code chính xác hơn.