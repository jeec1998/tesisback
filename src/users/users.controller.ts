import { Controller, Get, Post, Body, Param, Delete, Put, UseGuards, Request, UnauthorizedException, NotFoundException, BadRequestException } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthService } from '../auth/auth.service';
import { AuthGuard } from '@nestjs/passport';
import { SubjectsService } from '../subjects/subjects.service';
import * as crypto from 'crypto'; // Para generar datos aleatorios
import { Types } from 'mongoose';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
    private readonly subjectsService: SubjectsService,
  ) { }

  // Función para generar nombre de usuario y contraseña aleatoria
/*   generateRandomCredentials() {
    const username = `user${crypto.randomBytes(4).toString('hex')}`;
    const password = crypto.randomBytes(8).toString('hex'); // Contraseña aleatoria
    return { username, password };
  } */

  // Función para generar el enlace de WhatsApp
  generateWhatsappLink(phoneNumber: string, username: string, password: string): string {
    const message = `Tu nombre de usuario es: ${username} y tu contraseña es: ${password}`;
    const encodedMessage = encodeURIComponent(message); // Codificamos el mensaje
    return `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
  }
  @Post('login')
  async login(@Body() body: { nombreUsuario: string; password: string }) {
    const user = await this.usersService.findByEmail(body.nombreUsuario);
    if (!user || !(await this.authService.comparePasswords(body.password, user.password))) {
      throw new UnauthorizedException('Credenciales inválidas');
    }
    const accessToken = await this.authService.generateToken({
      _id: (user as any)._id,
      email: user.email,
      role: user.role,
    });

    return { accessToken };
  }



 @Post()
async create(@Body() createUserDto: CreateUserDto) {
  try {
    // Generar una contraseña y nombre de usuario aleatorio
    const newpassword = crypto.randomBytes(8).toString('hex');  // 16 bytes para mayor seguridad
    const username = crypto.randomBytes(8).toString('hex');
    
    // Asignar valores al DTO
    createUserDto.nombreUsuario = username;
    createUserDto.password = newpassword;

    // Crear el usuario
    const user = await this.usersService.create(createUserDto);

    // Generar el enlace de WhatsApp si tiene teléfono, sino enviar un mensaje vacío.
    let whatsappLink = '';
    if (user.telefono) {
      // Usar `user.password` en lugar de `user.newpassword`
      whatsappLink = this.generateWhatsappLink(user.telefono, user.nombreUsuario, newpassword);
    }

    // Retornar la respuesta con el mensaje y enlace de WhatsApp (si existe)
    return {
      message: 'Usuario creado correctamente',
      link: whatsappLink || null,  // Si no tiene teléfono, el link será null
    };
    
  } catch (error) {
    return { message: 'Error al crear el usuario', error: error.message };
  }
}
@Post('from-subject/:subjectId')
async createUserFromSubject(
  @Param('subjectId') subjectId: string,
  @Body() createUserDto: CreateUserDto,
) {
  if (!Types.ObjectId.isValid(subjectId)) {
    throw new BadRequestException('ID de materia inválido');
  }

  // Generar usuario y contraseña aleatorios
  const newPassword = crypto.randomBytes(8).toString('hex');
  const username = crypto.randomBytes(8).toString('hex');

  createUserDto.nombreUsuario = username;
  createUserDto.password = newPassword;
  createUserDto.createbysubject = new Types.ObjectId(subjectId).toHexString();

  const user = await this.usersService.create(createUserDto);

  let whatsappLink = '';
  if (user.telefono) {
    whatsappLink = this.generateWhatsappLink(user.telefono, user.nombreUsuario, newPassword);
  }

  return {
    message: 'Usuario creado correctamente con materia asignada',
    link: whatsappLink || null,
  };
}
@UseGuards(AuthGuard('jwt'))
@Get(':userId/materia')
async obtenerMateriaUsuario(@Param('userId') userId: string) {
  if (!Types.ObjectId.isValid(userId)) {
    throw new BadRequestException('ID inválido');
  }
  const userObjectId = new Types.ObjectId(userId);
  const usuarioConMateria = await this.usersService.getMateriasDelUsuario(userObjectId);

  if (!usuarioConMateria) throw new NotFoundException('Usuario no encontrado');

  return usuarioConMateria.createbysubject || null; // devuelve la materia (populada) o null
}


  




  @UseGuards(AuthGuard('jwt'))
  @Get('perfil')
  async obtenerPerfilCompleto(@Request() req) {
    const userId = req.user?._id;

    if (!userId) {
      throw new BadRequestException('No se encontró el ID de usuario en el token.');
    }

    const user = await this.usersService.findOne(userId);

    if (!user) {
      throw new NotFoundException(`Usuario con ID ${userId} no encontrado`);
    }

    return {
      usuario: {
        nombre: user.name,
        nombreUsuario: user.nombreUsuario,
        telefono: user.telefono,
        telefonorepresentante: user.telefonorepresentante,
        estado: user.estado,
        correo: user.email,
        role: user.role,
        estilo: user.estilo,
        var: user.var,
      },
    };
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('materia/:materiaId')
  findAlumnosByMateria(@Param('materiaId') materiaId: string) {
    return this.usersService.findAlumnosByMateria(materiaId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put('cambiar-contrasena')
  async cambiarContrasena(@Request() req, @Body() body: { currentPassword: string; newPassword: string }) {
    const userId = req.user?._id;
  
    // Verificar si se pasó un ID de usuario en el token
    if (!userId) {
      throw new BadRequestException('No se encontró el ID de usuario en el token.');
    }
  
    // Obtener el usuario
    const user = await this.usersService.findOne(userId);
  
    // Verificar si el usuario existe
    if (!user) {
      throw new NotFoundException(`Usuario con ID ${userId} no encontrado`);
    }
  
    // Verificar si la contraseña actual es correcta
    const isPasswordValid = await this.authService.comparePasswords(body.currentPassword, user.password);
  
    if (!isPasswordValid) {
      throw new UnauthorizedException('La contraseña actual es incorrecta');
    }
  
    // Validar la nueva contraseña (por ejemplo, longitud mínima de 8 caracteres)
    if (body.newPassword.length < 8) {
      throw new BadRequestException('La nueva contraseña debe tener al menos 8 caracteres');
    }
  
    // Actualizar la contraseña con la nueva
    const updatedUser = await this.usersService.updatePassword(userId, body.newPassword);
  
    if (!updatedUser) {
      throw new NotFoundException(`No se pudo actualizar la contraseña del usuario con ID ${userId}`);
    }
  
    return { message: 'Contraseña actualizada correctamente ✅' };
  }
  
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @UseGuards(AuthGuard('jwt'))
  @Put('actualizar')
  async actualizarPerfil(@Request() req, @Body() updateUserDto: UpdateUserDto) {
    const userId = req.user._id;

    if (!userId) {
      throw new BadRequestException('ID no encontrado en el token');
    }

    return this.usersService.update(userId, updateUserDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put(':id')
  async actualizarUsuarioPorId(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Request() req,
  ) {
    const rol = req.user?.role;
    if (rol === 'alumno') {
      throw new UnauthorizedException('Solo el administrador puede actualizar usuarios por ID');
    }

    return this.usersService.update(id, updateUserDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const user = await this.usersService.findOne(id);
    if (!user) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }
    return user;
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
  @UseGuards(AuthGuard('jwt'))
  @Put(':id/reset-password')
  async resetPassword(@Param('id') id: string, @Request() req) {
    const rol = req.user?.role;

    // Verificar que el rol no sea "alumno"
    if (rol === 'alumno') {
      throw new UnauthorizedException('El rol "alumno" no tiene permiso para restablecer contraseñas');
    }

    const newPassword = crypto.randomBytes(8).toString('hex');

    const updatedUser = await this.usersService.resetPassword(id, newPassword);

    if (!updatedUser) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }

    // Si el usuario tiene teléfono, generar el enlace de WhatsApp
    if (updatedUser.telefono) {
      const whatsappLink = this.generateWhatsappLink(updatedUser.telefono, updatedUser.nombreUsuario, newPassword);
      return { message: 'Contraseña restablecida y enlace de WhatsApp generado', link: whatsappLink };
    }

    // Si no tiene teléfono, solo devolver el mensaje con la nueva contraseña
    return { message: 'Contraseña restablecida correctamente ✅', password: newPassword };
  }
}
