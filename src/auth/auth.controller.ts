import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { GetCurrentUser, GetCurrentUserUUID } from 'src/common/decorators';
import { GetGoogleUser } from 'src/common/decorators/get-google-user.decorator';
import { AtGuard, GoogleGuard, RtGuard } from 'src/common/guards';
import { replyErr, replyOk } from 'src/utils/ReplyHelper';
import { UUID } from 'src/utils/UUID';
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
  async logout(@GetCurrentUserUUID() userUUID: UUID) {
    await this.authService.logout(userUUID.String());

    return replyOk();
  }

  @UseGuards(RtGuard)
  @Post('refresh')
  async refreshTokens(
    @GetCurrentUser('refreshToken') refreshToken: string,
    @GetCurrentUserUUID() userUUID: UUID,
  ): Promise<any> {
    let tokens: Tokens;
    try {
      tokens = await this.authService.refreshTokens(
        userUUID.String(),
        refreshToken,
      );
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
  async googleAuthRedirect(@GetGoogleUser() user: any, @Res() res) {
    let tokens: Tokens;
    try {
      tokens = await this.authService.signinWithGoogle(user);
    } catch (err) {
      res.cookie('session', JSON.stringify(replyErr(err)));
      return res.redirect(`${process.env.FRONTEND_URL}/signin`);
    }

    res.cookie('session', JSON.stringify(replyOk(tokens)));

    return res.redirect(process.env.FRONTEND_URL);
  }
}
