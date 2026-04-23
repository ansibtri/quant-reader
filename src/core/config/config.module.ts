import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import appConfig from './app.config';
import databaseConfig from './database.config';
import mailConfig from './mail.config';
import { validate } from './env.validation';
import frontendConfig from './frontend.config';
import tokenConfig from './token.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [
        appConfig,
        databaseConfig,
        mailConfig,
        frontendConfig,
        tokenConfig,
      ],
      validate,
    }),
  ],
})
export class AppConfigModule {}
