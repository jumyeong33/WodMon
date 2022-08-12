import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaMoudle } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaMoudle],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
