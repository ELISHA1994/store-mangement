import {
  Body,
  Req,
  Controller,
  HttpCode,
  Post,
  UseGuards,
  Res,
  Get,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from '../services/auth.service';
import { RegisterDto } from '../dto/register.dto';
import RequestWithUser from '../interface/requestWithUser.interface';
import { LocalAuthenticationGuard } from '../guard/localAuthentication.guard';
import JwtAuthenticationGuard from '../guard/jwt-authentication.guard';
import { ResetPasswordDto } from '../dto/reset-password.dto';
import { UsersService } from '../../user/user.service';
import JwtRefreshGuard from '../guard/jwt-refresh.guard';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { User } from '../../user/entity/user.entity';
import { LoginUserDto } from "../dto/login.dto";

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Post('register')
  @ApiBody({ type: RegisterDto })
  @ApiOperation({
    summary: 'Register a new user',
    description: 'Create a new user and return user with JWT token',
  })
  @ApiResponse({
    status: 201,
    description: '',
    type: User,
  })
  async register(@Body() createUserDto: RegisterDto) {
    return await this.authService.register(createUserDto);
  }

  @HttpCode(200)
  @UseGuards(LocalAuthenticationGuard)
  @Post('log-in')
  @ApiOperation({
    summary: 'Login a user',
    description: 'Create user JWT token',
  })
  @ApiBody({ type: LoginUserDto })
  async logIn(@Req() request: RequestWithUser) {
    const { user } = request;
    const accessTokenCookie = this.authService.getCookieWithJwtToken(user.id);
    const { cookie: refreshTokenCookie, token: refreshToken } =
      this.authService.getCookieWithJwtRefreshToken(user.id);

    await this.usersService.setCurrentRefreshToken(refreshToken, user.id);

    request.res.setHeader('Set-Cookie', [
      accessTokenCookie,
      refreshTokenCookie,
    ]);

    return user;
  }

  @UseGuards(JwtAuthenticationGuard)
  @Post('log-out')
  @HttpCode(200)
  async logOut(@Req() request: RequestWithUser) {
    await this.usersService.removeRefreshToken(request.user.id);
    request.res.setHeader('Set-Cookie', this.authService.getCookieForLogOut());
  }

  @UseGuards(JwtAuthenticationGuard)
  @Post('reset-password')
  @ApiOperation({
    summary: 'Reset a user password',
    description: 'Reset a user password JWT token',
  })
  @ApiBody({ type: ResetPasswordDto })
  async resetPassword(
    @Req() request: RequestWithUser,
    @Res() response: Response,
    @Body() resetPasswordDto: ResetPasswordDto,
  ): Promise<any> {
    const { id } = request.user;
    await this.authService.resetPassword(id, resetPasswordDto);
    return response.send('Account password updated successfully');
  }

  @UseGuards(JwtAuthenticationGuard)
  @Get()
  authenticate(@Req() request: RequestWithUser) {
    const user = request.user;
    user.password = undefined;
    return user;
  }

  @UseGuards(JwtRefreshGuard)
  @Get('refresh')
  @ApiOperation({
    summary: 'Refresh a user token',
    description: 'Create a new JWT token',
  })
  refresh(@Req() request: RequestWithUser) {
    const accessTokenCookie = this.authService.getCookieWithJwtToken(
      request.user.id,
    );
    request.res.setHeader('Set-Cookie', accessTokenCookie);
    return request.user;
  }
}
