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

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
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
    

    return {
      accessToken,
    };
  }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
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
        correo: user.email,
        rol: user.role,
      },
    };
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
  

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
