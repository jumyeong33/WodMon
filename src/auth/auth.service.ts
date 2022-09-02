import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { LoginDto } from './dto';
import { JwtService } from '@nestjs/jwt';
import { Tokens, JwtPayload } from './interfaces';
import { PrismaService } from 'src/prisma/prisma.service';
import * as argon from 'argon2';
import { UsersService } from 'src/users/users.service';
import { UUID } from 'src/utils/UUID';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signin(dto: LoginDto): Promise<Tokens> {
    const user: [any] = await this.prismaService
      .$queryRaw`SELECT * FROM users WHERE email = ${dto.email}`;
    if (user.length < 1) {
      throw new ForbiddenException('User does not exist');
    }
    const passwordMatches = await argon.verify(user[0].password, dto.password);
    if (!passwordMatches) {
      throw new ForbiddenException('Wrong Password');
    }
    const tokens: Tokens = await this.getTokens(
      user[0].user_uuid,
      user[0].email,
    );
    await this.updateRtHash(user[0].user_uuid, tokens.refresh_token);

    return tokens;
  }

  async logout(userUUID: string): Promise<void> {
    await this.prismaService
      .$queryRaw`UPDATE users SET refresh_token = null WHERE user_uuid = ${userUUID} && refresh_token IS NOT NULL`;
  }

  async refreshTokens(userUUID: string, rt: string) {
    const user: [any] = await this.prismaService
      .$queryRaw`SELECT * FROM users WHERE user_uuid = ${userUUID}`;
    if (user.length < 1) {
      throw new ForbiddenException('User does not exist');
    }
    const rtMatches = await argon.verify(user[0].refresh_token, rt);
    if (!rtMatches) {
      throw new ForbiddenException('Access Denied');
    }
    const tokens = await this.getTokens(user[0].user_uuid, user[0].email);
    await this.updateRtHash(user[0].user_uuid, tokens.refresh_token);

    return tokens;
  }
  async updateRtHash(userUUID: string, rt: string): Promise<void> {
    const hash = await argon.hash(rt);
    await this.prismaService
      .$queryRaw`UPDATE users SET refresh_token = ${hash} WHERE user_uuid = ${userUUID}`;
  }

  async getTokens(userUUID: string, email: string): Promise<Tokens> {
    const jwtPayload: JwtPayload = {
      uuid: userUUID,
      email: email,
    };
    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(jwtPayload, {
        secret: process.env.ACCESS_SECRET,
        expiresIn: '15m',
      }),
      this.jwtService.signAsync(jwtPayload, {
        secret: process.env.REFRESH_SECRET,
        expiresIn: '1d',
      }),
    ]);

    return {
      access_token: at,
      refresh_token: rt,
    };
  }

  async signinWithGoogle(user: any) {
    if (!user) {
      throw new BadRequestException();
    }
    let checkUser: [any];
    //if user already sigin with google and wodmon
    checkUser = await this.prismaService
      .$queryRaw`SELECT * FROM users WHERE google_id = ${user.googleId}`;
    if (checkUser.length > 0) {
      const tokens = await this.getTokens(
        checkUser[0].user_uuid,
        checkUser[0].email,
      );
      await this.updateRtHash(checkUser[0].user_uuid, tokens.refresh_token);
      return tokens;
    }

    checkUser = await this.prismaService
      .$queryRaw`SELECT * FROM users WHERE email = ${user.email}`;
    if (checkUser.length > 0) {
      throw new ForbiddenException(
        'User exist, but have not connected with google account',
      );
    }
    const userUUID = await this.userService.createWithGoogle(user);
    const newUser = await this.userService.MustFindOne(userUUID);
    const tokens = await this.getTokens(newUser.uuid.String(), newUser.email);
    await this.updateRtHash(newUser.uuid.String(), tokens.refresh_token);

    return tokens;
  }
}
