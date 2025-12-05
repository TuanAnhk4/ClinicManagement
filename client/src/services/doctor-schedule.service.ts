import api from '@/lib/api';
import { API_URLS } from '@/constants/api-urls';
import { 
  DoctorSchedule, 
  CreateSchedulePayload, 
  UpdateSchedulePayload 
} from '@/types/doctor-schedules';

export const doctorScheduleService = {
  /**
   * Tạo lịch làm việc mới (Dành cho Bác sĩ tự tạo)
   * URL: POST /doctor-schedules
   */
  create: async (data: CreateSchedulePayload) => {
    const response = await api.post<DoctorSchedule>(API_URLS.DOCTOR_SCHEDULES.BASE, data);
    return response.data;
  },

  /**
   * Lấy danh sách lịch làm việc của Bác sĩ đang đăng nhập
   * URL: GET /doctor-schedules/me
   */
  getMySchedules: async () => {
    const response = await api.get<DoctorSchedule[]>(API_URLS.DOCTOR_SCHEDULES.ME);
    return response.data;
  },

  /**
   * Lấy lịch làm việc của một bác sĩ cụ thể theo ID
   * (Dùng cho Bệnh nhân khi chọn bác sĩ để đặt lịch)
   * URL: GET /doctor-schedules/doctor/:doctorId
   */
  getByDoctorId: async (doctorId: number) => {
    const url = API_URLS.DOCTOR_SCHEDULES.GET_BY_DOCTOR(doctorId);
    const response = await api.get<DoctorSchedule[]>(url);
    return response.data;
  },

  /**
   * Cập nhật lịch làm việc
   * URL: PATCH /doctor-schedules/:id
   */
  update: async (id: number, data: UpdateSchedulePayload) => {
    const url = API_URLS.DOCTOR_SCHEDULES.UPDATE(id);
    const response = await api.patch<DoctorSchedule>(url, data);
    return response.data;
  },

  /**
   * Xóa lịch làm việc
   * URL: DELETE /doctor-schedules/:id
   */
  delete: async (id: number) => {
    const url = API_URLS.DOCTOR_SCHEDULES.DELETE(id);
    await api.delete(url);
    return true;
  },
};