import { Module } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { WodsController } from './wods.controller';
import { WodsService } from './wods.service';

@Module({
  imports: [],
  controllers: [WodsController],
  providers: [WodsService, UsersService],
})
export class WodsModule {}
