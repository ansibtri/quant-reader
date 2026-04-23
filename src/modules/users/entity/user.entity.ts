import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Timestamp,
  UpdateDateColumn,
  VersionColumn,
} from 'typeorm';

export enum UserRole {
  ADMIN = 'admin',
  EDITOR = 'editor',
  GHOST = 'ghost',
}
// Provide table name from entity decorator
@Entity('Users')
export class Users {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('varchar', { length: 50 })
  firstname!: string;

  @Column('varchar', { length: 50 })
  lastname!: string;

  @Column('varchar', { length: 255, unique: true })
  email!: string;

  @Column('varchar')
  password!: string;

  @Column()
  phoneNumber?: string;

  @Column('date', { nullable: true })
  dateOfBirth?: Date;

  @Column('text', { nullable: true })
  description?: string;

  @Column('text', { nullable: true })
  profilePic?: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.GHOST,
  })
  role!: UserRole;

  @Column({ nullable: true })
  refreshToken?: string; // hashed refresh token stored here

  @Column('boolean', { default: false })
  isDeactivate?: boolean;

  // Is the ID Deleted
  @Column('boolean', { default: false })
  isDeleted?: boolean;

  // followers
  @Column('simple-array', { default: '' })
  followers?: string[];

  // check if the account is verified or not
  @Column({ default: false })
  isVerified!: boolean;

  // check if the account is actively contributer or not
  @Column({ default: true })
  isActiveContributor!: boolean;

  // automatically set on creation
  @CreateDateColumn()
  createdAt?: Timestamp;

  // automatically set on update
  @UpdateDateColumn()
  updatedAt?: Date;

  // TypeORM automatically manages this field
  @VersionColumn()
  version?: number;

  // soft delete
  @DeleteDateColumn()
  deletedAt?: Date; // TypeORM automatically sets this on softDelete
}
