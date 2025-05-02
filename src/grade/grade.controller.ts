import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { GradeService } from './grade.service';
import { Types } from 'mongoose';
import { CreateGradeDto } from './dto/create-grade.dto';

@Controller('grades')
export class GradeController {
  constructor(private readonly gradeService: GradeService) {}

  @Get()
  findAll() {
    return this.gradeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.gradeService.findOne(new Types.ObjectId(id));
  }
  @Get('user/:userId')
  findByUserId(@Param('userId') userId: string) {
    try {
      return this.gradeService.findByUserId(userId); // sin ObjectId
    } catch (error) {
      return { error: error.message };
    }
  }
  
  @Post()
  create(@Body() createGradeDto: CreateGradeDto) {
    return this.gradeService.create(createGradeDto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateGradeDto: any) {
    return this.gradeService.update(new Types.ObjectId(id), updateGradeDto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.gradeService.delete(new Types.ObjectId(id));
  }
}
