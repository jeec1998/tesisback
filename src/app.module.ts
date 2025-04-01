import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { SubjectsModule } from './subjects/subjects.module';
import { IssueModule } from './issue/issue.module';
import { SubtopicModule } from './subtopic/subtopic.module';
import { QualificationsModule } from './qualifications/qualifications.module';

@Module({
  imports: [UsersModule, SubjectsModule, IssueModule, SubtopicModule, QualificationsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
