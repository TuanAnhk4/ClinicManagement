export interface OverviewStats {
  totalPatients: number;
  totalDoctors: number;
  totalAppointments: number;
  appointmentStats: {
    completed: number;
    pending: number;
  };
  totalRevenue: number;
}

export interface DailyStat {
  date: string;
  count: number;
  revenue: number;
}

export interface AppointmentStatusStat {
  status: string;
  count: number;
}

export interface TopDiagnosis {
  diagnosis: string;
  count: number;
}

export interface DoctorPerformance {
  id: number;
  name: string;
  count: number;
}

export interface UpcomingAppointment {
  id: number;
  time: string;
  patientName: string;
  doctorName: string;
  reason: string;
}
