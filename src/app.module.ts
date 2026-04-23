import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppConfigModule } from './core/config/config.module';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DomainModule } from './modules/domain.module';
import { MailModule } from './core/mail/mail.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    AppConfigModule,
    // Use forRootAsync to wait for ConfigService to be ready
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('database.host'),
        port: config.get<number>('database.port'),
        username: config.get<string>('database.username'),
        password: '12345678',
        database: config.get<string>('database.database'),
        autoLoadEntities: true,
        synchronize:
          config.get<string>('app.env', { infer: true }) !== 'PRODUCTION',
      }),
    }),
    DomainModule,
    MailModule,
    ScheduleModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
