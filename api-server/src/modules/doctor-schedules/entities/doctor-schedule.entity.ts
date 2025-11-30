import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '@modules/users/entities';

@Entity('doctor_schedules')
export class DoctorSchedule {
  @PrimaryGeneratedColumn()
  id: number;

  // Ngày trong tuần:
  // Quy ước: 0 = Chủ Nhật, 1 = Thứ 2, ..., 6 = Thứ 7 (Theo chuẩn JavaScript Date.getDay())
  // Hoặc: 1 = Thứ 2 ... 7 = Chủ Nhật (Tùy bạn chọn, nhưng cần nhất quán với Frontend)
  @Column({ type: 'int' })
  dayOfWeek: number;

  // Giờ bắt đầu (Lưu dạng chuỗi 'HH:mm:ss', ví dụ '08:00:00')
  @Column({ type: 'time' })
  startTime: string;

  // Giờ kết thúc (Lưu dạng chuỗi 'HH:mm:ss', ví dụ '17:00:00')
  @Column({ type: 'time' })
  endTime: string;

  // --- QUAN HỆ VỚI BÁC SĨ ---

  @ManyToOne(() => User, (user) => user.doctorSchedules, {
    onDelete: 'CASCADE', // Nếu xóa Bác sĩ thì xóa luôn lịch làm việc
    nullable: false,
  })
  @JoinColumn({ name: 'doctorId' })
  doctor: User;

  @Column()
  doctorId: number; // Cột ID thực tế

  // --- AUDIT ---

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
