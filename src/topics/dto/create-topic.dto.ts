import { IsNotEmpty, IsString, IsMongoId, IsArray, IsOptional } from 'class-validator';

export class CreateTopicDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsMongoId()
  subject: string;

  @IsOptional()
  @IsArray()
  subtopics?: string[];
}
