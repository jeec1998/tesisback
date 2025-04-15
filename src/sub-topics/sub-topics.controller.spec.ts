import { Test, TestingModule } from '@nestjs/testing';
import { SubTopicsController } from './sub-topics.controller';
import { SubTopicsService } from './sub-topics.service';

describe('SubTopicsController', () => {
  let controller: SubTopicsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SubTopicsController],
      providers: [SubTopicsService],
    }).compile();

    controller = module.get<SubTopicsController>(SubTopicsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
