// src/auth/dto/login.dto.ts

import { IsEmail, IsString } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'El usuario no es válido' })
  nombreUsuario: string;

  @IsString({ message: 'La contraseña debe ser un texto válido' })
  password: string;
}
