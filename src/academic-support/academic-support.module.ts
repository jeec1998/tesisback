import { Module } from '@nestjs/common';
import { AcademicSupportService } from './academic-support.service';
import { AcademicSupportController } from './academic-support.controller';
import { LangChainService } from 'src/shared/langchain/langchain-service';

@Module({
  controllers: [AcademicSupportController],
  providers: [AcademicSupportService, LangChainService],
})
export class AcademicSupportModule { }
