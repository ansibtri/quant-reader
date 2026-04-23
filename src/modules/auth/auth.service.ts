import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { compareHash } from 'src/common/utils/hashing.utils';
import { UserService } from '../users/user.service';
import { MailService } from 'src/core/mail/mail.service';
import frontendConfig from 'src/core/config/frontend.config';
import type { ConfigService, ConfigType } from '@nestjs/config';
import { OtpService } from 'src/core/otp/otp.service';
import { OtpPurpose, VerifyOtpDto } from 'src/core/otp/dto/otp.dto';
import { ICurrentUser } from 'src/interface/current-user.interface';
import { generateAccessToken } from 'src/common/utils/generate-token.util';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import tokenConfig from 'src/core/config/token.config';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private mailService: MailService,
    @Inject(frontendConfig.KEY)
    private readonly frontend: ConfigType<typeof frontendConfig>,
    private otpService: OtpService,
    private jwtService: JwtService,
    @Inject(tokenConfig.KEY)
    private readonly token: ConfigType<typeof tokenConfig>,
  ) {}

  // login account
  public async login(email: string, password: string) {
    // findUser takes 2 parameters in Object Literal. They are:
    // 1. First parameter: Condition
    // 2. 2nd parameter: Columns that we need
    const user = await this.userService.findUser(
      {
        email: email,
      },
      {
        id: true,
        password: true,
        firstname: true,
        lastname: true,
        phoneNumber: true,
        dateOfBirth: true,
        description: true,
        profilePic: true,
        role: true,
        followers: true,
        isVerified: true,
      },
    );

    // if email doesn't exist then
    if (!user) {
      throw new NotFoundException(`User with ${email} not found`);
    }

    // Check Password
    const isPasswordValid = await compareHash(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check if account is deactivated
    if (user.isDeactivate) {
      throw new ForbiddenException('Account is deactivate');
    }

    const tokens = await this.generateAndStoreTokens(user.id, user.email);

    const hashedRefreshToken = await bcrypt.hash(tokens.refreshToken, 10);

    const token = await this.userService.updateRefreshToken(
      email,
      hashedRefreshToken,
    );
    return token;
  }

  public async generateAndStoreTokens(userId: string, email: string) {
    const payload = {
      sub: userId,
      email,
    };

    const accessToken = await this.jwtService.signAsync(payload);

    const refreshToken = await this.jwtService.signAsync(payload);
    console.log(refreshToken);

    return {
      accessToken,
      refreshToken,
    };
  }

  // account recovery
  public async recoverAccount(email: string, ipAddress: string) {
    // get user detail if email exists
    const user = await this.userService.findUser(
      {
        email: email,
      },
      {
        id: true,
        firstname: true,
        lastname: true,
        email: true,
      },
    );

    if (!user) {
      throw new NotFoundException('User not found!');
    }
    // generate otp
    const timeInMinutes: number = 20;
    const otp = await this.otpService.createOtp({
      purpose: OtpPurpose.PASSWORD_RESET,
      expiresAt: new Date(Date.now() + timeInMinutes * 60 * 1000),
      ipAddress: ipAddress,
      userId: user.id,
    });

    return await this.mailService.sendResetPasswordEmail(email, {
      name: `${user?.firstname} ${user?.lastname}`,
      resetUrl: `${this.frontend.url}${this.frontend.recoveryUrl}?token=${otp.otp}`,
      expiresIn: `${timeInMinutes} minutes`,
    });
  }

  // verify otp
  public async verifyOtp(verificationDetails: VerifyOtpDto) {
    const { email } = verificationDetails;

    const checkIfExists = await this.userService.findUser(
      {
        email: email,
      },
      {
        id: true,
        email: true,
        role: true,
        isVerified: true,
        isDeactivate: true,
      },
    );
    if (!checkIfExists) {
      throw new NotFoundException(`User not found`);
    }

    const verifyCode = await this.otpService.verifyOtp(
      verificationDetails,
      checkIfExists as ICurrentUser,
    );

    return verifyCode;
  }
}
