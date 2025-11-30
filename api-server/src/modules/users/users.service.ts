import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';

import { HashUtil } from '@common/utils';

import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';

import { User } from './entities/user.entity';
import { CreateUserDto, UserResponseDto, UpdateUserDto } from './dtos';
import { UserRole } from './enums';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    const { email } = createUserDto;

    const existingUser = await this.usersRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new ConflictException(`User with email ${email} already exists.`);
    }

    const user = this.usersRepository.create(createUserDto);
    await this.usersRepository.save(user);

    const { password, ...result } = user;
    return result;
  }

  async findAll(role?: UserRole): Promise<UserResponseDto[]> {
    const options: FindManyOptions<User> = {
      relations: ['specialty'],
    };
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
    if (updateUserDto.password) {
      updateUserDto.password = await HashUtil.hash(updateUserDto.password);
    }

    await this.usersRepository.update(id, updateUserDto);

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
