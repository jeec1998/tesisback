import { IsNotEmpty, IsMongoId, IsString } from 'class-validator';

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
}
