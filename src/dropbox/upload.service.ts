import { Injectable } from '@nestjs/common';
import { DropboxService } from './dropbox.service';

import { Express } from 'express';
import { CreateUploadDto } from './dto/create-dropbox.dto';

@Injectable()
export class UploadService {
  constructor(private readonly dropboxService: DropboxService) {}

  async upload(file: Express.Multer.File, body: CreateUploadDto) {
    const publicUrl = await this.dropboxService.uploadFile(file, body);

    return {
      message: 'Archivo subido correctamente ✅',
      url: publicUrl,
    };
  }
}
