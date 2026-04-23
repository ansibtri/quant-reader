import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comments } from './entities/comment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Comments])],
  controllers: [CommentsController],
  providers: [CommentsService],
})
export class CommentsModule {}
