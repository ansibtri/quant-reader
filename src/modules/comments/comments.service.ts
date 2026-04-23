import { Injectable } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Comments } from './entities/comment.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comments)
    private commentRepository: Repository<Comments>,
  ) {}
  async create(payload: CreateCommentDto) {
    try {
      const newComment = new Comments();
      newComment.userId = payload.userId;
      newComment.blogId = payload.blogId;
      newComment.description = payload.description;
      newComment.parentCommentId = payload.parentCommentId;
      console.log(newComment);
      const savedNewComment = await this.commentRepository.save(newComment);

      console.log(savedNewComment);
      return savedNewComment;
    } catch (error) {
      console.log(error);
      throw new Error(error.message);
    }
  }

  async findAllByBlogId(blogId: string) {
    try {
      const blog = await this.commentRepository.findBy({
        blogId: blogId,
      });
      return blog;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} comment`;
  }

  update(id: number, updateCommentDto: UpdateCommentDto) {
    return `This action updates a #${id} comment`;
  }

  remove(id: number) {
    return `This action removes a #${id} comment`;
  }
}
