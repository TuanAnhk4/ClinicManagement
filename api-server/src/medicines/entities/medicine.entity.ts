import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
@Entity('medicines')
export class Medicine {
  @PrimaryGeneratedColumn() id: number;
  @Column({ unique: true }) name: string;
  @Column() unit: string; // Ví dụ: 'viên', 'chai', 'ống'
  @Column({ type: 'text', nullable: true }) description: string;
}
