import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { HeroWodModule } from './hero-wod/hero-wod.module';
import { PrismaMoudle } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { WodsModule } from './wods/wods.module';
import { TagsModule } from './tags/tags.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    HeroWodModule,
    UsersModule,
    PrismaMoudle,
    AuthModule,
    WodsModule,
    TagsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
