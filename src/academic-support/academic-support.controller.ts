import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AcademicSupportService } from './academic-support.service';
import { CreateAcademicSupportDto } from './dto/create-academic-support.dto';
import { UpdateAcademicSupportDto } from './dto/update-academic-support.dto';

@Controller('academic-support')
export class AcademicSupportController {
  constructor(private readonly academicSupportService: AcademicSupportService) { }

  @Post()
  create(@Body() createAcademicSupportDto: CreateAcademicSupportDto) {
    return this.academicSupportService.create(createAcademicSupportDto);
  }

  @Get()
  findAll() {
    return this.academicSupportService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.academicSupportService.findOne(+id);
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
    return {
      message: 'Refuerzo académico generado',
      data: response,
    };
  }
}
