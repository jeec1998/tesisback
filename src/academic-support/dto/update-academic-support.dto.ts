import { PartialType } from '@nestjs/mapped-types';
import { CreateAcademicSupportDto } from './create-academic-support.dto';

export class UpdateAcademicSupportDto extends PartialType(CreateAcademicSupportDto) {}
