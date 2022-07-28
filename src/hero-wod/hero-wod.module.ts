import { Module } from '@nestjs/common';
import { CsvModule } from 'nest-csv-parser';
import { PrismaMoudle } from 'src/prisma/prisma.module';
import { HeroWodController } from './hero-wod.controller';
import { HeroWodService } from './hero-wod.service';

@Module({
  imports: [PrismaMoudle, CsvModule],
  controllers: [HeroWodController],
  providers: [HeroWodService],
})
export class HeroWodModule {}
