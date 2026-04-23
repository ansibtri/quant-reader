import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Delete,
  Post,
  Patch,
  NotFoundException,
} from '@nestjs/common';
import { UserService } from './user.service';
import {
  ApiOperation,
  ApiTags,
  ApiNotFoundResponse,
  ApiForbiddenResponse,
  ApiBadGatewayResponse,
  ApiOkResponse,
  ApiInternalServerErrorResponse,
  ApiConsumes,
  ApiCreatedResponse,
  ApiBody,
} from '@nestjs/swagger';
import { UserResponseDto } from './dto/user.dto';
import { ErrorMessages } from 'src/common/constants/error-messages';
import { ResponseMessage } from 'src/common/constants/response-messages';
import { UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Body } from '@nestjs/common';
import { UploadedFile } from '@nestjs/common';
import { UserAlreadyExistsException } from 'src/common/exception/user-already-exist.exception';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { ConflictException } from '@nestjs/common';
import { diskStorage } from 'multer';
import fs from 'node:fs';
@ApiTags('User API')
@Controller('/user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('/register')
  @ApiConsumes('multipart/form-data')
  @HttpCode(HttpStatus.CREATED)
  @ApiNotFoundResponse({ description: ErrorMessages.NOT_FOUND })
  @ApiForbiddenResponse({ description: ErrorMessages.FORBIDDEN })
  @ApiBadGatewayResponse({ description: ErrorMessages.INVALID_REQUEST })
  @ApiOkResponse({ description: ResponseMessage.SUCCESS })
  @ApiInternalServerErrorResponse({
    description: ErrorMessages.INTERNAL_SERVER_ERROR,
  })
  @ApiOperation({
    description: 'Create User',
    operationId: 'RegisterUser',
    summary: 'Create a new User',
  })
  @ApiCreatedResponse({
    description: 'RESOURCE_CREATED',
  })
  @ApiInternalServerErrorResponse({
    description: ErrorMessages.INTERNAL_SERVER_ERROR,
  })
  @ApiBody({
    description: 'Users Data Submission',
    schema: {
      type: 'object',
      properties: {
        firstname: { type: 'string', example: 'John' },
        lastname: { type: 'string', example: 'Doe' },
        email: { type: 'string', example: 'john@gmail.com' },
        password: { type: 'string', example: 'Strong@123' },
        phoneNumber: { type: 'string', example: '98XXXXXXXX' },
        dateOfBirth: { type: 'string', format: 'date' },
        description: { type: 'string' },

        // THIS enables file upload UI
        profilePic: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(
    FileInterceptor('profilePic', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueName = Date.now() + '-' + file.originalname;
          cb(null, uniqueName);
        },
      }),
    }),
  )
  async registerAccount(
    @Body() payload: CreateUserDto,
    @UploadedFile('profilePic') file: Express.Multer.File,
  ): Promise<Record<string, any>> {
    try {
      const registeredDetails = await this.userService.registerUser(
        payload,
        file,
      );
      return registeredDetails;
    } catch (err) {
      if (file) {
        fs.unlinkSync(file.path);
      }
      if (err instanceof UserAlreadyExistsException) {
        throw new ConflictException(err.message);
      }
      throw err;
    }
  }

  // get single user detail by unique email
  @Get('/singleuser/:email')
  @ApiOperation({
    operationId: 'FindSingleUser',
    summary: 'Fetch Single User Details By Email',
    description:
      'When you hit the api with user email, you will get the details of the user.',
  })
  @ApiBadGatewayResponse({ description: 'BAD_REQUEST' })
  @ApiForbiddenResponse({ description: 'FORBIDDEN' })
  @ApiOkResponse({ description: ResponseMessage.SUCCESS })
  async findSingleUser(
    @Param('email') email: string,
  ): Promise<UserResponseDto> {
    // findUser takes 2 parameters in Object Literal. They are:
    // 1. First parameter: Condition
    // 2. 2nd parameter: Columns that we need
    const user = await this.userService.findUser(
      {
        email: email,
      },
      {
        id: true,
        firstname: true,
        lastname: true,
        phoneNumber: true,
        dateOfBirth: true,
        description: true,
        profilePic: true,
        role: true,
        followers: true,
        isVerified: true,
      },
    );

    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }

    return user;
  }

  // get all users
  @Get('/all')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    operationId: 'Find All User',
    summary: 'Fetch All Users Details',
    description: 'When you hit the api, you will get the details of the users.',
  })
  @ApiBadGatewayResponse({ description: 'BAD_REQUEST' })
  @ApiForbiddenResponse({ description: 'FORBIDDEN' })
  @ApiNotFoundResponse({ description: ErrorMessages.NOT_FOUND })
  @ApiInternalServerErrorResponse({
    description: ErrorMessages.INTERNAL_SERVER_ERROR,
  })
  @ApiOkResponse({ description: ResponseMessage.FETCHED })
  async findAllUsers() {
    return await this.userService.findAll();
  }

  // Deactivate User
  @Patch('/:user/toggledeactivate')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    operationId: 'Deactivate User',
    summary: 'Deactive the account of the user',
    description:
      'It will make the account unsearchable and hide all details temporarily. This action can be performed by self. ',
  })
  @ApiBadGatewayResponse({ description: 'BAD_REQUEST' })
  @ApiForbiddenResponse({ description: 'FORBIDDEN' })
  @ApiNotFoundResponse({ description: ErrorMessages.NOT_FOUND })
  @ApiInternalServerErrorResponse({
    description: ErrorMessages.INTERNAL_SERVER_ERROR,
  })
  @ApiOkResponse({ description: ResponseMessage.FETCHED })
  async toggleDeactivateUserAccount(
    @Param('user') user: string,
  ): Promise<Record<string, any>> {
    return await this.userService.toggleDeactivateUserAccount(user);
  }

  // Delete User
  @Delete('/:user/delete')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    operationId: 'Delete User',
    summary: 'Delete the account of the user',
    description:
      'It will update the account unsearchable and hide all details permanently. This action can be performed by self. ',
  })
  @ApiBadGatewayResponse({ description: 'BAD_REQUEST' })
  @ApiForbiddenResponse({ description: 'FORBIDDEN' })
  @ApiNotFoundResponse({ description: ErrorMessages.NOT_FOUND })
  @ApiInternalServerErrorResponse({
    description: ErrorMessages.INTERNAL_SERVER_ERROR,
  })
  @ApiOkResponse({ description: ResponseMessage.FETCHED })
  async deleteUser(@Param('user') user: string) {
    return await this.userService.delete(user);
  }
}
