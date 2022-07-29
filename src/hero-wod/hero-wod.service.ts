import { Injectable } from '@nestjs/common';
import { CreateHeroWod } from './dto/createHeroWod';
import { hero_wod } from '@prisma/client';
import { CsvParser } from 'nest-csv-parser';
import { createReadStream } from 'fs';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class HeroWodService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly csvParser: CsvParser,
  ) {}

  async getAll(): Promise<hero_wod[]> {
    return await this.prismaService
      .$queryRaw`SELECT * from hero_wod ORDER BY 'desc'`;
  }

  async get(title: string): Promise<hero_wod> {
    return await this.prismaService
      .$queryRaw`SELECT * from hero_wod WHERE title=${title}`;
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
