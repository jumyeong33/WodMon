import { Test, TestingModule } from '@nestjs/testing';
import { HeroWodService } from './hero-wod.service';

describe('HeroWodService', () => {
  let service: HeroWodService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HeroWodService],
    }).compile();

    service = module.get<HeroWodService>(HeroWodService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
