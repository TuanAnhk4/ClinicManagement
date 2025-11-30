export class StringUtil {
  /**
   * Tạo chuỗi ngẫu nhiên (Dùng cho mật khẩu mặc định hoặc token reset)
   */
  static generateRandomString(length: number = 10): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  }

  /**
   * Viết hoa chữ cái đầu (Ví dụ: 'tim mạch' -> 'Tim mạch')
   */
  static capitalize(str: string): string {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }
}
