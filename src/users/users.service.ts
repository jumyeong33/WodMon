import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UUID } from 'src/utils/UUID';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
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
    return 'This action adds a new user';
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
