import { Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common';
import { GetCurrentUser, GetCurrentUserId } from 'src/common/decorators';
import { AtGuard, RtGuard } from 'src/common/guards';
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
  async logout(@GetCurrentUserId() userId: number) {
    await this.authService.logout(userId);

    return replyOk();
  }

  @UseGuards(RtGuard)
  @Post('refresh')
  async refreshTokens(
    @GetCurrentUser('refreshToken') refreshToken: string,
    @GetCurrentUserId() userId: number,
  ): Promise<any> {
    let tokens: Tokens;
    try {
      tokens = await this.authService.refreshTokens(userId, refreshToken);
    } catch (err) {
      return replyErr(err);
    }

    return replyOk(tokens);
  }
}
