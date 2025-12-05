import api from '@/lib/api';
import { API_URLS } from '@/constants/api-urls';
import { 
  MedicalRecord, 
  CreateMedicalRecordPayload 
} from '@/types/medical-records';

export const medicalRecordService = {
  /**
   * Tạo hồ sơ khám bệnh mới (Dành cho Bác sĩ)
   * URL: POST /medical-records
   */
  create: async (data: CreateMedicalRecordPayload) => {
    const response = await api.post<MedicalRecord>(API_URLS.MEDICAL_RECORDS.BASE, data);
    return response.data;
  },

  /**
   * Lấy chi tiết hồ sơ khám bệnh dựa theo ID cuộc hẹn
   * (Dùng khi click vào một lịch hẹn trong quá khứ để xem lại kết quả)
   * URL: GET /medical-records/appointment/:appointmentId
   */
  getByAppointmentId: async (appointmentId: number) => {
    const url = API_URLS.MEDICAL_RECORDS.GET_BY_APPOINTMENT(appointmentId);
    const response = await api.get<MedicalRecord>(url);
    return response.data;
  },

  /**
   * Lấy toàn bộ lịch sử khám bệnh của một bệnh nhân
   * (Dùng cho Bác sĩ xem tiền sử bệnh, hoặc Admin kiểm tra)
   * URL: GET /medical-records/patient/:patientId
   */
  getByPatientId: async (patientId: number) => {
    const url = API_URLS.MEDICAL_RECORDS.GET_BY_PATIENT(patientId);
    const response = await api.get<MedicalRecord[]>(url);
    return response.data;
  },

  /**
   * Lấy chi tiết một hồ sơ theo ID hồ sơ (Ít dùng hơn byAppointmentId nhưng vẫn cần)
   * URL: GET /medical-records/:id
   */
  getById: async (id: number) => {
    const url = API_URLS.MEDICAL_RECORDS.GET_BY_ID(id);
    const response = await api.get<MedicalRecord>(url);
    return response.data;
  },
};