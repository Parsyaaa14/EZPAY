// auth.controller.ts
import { Controller, Post, Body, Res, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ValidateTokoDto } from './dto/validate-toko.dto';
import { TokoService } from 'src/toko/toko.service';
import { LoginDto } from './dto/login.dto';

@Controller('auth') // Perhatikan bahwa ini mendefinisikan prefix 'auth'
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly tokoService: TokoService,
  ) {}

  @Post('login/kasir')
  async loginForKasir(@Body() loginKasir: LoginDto) {
    const { email, password } = loginKasir;
    const result = await this.authService.loginForKasir(email, password);
    return {
      access_token: result.access_token,
      id_user: result.id_user, // Tambahkan id_user
      nama: result.nama,
      id_toko: result.id_toko, // Tambahkan id_toko
      email: result.email,
      nama_role: result.nama_role, // Tambahkan nama_role
    };
  }

  @Post('login/')
  async login(@Body() validateTokoDto: ValidateTokoDto) {
      const { email, password } = validateTokoDto;
      const result = await this.authService.validateToko(email, password);
    
      // Jika ada URL redirect, kirimkan URL tersebut
      if (result.redirect) {
          return { redirectUrl: result.redirect };
      }
    
      // Jika login berhasil, kembalikan token, user ID, ID toko, dan nama role
      return {
          message: result.message,
          access_token: result.access_token,
          id_user: result.user.id_user, // Tambahkan id_user
          nama: result.user.nama,
          id_toko: result.id_toko, // Tambahkan id_toko
          email: result.user.email,
          nama_role: result.user.nama_role // Tambahkan nama_role
      };
  }
  
  

  @Post('login/superadmin')
  async loginForSuperadmin(@Body() body: { email: string; password: string }) {
    const { email, password } = body;
    return this.authService.loginForSuperadmin(email, password);
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