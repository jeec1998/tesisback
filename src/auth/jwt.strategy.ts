import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super({
      jwtFromRequest: (req: Request) => {
      
        const tokenFromQuery = req?.query?.accessToken as string;
        if (tokenFromQuery) {
         
          return tokenFromQuery;
        }

       
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
          const token = authHeader.split(' ')[1];
       
          return token;
        }

        return null;
      },
      ignoreExpiration: false,
      secretOrKey: 'mi_clave_secreta',

      
      passReqToCallback: true,
    });
  }

 
  async validate(req: Request, payload: any) {

    return {
      _id: payload._id,
      email: payload.email,
      role: payload.role,
    };
  }
}
