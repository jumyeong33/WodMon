import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { HeroWodService } from '../hero-wod.service';

describe('HeroWodService Int', () => {
  let prisma: PrismaService;
  let service: HeroWodService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    prisma = module.get(PrismaService);
    service = module.get(HeroWodService);
    await prisma.cleanDataBase();
  });

  describe('GetAll', () => {
    it('should return 10 wods', async () => {
      await service.createByCsv();
      const result = await service.getAll();
      expect(result.length).toEqual(10);
    });
  });

  describe('Get', () => {
    it('should return 1 wod', async () => {
      await service.createByCsv();
      const wod = await service.get('Bell');
      expect(wod[0].title).toEqual('Bell');
    });
  });

  describe('GetRandom', () => {
    it('should return 1 wod', async () => {
      await service.createByCsv();
      const wod = await service.getRandom();
      expect(wod.length).toEqual(1);
    });
  });
});
