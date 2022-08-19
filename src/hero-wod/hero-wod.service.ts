import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateHeroWod } from './dto/createHeroWod';
import { hero_wod } from '@prisma/client';
import { CsvParser } from 'nest-csv-parser';
import { createReadStream } from 'fs';
import { PrismaService } from 'src/prisma/prisma.service';
import { HeroWod } from './entities/hero-wod.entity';

@Injectable()
export class HeroWodService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly csvParser: CsvParser,
  ) {}

  async getAll(): Promise<HeroWod[]> {
    const heroWods: [hero_wod] = await this.prismaService
      .$queryRaw`SELECT * from hero_wod ORDER BY 'desc'`;

    return HeroWod.FromRows(heroWods);
  }

  async get(title: string): Promise<hero_wod> {
    return await this.prismaService
      .$queryRaw`SELECT * from hero_wod WHERE title=${title}`;
  }

  async getRandom(): Promise<HeroWod> {
    const heroWod: [hero_wod] = await this.prismaService
      .$queryRaw`SELECT * FROM hero_wod ORDER BY RAND() LIMIT 1`;

    return HeroWod.FromRow(heroWod[0]);
  }

  async getRandomFilter(wodIDs: [number]): Promise<HeroWod> {
    const cond = wodIDs.toString();
    const heroWod: [hero_wod] = await this.prismaService
      .$queryRaw`SELECT * FROM hero_wod WHERE NOT FIND_IN_SET(id, ${cond}) ORDER BY RAND() LIMIT 1`;
    if (heroWod.length < 1) {
      throw new BadRequestException('You have Seen All wods from WodMon');
    }

    return HeroWod.FromRow(heroWod[0]);
  }

  async createByCsv() {
    const stream = createReadStream(
      '/Users/user/JuProject/wodmon/TheHeroWod11.csv',
    );
    const heroWods = await this.csvParser.parse(
      stream,
      CreateHeroWod,
      null,
      null,
      { strict: true, separator: ',' },
    );
    for (const wod of heroWods.list) {
      await this.prismaService
        .$queryRaw`INSERT INTO hero_wod(title, description, history) VALUES(${wod.title}, ${wod.description},${wod.history})`;
    }
    return true;
  }
}
