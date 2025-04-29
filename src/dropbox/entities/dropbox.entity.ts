// src/dropbox/dto/upload-schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Upload {
  @Prop({ required: true })
  fileName: string;

  @Prop({ required: true })
  dropboxUrl: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;
  @Prop({ type: Types.ObjectId, ref: 'Subject', required: true })
  subjectId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Topic', required: true })
  topicId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Subtopic', required: true })
  subtopicId: Types.ObjectId;

  @Prop({ required: true, enum: ['pdf', 'word', 'video', 'audio', 'image', 'pptx', 'other'] })
  fileType: string;
}

export type UploadDocument = Upload & Document;
export const UploadSchema = SchemaFactory.createForClass(Upload);
