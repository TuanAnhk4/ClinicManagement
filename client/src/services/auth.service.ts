import api from '@/lib/api';
import { API_URLS } from '@/constants/api-urls';
import { STORAGE_KEYS } from '@/constants/storage-keys';
import { 
  LoginPayload, 
  LoginResponse, 
  RegisterPayload 
} from '@/types/auth';
import { User } from '@/types/users';
import { ApiResponse } from '@/types/common';

import { ResetPasswordPayload } from '@/types/auth';

export const authService = {
  /**
   * Đăng nhập
   * @param payload Email và Password
   */
  login: async (payload: LoginPayload) => {
    // Gọi API Login
    const response = await api.post<LoginResponse>(API_URLS.AUTH.LOGIN, payload);
    
    // Lưu token vào LocalStorage
    if (response.data?.access_token) {
      localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, response.data.access_token);
      
      // Nếu backend trả về thông tin user luôn thì lưu luôn
      if (response.data.user) {
        localStorage.setItem(STORAGE_KEYS.USER_INFO, JSON.stringify(response.data.user));
        localStorage.setItem(STORAGE_KEYS.USER_ROLE, response.data.user.role);
      }
    }
    
    return response.data;
  },

  /**
   * Đăng ký tài khoản mới
   * @param payload Thông tin đăng ký
   */
  register: async (payload: RegisterPayload) => {
    const response = await api.post<User>(API_URLS.AUTH.REGISTER, payload);
    return response.data;
  },

  /**
   * Lấy thông tin Profile của user đang đăng nhập
   * (Token sẽ được tự động đính kèm bởi axios interceptor trong lib/api.ts)
   */
  getProfile: async () => {
    const response = await api.get<User>(API_URLS.AUTH.PROFILE);
    
    // Cập nhật lại thông tin mới nhất vào LocalStorage
    if (response.data) {
      localStorage.setItem(STORAGE_KEYS.USER_INFO, JSON.stringify(response.data));
      localStorage.setItem(STORAGE_KEYS.USER_ROLE, response.data.role);
    }

    return response.data;
  },

  /**
   * Đăng xuất
   * Xóa sạch dữ liệu trong LocalStorage
   */
  logout: () => {
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER_INFO);
    localStorage.removeItem(STORAGE_KEYS.USER_ROLE);
    // Có thể gọi API logout nếu backend cần invalidate token (thường JWT không cần)
  },

  /**
   * Kiểm tra xem user đã đăng nhập chưa (Dựa vào token ở client)
   */
  isAuthenticated: () => {
    if (typeof window === 'undefined') return false;
    return !!localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
  },

  /**
   * Lấy vai trò hiện tại (để phân quyền nhanh trên UI)
   */
  getCurrentRole: () => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(STORAGE_KEYS.USER_ROLE);
  },
  forgotPassword: async (email: string) => {
    // Payload chỉ cần email
    return api.post(API_URLS.AUTH.FORGOT_PASSWORD, { email });
  },
  resetPassword: async (payload: ResetPasswordPayload) => {
    return api.post(API_URLS.AUTH.RESET_PASSWORD, payload);
  },
};