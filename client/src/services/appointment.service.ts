import api from '@/lib/api';
import { API_URLS } from '@/constants/api-urls';
import { 
  Appointment, 
  CreateAppointmentPayload 
} from '@/types/appointments';

export const appointmentService = {
  /**
   * Tạo lịch hẹn mới (Dành cho Bệnh nhân)
   * URL: POST /appointments
   */
  create: async (data: CreateAppointmentPayload) => {
    const response = await api.post<Appointment>(API_URLS.APPOINTMENTS.BASE, data);
    return response.data;
  },

  /**
   * Lấy danh sách lịch hẹn của Bệnh nhân đang đăng nhập
   * URL: GET /appointments/patient/me
   */
  getMyAppointmentsAsPatient: async () => {
    const response = await api.get<Appointment[]>(API_URLS.APPOINTMENTS.MY_PATIENT);
    return response.data;
  },

  /**
   * Lấy danh sách lịch hẹn của Bác sĩ đang đăng nhập (Dashboard Bác sĩ)
   * URL: GET /appointments/doctor/me
   */
  getMyAppointmentsAsDoctor: async () => {
    const response = await api.get<Appointment[]>(API_URLS.APPOINTMENTS.MY_DOCTOR);
    return response.data;
  },

  /**
   * Lấy danh sách lịch hẹn của một Bác sĩ cụ thể theo ID
   * Dùng cho trang "Đặt Lịch" để hiển thị các slot đã bị chiếm
   * URL: GET /appointments/doctor/:id
   */
  getByDoctorId: async (doctorId: number) => {
    const url = API_URLS.APPOINTMENTS.GET_BY_DOCTOR_ID(doctorId);
    const response = await api.get<Appointment[]>(url);
    return response.data;
  },

  /**
   * Lấy chi tiết một lịch hẹn
   * URL: GET /appointments/:id
   */
  getById: async (id: number) => {
    const url = API_URLS.APPOINTMENTS.GET_BY_ID(id);
    const response = await api.get<Appointment>(url);
    return response.data;
  },

  /**
   * Hủy lịch hẹn
   * URL: PATCH /appointments/:id/cancel
   */
  cancel: async (id: number) => {
    const url = API_URLS.APPOINTMENTS.CANCEL(id);
    const response = await api.patch<Appointment>(url);
    return response.data;
  },
  getAll: async () => {
    const response = await api.get<Appointment[]>(API_URLS.APPOINTMENTS.BASE); 
    return response.data;
  },
};