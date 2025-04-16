import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateTopicDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  curso: string;
}
