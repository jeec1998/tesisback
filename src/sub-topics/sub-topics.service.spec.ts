import { Test, TestingModule } from '@nestjs/testing';
import { SubTopicsService } from './sub-topics.service';

describe('SubTopicsService', () => {
  let service: SubTopicsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SubTopicsService],
    }).compile();

    service = module.get<SubTopicsService>(SubTopicsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
