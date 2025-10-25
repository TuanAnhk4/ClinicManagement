import { Controller, Post, Body, Get, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dtos/register.dto';
import { LoginDto } from './dtos/login.dto';
import { AuthGuard } from '@nestjs/passport';
import { LoginResponseDto } from './dtos/login-response.dto';
import { UserResponseDto } from '@/users/dtos/user-response.dto';

// Thêm vào đầu file src/auth/auth.controller.ts
interface UserPayload {
  userId: number;
  email: string;
  role: string;
}
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto): Promise<UserResponseDto> {
    const user = await this.authService.register(registerDto);
    // Trả về user mà không có password
    const { password: _, ...result } = user;
    return result;
  }

  @Post('login')
  login(@Body() loginDto: LoginDto): Promise<LoginResponseDto> {
    return this.authService.login(loginDto);
  }

  // Endpoint ví dụ để kiểm tra Guard
  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  getProfile(@Request() req: { user: UserPayload }) {
    return req.user;
  }
}
