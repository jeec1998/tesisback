import { IsMongoId, IsOptional, IsNumber } from 'class-validator';
import { Types } from 'mongoose';

export class UpdateGradeDto {
  @IsMongoId()
  @IsOptional()
  userId?: Types.ObjectId;

  @IsMongoId()
  @IsOptional()
  subjectId?: Types.ObjectId;

  @IsMongoId()
  @IsOptional()
  topicId?: Types.ObjectId;

  @IsMongoId()
  @IsOptional()
  subTopicId?: Types.ObjectId;

  @IsNumber()
  @IsOptional()
  grade?: number;

  @IsNumber()
  @IsOptional()
  recoveryGrade?: number;
}
