import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsArray,
  isNotEmpty,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateBlogDto {
  @ApiProperty({
    name: 'title',
    required: true,
    example: 'Getting Started with Next.js 14',
  })
  @IsNotEmpty()
  @IsString()
  title!: string;

  @ApiProperty({
    name: 'slug',
    required: false,
    example: 'getting-started-nextjs-14',
  })
  @IsNotEmpty()
  @IsString()
  slug!: string;

  @ApiProperty({
    name: 'content',
    required: true,
    example:
      'Next.js 14 introduces powerful features like server actions, improved routing, and enhanced performance. In this guide, we explore how to set up your first app and understand the core concepts..',
  })
  @IsString()
  @IsNotEmpty()
  content!: string;

  @ApiProperty({
    name: 'excerpt',
    required: true,
    example:
      'Learn the fundamentals of Next.js 14 and how to build fast web apps.',
  })
  @IsString()
  @IsNotEmpty()
  excerpt!: string;

  @ApiProperty({
    name: 'category',
    required: true,
    example: 'webdev',
  })
  @IsString()
  @IsNotEmpty()
  category!: string;

  @ApiProperty({
    name: 'tags',
    required: false,
    example: ['Next.js', 'React', 'JavaScript'],
  })
  @Transform(({ value }) =>
    Array.isArray(value)
      ? value
      : value.split(',').map((v: string) => v.trim()),
  )
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags!: string[];

  @ApiProperty({
    name: 'author',
    required: false,
    example: 'Anish Dev',
  })
  @IsString()
  @IsNotEmpty()
  authorId!: string;

  @ApiProperty()
  @IsString()
  readingTime!: string;

  // @ApiProperty()
  // @IsString()
  // @IsOptional()
  // coverImage!: string;
}
