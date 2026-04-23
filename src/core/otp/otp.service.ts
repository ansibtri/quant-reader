import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import crypto from 'node:crypto';
import { OTP } from './entity/otp.entity';
import { Repository } from 'typeorm';
import { OtpPurpose, VerifyOtpDto } from './dto/otp.dto';
import { ICurrentUser } from 'src/interface/current-user.interface';

type createOtpParameterType = {
  purpose: OtpPurpose;
  expiresAt: Date;
  ipAddress: string;
  userId: string;
};
@Injectable()
export class OtpService {
  constructor(
    @InjectRepository(OTP)
    private readonly otpRepository: Repository<OTP>,
  ) {}

  public async createOtp({
    purpose,
    expiresAt,
    ipAddress,
    userId,
  }: createOtpParameterType) {
    const length: number = 6;

    // crypto.randomInt is cryptographically secure + generated unique enough
    const min: number = Math.pow(10, length - 1); // 100000
    const max: number = Math.pow(10, length) - 1; // 99999
    const otp: number = crypto.randomInt(min, max + 1);

    // store otp in database
    const newOtp = new OTP();
    newOtp.otp = otp;
    newOtp.purpose = purpose;
    newOtp.isUsed = false;
    newOtp.isVerified = false;
    newOtp.expiresAt = expiresAt;
    newOtp.ipAddress = ipAddress;
    newOtp.userId = userId;

    const savedNewOtp = await this.otpRepository.save(newOtp);
    return savedNewOtp;
  }

  // Verify OTP
  public async verifyOtp(
    verificationDetails: VerifyOtpDto,
    user: ICurrentUser,
  ) {
    // check code if it exists in database
    const checkCode = await this.otpRepository.findOne({
      where: {
        otp: verificationDetails.otp,
        userId: user.id,
        isVerified: false,
        isUsed: false,
      },
    });

    if (!checkCode) throw new NotFoundException('Invalid Credentials');

    checkCode.isUsed = true;
    checkCode.isVerified = true;
    checkCode.verifiedAt = new Date();

    const otpRecordUpdated = await this.otpRepository.save(checkCode);
    return otpRecordUpdated;
  }
}
