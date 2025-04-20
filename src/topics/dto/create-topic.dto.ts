// create-topic.dto.ts
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateTopicDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  curso: string;

  @IsNotEmpty()
  @IsString()
  subject: string;
}
