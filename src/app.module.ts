import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { SubjectsModule } from './subjects/subjecs.module';
import { TopicsModule } from './topics/topics.module';
import { DropboxModule } from './dropbox/dropbox.module';
import { AcademicSupportModule } from './academic-support/academic-support.module';
import { GradeModule } from './grade/grade.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_DB'),
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    AuthModule,
    SubjectsModule,
    TopicsModule,
    DropboxModule,
    AcademicSupportModule,
    GradeModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
