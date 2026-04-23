import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { catchError, distinct, Observable, tap } from 'rxjs';
import { AnalyticsService } from 'src/modules/analytics/analytics.service';
import { AnalyticsEvent } from 'src/modules/analytics/dto/analytics.dto';
import { TRACK_EVENT_KEY } from '../decorators/track.decorator';

@Injectable()
export class AnalyticsInterceptor implements NestInterceptor {
  constructor(
    private readonly reflector: Reflector,
    private readonly analytics: AnalyticsService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const metadata = this.reflector.get<{
      eventName: AnalyticsEvent;
      getDetails?: (req: any) => Record<string, any>;
    }>(TRACK_EVENT_KEY, context.getHandler());

    if (!metadata) {
      return next.handle();
    }

    const { eventName, getDetails } = metadata;

    const req = context.switchToHttp().getRequest();
    const userId = req.user?.id || 'anonymous';

    return next.handle().pipe(
      tap(() => {
        const properties = getDetails ? getDetails(req) : {};

        this.analytics.track(eventName, userId, {
          ...properties,
          path: req.url,
          method: req.method,
          status: 'success',
        });
      }),
      catchError((err) => {
        this.analytics.track(eventName, userId, {
          path: req.url,
          method: req.method,
          status: 'error',
          error: err.message,
        });
        throw err;
      }),
    );
  }
}
