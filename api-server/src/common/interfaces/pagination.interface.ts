export interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string; // Từ khóa tìm kiếm chung
}

// Kiểu dữ liệu trả về cho các danh sách có phân trang
export interface PaginatedResult<T> {
  data: T[]; // Mảng dữ liệu (Ví dụ: User[], Medicine[])
  total: number; // Tổng số bản ghi trong DB
  page: number; // Trang hiện tại
  limit: number; // Số lượng mỗi trang
  totalPages: number; // Tổng số trang
}
