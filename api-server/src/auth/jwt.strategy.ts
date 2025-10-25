import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '@/users/users.service';
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
    const secret = configService.get<string>('JWT_SECRET');

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret!,
    });
  }

  // Hàm này sẽ tự động chạy sau khi token được xác thực
  async validate(payload: JwtPayload): Promise<User> {
    const user = await this.usersService.findOneById(payload.sub);

    if (!user) {
      throw new UnauthorizedException('User not found or has been deleted.');
    }

    // Rất quan trọng: Trả về toàn bộ đối tượng user (đã có sẵn id)
    // NestJS sẽ tự động loại bỏ password khi trả về nếu bạn cấu hình đúng
    return user;
  }
}
