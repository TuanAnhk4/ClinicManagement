import api from '@/lib/api';
import { API_URLS } from '@/constants/api-urls';
import { 
  Specialty, 
  CreateSpecialtyPayload, 
  UpdateSpecialtyPayload 
} from '@/types/specialties';

export const specialtyService = {
  /**
   * Lấy danh sách tất cả chuyên khoa
   * URL: GET /specialties
   */
  getAll: async () => {
    const response = await api.get<Specialty[]>(API_URLS.SPECIALTIES.BASE);
    return response.data;
  },

  /**
   * Lấy chi tiết một chuyên khoa theo ID
   * URL: GET /specialties/:id
   */
  getById: async (id: number) => {
    const url = API_URLS.SPECIALTIES.GET_BY_ID(id);
    const response = await api.get<Specialty>(url);
    return response.data;
  },

  /**
   * Tạo chuyên khoa mới (Dành cho Admin)
   * URL: POST /specialties
   */
  create: async (data: CreateSpecialtyPayload) => {
    const response = await api.post<Specialty>(API_URLS.SPECIALTIES.BASE, data);
    return response.data;
  },

  /**
   * Cập nhật thông tin chuyên khoa (Dành cho Admin)
   * URL: PATCH /specialties/:id
   */
  update: async (id: number, data: UpdateSpecialtyPayload) => {
    // Lưu ý: URL update thường dùng chung format với GET_BY_ID (/specialties/:id)
    const url = API_URLS.SPECIALTIES.GET_BY_ID(id); 
    const response = await api.patch<Specialty>(url, data);
    return response.data;
  },

  /**
   * Xóa chuyên khoa (Dành cho Admin)
   * URL: DELETE /specialties/:id
   */
  delete: async (id: number) => {
    const url = API_URLS.SPECIALTIES.GET_BY_ID(id);
    await api.delete(url);
    return true;
  },
};