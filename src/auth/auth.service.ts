
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { access } from 'fs';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}
  async login(user: any): Promise<{ access_token: string }> {
    const payload = {
      _id: user._id,
      email: user.email,
      role: user.role,
    };
  
    console.log('📦 Payload JWT:', payload);
  
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
  async generateToken(payload: any): Promise<string> {
    return this.jwtService.signAsync(payload);
  }

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  async comparePasswords(password: string, hashed: string): Promise<boolean> {
    return bcrypt.compare(password, hashed);
  }
}
