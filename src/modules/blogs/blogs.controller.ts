import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UploadedFile,
} from '@nestjs/common';
import { BlogsService } from './blogs.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import {
  ApiConsumes,
  ApiOperation,
  ApiCreatedResponse,
  ApiBody,
  ApiNotFoundResponse,
  ApiForbiddenResponse,
  ApiBadGatewayResponse,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';
import { HttpCode, HttpStatus } from '@nestjs/common';
import { ErrorMessages } from 'src/common/constants/error-messages';
import { UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
@Controller('blogs')
export class BlogsController {
  constructor(private readonly blogsService: BlogsService) {}

  @Post('/create')
  @ApiConsumes('multipart/form-data')
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
  @ApiBody({
    description: 'Blogs Data Submission',
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string', example: 'John' },
        content: { type: 'string', example: 'Doe' },
        excerpt: { type: 'string', example: 'john@gmail.com' },
        authorId: {
          type: 'string',
          example: '2ff13c7e-08d6-484e-9e6f-defe34b49994',
        },
        category: { type: 'string', example: 'webdev' },
        readingTime: { type: 'string', example: '6 min' },
        slug: { type: 'string', format: 'date' },
        tags: {
          type: 'array',
          items: { type: 'string' },
          examples: ['nextjs', 'reactjs'],
        },

        // THIS enables file upload UI
        coverImage: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(
    FileInterceptor('coverImage', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueName = Date.now() + '-' + file.originalname;
          cb(null, uniqueName);
        },
      }),
    }),
  )
  create(
    @Body() payload: CreateBlogDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.blogsService.create(payload, file);
  }

  @Get()
  findAll() {
    return this.blogsService.findAll();
  }

  @Get(':slug')
  findOne(@Param('slug') slug: string) {
    return this.blogsService.findOne(slug);
  }

  @Patch(':slug')
  update(@Param('slug') slug: string, @Body() updateBlog: UpdateBlogDto) {
    return this.blogsService.update(slug, updateBlog);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.blogsService.remove(+id);
  }
}
