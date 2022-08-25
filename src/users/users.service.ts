import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { UUID } from 'src/utils/UUID';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { users } from '@prisma/client';
import * as argon from 'argon2';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createUserDto: CreateUserDto): Promise<UUID> {
    const existUser: [User] = await this.prismaService
      .$queryRaw`SELECT id FROM users WHERE email=${createUserDto.email}`;

    if (existUser.length > 0) {
      throw new HttpException('Email is Duplicated', HttpStatus.BAD_REQUEST);
    }

    const userUUID = UUID.New();
    const hash = await argon.hash(createUserDto.password);
    await this.prismaService.$queryRaw`INSERT INTO users(
        user_uuid,
        name,
        email,
        password)
      VALUES(
        ${userUUID.String()},
        ${createUserDto.name},
        ${createUserDto.email},
        ${hash})`;

    return userUUID;
  }

  findAll() {
    return `This action returns all users`;
  }

  async MustFindOneByEmail(email: string): Promise<User> {
    const row: [users] = await this.prismaService
      .$queryRaw`SELECT * FROM users WHERE email = ${email}`;

    if (row.length < 1) {
      throw new BadRequestException('User Does Not exist');
    }

    return User.FromRow(row[0]);
  }

  async MustFindOne(uuid: UUID): Promise<User> {
    const row: [users] = await this.prismaService
      .$queryRaw`SELECT * FROM users WHERE user_uuid = ${uuid.String()}`;

    if (row.length < 1) {
      throw new BadRequestException('User Does Not exist');
    }

    return User.FromRow(row[0]);
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
