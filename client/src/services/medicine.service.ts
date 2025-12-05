import api from '@/lib/api';
import { API_URLS } from '@/constants/api-urls';
import { 
  Medicine, 
  CreateMedicinePayload, 
  UpdateMedicinePayload 
} from '@/types/medicines';

export const medicineService = {
  /**
   * Lấy danh sách tất cả thuốc
   * URL: GET /medicines
   */
  getAll: async () => {
    const response = await api.get<Medicine[]>(API_URLS.MEDICINES.BASE);
    return response.data;
  },

  /**
   * Lấy chi tiết một loại thuốc theo ID
   * URL: GET /medicines/:id
   */
  getById: async (id: number) => {
    const url = API_URLS.MEDICINES.GET_BY_ID(id);
    const response = await api.get<Medicine>(url);
    return response.data;
  },

  /**
   * Tạo thuốc mới (Dành cho Admin)
   * URL: POST /medicines
   */
  create: async (data: CreateMedicinePayload) => {
    const response = await api.post<Medicine>(API_URLS.MEDICINES.BASE, data);
    return response.data;
  },

  /**
   * Cập nhật thông tin thuốc (Dành cho Admin)
   * URL: PATCH /medicines/:id
   */
  update: async (id: number, data: UpdateMedicinePayload) => {
    const url = API_URLS.MEDICINES.GET_BY_ID(id); // Tận dụng hàm tạo URL có sẵn
    const response = await api.patch<Medicine>(url, data);
    return response.data;
  },

  /**
   * Xóa thuốc (Dành cho Admin)
   * URL: DELETE /medicines/:id
   */
  delete: async (id: number) => {
    const url = API_URLS.MEDICINES.GET_BY_ID(id);
    await api.delete(url);
    return true;
  },
};