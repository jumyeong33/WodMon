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
import { CreateGoogleUserDto } from 'src/users/dto/create-google-user.dto';

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
    const tokens: Tokens = await this.getTokens(user[0].id, user[0].email);
    await this.updateRtHash(user[0].id, tokens.refresh_token);

    return tokens;
  }

  async logout(userId: number): Promise<void> {
    await this.prismaService
      .$queryRaw`UPDATE users SET refresh_token = null WHERE id = ${userId} && refresh_token IS NOT NULL`;
  }

  async refreshTokens(userId: number, rt: string) {
    const user: [any] = await this.prismaService
      .$queryRaw`SELECT * FROM users WHERE id = ${userId}`;
    if (user.length < 1) {
      throw new ForbiddenException('User does not exist');
    }
    const rtMatches = await argon.verify(user[0].refresh_token, rt);
    if (!rtMatches) {
      throw new ForbiddenException('Access Denied');
    }
    const tokens = await this.getTokens(user[0].id, user[0].email);
    await this.updateRtHash(user[0].id, tokens.refresh_token);

    return tokens;
  }
  async updateRtHash(userId: number, rt: string): Promise<void> {
    const hash = await argon.hash(rt);
    await this.prismaService
      .$queryRaw`UPDATE users SET refresh_token = ${hash} WHERE id = ${userId}`;
  }

  async getTokens(userId: number, email: string): Promise<Tokens> {
    const jwtPayload: JwtPayload = {
      id: userId,
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
      .$queryRaw`SELECT * FROM users WHERE googleId = ${user.id}`;
    if (checkUser.length < 1) {
      const tokens = await this.getTokens(checkUser[0].id, checkUser[0].email);
      await this.updateRtHash(user[0].id, tokens.refresh_token);
      return tokens;
    }
    checkUser = await this.prismaService
      .$queryRaw`SELECT * FROM users WHERE email = ${user.email}`;
    if (checkUser.length < 1) {
      throw new ForbiddenException(
        'User exist, but have not connected with google account',
      );
    }
    await this.userService.createWithGoogle(user);
  }
}
