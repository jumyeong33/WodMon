import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  UseGuards,
} from '@nestjs/common';
import { GetCurrentUser, GetCurrentUserUUId } from 'src/common/decorators';
import { GetGoogleUser } from 'src/common/decorators/get-google-user.decorator';
import { AtGuard, GoogleGuard, RtGuard } from 'src/common/guards';
import { replyErr, replyOk } from 'src/utils/ReplyHelper';
import { AuthService } from './auth.service';
import { LoginDto } from './dto';
import { Tokens } from './interfaces';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signin')
  async signUp(@Body() dto: LoginDto): Promise<any> {
    let tokens: Tokens;
    try {
      tokens = await this.authService.signin(dto);
    } catch (err) {
      return replyErr(err);
    }

    return replyOk(tokens);
  }

  @UseGuards(AtGuard)
  @HttpCode(200)
  @Post('logout')
  async logout(@GetCurrentUserUUId() userUUID: string) {
    await this.authService.logout(userUUID);

    return replyOk();
  }

  @UseGuards(RtGuard)
  @Post('refresh')
  async refreshTokens(
    @GetCurrentUser('refreshToken') refreshToken: string,
    @GetCurrentUserUUId() userUUID: string,
  ): Promise<any> {
    let tokens: Tokens;
    try {
      tokens = await this.authService.refreshTokens(userUUID, refreshToken);
    } catch (err) {
      return replyErr(err);
    }

    return replyOk(tokens);
  }

  @Get('google')
  @UseGuards(GoogleGuard)
  async googleAuth() {
    return replyOk();
  }

  @Get('google/redirect')
  @UseGuards(GoogleGuard)
  async googleAuthRedirect(@GetGoogleUser() user: any) {
    let tokens: Tokens;
    try {
      tokens = await this.authService.signinWithGoogle(user);
    } catch (err) {
      return replyErr(err);
    }

    return replyOk(tokens);
  }
}
