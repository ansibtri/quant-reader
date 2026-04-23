import { SetMetadata } from '@nestjs/common';
import { AnalyticsEvent } from 'src/modules/analytics/dto/analytics.dto';

export const TRACK_EVENT_KEY: string = 'track_event';

export const Track = (
  eventName: AnalyticsEvent,
  eventDetails: Record<string, any>,
) => SetMetadata(eventName, eventDetails);
