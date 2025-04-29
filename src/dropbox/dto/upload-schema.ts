import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type UploadDocument = Upload & Document;

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

  @Prop({ type: Types.ObjectId, ref: 'topic', required: true })
  topicId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Subtopic', required: true })
  subtopicId: Types.ObjectId;  

  @Prop({ required: true, enum: ['pdf', 'word', 'video', 'audio', 'mp3', 'image', 'pptx', 'other'] })
  fileType: string;  
}

export const UploadSchema = SchemaFactory.createForClass(Upload);
