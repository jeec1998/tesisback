import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Grade {
  @Prop({ type: String, ref: 'User', required: true })
  userId: string;

  @Prop({ type: String, ref: 'Subject', required: true })
  subjectId: string;

  @Prop({ type: String, ref: 'Topic', required: true })
  topicId: string;

  // Aseguramos que no se genere un _id dentro del array de subTopicIds
  @Prop({
    type: [{
      subTopicId: { type: String, required: true },
      grade: { type: Number, required: true },
      recoveryGrade: { type: Number, required: false }
    }],
    required: true,
    _id: false  // Esto desactiva la creación de _id en cada subdocumento
  })
  subTopics: { subTopicId: String, grade: number }[];

  @Prop({ type: Number, required: true }) // Calificación general
  totalGrade: number;

  @Prop({ type: Number, required: false }) // `recoveryGrade` es opcional
  totalRecoveryGrade?: number;
}

export type GradeDocument = Grade & Document;
export const GradeSchema = SchemaFactory.createForClass(Grade);
