import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  nombreUsuario: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true, enum: ['docente', 'alumno', 'admin'] })
  role: 'docente' | 'alumno' | 'admin';
  estado?: string;

  @Prop({ required: false })
  var?: boolean;

  @Prop({
    type: [String],
    enum: ['activo', 'reflexivo', 'teorico', 'pragmatico'],
    required: function (this: User) {
      return this.role === 'alumno';
    },
  })
  estilo?: ('activo' | 'reflexivo' | 'teorico' | 'pragmatico')[];

  @Prop({ required: true })
  telefono: string;

  @Prop({
    required: function (this: User) {
      return this.role === 'alumno';
    },
  })
  telefonorepresentante?: string;

  @Prop({ type: [Types.ObjectId], ref: 'Subject', default: [] })
  createbysubject?: Types.ObjectId[];

}

export const UserSchema = SchemaFactory.createForClass(User);
