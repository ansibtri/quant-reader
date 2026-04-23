import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';

export enum OtpPurpose {
  EMAIL_VERIFICATION = 'email_verification',
  PASSWORD_RESET = 'password_reset',
  TWO_FACTOR_AUTH = 'two_factor_auth',
  ACCOUNT_RECOVERY = 'account_recovery',
}

// create otp dto
export class CreateOtpDto {
  @IsNumber()
  @IsNotEmpty()
  otp!: number;

  @IsString()
  @IsNotEmpty()
  userId!: string;

  @IsEnum(OtpPurpose)
  @IsNotEmpty()
  purpose!: OtpPurpose;

  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  createdAt!: Date;

  @Type(() => Date)
  @IsDate()
  expiresAt!: Date;
}

// otp response dto
export class OtpResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  otp!: number;

  @ApiProperty()
  isUsed!: boolean;

  @ApiProperty()
  isExpired!: boolean;

  @ApiProperty()
  expiresAt!: Date;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  otpGeneratedBy!: {
    id: string;
    email: string;
    firstname: string;
  };
}

// verification of otp
export class VerifyOtpDto {
  @IsNumber()
  @IsNotEmpty()
  otp!: number;

  @IsEnum(OtpPurpose)
  @IsNotEmpty()
  purpose!: OtpPurpose;

  @IsEmail()
  @IsNotEmpty()
  email!: string;
}
