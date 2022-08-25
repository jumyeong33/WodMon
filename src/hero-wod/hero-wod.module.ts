import { Module } from '@nestjs/common';
import { CsvModule } from 'nest-csv-parser';
import { HeroWodController } from './hero-wod.controller';
import { HeroWodService } from './hero-wod.service';

@Module({
  imports: [CsvModule],
  controllers: [HeroWodController],
  providers: [HeroWodService],
})
export class HeroWodModule {}
