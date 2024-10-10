// auth.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ValidateTokoDto } from './dto/validate-toko.dto';
import { TokoService } from 'src/toko/toko.service';

@Controller('auth') // Perhatikan bahwa ini mendefinisikan prefix 'auth'
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly tokoService: TokoService,
  ) {}

  @Post('login/kasir')
  async loginForKasir(@Body() body: { email: string; password: string }) {
    const { email, password } = body;
    return this.authService.loginForKasir(email, password);
  }

  @Post('login/')
  async validateToko(@Body() validateTokoDto: ValidateTokoDto) {
    const { email, password } = validateTokoDto;
    const result = await this.authService.validateToko(email, password);
  
    if (result.redirect) {
      return { redirectUrl: result.redirect }; // Jika toko ditolak, berikan URL redirect ke frontend
    }
  
    return result; // Jika login berhasil atau status pending
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