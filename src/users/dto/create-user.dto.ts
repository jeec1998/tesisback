import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, ValidateIf, IsArray, ArrayNotEmpty, IsBoolean, validate } from 'class-validator';

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


  @IsString()
  telefono?: string;

  @ValidateIf(o => o.role === 'alumno')
  @IsNotEmpty({ message: 'El campo telefonorepresentante es obligatorio para alumnos' })
  @IsString()
  telefonorepresentante?: string;

  @IsOptional()
  @IsString()
  estado?: string;
   
  @IsOptional()
  @IsBoolean()
  var: boolean;

  @ValidateIf(o => o.role === 'alumno')
  @IsArray()
  @ArrayNotEmpty()
  @IsEnum(['activo', 'reflexivo', 'teórico', 'pragmático'], { each: true })
  estilo: ('activo' | 'reflexivo' | 'teórico' | 'pragmático')[];
  
  @ValidateIf(o => o.role === 'alumno')
  @IsNotEmpty({ message: 'El campo nivel es obligatorio para alumnos' })
  @IsString()
  cursos?: string;

  @ValidateIf(o => o.role === 'alumno')
  @IsNotEmpty({ message: 'El campo createbysubject es obligatorio para alumnos' })
  @IsString()
  createbysubject?: string;
}
