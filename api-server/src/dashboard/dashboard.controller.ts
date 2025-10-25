import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { DashboardService } from './dashboard.service';
import { Roles } from 'src/auth/roles.decorator';
import { UserRole } from 'src/users/entities/user.entity';
import { RolesGuard } from 'src/auth/roles.guard';

// Định nghĩa kiểu dữ liệu trả về cho các endpoint (nên đặt ở file types chung nếu dùng ở nhiều nơi)
interface CountByTimeResponse {
  date?: string; // Dùng cho daily
  month?: string; // Dùng cho monthly
  count: number;
}
interface TopDiagnosisResponse {
  diagnosis: string;
  count: number;
}
interface SpecialtyCountResponse {
  specialty: string;
  count: number;
}
interface RevenueDataResponse {
  date?: string; // Hoặc month
  revenue: number;
}

@Controller('dashboard')
@UseGuards(AuthGuard('jwt'), RolesGuard) // Bảo vệ tất cả endpoint
@Roles(UserRole.ADMIN) // Chỉ Admin mới được truy cập controller này
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('daily-appointments')
  async getDailyAppointmentCounts(): Promise<CountByTimeResponse[]> {
    return this.dashboardService.getDailyAppointmentCounts();
  }

  @Get('monthly-appointments')
  async getMonthlyAppointmentCounts(): Promise<CountByTimeResponse[]> {
    return this.dashboardService.getMonthlyAppointmentCounts();
  }

  @Get('top-diagnoses')
  async getTopDiagnoses(): Promise<TopDiagnosisResponse[]> {
    return this.dashboardService.getTopDiagnoses();
  }

  @Get('specialty-distribution')
  async getAppointmentCountBySpecialty(): Promise<SpecialtyCountResponse[]> {
    return this.dashboardService.getAppointmentCountBySpecialty();
  }

  @Get('revenue')
  async getRevenueData(): Promise<RevenueDataResponse[]> {
    return this.dashboardService.getRevenueData();
  }
}
