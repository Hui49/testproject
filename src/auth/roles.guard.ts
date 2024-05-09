import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './decorators/roles.decorator';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/users.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector,
    private readonly jwtService: JwtService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<string[]>(ROLES_KEY, context.getHandler());
    if (!roles) {
      return true; // No roles specified, allow access
    }

    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.split(' ')[1]; // Extract JWT token from Authorization header

    if (!token) {
      return false; // Token not found, deny access
    }

    try {
      const decodedToken = this.jwtService.verify<User>(token); // Verify and decode JWT token
      const userRoles = decodedToken.role;

      return roles.some(role => userRoles.includes(role)); // Check if user has any of the required roles
    } catch (err) {
      return false; // Token verification failed, deny access
    }
  }
}