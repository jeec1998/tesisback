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

  @IsOptional()
  @IsString()
  estado?: string;
}
