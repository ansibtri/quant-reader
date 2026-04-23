import {
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  Matches,
  MaxDate,
  MaxLength,
  Length,
  IsOptional,
  IsBoolean,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateUserDto {
  @ApiProperty({
    name: 'firstname',
    required: true,
    example: 'John',
  })
  // Validates that the value is  a non-empty string
  @IsNotEmpty({ message: 'First name is required' })
  @IsString({ message: 'First name must be a string' })
  @MinLength(3, { message: 'First name must be at least 3 characters' })
  @MaxLength(50, { message: 'First name cannot exceed 50 characters' })
  readonly firstname!: string;

  @ApiProperty({
    name: 'lastname',
    required: true,
    example: 'Doe',
  })
  // Validates that the value is a non-empty string
  @IsNotEmpty({ message: 'Last name is required' })
  @IsString({ message: 'Last name must be a string ' })
  @MinLength(3, { message: 'Last name must be at least 3 characters' })
  @MaxLength(50, { message: 'Last name cannot exceed 50 characters' })
  readonly lastname!: string;

  @ApiProperty({
    name: 'email',
    required: true,
    example: 'john.doe@example.com',
  })
  // Validates proper email format using RFC 5322 standard
  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  readonly email!: string;

  @ApiProperty({
    name: 'password',
    required: true,
    example: '#!@$SF#R',
  })
  // Validates password with custom regex pattern for strength requirements
  @IsNotEmpty()
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).+$/, {
    message:
      'Password must contain uppercase, lowercase, number, and special character',
  })
  readonly password!: string;

  @ApiProperty({
    name: 'phoneNumber',
    required: true,
    example: '98-xxx-xxxxx',
  })
  @IsNotEmpty({ message: 'Phone Number is required' })
  @IsString({ message: 'Phone Number must be valid' })
  @Length(10, 10, { message: 'Phone Number must be of length 10.' })
  readonly phoneNumber?: string;

  @ApiProperty({
    name: 'dateOfBirth',
    required: true,
    example: '2071/12/12',
  })
  @Type(() => Date)
  @IsDate()
  @MaxDate(
    () => new Date(new Date().setFullYear(new Date().getFullYear() - 13)),
    { message: 'User must be at least 13 years old' },
  )
  readonly dateOfBirth?: Date;

  @ApiProperty({
    name: 'description',
    required: false,
    example: 'Please tell us about yourself!',
  })
  @IsString()
  @IsOptional()
  @Length(0, 500)
  readonly description?: string;

  @ApiProperty({
    name: 'isDeactivate',
    required: false,
    example: 'Is the ID deactivate',
  })
  @IsBoolean()
  @IsOptional()
  readonly isDeactivate?: boolean;

  @ApiProperty({
    name: 'isDeleted',
    required: false,
    example: 'Is the ID Deleted',
  })
  @IsBoolean()
  @IsOptional()
  readonly isDeleted?: boolean;
}
