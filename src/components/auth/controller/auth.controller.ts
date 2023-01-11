import {
  Body,
  Req,
  Controller,
  HttpCode,
  Post,
  UseGuards,
  Res,
  Get, HttpStatus
} from "@nestjs/common";
import { Response } from 'express';
import { AuthService } from '../services/auth.service';
import { RegisterDto } from '../dto/register.dto';
import RequestWithUser from '../interface/requestWithUser.interface';
import { LocalAuthenticationGuard } from '../guard/localAuthentication.guard';
import JwtAuthenticationGuard from '../guard/jwt-authentication.guard';
import { ResetPasswordDto } from '../dto/reset-password.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() createUserDto: RegisterDto) {
    return await this.authService.register(createUserDto);
    // Todo: Email confirmation integration
  }

  @HttpCode(200)
  @UseGuards(LocalAuthenticationGuard)
  @Post('log-in')
  async logIn(@Req() request: RequestWithUser, @Res() response: Response) {
    const { user } = request;
    const cookie = this.authService.getCookieWithJwtToken(user.id);
    response.setHeader('Set-Cookie', cookie);
    user.password = undefined;
    return response.send(user);
  }

  @UseGuards(JwtAuthenticationGuard)
  @Post('log-out')
  async logOut(@Res() response: Response) {
    response.setHeader('Set-Cookie', this.authService.getCookieForLogOut());
    return response.sendStatus(200);
  }

  @UseGuards(JwtAuthenticationGuard)
  @Post('reset-password')
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
}
