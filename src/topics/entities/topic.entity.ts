import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from '../../users/entities/user.entity'; 
import * as mongoose from 'mongoose';

export type TopicDocument = Topic & Document;

@Schema()
export class Topic {
  @Prop({ required: true })
  name: string;

  @Prop({required: true})
  curso: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  createdBy: Types.ObjectId;
}

export const TopicSchema = SchemaFactory.createForClass(Topic);
TopicSchema.index({ name: 1, curso: 1 }, { unique: true });

