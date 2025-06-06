import { IsNotEmpty, IsMongoId, IsString, IsBoolean } from 'class-validator';

export class CreateUploadDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  subjectId: string;

  @IsNotEmpty()
  @IsMongoId()
  topicId: string;

  @IsNotEmpty()
  @IsMongoId()
  subtopicId: string;

  @IsNotEmpty()
  @IsString()
  fileType: string;

  @IsNotEmpty()
  @IsBoolean()
  resourcemode: boolean;
}
