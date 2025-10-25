import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert, OneToMany } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Appointment } from '@/appointments/entities/appointment.entity';

// Định nghĩa các vai trò người dùng có thể có trong hệ thống
export enum UserRole {
  ADMIN = 'ADMIN',
  DOCTOR = 'DOCTOR',
  PATIENT = 'PATIENT',
}

@Entity('users') // Tên của bảng trong database PostgreSQL
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, nullable: false })
  email: string;

  @Column({ nullable: false })
  password: string;

  @Column({ nullable: false })
  fullName: string;

  @Column({ unique: true, nullable: true })
  phoneNumber: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.PATIENT, // Mặc định khi tạo mới sẽ là Bệnh nhân
  })
  role: UserRole;

  @OneToMany(() => Appointment, (appointment) => appointment.patient)
  appointmentsAsPatient: Appointment[];

  @OneToMany(() => Appointment, (appointment) => appointment.doctor)
  appointmentsAsDoctor: Appointment[];

  // Đây là một "hook" của TypeORM.
  // Nó sẽ tự động chạy hàm này TRƯỚC KHI một user mới được chèn vào database.
  @BeforeInsert()
  async hashPassword() {
    // Băm mật khẩu với 10 vòng lặp (salt rounds)
    this.password = await bcrypt.hash(this.password, 10);
  }
}
