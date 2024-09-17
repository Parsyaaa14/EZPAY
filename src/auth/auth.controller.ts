// auth.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')  // Perhatikan bahwa ini mendefinisikan prefix 'auth'
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login/kasir')
  async loginForKasir(@Body() body: { email: string; password: string }) {
    const { email, password } = body;
    return this.authService.loginForKasir(email, password);
  }

  @Post('login/toko')
  async loginForAdmin(@Body() body: { email: string; password: string }) {
    const { email, password } = body;
    return this.authService.validateToko(email, password);
  }

  // @Post('login')  // Ini mendefinisikan endpoint POST /auth/login
  // async login(@Body() body: { email: string; password: string }) {
  //   return this.authService.login(body.email, body.password);
  // }
}
// @Controller('auth')
// export class AuthController {
//   constructor(private readonly authService: AuthService) {}

//   @Post('login')
//   async login(@Body() loginDto: LoginDto): Promise<{ access_token: string }> {
//     const { email, password } = loginDto;
//     return this.authService.login(email, password);
//   }