import api from '@/lib/api';
import { API_URLS } from '@/constants/api-urls';
import { User, UpdateUserPayload } from '@/types/users';
import { RegisterPayload } from '@/types/auth'; // Tái sử dụng payload đăng ký cho việc tạo mới user
import { UserRole } from '@/types/enums';

export const userService = {
  /**
   * Lấy danh sách tất cả users (Có thể lọc theo Role)
   * URL: GET /users hoặc /users?role=DOCTOR
   */
  getAll: async (params?: { role?: UserRole }) => {
    const response = await api.get<User[]>(API_URLS.USERS.BASE, {
      params: params, // Axios tự động chuyển object này thành query string (?role=...)
    });
    return response.data;
  },

  /**
   * Helper riêng để lấy danh sách Bác sĩ (Thường dùng cho trang Đặt lịch)
   */
  getDoctors: async () => {
    // Gọi tái sử dụng hàm getAll với tham số role DOCTOR
    return userService.getAll({ role: UserRole.DOCTOR });
  },

  /**
   * Lấy chi tiết một User theo ID
   * URL: GET /users/:id
   */
  getById: async (id: number) => {
    const url = API_URLS.USERS.GET_BY_ID(id);
    const response = await api.get<User>(url);
    return response.data;
  },

  /**
   * Tạo mới User (Dành cho Admin)
   * URL: POST /users
   */
  create: async (data: RegisterPayload) => {
    // Dùng chung cấu trúc RegisterPayload vì form tạo mới của Admin cũng tương tự
    const response = await api.post<User>(API_URLS.USERS.BASE, data);
    return response.data;
  },

  /**
   * Cập nhật thông tin User
   * URL: PATCH /users/:id
   */
  update: async (id: number, data: UpdateUserPayload) => {
    const url = API_URLS.USERS.UPDATE(id);
    const response = await api.patch<User>(url, data);
    return response.data;
  },

  /**
   * Xóa User (Dành cho Admin)
   * URL: DELETE /users/:id
   */
  delete: async (id: number) => {
    const url = API_URLS.USERS.DELETE(id);
    await api.delete(url);
    // Hàm xóa thường không cần return data, hoặc return success message
    return true;
  },
};
