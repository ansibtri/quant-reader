import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { OtpPurpose } from '../dto/otp.dto';
import { Users } from 'src/modules/users/entity/user.entity';
import { Timestamp } from 'typeorm';

@Entity('Otp')
export class OTP {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  otp!: number;

  @Column({
    type: 'enum',
    enum: OtpPurpose,
  })
  purpose!: OtpPurpose; // what is otp for

  @Column({
    default: false,
  })
  isUsed!: boolean; // was it used

  @Column({ default: false })
  isVerified!: boolean; // was it verified successfully

  @Column()
  expiresAt!: Date; // when it expires

  @Column({ nullable: true })
  verifiedAt?: Date; // when it was verified

  @Column({ nullable: true })
  ipAddress?: string; // who requested it (audit)

  @ManyToOne(() => Users, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  otpGeneratedBy!: Users;

  @Column()
  userId!: string;

  @CreateDateColumn()
  createdAt!: Timestamp;

  @DeleteDateColumn()
  deletedAt?: Date; // soft delete for audit
}
