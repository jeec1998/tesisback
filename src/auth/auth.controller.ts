import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { LoginDto } from '../auth/dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const user = await this.usersService.findByEmail(loginDto.nombreUsuario);
  
    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }
  
    const isValid = await this.authService.comparePasswords(
      loginDto.password,
      user.password,
    );
  
    if (!isValid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }
  
    return this.authService.login(user);
    
  }
  
}
