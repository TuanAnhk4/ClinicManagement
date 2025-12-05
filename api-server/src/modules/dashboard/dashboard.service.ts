import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { DateUtil } from '@common/utils';

import { Appointment } from '@modules/appointments/entities';
import { MedicalRecord } from '@modules/medical-records/entities';
import { User } from '@modules/users/entities';

import { AppointmentStatus } from '@modules/appointments/enums';
import { UserRole } from '@modules/users/enums';

import {
  DailyStatRaw,
  DiagnosisRaw,
  DoctorPerformanceRaw,
  OverviewRaw,
  StatusStatRaw,
} from './dtos/dashboard-raw.interface';

import {
  DailyStatDto,
  DoctorPerformanceDto,
  OverviewStatsDto,
  TopDiagnosisDto,
  UpcomingAppointmentDto,
  AppointmentStatusDto,
} from './dtos/dashboard-response.dto';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Appointment) private appointmentRepo: Repository<Appointment>,
    @InjectRepository(MedicalRecord) private medicalRecordRepo: Repository<MedicalRecord>,
    @InjectRepository(User) private userRepo: Repository<User>,
  ) {}

  /**
   * 1. TỔNG QUAN (KPIs) - Số liệu tích lũy
   */
  async getOverviewStats(): Promise<OverviewStatsDto> {
    const totalPatients = await this.userRepo.count({ where: { role: UserRole.PATIENT } });
    const totalDoctors = await this.userRepo.count({ where: { role: UserRole.DOCTOR } });

    const totalAppointments = await this.appointmentRepo.count();
    const completedAppointments = await this.appointmentRepo.count({ where: { status: AppointmentStatus.COMPLETED } });
    const pendingAppointments = await this.appointmentRepo.count({ where: { status: AppointmentStatus.PENDING } });

    // Tính tổng doanh thu thực tế (chỉ từ các ca đã có hồ sơ)
    const revenueResult = await this.medicalRecordRepo
      .createQueryBuilder('record')
      .select('SUM(record.total_cost)', 'total')
      .getRawOne<OverviewRaw>();

    return {
      totalPatients,
      totalDoctors,
      totalAppointments,
      appointmentStats: {
        completed: completedAppointments,
        pending: pendingAppointments,
      },
      totalRevenue: revenueResult && revenueResult.total ? Number(revenueResult.total) : 0,
    };
  }

  /**
   * 2. BIỂU ĐỒ XU HƯỚNG (30 Ngày gần nhất)
   * Số ca khám hoàn thành & Doanh thu theo ngày
   */
  async getDailyStats(): Promise<DailyStatDto[]> {
    const thirtyDaysAgo = DateUtil.getStartOfDay(DateUtil.addDays(new Date(), -30));

    const results = await this.appointmentRepo
      .createQueryBuilder('appointment')

      .leftJoin(MedicalRecord, 'record', 'record.appointmentId = appointment.id')
      // PostgreSQL dùng TO_CHAR để format ngày
      .select("TO_CHAR(appointment.appointmentTime, 'YYYY-MM-DD')", 'date')
      .addSelect('COUNT(appointment.id)', 'count')
      .addSelect('SUM(record.total_cost)', 'revenue')
      .where('appointment.appointmentTime >= :startDate', { startDate: thirtyDaysAgo })
      .andWhere('appointment.status = :status', { status: AppointmentStatus.COMPLETED })
      .groupBy("TO_CHAR(appointment.appointmentTime, 'YYYY-MM-DD')")
      .orderBy('date', 'ASC')
      .getRawMany<DailyStatRaw>();

    return results.map((item) => ({
      date: item.date,
      count: Number(item.count),
      revenue: Number(item.revenue),
    }));
  }

  /**
   * 3. TỶ LỆ TRẠNG THÁI LỊCH HẸN
   * (Bao nhiêu % hủy, bao nhiêu % hoàn thành...)
   */
  async getAppointmentStatusStats(): Promise<AppointmentStatusDto[]> {
    const results = await this.appointmentRepo
      .createQueryBuilder('appointment')
      .select('appointment.status', 'status')
      .addSelect('COUNT(appointment.id)', 'count')
      .groupBy('appointment.status')
      .getRawMany<StatusStatRaw>();

    return results.map((item) => ({
      status: item.status,
      count: Number(item.count),
    }));
  }

  /**
   * 4. TOP BỆNH PHỔ BIẾN (Dựa trên chẩn đoán thực tế)
   */
  async getTopDiagnoses(): Promise<TopDiagnosisDto[]> {
    const thirtyDaysAgo = DateUtil.getStartOfDay(DateUtil.addDays(new Date(), -30));

    const results = await this.medicalRecordRepo
      .createQueryBuilder('record')
      .innerJoin('record.appointment', 'appointment')
      .select('record.diagnosis', 'diagnosis')
      .addSelect('COUNT(record.id)', 'count')
      .where('appointment.appointmentTime >= :startDate', { startDate: thirtyDaysAgo })
      .groupBy('record.diagnosis')
      .orderBy('count', 'DESC')
      .limit(5)
      .getRawMany<DiagnosisRaw>();

    return results.map((item) => ({
      diagnosis: item.diagnosis,
      count: Number(item.count),
    }));
  }

  /**
   * 5. HIỆU SUẤT BÁC SĨ (Top 5 bác sĩ khám nhiều nhất)
   */
  async getTopDoctors(): Promise<DoctorPerformanceDto[]> {
    const results = await this.appointmentRepo
      .createQueryBuilder('appointment')
      .innerJoin('appointment.doctor', 'doctor')
      .select('doctor.id', 'doctorId')
      .addSelect('doctor.fullName', 'doctorName')
      .addSelect('COUNT(appointment.id)', 'count')
      .where('appointment.status = :status', { status: AppointmentStatus.COMPLETED })
      .groupBy('doctor.id')
      .addGroupBy('doctor.fullName')
      .orderBy('count', 'DESC')
      .limit(5)
      .getRawMany<DoctorPerformanceRaw>();

    return results.map((item) => ({
      id: item.doctorId,
      name: item.doctorName,
      count: Number(item.count),
    }));
  }

  /**
   * 6. LỊCH HẸN SẮP TỚI (5 lịch hẹn Confirmed gần nhất)
   */
  async getUpcomingAppointments(): Promise<UpcomingAppointmentDto[]> {
    const appointments = await this.appointmentRepo.find({
      where: {
        status: AppointmentStatus.CONFIRMED,
        // Có thể thêm điều kiện ngày >= hôm nay nếu cần
      },
      relations: ['patient', 'doctor'],
      order: { appointmentTime: 'ASC' }, // Sắp xếp thời gian gần nhất trước
      take: 5,
    });

    // Map dữ liệu gọn gàng để trả về
    return appointments.map((appt) => ({
      id: appt.id,
      time: appt.appointmentTime,
      patientName: appt.patient.fullName,
      doctorName: appt.doctor.fullName,
      reason: appt.reason || '',
    }));
  }
}
