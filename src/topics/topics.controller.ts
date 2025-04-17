import {
  Controller,
  Post,
  Put,
  Body,
  Delete,
  Get,
  Param,
  Req,
  UseGuards,
  UnauthorizedException,
  BadRequestException
} from '@nestjs/common';
import { TopicsService } from './topics.service';
import { CreateTopicDto } from './dto/create-topic.dto';
import { AuthGuard } from '@nestjs/passport';
import { UpdateTopicDto } from './dto/update-topic.dto';
import { isValidObjectId } from 'mongoose';
@Controller('topics')
export class TopicsController {
  constructor(private readonly topicsService: TopicsService) {}

  @UseGuards(AuthGuard('jwt')) 
  @Post()
  create(@Body() createTopicDto: CreateTopicDto, @Req() req: any) {
    if (!req.user || !req.user._id) {
      throw new UnauthorizedException('Usuario no autenticado');
    }

    return this.topicsService.create(createTopicDto, req.user._id);
  }
  @UseGuards(AuthGuard('jwt'))
  @Put(':id')
  async update(
    @Param('id') id: string, 
    @Body() updateTopicDto: UpdateTopicDto,
    @Req() req: any,
  ) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('ID inválido');
    }
  
    return this.topicsService.update(id, updateTopicDto, req.user._id); 
  }
  @UseGuards(AuthGuard('jwt'))
  @Get('usuario/:id')
  async findByUsuario(@Param('id') id: string) {
  if (!isValidObjectId(id)) {
    throw new BadRequestException('ID inválido');
  }

  return this.topicsService.findByCreatedBy(id);
}

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  async remove(@Param('id') id: string, @Req() req: any) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('ID inválido');
    }
  }

}
