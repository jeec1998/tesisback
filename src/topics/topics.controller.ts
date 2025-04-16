import {
  Controller,
  Post,
  Body,
  Req,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';
import { TopicsService } from './topics.service';
import { CreateTopicDto } from './dto/create-topic.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('topics')
export class TopicsController {
  constructor(private readonly topicsService: TopicsService) {}

  @UseGuards(AuthGuard('jwt')) // ✅ Solo autenticación
  @Post()
  create(@Body() createTopicDto: CreateTopicDto, @Req() req: any) {
    if (!req.user || !req.user._id) {
      throw new UnauthorizedException('Usuario no autenticado');
    }

    return this.topicsService.create(createTopicDto, req.user._id);
  }
}
