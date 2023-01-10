import { Body, Controller, Post } from '@nestjs/common';
import { User } from './entity/user.entity';
import { UsersService } from './user.service';
import { CreateUserDto } from './dto/user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UsersService) {}

  @Post()
  public async create(@Body() userDto: CreateUserDto): Promise<User> {
    return await this.userService.create(userDto);
  }
}
