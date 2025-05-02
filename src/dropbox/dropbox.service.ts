// src/dropbox/dropbox.service.ts
import { Injectable } from '@nestjs/common';
import { Dropbox } from 'dropbox';
import { DropboxAuthService } from './dropbox-auth.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Upload, UploadDocument } from './dto/upload-schema';
import * as dotenv from 'dotenv';
import fetch from 'node-fetch';
import { CreateUploadDto } from './dto/create-dropbox.dto';


dotenv.config();

@Injectable()
export class DropboxService {
  constructor(
    private readonly dropboxAuthService: DropboxAuthService,
    @InjectModel(Upload.name) private uploadModel: Model<UploadDocument>,
  ) { }


  async uploadFile(file: Express.Multer.File, body: CreateUploadDto): Promise<string> {
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

    let publicUrl: string;

    try {
      const sharedLinkResponse = await dbx.sharingCreateSharedLinkWithSettings({
        path: uploadResponse.result.path_lower!,
      });
      publicUrl = sharedLinkResponse.result.url.replace('?dl=0', '?raw=1');
    } catch (error) {
      if (error?.error?.error_summary?.startsWith('shared_link_already_exists')) {
        const metadata = error.error.error.shared_link_already_exists.metadata;
        publicUrl = metadata.url.replace('?dl=0', '?raw=1');
      } else {
        console.error('Error creando shared link:', error);
        throw error;
      }
    }

    await this.uploadModel.create({
      fileName: file.originalname,
      dropboxUrl: publicUrl,
      title: body.title,
      description: body.description,
      subjectId: body.subjectId,
      topicId: body.topicId,
      subtopicId: body.subtopicId,
      fileType: body.fileType,
    });

    return publicUrl;
  }
  async getResourcesBySubject(subjectId: string): Promise<Upload[]> {
    return this.uploadModel.find({ subjectId }).exec();  // Filtra los recursos por subjectId
  }




}
