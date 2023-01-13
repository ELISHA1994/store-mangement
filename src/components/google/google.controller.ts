import { Body, Controller, Post, Req } from '@nestjs/common';
import { GoogleService } from './google.service';
import { TokenVerificationDto } from './dto/tokenVerification.dto';
import { Request } from 'express';

@Controller('google-authentication')
export class GoogleController {
  constructor(private readonly googleAuthService: GoogleService) {}

  @Post()
  async authenticate(
    @Body() tokenData: TokenVerificationDto,
    @Req() request: Request,
  ) {
    const { accessTokenCookie, refreshTokenCookie, user } =
      await this.googleAuthService.authenticate(tokenData.token);

    request.res.setHeader('Set-Cookie', [
      accessTokenCookie,
      refreshTokenCookie,
    ]);

    return user;
  }
}
