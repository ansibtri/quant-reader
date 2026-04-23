import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from 'src/common/constants/jwtConstants';
import { UserModule } from '../users/user.module';
import { MailModule } from 'src/core/mail/mail.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import frontendConfig from 'src/core/config/frontend.config';
import { OtpModule } from 'src/core/otp/otp.module';
import { PassportModule } from '@nestjs/passport';
import tokenConfig from 'src/core/config/token.config';

@Module({
  imports: [
    ConfigModule.forFeature(frontendConfig),
    ConfigModule.forFeature(tokenConfig),
    UserModule,
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '60s' },
    }),
    PassportModule,
    MailModule,
    OtpModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
