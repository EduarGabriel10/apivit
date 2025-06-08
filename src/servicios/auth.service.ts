import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsuarioService } from 'src/usuario/usuario.service'; // Importa tu servicio de usuario
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usuarioService: UsuarioService,
    private readonly jwtService: JwtService,  
  ) {}

  async login(email: string, contrasena: string) {
    const usuario = await this.usuarioService.getUsuarioByEmail(email);

    if (!usuario) {
      throw new Error('Credenciales incorrectas');
    }

    // Comparar la contraseña ingresada con la contraseña cifrada en la base de datos
    const isPasswordValid = await bcrypt.compare(contrasena, usuario.contrasena);

    if (!isPasswordValid) {
      throw new Error('Credenciales incorrectas');
    }

    // Crear el payload para el JWT
    const payload = { email: usuario.email, id: usuario.id };

    // Generar el token JWT
    const token = this.jwtService.sign(payload);
    console.log('Generated Token:', token);


    return { access_token: token,
      message: 'Login exitoso',
      token: token,
    };
  }
}
