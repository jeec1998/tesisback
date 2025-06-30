// src/dropbox/dropbox.service.ts
import { Injectable } from '@nestjs/common';
import { Dropbox } from 'dropbox';
import { DropboxAuthService } from './dropbox-auth.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
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
      resourcemode: body.resourcemode,
    });

    return publicUrl;
  }
  async getResourcesBySubject(subjectId: string): Promise<Upload[]> {
    return this.uploadModel.find({ subjectId }).exec();  // Filtra los recursos por subjectId
  }

  async getResourcesBySubtopic(subtopicId: string): Promise<Upload[]> {
    return this.uploadModel.find({ subtopicId }).exec();  // Filtra los recursos por subtopicId 
  }

  async findManyBySubtopicIds(subtopicIds: string[]): Promise<UploadDocument[]> {
    return this.uploadModel.find({ subtopicId: { $in: subtopicIds } }).exec();  // Filtra los recursos por subtopicId
  }

  async updateFile(id: string, file: Express.Multer.File, body: CreateUploadDto): Promise<string> {
  const accessToken = await this.dropboxAuthService.refreshAccessToken();
  const dbx = new Dropbox({ accessToken, fetch });

  // Primero, obtenemos el recurso para verificar el archivo actual
  const recurso = await this.uploadModel.findById(id);
  if (!recurso) {
    throw new Error('Recurso no encontrado');
  }

  const pathInDropbox = '/' + recurso.fileName;

  // Eliminar archivo anterior de Dropbox (opcional, si deseas reemplazarlo)
  try {
    await dbx.filesDelete({ path: pathInDropbox });
  } catch (error) {
    console.error('Error al eliminar archivo previo:', error);
  }

  // Subimos el nuevo archivo a Dropbox
  const uploadResponse = await dbx.filesUpload({
    path: pathInDropbox,
    contents: file.buffer,
    mode: { '.tag': 'overwrite' }, // Sobrescribe el archivo existente
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

  // Actualizamos el recurso en la base de datos
  recurso.fileName = file.originalname;
  recurso.dropboxUrl = publicUrl;
  recurso.title = body.title;
  recurso.description = body.description;
  recurso.subjectId = new Types.ObjectId(body.subjectId);
  recurso.topicId = new Types.ObjectId(body.topicId);
  recurso.subtopicId = new Types.ObjectId(body.subtopicId);
  recurso.fileType = body.fileType;

  await recurso.save();  // Guardamos los cambios en la base de datos

  return publicUrl;
}
async deleteFile(id: string): Promise<void> {
  const recurso = await this.uploadModel.findById(id);
  if (!recurso) {
    throw new Error('Recurso no encontrado');
  }

  const accessToken = await this.dropboxAuthService.refreshAccessToken();
  const dbx = new Dropbox({ accessToken, fetch });

  // Eliminamos el archivo de Dropbox
  try {
    await dbx.filesDelete({ path: '/' + recurso.fileName });
  } catch (error) {
    console.error('Error al eliminar archivo de Dropbox:', error);
    throw new Error('Error al eliminar archivo de Dropbox');
  }

  // Eliminamos el recurso de la base de datos
  await this.uploadModel.findByIdAndDelete(id);
}


}
