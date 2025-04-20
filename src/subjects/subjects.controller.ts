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
import { SubjectsService } from './subjects.service';
import { CreateSubjectDto } from './dto/create-subjects.dto';
import { AuthGuard } from '@nestjs/passport';
import { UpdateSubjectDto } from './dto/update-subjects.dto';
import { isValidObjectId } from 'mongoose';
@Controller('Subjects')
export class SubjectsController {
  constructor(private readonly SubjectsService: SubjectsService) {}

  @UseGuards(AuthGuard('jwt')) 
  @Post()
  create(@Body() createSubjectDto: CreateSubjectDto, @Req() req: any) {
    if (!req.user || !req.user._id) {
      throw new UnauthorizedException('Usuario no autenticado');
    }

    return this.SubjectsService.create(createSubjectDto, req.user._id);
  }
  @UseGuards(AuthGuard('jwt'))
  @Put(':id')
  async update(
    @Param('id') id: string, 
    @Body() updateSubjectDto: UpdateSubjectDto,
    @Req() req: any,
  ) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('ID inválido');
    }
  
    return this.SubjectsService.update(id, updateSubjectDto, req.user._id); 
  }
  @UseGuards(AuthGuard('jwt'))
  @Get('usuario/:id')
  async findByUsuario(@Param('id') id: string) {
  if (!isValidObjectId(id)) {
    throw new BadRequestException('ID inválido');
  }

  return this.SubjectsService.findByCreatedBy(id);
}

@UseGuards(AuthGuard('jwt'))
@Delete(':id')
async remove(@Param('id') id: string, @Req() req: any) {
  if (!isValidObjectId(id)) {
    throw new BadRequestException('ID inválido');
  }

  if (!req.user || !req.user._id) {
    throw new UnauthorizedException('Usuario no autenticado');
  }

  return this.SubjectsService.remove(id, req.user._id); 
}

  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  async findOne(@Param('id') id: string, @Req() req: any) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('ID inválido');
    }
  
    return this.SubjectsService.findOne(id); 
  }
  

}
