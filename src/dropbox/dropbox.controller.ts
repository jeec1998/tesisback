// src/dropbox/dropbox.controller.ts
import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { DropboxService } from './dropbox.service';

@Controller('dropbox')
export class DropboxController {
  constructor(private readonly dropboxService: DropboxService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    const link = await this.dropboxService.uploadFile(file);
    return { success: true, link };
  }
}
