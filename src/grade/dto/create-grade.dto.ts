import { IsMongoId, IsNotEmpty, IsNumber, IsArray, IsString } from 'class-validator';


export class CreateGradeDto {
    @IsString()
    @IsNotEmpty()
    userId: string;

    @IsString()
    @IsNotEmpty()
    subjectId: string;

    @IsString()
    @IsNotEmpty()
    topicId: string;

    @IsArray()
    subTopics: { subTopicId: string, grade: number }[];
}
