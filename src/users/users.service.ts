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

@Injectable()
export class UsersService {
  public static FromRow(row): User {
    const user = new User();
    user.id = row.id;
    user.uuid = row.user_uuid;
    user.name = row.name;
    user.email = row.email;
    user.createdAt = row.created_at;
    user.updatedAt = row.updated_at;
    user.archivedAt = row.archived_at;

    return user;
  }
  constructor(private readonly prismaService: PrismaService) {}
  async create(createUserDto: CreateUserDto): Promise<string> {
    const existUser: [User] = await this.prismaService
      .$queryRaw`SELECT id FROM users WHERE email=${createUserDto.email}`;

    if (existUser.length > 0) {
      throw new HttpException('Email is Duplicated', HttpStatus.BAD_REQUEST);
    }

    const userUUID = UUID.New();

    await this.prismaService
      .$queryRaw`INSERT INTO users(user_uuid, name, email, password)
      VALUES(${userUUID.String()},${createUserDto.name},${
      createUserDto.email
    },${createUserDto.password})`;
    return userUUID.String();
  }

  findAll() {
    return `This action returns all users`;
  }

  async findOne(uuid: string): Promise<User> {
    const row: [User] = await this.prismaService
      .$queryRaw`SELECT * FROM users WHERE user_uuid = ${uuid}`;

    if (row.length < 1) {
      throw new BadRequestException('User Does Not exist');
    }
    const user = UsersService.FromRow(row[0]);
    return user;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
