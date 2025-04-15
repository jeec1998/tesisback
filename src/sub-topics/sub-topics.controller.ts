import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SubTopicsService } from './sub-topics.service';
import { CreateSubTopicDto } from './dto/create-sub-topic.dto';
import { UpdateSubTopicDto } from './dto/update-sub-topic.dto';

@Controller('sub-topics')
export class SubTopicsController {
  constructor(private readonly subTopicsService: SubTopicsService) {}

  @Post()
  create(@Body() createSubTopicDto: CreateSubTopicDto) {
    return this.subTopicsService.create(createSubTopicDto);
  }

  @Get()
  findAll() {
    return this.subTopicsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.subTopicsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSubTopicDto: UpdateSubTopicDto) {
    return this.subTopicsService.update(+id, updateSubTopicDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.subTopicsService.remove(+id);
  }
}
