import { MinLength } from "class-validator";

export class EditPasswordDto {
    @MinLength(8, { message: 'Password should be at least 8 characters long' })
    newPassword: string;
  }