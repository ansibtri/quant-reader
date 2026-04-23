import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MinLength,
} from 'class-validator';

export class CreateCommentDto {
  @ApiProperty({
    name: 'description',
    required: true,
    example: 'babal hai babal blog ta! dami lekhdo raechau',
  })
  @IsString()
  @MinLength(3)
  @IsNotEmpty()
  description!: string;

  @ApiProperty({
    name: 'userId',
    required: true,
    example: '873a23c9-e77d-445d-9b8c-c3012671db41',
  })
  @IsUUID()
  @IsNotEmpty()
  userId!: string;

  @ApiProperty({
    name: 'blogId',
    required: true,
    example: '5a70bead-de92-4cd8-a1c8-33d57621fb47',
  })
  @IsUUID()
  @IsNotEmpty()
  blogId!: string;

  @ApiProperty({
    name: 'parentCommentId',
    required: false,
    example: '09067eab-e16e-45ef-b39e-ef505f42aca9',
  })
  @IsOptional()
  @IsUUID()
  parentCommentId?: string;
}
