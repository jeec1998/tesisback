import { Test, TestingModule } from '@nestjs/testing';
import { AcademicSupportService } from './academic-support.service';

describe('AcademicSupportService', () => {
  let service: AcademicSupportService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AcademicSupportService],
    }).compile();

    service = module.get<AcademicSupportService>(AcademicSupportService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
