import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsEnum(['docente', 'alumno', 'admin'])
  role: 'docente' | 'alumno' | 'admin';
  
  @IsString()
  @IsNotEmpty()
  nombreUsuario?: string;
  
  @IsOptional()
  @IsString()
  telefono?: string;
  
  @IsOptional()
  @IsString()
  estado?: string;
  @IsOptional()
  @IsEnum(['activo', 'reflexivo', 'teorico', 'pragmatico'])
  estilo?: 'activo' | 'reflexivo' | 'teorico' | 'pragmatico';
}
