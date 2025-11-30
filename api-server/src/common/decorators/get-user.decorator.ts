import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { User } from '@modules/users/entities';

import { RequestWithUser } from '../interfaces';

export const GetUser = createParamDecorator((_data: unknown, ctx: ExecutionContext): User => {
  const request = ctx.switchToHttp().getRequest<RequestWithUser>();
  return request.user;
});
