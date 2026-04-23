import { Module } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { ConfigModule } from '@nestjs/config';
import posthogConfig from 'src/core/config/posthog.config';

@Module({
  imports: [ConfigModule.forFeature(posthogConfig)],
  controllers: [],
  providers: [AnalyticsService],
})
export class AnalyticsModule {}
