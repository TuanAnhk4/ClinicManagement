import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseIntPipe, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { AuthGuard } from '@nestjs/passport';

import { Roles } from '@auth/roles.decorator';
import { UserRole } from './entities/user.entity';
import { RolesGuard } from '@auth/roles.guard';

@Controller('users')
@UseGuards(AuthGuard('jwt'), RolesGuard) // QUAN TRỌNG: Bảo vệ tất cả các API trong controller này
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Roles(UserRole.ADMIN) // Chỉ Admin được tạo
  create(@Body() createUserDto: CreateUserDto) {
    // console.log('--- EXECUTING: UsersController -> create() ---');
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll(@Query('role') role?: UserRole) {
    // console.log('--- EXECUTING: UsersController -> findAll() ---');
    return this.usersService.findAll(role);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    // console.log('--- EXECUTING: UsersController -> findOne() ---');
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateUserDto: UpdateUserDto) {
    // console.log('--- EXECUTING: UsersController -> update() ---');
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN) // Chỉ Admin được xóa
  remove(@Param('id', ParseIntPipe) id: number) {
    // console.log('--- EXECUTING: UsersController -> remove() ---');
    return this.usersService.remove(id);
  }
}
