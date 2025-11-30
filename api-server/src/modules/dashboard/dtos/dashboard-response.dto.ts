export class OverviewStatsDto {
  totalPatients: number;
  totalDoctors: number;
  totalAppointments: number;
  appointmentStats: {
    completed: number;
    pending: number;
  };
  totalRevenue: number;
}

export class DailyStatDto {
  date: string;
  count: number;
  revenue: number;
}

export class TopDiagnosisDto {
  diagnosis: string;
  count: number;
}

export class DoctorPerformanceDto {
  id: number;
  name: string;
  count: number;
}

export class AppointmentStatusDto {
  status: string;
  count: number;
}

export class UpcomingAppointmentDto {
  id: number;
  time: Date;
  patientName: string;
  doctorName: string;
  reason: string;
}
