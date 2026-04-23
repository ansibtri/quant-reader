import { HttpException, HttpStatus } from '@nestjs/common';

export class UserAlreadyExistsException extends HttpException {
  constructor(message?: string) {
    super('CONFLICT: ' + (message ? message : null), HttpStatus.CONFLICT);
  }
}
