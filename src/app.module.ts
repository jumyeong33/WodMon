import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HeroWodModule } from './hero-wod/hero-wod.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    HeroWodModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
