import { Controller, Post, UploadedFile, Body, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { DropboxService } from './dropbox.service'; // Importa correctamente tu DropboxService
import { CreateUploadDto } from './dto/create-dropbox.dto'; // Importa tu DTO
import { Express } from 'express';

@Controller('dropbox')
export class DropboxController {
  constructor(private readonly dropboxService: DropboxService) {} // 🔥 Inyectas DropboxService aquí

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: CreateUploadDto
  ) {
    return this.dropboxService.uploadFile(file, body); // 🔥 Llama directo a dropboxService
  }
}
