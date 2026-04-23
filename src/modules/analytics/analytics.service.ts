import { Injectable, OnModuleDestroy, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PostHog } from 'posthog-node';
import { ErrorMessages } from 'src/common/constants/error-messages';

@Injectable()
export class AnalyticsService implements OnModuleDestroy {
  private readonly client: PostHog;
  private readonly logger = new Logger(AnalyticsService.name);

  constructor(private readonly configService: ConfigService) {
    const apiKey: string =
      this.configService.get<string>('posthog.apiKey') ||
      ErrorMessages.NOT_FOUND;
    const host: string =
      this.configService.get<string>('posthog.host') || ErrorMessages.NOT_FOUND;

    if (!apiKey || !host) {
      this.logger.warn('PostHog config missing. Analytics disabled.');
    }
    this.client = new PostHog(apiKey, { host });
  }

  // Track Event
  track(event: string, distinctId: string, properties?: Record<string, any>) {
    if (!this.client) return;
    try {
      this.client.capture({
        distinctId,
        event,
        properties,
      });
    } catch (err) {
      this.logger.error('PostHog track failed', err);
    }
  }

  // Identify user
  identify(distinctId: string, properties?: Record<string, any>) {
    if (!this.client) return;
    try {
      this.client.identify({
        distinctId,
        properties,
      });
    } catch (err) {
      this.logger.error(' PostHog identify failed', err);
    }
  }

  // Graceful Shutdown (Very Important)
  async onModuleDestroy() {
    if (!this.client) return;

    try {
      await this.client.shutdown();
      this.logger.log('Posthog client shud down');
    } catch (err) {
      this.logger.error('PostHog shutdown failed', err);
    }
  }
}
