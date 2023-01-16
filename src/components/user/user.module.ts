import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { UserController } from './user.controller';
import { UsersService } from './user.service';
import { UserRepository } from '../../repositories/user.repository';
import { UserRepositoryInterface } from './interface/user.repository.interface';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [
    UsersService,
    {
      provide: 'UserRepositoryInterface',
      useClass: UserRepository,
    },
  ],
  controllers: [UserController],
  exports: [UsersService],
})
export class UserModule {}
