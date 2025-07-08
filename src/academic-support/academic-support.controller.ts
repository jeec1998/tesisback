import { Controller, Get, Post, Body, Patch, Param, Delete, BadRequestException, NotFoundException } from '@nestjs/common';
import { AcademicSupportService } from './academic-support.service';
import { CreateAcademicSupportDto } from './dto/create-academic-support.dto';
import { UpdateAcademicSupportDto } from './dto/update-academic-support.dto';
import { Types } from 'mongoose';

@Controller('academic-support')
export class AcademicSupportController {
  constructor(private readonly academicSupportService: AcademicSupportService) { }

  @Post()
  create(@Body() createAcademicSupportDto: CreateAcademicSupportDto) {
    return this.academicSupportService.create(createAcademicSupportDto);
  }
  
@Get('user/:userId/topic/:topicId')
async getByUserAndTopic(
  @Param('userId') userId: string,
  @Param('topicId') topicId: string,
) {
  return this.academicSupportService.findByStudentIdAndTopicId(userId, topicId);
}


  @Get()
  findAll() {
    return this.academicSupportService.findAll();
  }
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.academicSupportService.findByIdOrStudentId(id);
  }

@Get('user/:userId/subject/:subjectId')
  async findByUserAndSubject(
    @Param('userId') userId: string,
    @Param('subjectId') subjectId: string,
  ) {
    // Validación para asegurar que los IDs son válidos.
    if (!Types.ObjectId.isValid(userId) || !Types.ObjectId.isValid(subjectId)) {
      throw new BadRequestException('El ID del usuario o de la materia no es válido.');
    }
    const results = await this.academicSupportService.findByStudentAndSubject(userId, subjectId);
    if (!results || results.length === 0) {
      throw new NotFoundException(`No se encontraron refuerzos académicos para el usuario ${userId} en la materia ${subjectId}.`);
    }
    return results;
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAcademicSupportDto: UpdateAcademicSupportDto) {
    return this.academicSupportService.update(+id, updateAcademicSupportDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.academicSupportService.remove(+id);
  }
@Get(':topicId/generate')
async generateWithIa(@Param('topicId') topicId: string) {
  const response = await this.academicSupportService.generateByTopic(topicId);
  
  // Verifica si los datos fueron generados o si ya existen
  if (response.message) {
    return response;
  } else {
    return {
      message: 'Refuerzo académico generado con éxito',
      data: response,
    };
  }
}
@Get('topic/:topicId/exists')
  async topicExists(@Param('topicId') topicId: string) {
    if (!Types.ObjectId.isValid(topicId)) {
      throw new BadRequestException('El ID del tópico proporcionado no es válido.');
    }
    const exists = await this.academicSupportService.checkTopicExists(topicId);
    return { exists };
  }

}
