/**
 * Tập hợp các biểu thức chính quy (Regex) để validate dữ liệu
 */
export const REGEX = {
  // 1. Email chuẩn (RFC 5322 compliant-ish)
  // VD: user@example.com
  EMAIL: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,

  // 2. Số điện thoại Việt Nam
  // Bắt đầu bằng 0, theo sau là 3,5,7,8,9 và 8 chữ số nữa (Tổng 10 số)
  // VD: 0987654321
  PHONE_VN: /^(03|05|07|08|09)+([0-9]{8})$/,

  // 3. Mật khẩu mạnh (Strong Password)
  // Tối thiểu 8 ký tự, ít nhất 1 chữ hoa, 1 chữ thường, 1 số, 1 ký tự đặc biệt
  PASSWORD_STRONG: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,

  // 4. Chỉ chứa số (Numeric only)
  // Dùng cho input số lượng, giá tiền
  NUMERIC: /^[0-9]+$/,

  // 5. Số thập phân (Decimal)
  // Dùng cho cân nặng, chiều cao (VD: 10.5)
  DECIMAL: /^\d+(\.\d{1,2})?$/,

  // 6. Định dạng ngày (YYYY-MM-DD)
  DATE_ISO: /^\d{4}-\d{2}-\d{2}$/,

  // 7. Định dạng giờ (HH:mm) - 24h
  // VD: 08:00, 23:59
  TIME_24H: /^([01]\d|2[0-3]):([0-5]\d)$/,
  
  // 8. Căn cước công dân (CCCD) Việt Nam (12 số)
  CCCD: /^[0-9]{12}$/,
} as const;

/**
 * Các thông báo lỗi chuẩn tương ứng với Regex (để đồng bộ UI)
 */
export const REGEX_MESSAGES = {
  EMAIL: 'Email không đúng định dạng.',
  PHONE_VN: 'Số điện thoại không hợp lệ (VD: 09xxxxxxxx).',
  PASSWORD_STRONG: 'Mật khẩu phải có ít nhất 8 ký tự, gồm chữ hoa, thường, số và ký tự đặc biệt.',
  NUMERIC: 'Vui lòng chỉ nhập số.',
  DECIMAL: 'Vui lòng nhập số (cho phép số thập phân).',
  DATE: 'Ngày không hợp lệ (YYYY-MM-DD).',
  TIME: 'Giờ không hợp lệ (HH:mm).',
  CCCD: 'Số CCCD phải bao gồm 12 chữ số.',
} as const;