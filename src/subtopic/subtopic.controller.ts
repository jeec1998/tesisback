import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SubtopicService } from './subtopic.service';
import { CreateSubtopicDto } from './dto/create-subtopic.dto';
import { UpdateSubtopicDto } from './dto/update-subtopic.dto';

@Controller('subtopic')
export class SubtopicController {
  constructor(private readonly subtopicService: SubtopicService) {}

  @Post()
  create(@Body() createSubtopicDto: CreateSubtopicDto) {
    return this.subtopicService.create(createSubtopicDto);
  }

  @Get()
  findAll() {
    return this.subtopicService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.subtopicService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSubtopicDto: UpdateSubtopicDto) {
    return this.subtopicService.update(+id, updateSubtopicDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.subtopicService.remove(+id);
  }
}
