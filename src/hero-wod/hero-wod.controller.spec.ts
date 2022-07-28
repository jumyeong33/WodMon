import { Test, TestingModule } from '@nestjs/testing';
import { HeroWodController } from './hero-wod.controller';

describe('HeroWodController', () => {
  let controller: HeroWodController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HeroWodController],
    }).compile();

    controller = module.get<HeroWodController>(HeroWodController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
