import { Controller, Post, Body, Get } from '@nestjs/common';

import { AuthService } from './auth.service';
import { RegisterDto, LoginDto, LoginResponseDto } from './dtos';

import { User } from '@modules/users/entities';
import { UserResponseDto } from '@modules/users/dtos';

import { GetUser, Public } from '@common/decorators';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('register')
  register(@Body() registerDto: RegisterDto): Promise<UserResponseDto> {
    return this.authService.register(registerDto);
  }

  @Public()
  @Post('login')
  login(@Body() loginDto: LoginDto): Promise<LoginResponseDto> {
    return this.authService.login(loginDto);
  }

  @Get('profile')
  getProfile(@GetUser() user: User) {
    return user;
  }
}
