import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { replyOk, replyErr } from 'src/utils/ReplyHelper';
import { User } from './entities/user.entity';
import { UUID } from 'src/utils/UUID';
import { Public } from 'src/common/decorators';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Public()
  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<any> {
    let userUUID: UUID;
    try {
      userUUID = await this.usersService.create(createUserDto);
    } catch (err) {
      return replyErr(err);
    }

    return replyOk(userUUID);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':uuid')
  async findOne(@Param('uuid') uuid: string) {
    let user: User;
    const userUUID = UUID.FromStr(uuid);
    try {
      user = await this.usersService.MustFindOne(userUUID);
    } catch (err) {
      return replyErr(err);
    }

    return replyOk(user.serialize());
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
