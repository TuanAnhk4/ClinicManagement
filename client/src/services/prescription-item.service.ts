import api from '@/lib/api';
import { API_URLS } from '@/constants/api-urls';
import { 
  PrescriptionItem, 
  UpdatePrescriptionItemPayload 
} from '@/types/prescription-items';

export const prescriptionItemService = {
  /**
   * Cập nhật chi tiết một dòng thuốc (Số lượng, Liều dùng)
   * Dùng khi bác sĩ muốn sửa lại đơn thuốc đã kê.
   * URL: PATCH /prescription-items/:id
   */
  update: async (id: number, data: UpdatePrescriptionItemPayload) => {
    const url = API_URLS.PRESCRIPTION_ITEMS.UPDATE(id);
    const response = await api.patch<PrescriptionItem>(url, data);
    return response.data;
  },

  /**
   * Xóa một dòng thuốc khỏi đơn
   * Dùng khi bác sĩ lỡ tay kê nhầm thuốc.
   * URL: DELETE /prescription-items/:id
   */
  delete: async (id: number) => {
    const url = API_URLS.PRESCRIPTION_ITEMS.DELETE(id);
    await api.delete(url);
    return true;
  },
};