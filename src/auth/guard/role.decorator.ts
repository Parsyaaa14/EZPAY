import { SetMetadata } from '@nestjs/common';

// Dekorator Roles untuk menetapkan metadata 'roles' ke handler
export const Roles = (...roles: string[]) => SetMetadata('roles', roles);