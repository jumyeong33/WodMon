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

  it('should be defined', () => {
    expect(prisma).toBeDefined();
  });
  it('should be defined service', () => {
    expect(service).toBeDefined();
  });

  describe('GetAll', () => {
    it('should return 10 wods', async () => {
      await service.createByCsv();
      const result = await service.getAll();
      expect(result.length).toEqual(10);
    });
  });
});
