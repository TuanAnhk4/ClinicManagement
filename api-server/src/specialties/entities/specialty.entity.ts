import { User } from 'src/users/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity('specialties')
export class Specialty {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, nullable: false })
  name: string; // Tên chuyên khoa (ví dụ: Tim Mạch, Da Liễu)

  @Column({ type: 'text', nullable: true })
  description: string | null;

  // Một chuyên khoa có thể có nhiều bác sĩ
  @OneToMany(() => User, (user) => user.specialty)
  doctors: User[];

  @Column({ type: 'decimal', precision: 10, scale: 0, default: 0 })
  base_cost: number;
}
