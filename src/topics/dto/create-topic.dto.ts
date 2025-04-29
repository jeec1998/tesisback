import { IsNotEmpty, IsString, IsMongoId, IsArray, ValidateNested, IsOptional, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

class SubtopicDto {
  @IsOptional()
  @IsMongoId()
  _id?: string; 

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsNumber()
  maxScore: number;
}

export class CreateTopicDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsMongoId()
  subject: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SubtopicDto)
  subtopics?: SubtopicDto[];
}
