import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([(req) => req.cookies['access_token']]), // Extract JWT from cookies
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET, // Use the same secret as in JwtModule
    });
  }

  async validate(payload: any) {
    return { userId: payload.sub, username: payload.username }; // Attach user info to the request
  }
}
