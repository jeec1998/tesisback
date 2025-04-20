// topics.controller.ts
import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  BadRequestException,
} from '@nestjs/common';
import { CreateTopicDto } from './dto/create-topic.dto';
import { TopicsService } from './topics.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('topics')
export class TopicsController {
  constructor(private readonly topicsService: TopicsService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async create(@Body() createTopicDto: CreateTopicDto, @Req() req: any) {
    if (req.user.role !== 'docente' && req.user.role !== 'admin') {
      throw new BadRequestException('No tienes permisos para crear temas');
    }

    return this.topicsService.create(createTopicDto);
  }
}
