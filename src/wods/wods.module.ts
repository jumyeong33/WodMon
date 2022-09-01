import { Module } from '@nestjs/common';
import { WodController } from './wods.controller';
import { WodService } from './wods.service';

@Module({
  imports: [],
  controllers: [WodController],
  providers: [WodService],
})
export class WodModule {}
