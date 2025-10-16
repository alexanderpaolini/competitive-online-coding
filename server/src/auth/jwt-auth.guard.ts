import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const token = request.cookies['access_token']; // Extract JWT from cookies

    if (!token) {
      return false; // No token, deny access
    }

    try {
      const decoded = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET, // Match this with the JwtModule secret
      });
      request['user'] = decoded; // Attach user data to the request
      return true; // Token is valid, allow access
    } catch (err) {
      return false; // Invalid token, deny access
    }
  }
}
