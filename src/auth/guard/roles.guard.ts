// src/auth/guard/roles.guard.ts
import {
    Injectable,
    CanActivate,
    ExecutionContext,
    ForbiddenException,
  } from '@nestjs/common';
  import { Reflector } from '@nestjs/core';
  import { JwtAuthGuard } from './jwt-auth.guard'; // Pastikan Anda memiliki JwtAuthGuard
  
  @Injectable()
  export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) {}
  
    canActivate(context: ExecutionContext): boolean {
      const requiredRoles = this.reflector.get<string[]>(
        'roles',
        context.getHandler(),
      );
  
      if (!requiredRoles) {
        return true; // Jika tidak ada role yang dibutuhkan, akses diperbolehkan
      }
  
      const request = context.switchToHttp().getRequest();
      const user = request.user; // User yang sudah terautentikasi
      const hasRole = requiredRoles.some((role) => user.role?.includes(role));
  
      if (!hasRole) {
        throw new ForbiddenException('Forbidden resource');
      }
  
      return true;
    }
  }
  