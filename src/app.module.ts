import { Module } from '@nestjs/common';
import { HeroWodModule } from './hero-wod/hero-wod.module';

@Module({
  imports: [HeroWodModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
