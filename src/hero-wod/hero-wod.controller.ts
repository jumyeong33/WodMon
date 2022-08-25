import { Body, Controller, Get, HttpCode, Post } from '@nestjs/common';
import { HeroWodService } from './hero-wod.service';
import { replyOk, replyErr } from 'src/utils/ReplyHelper';
import { HeroWod } from './entities/hero-wod.entity';
import { Public } from 'src/common/decorators';

@Controller('hero-wod')
export class HeroWodController {
  constructor(private readonly heroWodService: HeroWodService) {}

  @Public()
  @Get()
  async getAllHeroWod(): Promise<any> {
    let heroWods: HeroWod[];

    try {
      heroWods = await this.heroWodService.getAll();
    } catch (err) {
      return replyErr(err);
    }

    return replyOk(heroWods.map((wod) => wod.serialize()));
  }

  @Get('create')
  @HttpCode(201)
  async createHeroWodByCsv(): Promise<any> {
    return this.heroWodService.createByCsv();
  }

  @Public()
  @Post('random/filter')
  @HttpCode(200)
  async getRandomFilterHeroWod(@Body('id') wodIDs: [number]): Promise<any> {
    let heroWod: HeroWod;

    try {
      heroWod = await this.heroWodService.getRandomFilter(wodIDs);
    } catch (err) {
      return replyErr(err);
    }

    return replyOk(heroWod.serialize());
  }

  @Public()
  @Get('random')
  @HttpCode(200)
  async getRandomHeroWod(): Promise<any> {
    let heroWod: HeroWod;

    try {
      heroWod = await this.heroWodService.getRandom();
    } catch (err) {
      return replyErr(err);
    }

    return replyOk(heroWod.serialize());
  }
}
