import api from '@/lib/api';
import { API_URLS } from '@/constants/api-urls';
import { 
  Prescription, 
  // Lưu ý: Thường đơn thuốc được tạo kèm hồ sơ bệnh án.
  // Nhưng nếu có chức năng tạo lẻ, bạn sẽ cần type CreatePrescriptionPayload (bạn có thể tự định nghĩa trong types/prescriptions.ts nếu chưa có)
  // Ở đây tớ giả định bạn chỉ cần Update và View là chính.
} from '@/types/prescriptions';

// Định nghĩa tạm payload nếu chưa có trong types (hoặc import từ types nếu đã thêm)
interface UpdatePrescriptionPayload {
  // Thường update ghi chú hoặc trạng thái đơn thuốc
  notes?: string; 
}

export const prescriptionService = {
  /**
   * Lấy danh sách tất cả đơn thuốc
   * URL: GET /prescriptions
   */
  getAll: async () => {
    const response = await api.get<Prescription[]>(API_URLS.PRESCRIPTIONS.BASE);
    return response.data;
  },

  /**
   * Lấy chi tiết một đơn thuốc theo ID
   * URL: GET /prescriptions/:id
   */
  getById: async (id: number) => {
    const url = API_URLS.PRESCRIPTIONS.GET_BY_ID(id);
    const response = await api.get<Prescription>(url);
    return response.data;
  },

  /**
   * Cập nhật đơn thuốc
   * URL: PATCH /prescriptions/:id
   */
  update: async (id: number, data: UpdatePrescriptionPayload) => {
    const url = API_URLS.PRESCRIPTIONS.GET_BY_ID(id);
    const response = await api.patch<Prescription>(url, data);
    return response.data;
  },

  /**
   * Xóa đơn thuốc (Dành cho Admin)
   * URL: DELETE /prescriptions/:id
   */
  delete: async (id: number) => {
    const url = API_URLS.PRESCRIPTIONS.GET_BY_ID(id);
    await api.delete(url);
    return true;
  },

  // --- MỞ RỘNG SAU NÀY ---
  /**
   * Tải file PDF đơn thuốc (Ví dụ)
   * URL: GET /prescriptions/:id/pdf
   */
  // downloadPdf: async (id: number) => {
  //   const url = `${API_URLS.PRESCRIPTIONS.GET_BY_ID(id)}/pdf`;
  //   const response = await api.get(url, { responseType: 'blob' });
  //   // Logic save file...
  // }
};