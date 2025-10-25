import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';
import { User, UserRole } from './entities/user.entity';
import { CreateUserDto } from './dtos/create-user.dto';
import { UserResponseDto } from './dtos/user-response.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  // crud
  async create(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    const { email } = createUserDto;

    // --- BỔ SUNG ĐOẠN KIỂM TRA NÀY ---
    const existingUser = await this.usersRepository.findOne({ where: { email } });
    if (existingUser) {
      // Nếu đã có user với email này, ném ra lỗi 409 Conflict
      throw new ConflictException(`User with email ${email} already exists.`);
    }
    // ------------------------------------

    const user = this.usersRepository.create(createUserDto);
    await this.usersRepository.save(user);

    const { password, ...result } = user;
    return result;
  }

  async findAll(role?: UserRole): Promise<UserResponseDto[]> {
    const options: FindManyOptions<User> = {};
    if (role) {
      options.where = { role };
    }

    const users = await this.usersRepository.find(options);
    return users.map(({ password: _, ...result }) => result);
  }

  async findOne(id: number): Promise<UserResponseDto> {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    const { password: _, ...result } = user;
    return result;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<UserResponseDto> {
    // Nếu DTO có chứa trường 'password', chúng ta cần băm nó trước
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    // Dùng query builder để update an toàn hơn, tránh các vấn đề với hook
    await this.usersRepository.update(id, updateUserDto);

    // Sau khi update, tải lại user để đảm bảo dữ liệu là mới nhất
    const updatedUser = await this.usersRepository.findOneBy({ id });
    if (!updatedUser) {
      throw new NotFoundException(`User with ID ${id} not found after update`);
    }

    const { password, ...result } = updatedUser;
    return result;
  }

  async remove(id: number): Promise<void> {
    const result = await this.usersRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  }

  async findOneByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email } });
  }
  async findOneById(id: number): Promise<User | null> {
    return this.usersRepository.findOne({ where: { id } });
  }
}
