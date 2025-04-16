// src/auth/dto/login.dto.ts

import { IsEmail, IsString } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'El correo electrónico no es válido' })
  email: string;

  @IsString({ message: 'La contraseña debe ser un texto válido' })
  password: string;
}
