import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
// import { JwtPayload } from '../interfaces/jwt-payload.interface'; // Sesuaikan dengan interface payload yang Anda buat
import { AuthService } from '../auth.service';// Pastikan AuthService diimpor

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'your_default_jwt_secret', // Ganti dengan secret yang sesuai
    });
  }
  async validate(payload: any) {
    return payload; // Lakukan validasi user di sini
  }
}
