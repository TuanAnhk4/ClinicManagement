import axios, { 
  AxiosInstance, 
  AxiosResponse, 
  AxiosError, 
  InternalAxiosRequestConfig 
} from 'axios';
import { AppConfig } from '@/constants/config';
import { STORAGE_KEYS } from '@/constants/storage-keys';

// 1. Tạo instance với cấu hình từ file config
const api: AxiosInstance = axios.create({
  baseURL: AppConfig.API.BASE_URL,
  timeout: AppConfig.API.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 2. Request Interceptor: Tự động gắn Token
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Chỉ chạy ở phía Client (Browser) để tránh lỗi khi SSR
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 3. Response Interceptor: Xử lý dữ liệu và Lỗi toàn cục
api.interceptors.response.use(
  (response: AxiosResponse) => {
    // Trả về response nguyên bản (hoặc response.data nếu bạn muốn gọn hơn)
    return response; 
  },
  (error: AxiosError) => {
    // Xử lý lỗi
    if (error.response) {
      const status = error.response.status;

      // Tự động xử lý khi Token hết hạn hoặc không hợp lệ (401)
      if (status === 401) {
        if (typeof window !== 'undefined') {
          // Xóa sạch token cũ
          localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
          localStorage.removeItem(STORAGE_KEYS.USER_INFO);
          localStorage.removeItem(STORAGE_KEYS.USER_ROLE);
          
          // Chuyển hướng về trang Login (Dùng window.location để reload lại state sạch sẽ)
          // window.location.href = '/login'; 
          
          // Lưu ý: Nếu API login bị sai pass cũng trả về 401, 
          // nên cần cẩn thận kẻo tạo vòng lặp vô tận nếu bỏ comment dòng trên.
          // Tốt nhất là để trang Login tự xử lý lỗi sai pass, còn ở đây chỉ catch lỗi token hết hạn.
        }
      }
      
      // Có thể log lỗi ra console hoặc gửi lên server log (Sentry)
      console.error(`[API Error] ${status} - ${error.config?.url}:`, error.response.data);
    } else if (error.request) {
      // Lỗi mạng (Server chết, mất mạng)
      console.error('[API Error] Network Error - No response received', error.request);
    } else {
      console.error('[API Error] Request Setup Error', error.message);
    }

    return Promise.reject(error);
  }
);

export default api;