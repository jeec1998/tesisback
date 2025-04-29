import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export class Subtopic {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  maxScore: number;
  
  @Prop({ required: true, default: () => new Types.ObjectId() })
  _id: Types.ObjectId;
}

@Schema({ timestamps: true })
export class Topic {
  @Prop({ required: true })
  name: string;

  @Prop({ type: Types.ObjectId, ref: 'Subject', required: true })
  subject: Types.ObjectId;

  @Prop({ type: [Subtopic], default: [] })
  subtopics: Subtopic[];
}

export type TopicDocument = Topic & Document;
export const TopicSchema = SchemaFactory.createForClass(Topic);
