import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { HeroWodModule } from './hero-wod/hero-wod.module';
import { PrismaMoudle } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    HeroWodModule,
    UsersModule,
    PrismaMoudle,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
