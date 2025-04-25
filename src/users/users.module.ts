import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User, UserSchema } from './entities/user.entity';
import { AuthModule } from '../auth/auth.module'; 
import { Subject } from 'rxjs';
import { SubjectsModule } from 'src/subjects/subjecs.module';


@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    AuthModule,
    SubjectsModule,
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
