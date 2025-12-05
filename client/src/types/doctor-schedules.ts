export interface DoctorSchedule {
  id: number;
  doctorId: number;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
}

export interface CreateSchedulePayload {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
}

export interface UpdateSchedulePayload {
  dayOfWeek?: number;
  startTime?: string;
  endTime?: string;
}
