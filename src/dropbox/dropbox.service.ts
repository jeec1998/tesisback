// src/dropbox/dropbox.service.ts
import { Injectable } from '@nestjs/common';
import { Dropbox } from 'dropbox';
import { DropboxAuthService } from './dropbox-auth.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Upload, UploadDocument } from './dto/upload-schema';
import * as dotenv from 'dotenv';
import fetch from 'node-fetch';
dotenv.config();

@Injectable()
export class DropboxService {
  constructor(
    private readonly dropboxAuthService: DropboxAuthService,
    @InjectModel(Upload.name) private uploadModel: Model<UploadDocument>,
  ) {}

  async uploadFile(file: Express.Multer.File): Promise<string> {
   
    const accessToken = await this.dropboxAuthService.refreshAccessToken();

    const dbx = new Dropbox({
      accessToken,
      fetch,
    });

    const pathInDropbox = '/' + file.originalname;

    const uploadResponse = await dbx.filesUpload({
      path: pathInDropbox,
      contents: file.buffer,
      mode: { '.tag': 'add' },
    });

    const sharedLinkResponse = await dbx.sharingCreateSharedLinkWithSettings({
      path: uploadResponse.result.path_lower!,
    });

    const publicUrl = sharedLinkResponse.result.url.replace('?dl=0', '?raw=1');

    // ⬇️ GUARDAR EN MONGO ⬇️
    await this.uploadModel.create({
      fileName: file.originalname,
      dropboxUrl: publicUrl,
    });

    return publicUrl;
  }
}
