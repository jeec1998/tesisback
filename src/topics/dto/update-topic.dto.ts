import { IsNotEmpty, IsString, IsMongoId, IsArray, IsOptional } from 'class-validator';

export class UpdateTopicDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsArray()
  subtopics?: string[];
}
