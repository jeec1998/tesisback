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
  NotFoundException,
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
@UseGuards(AuthGuard('jwt'))
@Post('admin/:userId')
async createForUser(
  @Param('userId') userId: string,
  @Body() createSubjectDto: CreateSubjectDto,
  @Req() req: any,
) {
  if (!isValidObjectId(userId)) {
    throw new BadRequestException('ID de usuario inválido');
  }

  if (!req.user || req.user.role !== 'admin') {
    throw new UnauthorizedException('Solo administradores pueden asignar materias a cualquier usuario');
  }

  return this.SubjectsService.create(createSubjectDto, userId);
}
  @UseGuards(AuthGuard('jwt'))
  @Put('admin/:id')
  async updateAsAdmin(
  @Param('id') id: string,
  @Body() updateSubjectDto: UpdateSubjectDto,
  @Req() req: any,
) {
  if (!isValidObjectId(id)) {
    throw new BadRequestException('ID inválido');
  }

  if (!req.user || req.user.role !== 'admin') {
    throw new UnauthorizedException('Solo administradores pueden editar cualquier meateria');
  }

  return this.SubjectsService.updateAsAdmin(id, updateSubjectDto);
}
@UseGuards(AuthGuard('jwt'))
@Delete('admin/:id')
async removeAsAdmin(@Param('id') id: string, @Req() req: any) {
  if (!isValidObjectId(id)) {
    throw new BadRequestException('ID inválido');
  }

  if (!req.user || req.user.role !== 'admin') {
    throw new UnauthorizedException('Solo administradores pueden eliminar cualquier materia');
  }

  return this.SubjectsService.removeAsAdmin(id);
}



}
