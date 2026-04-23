import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import {
  ApiConsumes,
  ApiNotFoundResponse,
  ApiForbiddenResponse,
  ApiBadGatewayResponse,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiCreatedResponse,
} from '@nestjs/swagger';
import { ErrorMessages } from 'src/common/constants/error-messages';
import { HttpCode, HttpStatus } from '@nestjs/common';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  @ApiConsumes('application/json')
  @HttpCode(HttpStatus.CREATED)
  @ApiNotFoundResponse({ description: ErrorMessages.NOT_FOUND })
  @ApiForbiddenResponse({ description: ErrorMessages.FORBIDDEN })
  @ApiBadGatewayResponse({ description: ErrorMessages.INVALID_REQUEST })
  @ApiInternalServerErrorResponse({
    description: ErrorMessages.INTERNAL_SERVER_ERROR,
  })
  @ApiOperation({
    description: 'Create Blog',
    operationId: 'RegisterBlog',
    summary: 'Create a new Blog',
  })
  @ApiCreatedResponse({
    description: 'RESOURCE_CREATED',
  })
  @ApiInternalServerErrorResponse({
    description: ErrorMessages.INTERNAL_SERVER_ERROR,
  })
  create(@Body() payload: CreateCommentDto) {
    return this.commentsService.create(payload);
  }

  @Get(':blogId/comments')
  findAll(@Param('blogId') blogId: string) {
    return this.commentsService.findAllByBlogId(blogId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.commentsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCommentDto: UpdateCommentDto) {
    return this.commentsService.update(+id, updateCommentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.commentsService.remove(+id);
  }
}
