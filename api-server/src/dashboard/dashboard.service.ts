import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm'; // Import MoreThanOrEqual
import { Appointment, AppointmentStatus } from 'src/appointments/entities/appointment.entity';
import { MedicalRecord } from 'src/medical-records/entities/medical-record.entity';
import { User, UserRole } from 'src/users/entities/user.entity';

// Định nghĩa interface cho kết quả truy vấn thô để tránh lỗi 'any'
interface DailyCountResult {
  date: string; // DATE() trả về string
  count: string; // COUNT() trả về string
}

interface MonthlyCountResult {
  month: string; // TO_CHAR() trả về string
  count: string;
}

interface TopDiagnosisResult {
  diagnosis: string;
  count: string;
}

interface SpecialtyCountResult {
  // Giả sử specialtyId là number, nếu bạn dùng specialty name thì đổi thành string
  specialtyId: number;
  count: string;
}

interface RevenueDataResult {
  date: string; // Hoặc month: string tùy theo cách group
  revenue: number; // Doanh thu là số
}

interface SpecialtyMap {
  [key: number]: string; // Key là number (ID), Value là string (Tên)
}

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Appointment)
    private appointmentRepository: Repository<Appointment>,
    @InjectRepository(MedicalRecord)
    private medicalRecordRepository: Repository<MedicalRecord>,
    @InjectRepository(User) // Inject UserRepository để join lấy specialty
    private userRepository: Repository<User>,
  ) {}

  /**
   * 1. Lấy số lượng lịch hẹn đã hoàn thành mỗi ngày (30 ngày gần nhất)
   */
  async getDailyAppointmentCounts(): Promise<{ date: string; count: number }[]> {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    thirtyDaysAgo.setHours(0, 0, 0, 0); // Đặt về đầu ngày

    const results = await this.appointmentRepository
      .createQueryBuilder('appointment')
      // Sử dụng DATE() cho PostgreSQL/MySQL để lấy phần ngày
      .select('DATE(appointment.appointmentTime)', 'date')
      .addSelect('COUNT(appointment.id)', 'count')
      .where('appointment.appointmentTime >= :startDate', { startDate: thirtyDaysAgo })
      .andWhere('appointment.status = :status', { status: AppointmentStatus.COMPLETED })
      .groupBy('date')
      .orderBy('date', 'ASC')
      .getRawMany<DailyCountResult>();

    // Chuyển đổi count sang number
    return results.map((item: DailyCountResult) => ({
      date: item.date,
      count: parseInt(item.count, 10) || 0, // Đảm bảo là số
    }));
  }

  /**
   * 2. Lấy số lượng lịch hẹn đã hoàn thành mỗi tháng trong năm hiện tại
   */
  async getMonthlyAppointmentCounts(): Promise<{ month: string; count: number }[]> {
    const currentYear = new Date().getFullYear();

    const results = await this.appointmentRepository
      .createQueryBuilder('appointment')
      // Sử dụng TO_CHAR() cho PostgreSQL để định dạng YYYY-MM
      .select("TO_CHAR(appointment.appointmentTime, 'YYYY-MM')", 'month')
      .addSelect('COUNT(appointment.id)', 'count')
      // Sử dụng EXTRACT() cho PostgreSQL để lấy năm
      .where('EXTRACT(YEAR FROM appointment.appointmentTime) = :year', { year: currentYear })
      .andWhere('appointment.status = :status', { status: AppointmentStatus.COMPLETED })
      .groupBy('month')
      .orderBy('month', 'ASC')
      .getRawMany<MonthlyCountResult>();

    return results.map((item: MonthlyCountResult) => ({
      month: item.month,
      count: parseInt(item.count, 10) || 0,
    }));
  }

  /**
   * 3. Lấy top 5 chẩn đoán phổ biến nhất (30 ngày gần nhất)
   */
  async getTopDiagnoses(): Promise<{ diagnosis: string; count: number }[]> {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    thirtyDaysAgo.setHours(0, 0, 0, 0);

    const results = await this.medicalRecordRepository
      .createQueryBuilder('record')
      .select('record.diagnosis', 'diagnosis')
      .addSelect('COUNT(record.id)', 'count')
      // Join với appointment để lọc theo ngày
      .innerJoin('record.appointment', 'appointment')
      .where('appointment.appointmentTime >= :startDate', { startDate: thirtyDaysAgo })
      .groupBy('record.diagnosis')
      .orderBy('count', 'DESC')
      .limit(5) // Giới hạn top 5
      .getRawMany<TopDiagnosisResult>();

    return results.map((item: TopDiagnosisResult) => ({
      diagnosis: item.diagnosis,
      count: parseInt(item.count, 10) || 0,
    }));
  }

  /**
   * 4. Lấy phân bổ số lượng lịch hẹn đã hoàn thành theo chuyên khoa (30 ngày gần nhất)
   */
  async getAppointmentCountBySpecialty(): Promise<{ specialty: string; count: number }[]> {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    thirtyDaysAgo.setHours(0, 0, 0, 0);

    const results = await this.appointmentRepository
      .createQueryBuilder('appointment')
      // Chọn specialtyId từ bảng doctor (User)
      .select('doctor.specialtyId', 'specialtyId')
      .addSelect('COUNT(appointment.id)', 'count')
      // Join với bảng users (đặt alias là 'doctor') thông qua quan hệ
      .innerJoin('appointment.doctor', 'doctor')
      .where('appointment.appointmentTime >= :startDate', { startDate: thirtyDaysAgo })
      .andWhere('appointment.status = :status', { status: AppointmentStatus.COMPLETED })
      // Đảm bảo chỉ join với bác sĩ
      .andWhere('doctor.role = :role', { role: UserRole.DOCTOR })
      .groupBy('doctor.specialtyId')
      .orderBy('count', 'DESC')
      .getRawMany<SpecialtyCountResult>();

    // TODO: Cần có cơ chế mapping specialtyId sang tên chuyên khoa thực tế
    // Ví dụ: Query thêm bảng specialties hoặc dùng một map định nghĩa sẵn
    // Dưới đây chỉ là placeholder
    const specialtyMap: SpecialtyMap = { 1: 'Tim Mạch', 2: 'Da Liễu', 3: 'Nha Khoa' };

    return results.map((item: SpecialtyCountResult) => {
      // 3. Lấy tên chuyên khoa một cách an toàn
      const specialtyName: string = specialtyMap[item.specialtyId] ?? `Chuyên khoa ID ${item.specialtyId}`; // Dùng ?? để cung cấp giá trị mặc định

      return {
        specialty: specialtyName, // Gán giá trị string đã được đảm bảo
        count: parseInt(item.count, 10) || 0,
      };
    });
  }

  /**
   * 5. Lấy dữ liệu doanh thu (Placeholder - cần cột 'cost' trong database)
   */
  async getRevenueData(): Promise<RevenueDataResult[]> {
    // Logic này chỉ là ví dụ, bạn cần có cột 'cost' trong bảng Appointment hoặc MedicalRecord
    // const results = await this.appointmentRepository
    //   .createQueryBuilder('appointment')
    //   .select('DATE(appointment.appointmentTime)', 'date')
    //   .addSelect('SUM(appointment.cost)', 'revenue') // Giả sử có cột cost
    //   .where('appointment.status = :status', { status: AppointmentStatus.COMPLETED })
    //   .groupBy('date')
    //   .orderBy('date', 'ASC')
    //   .getRawMany();
    // return results.map(item => ({ date: item.date, revenue: parseFloat(item.revenue) || 0 }));

    // Trả về dữ liệu rỗng nếu chưa có cột cost
    return Promise.resolve([]);
  }
}
