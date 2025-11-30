import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';

import { User } from '@/modules/users/entities';
import { IS_PUBLIC_KEY } from '../decorators';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    // 4. Kiểm tra xem route hiện tại có gắn @Public không
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // Nếu có @Public, cho qua luôn (return true)
    if (isPublic) {
      return true;
    }

    // Nếu không, chạy logic kiểm tra Token bình thường của cha
    return super.canActivate(context);
  }
  // Bạn có thể override hàm này để tùy chỉnh cách xử lý lỗi
  // Ví dụ: Nếu không có token hoặc token sai, NestJS mặc định trả về 401.
  // Bạn có thể tùy biến thông báo lỗi ở đây nếu muốn.

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleRequest(err: any, user: any, _info: any, _context: any, _status: any): any {
    // err: Lỗi hệ thống (nếu có)
    // user: User object trả về từ JwtStrategy (hàm validate)
    // info: Thông tin lỗi từ Passport (ví dụ: "jwt expired", "No auth token")

    if (err || !user) {
      throw err || new UnauthorizedException('Bạn cần đăng nhập để thực hiện hành động này.');
    }

    return user as User;
  }
}
