import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TopicsService } from './topics.service';
import { TopicsController } from './topics.controller';
import { Topic, TopicSchema } from './entities/topic.entity';
import { Subject, SubjectSchema } from '../subjects/entities/subject.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Topic.name, schema: TopicSchema },
      { name: Subject.name, schema: SubjectSchema },
    ]),
  ],
  controllers: [TopicsController],
  providers: [TopicsService],
})
export class TopicsModule {}
