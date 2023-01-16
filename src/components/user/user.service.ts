import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { UserRepositoryInterface } from './interface/user.repository.interface';
import { User } from './entity/user.entity';
import { RegisterDto } from '../auth/dto/register.dto';
import { UpdatePasswordDto } from './dto/updatePassword.dto';

@Injectable()
export class UsersService {
  constructor(
    @Inject('UserRepositoryInterface')
    private readonly userRepository: UserRepositoryInterface,
  ) {}

  async create(userDto: RegisterDto): Promise<User> {
    return await this.userRepository.create(userDto);
  }

  async createWithGoogle(email: string, name: string) {
    return await this.userRepository.create({
      email,
      name,
      isRegisteredWithGoogle: true,
    });
  }

  async getByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findByCondition({
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
    await this.userRepository.update(id, {
      password: passwordDto.passwordHash,
    });
    const updatedUser = await this.userRepository.findOneById(id);
    if (updatedUser) {
      return updatedUser;
    }
    throw new HttpException('User not found', HttpStatus.NOT_FOUND);
  }

  async getById(id: number) {
    const user = await this.userRepository.findOneById(id);
    if (user) {
      return user;
    }
    throw new HttpException(
      'User with this id does not exist',
      HttpStatus.NOT_FOUND,
    );
  }

  async getUserIfRefreshTokenMatches(refreshToken: string, userId: number) {
    const user = await this.userRepository.findByCondition({
      where: { id: userId },
      select: ['id', 'email', 'name', 'password', 'currentHashedRefreshToken'],
    });

    const isRefreshTokenMatching = await bcrypt.compare(
      refreshToken,
      user.currentHashedRefreshToken,
    );

    if (isRefreshTokenMatching) {
      return user;
    }
  }

  async setCurrentRefreshToken(refreshToken: string, userId: number) {
    const currentHashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.userRepository.update(userId, {
      currentHashedRefreshToken,
    });
  }

  async removeRefreshToken(userId: number) {
    return this.userRepository.update(userId, {
      currentHashedRefreshToken: null,
    });
  }
}
