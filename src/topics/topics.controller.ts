import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  BadRequestException,
  Get,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { CreateTopicDto } from './dto/create-topic.dto';
import { UpdateTopicDto } from './dto/update-topic.dto'; // Ahora también usamos UpdateTopicDto
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

  @UseGuards(AuthGuard('jwt'))
  @Get('materia/:materiaId')
  async findByMateria(@Param('materiaId') materiaId: string) {
    return this.topicsService.findByMateria(materiaId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put(':id')
  async update(@Param('id') id: string, @Body() updateTopicDto: UpdateTopicDto, @Req() req: any) {
    if (req.user.role !== 'docente' && req.user.role !== 'admin') {
      throw new BadRequestException('No tienes permisos para actualizar temas');
    }
    return this.topicsService.update(id, updateTopicDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  async remove(@Param('id') id: string, @Req() req: any) {
    if (req.user.role !== 'docente' && req.user.role !== 'admin') {
      throw new BadRequestException('No tienes permisos para eliminar temas');
    }
    return this.topicsService.remove(id);
  }
}
