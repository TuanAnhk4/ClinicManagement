import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '@users/entities/user.entity';
import { ROLES_KEY } from './roles.decorator';
import { Request } from 'express'; // 1. Import Request từ express

// 2. Tạo interface để định nghĩa request có chứa user
interface RequestWithUser extends Request {
  user: {
    userId: number;
    email: string;
    role: UserRole;
  };
}

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      return true;
    }

    // 3. Áp dụng interface đã tạo
    const request: RequestWithUser = context.switchToHttp().getRequest();
    const { user } = request; // Bây giờ 'user' đã có kiểu dữ liệu rõ ràng

    // So sánh vai trò của user với vai trò yêu cầu
    return requiredRoles.some((role) => user.role === role);
  }
}
