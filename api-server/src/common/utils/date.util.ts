export class DateUtil {
  /**
   * Tính tuổi từ ngày sinh (Dùng cho ML Feature: Age)
   * @param dateOfBirth Ngày sinh (Date object hoặc chuỗi ISO)
   */
  static calculateAge(dateOfBirth: Date | string): number {
    if (!dateOfBirth) return 0;

    const dob = new Date(dateOfBirth);
    const diffMs = Date.now() - dob.getTime();
    const ageDt = new Date(diffMs);

    return Math.abs(ageDt.getUTCFullYear() - 1970);
  }

  /**
   * Lấy thời điểm bắt đầu ngày (00:00:00.000)
   * Dùng để query thống kê trong ngày
   */
  static getStartOfDay(date: Date = new Date()): Date {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
  }

  /**
   * Lấy thời điểm kết thúc ngày (23:59:59.999)
   */
  static getEndOfDay(date: Date = new Date()): Date {
    const d = new Date(date);
    d.setHours(23, 59, 59, 999);
    return d;
  }

  /**
   * Cộng/Trừ ngày (Ví dụ: lấy 30 ngày trước)
   */
  static addDays(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }
}
