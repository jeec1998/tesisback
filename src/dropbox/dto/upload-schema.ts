
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UploadDocument = Upload & Document;

@Schema({ timestamps: true })
export class Upload {
  @Prop()
  fileName: string;

  @Prop()
  dropboxUrl: string;
}

export const UploadSchema = SchemaFactory.createForClass(Upload);
