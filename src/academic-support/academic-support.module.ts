import { Module } from '@nestjs/common';
import { AcademicSupportService } from './academic-support.service';
import { AcademicSupportController } from './academic-support.controller';
import { LangChainService } from 'src/shared/langchain/langchain-service';
import { GradeService } from 'src/grade/grade.service';
import { TopicsService } from 'src/topics/topics.service';
import { UsersService } from 'src/users/users.service';
import { SubjectsService } from 'src/subjects/subjects.service';
import { DropboxService } from 'src/dropbox/dropbox.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Grade, GradeSchema } from 'src/grade/entities/grade.entity';
import { AcademicSupport, AcademicSupportSchema } from './entities/academic-support.entity';
import { Subtopic, Topic, TopicSchema } from 'src/topics/entities/topic.entity';
import { User, UserSchema } from 'src/users/entities/user.entity';
import { AuthService } from 'src/auth/auth.service';
import { Subject, SubjectSchema } from 'src/subjects/entities/subject.entity';
import { DropboxAuthService } from 'src/dropbox/dropbox-auth.service';
import { Upload, UploadSchema } from 'src/dropbox/dto/upload-schema';
import { JwtService } from '@nestjs/jwt';


@Module({
  imports: [
    MongooseModule.forFeature([
      { name: AcademicSupport.name, schema: AcademicSupportSchema },
      { name: Grade.name, schema: GradeSchema },
      { name: Topic.name, schema: TopicSchema },
      { name: Subtopic.name, schema: TopicSchema }, // Cambia 'SubTopic' por el nombre correcto del esquema
      { name: User.name, schema: UserSchema }, // Cambia 'User' por el nombre correcto del esquema
      { name: Subject.name, schema: SubjectSchema }, // Cambia 'Subject' por el nombre correcto del esquema
      { name: Upload.name, schema: UploadSchema }, // Cambia 'Upload' por el nombre correcto del esquema

    ]),
  ],
  controllers: [AcademicSupportController],
  providers: [
    AcademicSupportService,
    LangChainService,
    GradeService,
    TopicsService,
    UsersService,
    SubjectsService,
    DropboxService,
    AuthService,
    DropboxAuthService,
    JwtService,
  ],
})
export class AcademicSupportModule { }
/*  */