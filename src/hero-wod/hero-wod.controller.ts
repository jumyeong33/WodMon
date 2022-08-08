import { Body, Controller, Get, HttpCode, Post } from '@nestjs/common';
import { HeroWodService } from './hero-wod.service';

@Controller('hero-wod')
export class HeroWodController {
  constructor(private readonly heroWodService: HeroWodService) {}

  @Get()
  @HttpCode(200)
  async getAllHeroWod(): Promise<any> {
    return this.heroWodService.getAll();
  }

  @Get('create')
  @HttpCode(201)
  async createHeroWodByCsv(): Promise<any> {
    return this.heroWodService.createByCsv();
  }

  @Post('random/filter')
  @HttpCode(200)
  async getRandomFilterHeroWod(@Body('id') wodIDs: [number]): Promise<any> {
    return this.heroWodService.getRandomFilter(wodIDs);
  }

  @Get('random')
  @HttpCode(200)
  async getRandomHeroWod(): Promise<any> {
    return this.heroWodService.getRandom();
  }
}
