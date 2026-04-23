import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { AnalyticsModule } from '../analytics/analytics.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from './entity/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Users]), AnalyticsModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
