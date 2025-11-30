import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';

import { UserRole } from '@/modules/users/enums';

import { RequestWithUser } from '../interfaces';

@Injectable()
export class OwnerOrAdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<RequestWithUser>();

    const user = request.user;
    const params = request.params;

    if (!user) return false;

    if (user.role === UserRole.ADMIN) {
      return true;
    }

    const targetId = parseInt(params.id);

    if (user.id === targetId) {
      return true;
    }

    throw new ForbiddenException('Bạn không có quyền sửa thông tin của người khác!');
  }
}
