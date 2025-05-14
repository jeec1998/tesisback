import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AcademicSupportDocument = AcademicSupport & Document;

@Schema()
export class AcademicSupport {
    @Prop({ required: true, type: Object })
    student: {
        id: string;
        nombre: string;
        email: string;
        estilosDeAprendizaje: string;
    };

    @Prop({ required: true, type: Object })
    topic: {
        id: string;
        materia: string;
        titulo: string;
    };

    @Prop({ required: true, type: Array })
    subtopics: {
        id: string;
        titulo: string;
        nota: number;
        notaMaxima: number;
    }[];

    @Prop({ required: true, type: Array })
    resourcesBySubtopic: {
        id: string;
        titulo: string;
        tipo: string;
        descripcion: string;
        subtema: string;
    }[];

    @Prop({ required: true, type: String })
    generated: string;
}

export const AcademicSupportSchema = SchemaFactory.createForClass(AcademicSupport);
