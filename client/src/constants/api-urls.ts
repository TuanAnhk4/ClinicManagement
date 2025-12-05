/**
 * Định nghĩa toàn bộ các endpoint API gọi đến Backend
 * Giúp tránh hard-code chuỗi URL ở nhiều nơi.
 */

export const API_URLS = {
  // 1. Authentication & Users
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    PROFILE: '/auth/profile',
    REFRESH_TOKEN: '/auth/refresh', // Nếu có làm refresh token
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
  },
  
  USERS: {
    BASE: '/users',
    GET_BY_ID: (id: number) => `/users/${id}`,
    UPDATE: (id: number) => `/users/${id}`,
    DELETE: (id: number) => `/users/${id}`,
    // API riêng để lấy danh sách bác sĩ (nếu backend hỗ trợ filter query)
    GET_DOCTORS: '/users?role=DOCTOR',
  },

  // 2. Quản lý Lịch hẹn
  APPOINTMENTS: {
    BASE: '/appointments',
    GET_BY_ID: (id: number) => `/appointments/${id}`,
    CANCEL: (id: number) => `/appointments/${id}/cancel`,
    
    // Các API đặc thù
    MY_PATIENT: '/appointments/patient/me',
    MY_DOCTOR: '/appointments/doctor/me',
    GET_BY_DOCTOR_ID: (doctorId: number) => `/appointments/doctor/${doctorId}`,
    ESTIMATE_COST: '/appointments/estimate-cost', // Cho chức năng dự đoán chi phí
  },

  // 3. Quản lý Chuyên khoa & Lịch làm việc
  SPECIALTIES: {
    BASE: '/specialties',
    GET_BY_ID: (id: number) => `/specialties/${id}`,
  },
  
  DOCTOR_SCHEDULES: {
    BASE: '/doctor-schedules',
    ME: '/doctor-schedules/me',
    GET_BY_DOCTOR: (doctorId: number) => `/doctor-schedules/doctor/${doctorId}`,
    UPDATE: (id: number) => `/doctor-schedules/${id}`,
    DELETE: (id: number) => `/doctor-schedules/${id}`,
  },

  // 4. Quản lý Khám bệnh & Thuốc
  MEDICAL_RECORDS: {
    BASE: '/medical-records',
    GET_BY_ID: (id: number) => `/medical-records/${id}`,
    GET_BY_APPOINTMENT: (appointmentId: number) => `/medical-records/appointment/${appointmentId}`,
    GET_BY_PATIENT: (patientId: number) => `/medical-records/patient/${patientId}`,
  },

  MEDICINES: {
    BASE: '/medicines',
    GET_BY_ID: (id: number) => `/medicines/${id}`,
  },

  PRESCRIPTIONS: {
    BASE: '/prescriptions',
    GET_BY_ID: (id: number) => `/prescriptions/${id}`,
  },

  PRESCRIPTION_ITEMS: {
    BASE: '/prescription-items',
    UPDATE: (id: number) => `/prescription-items/${id}`,
    DELETE: (id: number) => `/prescription-items/${id}`,
  },

  // 5. Dashboard & Thống kê (Admin)
  DASHBOARD: {
    OVERVIEW: '/dashboard/overview',
    DAILY_STATS: '/dashboard/daily-stats',
    APPOINTMENT_STATUS: '/dashboard/appointment-status',
    TOP_DIAGNOSES: '/dashboard/top-diagnoses',
    TOP_DOCTORS: '/dashboard/top-doctors',
    UPCOMING: '/dashboard/upcoming-appointments',
    COST_ANALYSIS: '/dashboard/cost-analysis', // Thống kê chi phí
  },

  // 6. Các tính năng AI/ML (Gọi qua API Server NestJS)
  AI: {
    PREDICT_COST: '/appointments/estimate-cost', // Alias cho dễ tìm
    RECOMMEND_DOCTOR: '/doctors/recommend', // Nếu có làm chức năng gợi ý
  }
} as const;
