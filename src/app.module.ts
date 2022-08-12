import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HeroWodModule } from './hero-wod/hero-wod.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    HeroWodModule,
    UsersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
