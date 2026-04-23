import { Injectable, NotFoundException, ParseUUIDPipe } from '@nestjs/common';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Blog } from './entities/blog.entity';
import { IsNull, Repository } from 'typeorm';

@Injectable()
export class BlogsService {
  constructor(
    @InjectRepository(Blog)
    private blogs: Repository<Blog>,
  ) {}
  public async create(payload: CreateBlogDto, file: Express.Multer.File) {
    try {
      const newBlog = new Blog();
      newBlog.title = payload.title;
      newBlog.category = payload.category;
      newBlog.authorId = payload.authorId;
      newBlog.content = payload.content;
      newBlog.coverImage = file.filename;
      newBlog.excerpt = payload.excerpt;
      newBlog.tags = payload.tags ?? [];
      newBlog.slug = payload.slug;
      newBlog.readingTime = payload.readingTime;

      const savedNewBlog = await this.blogs.save(newBlog);
      console.log('saved: -', savedNewBlog);
      return savedNewBlog;
    } catch (error) {
      throw new Error(error.msg);
    }
  }

  public async findAll() {
    try {
      const blogs = await this.blogs.find({
        where: {
          deletedAt: IsNull(),
        },
      });
      return blogs;
    } catch (err) {
      throw new Error(err.msg);
    }
  }

  async findOne(slug: string) {
    try {
      const getBlog = await this.blogs.find({
        where: {
          slug: slug,
        },
      });

      if (!getBlog) throw new NotFoundException('Blog not found');

      return getBlog;
    } catch (error) {
      throw new Error(error.msg);
    }
  }

  async update(slug: string, updateBlog: UpdateBlogDto) {
    try {
      const blog = await this.blogs.findOne({
        where: {slug: slug}
      });
      if (!blog) throw new NotFoundException(`Blog not found`);

      Object.assign(blog, updateBlog);
      // blog.title = updateBlog.title;
      // blog.slug = updateBlog.slug;
      // blog.content = updateBlog.content;
      // blog.excerpt = updateBlog.excerpt;
      // blog.category = updateBlog.category;
      // blog.tags = updateBlog.tags;
      // blog.authorId = updateBlog.authorId;
      // blog.readingTime = updateBlog.readingTime;

      const savedBlog = await this.blogs.save(blog);
      return savedBlog;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async remove(id: number) {
    try {
      const deleteBlog = await this.blogs.softDelete(id);
      return deleteBlog;
    } catch (error) {
      throw new Error(error.msg);
    }
  }
}
