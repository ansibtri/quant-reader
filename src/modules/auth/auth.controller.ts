import { Controller, Post, Body, Ip } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  ApiConsumes,
  ApiNotFoundResponse,
  ApiForbiddenResponse,
  ApiBadGatewayResponse,
  ApiOkResponse,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiCreatedResponse,
  ApiBody,
  ApiTags,
  ApiBadRequestResponse,
} from '@nestjs/swagger';

import { HttpCode, HttpStatus } from '@nestjs/common';
import { ErrorMessages } from 'src/common/constants/error-messages';
import { ResponseMessage } from 'src/common/constants/response-messages';
import type { LoginUserDto } from './dto/login.dto';
import { VerifyOtpDto } from 'src/core/otp/dto/otp.dto';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { UserResponseDto } from '../users/dto/user.dto';
import { ICurrentUser } from 'src/interface/current-user.interface';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  @ApiConsumes('application/json')
  @HttpCode(HttpStatus.CREATED)
  @ApiNotFoundResponse({ description: ErrorMessages.NOT_FOUND })
  @ApiForbiddenResponse({ description: ErrorMessages.FORBIDDEN })
  @ApiBadGatewayResponse({ description: ErrorMessages.INVALID_REQUEST })
  @ApiOkResponse({ description: ResponseMessage.SUCCESS })
  @ApiInternalServerErrorResponse({
    description: ErrorMessages.INTERNAL_SERVER_ERROR,
  })
  @ApiOperation({
    description: 'Login User',
    operationId: 'Authenticate User',
    summary: 'Verify a new User',
  })
  @ApiCreatedResponse({
    description: 'RESOURCE_AUTHENTICATED',
  })
  @ApiInternalServerErrorResponse({
    description: ErrorMessages.INTERNAL_SERVER_ERROR,
  })
  @ApiBody({
    description: 'User Authentication',
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', example: 'john@gmail.com' },
        password: { type: 'string', example: 'Strong@123' },
      },
    },
  })
  async login(@Body() payload: LoginUserDto) {
    return await this.authService.login(payload.email, payload.password);
  }

  // recover account
  @Post('/recover')
  @ApiConsumes('application/json')
  @HttpCode(HttpStatus.CREATED)
  @ApiBadRequestResponse({ description: ErrorMessages.BAD_REQUEST })
  @ApiNotFoundResponse({ description: ErrorMessages.NOT_FOUND })
  @ApiForbiddenResponse({ description: ErrorMessages.FORBIDDEN })
  @ApiBadGatewayResponse({ description: ErrorMessages.INVALID_REQUEST })
  @ApiOkResponse({ description: ResponseMessage.SUCCESS })
  @ApiInternalServerErrorResponse({
    description: ErrorMessages.INTERNAL_SERVER_ERROR,
  })
  @ApiOperation({
    description: 'Recover Account',
    operationId: 'recover_account',
    summary: 'Forget Password',
  })
  @ApiCreatedResponse({
    description: 'RESOURCE_AUTHENTICATED',
  })
  @ApiInternalServerErrorResponse({
    description: ErrorMessages.INTERNAL_SERVER_ERROR,
  })
  @ApiBody({
    description: 'Recover the password by verifying the email',
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', example: 'ansibtri961@gmail.com' },
      },
    },
  })
  async recover(
    @Body() payload: Omit<LoginUserDto, 'password'>,
    @Ip() ipAddress: string,
  ) {
    return await this.authService.recoverAccount(payload.email, ipAddress);
  }

  // recover account
  @Post('/verifyotp')
  @ApiConsumes('application/json')
  @HttpCode(HttpStatus.CREATED)
  @ApiBadGatewayResponse({ description: ErrorMessages.INVALID_REQUEST })
  @ApiNotFoundResponse({ description: ErrorMessages.NOT_FOUND })
  @ApiForbiddenResponse({ description: ErrorMessages.FORBIDDEN })
  @ApiInternalServerErrorResponse({
    description: ErrorMessages.INTERNAL_SERVER_ERROR,
  })
  @ApiOperation({
    description: 'Verify OTP Code',
    operationId: 'verify_otp',
    summary: 'Verify OTP',
  })
  @ApiCreatedResponse({
    description: ResponseMessage.SUCCESS,
  })
  @ApiBody({
    description: 'Send the emailed OTP',
    schema: {
      type: 'object',
      properties: {
        otp: { type: 'number', example: 490200 },
        email: { type: 'string', example: 'ansibtri961@gmail.com' },
        purpose: { type: 'string', example: 'password_reset' },
      },
    },
  })
  async verifyOtp(@Body() payload: VerifyOtpDto) {
    return this.authService.verifyOtp(payload);
  }
}
