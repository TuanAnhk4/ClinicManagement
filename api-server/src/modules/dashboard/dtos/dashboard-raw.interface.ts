export interface DailyStatRaw {
  date: string;
  count: string;
  revenue: string | null;
}

export interface DiagnosisRaw {
  diagnosis: string;
  count: string;
}

export interface DoctorPerformanceRaw {
  doctorId: number;
  doctorName: string;
  count: string;
}

export interface StatusStatRaw {
  status: string;
  count: string;
}

export interface OverviewRaw {
  total: string;
}
