import { Test, TestingModule } from '@nestjs/testing';
import { SubtopicController } from './subtopic.controller';
import { SubtopicService } from './subtopic.service';

describe('SubtopicController', () => {
  let controller: SubtopicController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SubtopicController],
      providers: [SubtopicService],
    }).compile();

    controller = module.get<SubtopicController>(SubtopicController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
