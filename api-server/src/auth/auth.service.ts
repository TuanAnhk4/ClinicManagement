import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '@/users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dtos/register.dto';
import { LoginDto } from './dtos/login.dto';
import { User } from '@/users/entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  async register(registerDto: RegisterDto): Promise<User> {
    const { fullName, email, password } = registerDto;
    const existingUser = await this.usersService.findOneByEmail(email);
    if (existingUser) {
      throw new ConflictException('Email already in use');
    }

    // Mật khẩu sẽ được tự động băm bởi hook BeforeInsert trong User Entity
    const user = this.usersRepository.create({ fullName, email, password });
    return this.usersRepository.save(user);
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    const user = await this.usersService.findOneByEmail(email);

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { email: user.email, sub: user.id, role: user.role };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
