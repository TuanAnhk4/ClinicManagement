import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from 'src/users/entities/user.entity';
import { Request } from 'express';

interface RequestWithUser extends Request {
  user: User;
}

export const GetUser = createParamDecorator((_data: unknown, ctx: ExecutionContext): User => {
  const request: RequestWithUser = ctx.switchToHttp().getRequest();
  return request.user;
});
