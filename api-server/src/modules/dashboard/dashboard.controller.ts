import { Controller, Get, UseGuards } from '@nestjs/common';

import { RolesGuard } from '@common/guards';
import { Roles } from '@common/decorators';
import { UserRole } from '@modules/users/enums';

import { DashboardService } from './dashboard.service';

import {
  OverviewStatsDto,
  DailyStatDto,
  AppointmentStatusDto,
  TopDiagnosisDto,
  DoctorPerformanceDto,
  UpcomingAppointmentDto,
} from './dtos/dashboard-response.dto';

@Controller('dashboard')
@UseGuards(RolesGuard)
@Roles(UserRole.ADMIN)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  /**
   * 1. Lấy số liệu tổng quan (KPIs)
   * URL: GET /dashboard/overview
   */
  @Get('overview')
  async getOverviewStats(): Promise<OverviewStatsDto> {
    return this.dashboardService.getOverviewStats();
  }

  /**
   * 2. Biểu đồ xu hướng (30 ngày)
   * URL: GET /dashboard/daily-stats
   */
  @Get('daily-stats')
  async getDailyStats(): Promise<DailyStatDto[]> {
    return this.dashboardService.getDailyStats();
  }

  /**
   * 3. Tỷ lệ trạng thái lịch hẹn
   * URL: GET /dashboard/appointment-status
   */
  @Get('appointment-status')
  async getAppointmentStatusStats(): Promise<AppointmentStatusDto[]> {
    return this.dashboardService.getAppointmentStatusStats();
  }

  /**
   * 4. Top bệnh phổ biến
   * URL: GET /dashboard/top-diagnoses
   */
  @Get('top-diagnoses')
  async getTopDiagnoses(): Promise<TopDiagnosisDto[]> {
    return this.dashboardService.getTopDiagnoses();
  }

  /**
   * 5. Hiệu suất Bác sĩ (Top Doctors)
   * URL: GET /dashboard/top-doctors
   */
  @Get('top-doctors')
  async getTopDoctors(): Promise<DoctorPerformanceDto[]> {
    return this.dashboardService.getTopDoctors();
  }

  /**
   * 6. Lịch hẹn sắp tới (Upcoming)
   * URL: GET /dashboard/upcoming-appointments
   */
  @Get('upcoming-appointments')
  async getUpcomingAppointments(): Promise<UpcomingAppointmentDto[]> {
    return this.dashboardService.getUpcomingAppointments();
  }
}
