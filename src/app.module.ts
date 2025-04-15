import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { SubjectsModule } from './subjects/subjects.module';
import { TopicsModule } from './topics/topics.module';
import { SubTopicsModule } from './sub-topics/sub-topics.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('mongo'),
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    AuthModule,
    SubjectsModule,
    TopicsModule,
    SubTopicsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {} 