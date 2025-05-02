import { Module } from '@nestjs/common';
import { GradeService } from './grade.service';
import { GradeController } from './grade.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Grade, GradeSchema } from './entities/grade.entity';
import { Subject } from 'rxjs';
import { SubjectSchema } from 'src/subjects/entities/subject.entity';
import { Subtopic, Topic, TopicSchema } from 'src/topics/entities/topic.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Grade.name, schema: GradeSchema },
      { name: Subject.name, schema: SubjectSchema },
      { name: Topic.name, schema: TopicSchema }, // Cambia 'Topic' por el nombre correcto del esquema
      { name: Subtopic.name, schema: TopicSchema }, // Cambia 'SubTopic' por el nombre correcto del esquema
    ]),
  ],
  controllers: [GradeController],

  providers: [GradeService],
})
export class GradeModule {}
