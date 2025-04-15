import { Module } from '@nestjs/common';
import { SubTopicsService } from './sub-topics.service';
import { SubTopicsController } from './sub-topics.controller';

@Module({
  controllers: [SubTopicsController],
  providers: [SubTopicsService],
})
export class SubTopicsModule {}
