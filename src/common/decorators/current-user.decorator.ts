import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { ICurrentUser } from 'src/interface/current-user.interface';

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    const request = ctx
      .switchToHttp()
      .getRequest<Request & { user: ICurrentUser }>();
    return request.user;
  },
);
