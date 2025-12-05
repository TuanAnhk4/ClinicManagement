import api from '@/lib/api';
import { API_URLS } from '@/constants/api-urls';
import { 
  OverviewStats, 
  DailyStat, 
  AppointmentStatusStat, 
  TopDiagnosis, 
  DoctorPerformance, 
  UpcomingAppointment 
} from '@/types/dashboard';

export const dashboardService = {
  /**
   * Lấy số liệu tổng quan (KPIs)
   * URL: GET /dashboard/overview
   */
  getOverviewStats: async () => {
    const response = await api.get<OverviewStats>(API_URLS.DASHBOARD.OVERVIEW);
    return response.data;
  },

  /**
   * Lấy dữ liệu cho biểu đồ xu hướng (30 ngày)
   * URL: GET /dashboard/daily-stats
   */
  getDailyStats: async () => {
    const response = await api.get<DailyStat[]>(API_URLS.DASHBOARD.DAILY_STATS);
    return response.data;
  },

  /**
   * Lấy tỷ lệ trạng thái lịch hẹn
   * URL: GET /dashboard/appointment-status
   */
  getAppointmentStatusStats: async () => {
    const response = await api.get<AppointmentStatusStat[]>(API_URLS.DASHBOARD.APPOINTMENT_STATUS);
    return response.data;
  },

  /**
   * Lấy Top bệnh phổ biến
   * URL: GET /dashboard/top-diagnoses
   */
  getTopDiagnoses: async () => {
    const response = await api.get<TopDiagnosis[]>(API_URLS.DASHBOARD.TOP_DIAGNOSES);
    return response.data;
  },

  /**
   * Lấy hiệu suất bác sĩ (Top Doctors)
   * URL: GET /dashboard/top-doctors
   */
  getTopDoctors: async () => {
    const response = await api.get<DoctorPerformance[]>(API_URLS.DASHBOARD.TOP_DOCTORS);
    return response.data;
  },

  /**
   * Lấy danh sách lịch hẹn sắp tới
   * URL: GET /dashboard/upcoming-appointments
   */
  getUpcomingAppointments: async () => {
    const response = await api.get<UpcomingAppointment[]>(API_URLS.DASHBOARD.UPCOMING);
    return response.data;
  },

  // --- Nếu sau này có làm API phân tích chi phí riêng ---
  // getCostAnalysis: async () => {
  //   const response = await api.get<any>(API_URLS.DASHBOARD.COST_ANALYSIS);
  //   return response.data;
  // }
};