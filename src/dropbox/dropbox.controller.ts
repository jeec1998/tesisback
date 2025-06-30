import { Controller, Post, Put, Delete, UploadedFile, Body, UseInterceptors, Get, Query, Param } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { DropboxService } from './dropbox.service';
import { CreateUploadDto } from './dto/create-dropbox.dto'; 
import { Express } from 'express';

@Controller('dropbox')
export class DropboxController {
  constructor(private readonly dropboxService: DropboxService) {}

  @Get('resources')
  async getResources(@Query('subjectId') subjectId: string) {
    return this.dropboxService.getResourcesBySubject(subjectId);  // Filtra los recursos por subjectId
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: CreateUploadDto
  ) {
    return this.dropboxService.uploadFile(file, body);  // Lógica de subida de archivo
  }

  @Put('update/:id')
  @UseInterceptors(FileInterceptor('file'))
  async updateFile(
    @Param('id') id: string, 
    @UploadedFile() file: Express.Multer.File,
    @Body() body: CreateUploadDto
  ) {
    return this.dropboxService.updateFile(id, file, body);  // Lógica de actualización de archivo
  }

  @Delete('delete/:id')
  async deleteFile(@Param('id') id: string) {
    return this.dropboxService.deleteFile(id);  // Lógica de eliminación de archivo
  }
}

