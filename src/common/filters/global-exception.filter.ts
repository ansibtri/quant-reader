import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { UserAlreadyExistsException } from '../exception/user-already-exist.exception';
import { Request, Response } from 'express'; // 👈 import from express

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(
    exception: HttpException | UserAlreadyExistsException,
    host: ArgumentsHost,
  ) {
    const ctx = host.switchToHttp();

    const response = ctx.getResponse<Response>(); // now correctly typed
    const request = ctx.getRequest<Request>();

    const statusCode =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? exception.message
        : 'Internal Server Error';

    response.status(statusCode).json({
      message,
      statusCode,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
