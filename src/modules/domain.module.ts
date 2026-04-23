import { Module } from '@nestjs/common';
import { UserModule } from './users/user.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { AuthModule } from './auth/auth.module';
import { BlogsModule } from './blogs/blogs.module';
import { CommentsModule } from './comments/comments.module';
@Module({
  imports: [
    UserModule,
    AnalyticsModule,
    AuthModule,
    CommentsModule,
    BlogsModule,
  ],
  controllers: [],
  providers: [],
})
export class DomainModule {}
