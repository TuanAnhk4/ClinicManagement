import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '@users/users.service';
import { User } from '@/users/entities/user.entity';
import { ConfigService } from '@nestjs/config';

interface JwtPayload {
  sub: number;
  email: string;
  role: string; // Hoặc UserRole nếu bạn import enum
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET')!,
    });
  }

  // Hàm này sẽ tự động chạy sau khi token được xác thực
  async validate(payload: JwtPayload) {
    const user: User | null = await this.usersService.findOneById(payload.sub);

    if (!user) {
      // SỬ DỤNG Ở ĐÂY: Nếu không tìm thấy user, ném ra lỗi
      throw new UnauthorizedException('User not found or has been deleted.');
    }
    // Bạn có thể truy vấn thêm thông tin user từ DB ở đây nếu cần
    // payload chứa những gì bạn đã đưa vào lúc tạo token
    return { userId: payload.sub, email: payload.email, role: payload.role };
  }
}
