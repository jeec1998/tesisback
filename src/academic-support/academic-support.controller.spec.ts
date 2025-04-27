import { Test, TestingModule } from '@nestjs/testing';
import { AcademicSupportController } from './academic-support.controller';
import { AcademicSupportService } from './academic-support.service';

describe('AcademicSupportController', () => {
  let controller: AcademicSupportController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AcademicSupportController],
      providers: [AcademicSupportService],
    }).compile();

    controller = module.get<AcademicSupportController>(AcademicSupportController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
