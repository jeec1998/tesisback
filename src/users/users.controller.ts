import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
  Request,
  UnauthorizedException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthService } from '../auth/auth.service';
import { AuthGuard } from '@nestjs/passport';
import { SubjectsService } from '../subjects/subjects.service'; 

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
    private readonly subjectsService: SubjectsService, 
  ) {}

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
    if (createUserDto.role === 'alumno') {
      if (!createUserDto.createbysubject) {
        throw new BadRequestException('El campo createbysubject es obligatorio para alumnos.');
      }

      const subject = await this.subjectsService.findOne(createUserDto.createbysubject);
      if (!subject) {
        throw new NotFoundException(
          `La materia con ID ${createUserDto.createbysubject} no existe.`,
        );
      }
    }

    return this.usersService.create(createUserDto);
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
      },
    };
  }
  @UseGuards(AuthGuard('jwt'))
  @Get('materia/:materiaId')
  findAlumnosByMateria(@Param('materiaId') materiaId: string) {
    return this.usersService.findAlumnosByMateria(materiaId);
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
  if (rol !== 'admin') {
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
}
