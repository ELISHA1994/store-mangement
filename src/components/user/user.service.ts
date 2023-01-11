import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entity/user.entity';
import { RegisterDto } from '../auth/dto/register.dto';
import { LoginUserDto } from '../auth/dto/login.dto';
import { ResetPasswordDto } from '../auth/dto/reset-password.dto';
import { UpdatePasswordDto } from './dto/updatePassword.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async create(userDto: RegisterDto): Promise<User> {
    const newUser = await this.usersRepository.create(userDto);
    await this.usersRepository.save(newUser);
    return newUser;
  }

  async getByEmail(email: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { email: email },
      select: ['id', 'email', 'name', 'password'],
    });

    if (user) {
      return user;
    } else {
      throw new HttpException(
        'User with this email does not exist',
        HttpStatus.NOT_FOUND,
      );
    }
  }

  async resetUserPassword(id: number, passwordDto: UpdatePasswordDto) {
    await this.usersRepository.update(id, {
      password: passwordDto.passwordHash,
    });
    const updatedUser = await this.usersRepository.findOne({ where: { id } });
    if (updatedUser) {
      return updatedUser;
    }
    throw new HttpException('User not found', HttpStatus.NOT_FOUND);
  }

  async getById(id: number) {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (user) {
      return user;
    }
    throw new HttpException(
      'User with this id does not exist',
      HttpStatus.NOT_FOUND,
    );
  }
}
