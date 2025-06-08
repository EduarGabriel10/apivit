import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt'; // Importa JwtService

interface Usuario {
  email: string;
  contrasena: string;
  nombre: string;
  telefono: string;
}

@Injectable()
export class UsuarioService {
  constructor(private prisma: PrismaService, private jwtService: JwtService) {} // Añadir JwtService al constructor

  // Función para verificar si el usuario ya existe por correo
  async getUsuarioByEmail(email: string) {
    const usuario = await this.prisma.usuario.findUnique({
      where: { email: email },
    });
    return usuario; // Retorna null si no se encuentra
  }

  async createUsuarioFromGoogle(usuario: Usuario) {
    const existingUser = await this.getUsuarioByEmail(usuario.email);
    console.log('Usuario encontrado:', existingUser);

    if (existingUser) {
      return {
        message: 'Usuario ya registrado',
        usuario: existingUser,
      };
    }

    const newUsuario = await this.prisma.usuario.create({
      data: {
        ...usuario,
      },
    });

    // Generar el payload para el JWT
    const payload = { email: newUsuario.email, id: newUsuario.id };

    // Generar el token JWT
    const token = this.jwtService.sign(payload);
    console.log('Generated Token (Google Login):', token);

    return {
      message: 'Usuario creado correctamente',
      usuario: newUsuario,
      token: token, // Devuelve el token JWT
    };
  }

  async createUsuario(usuario: Usuario) {
    const hashedPassword = await bcrypt.hash(usuario.contrasena, 10);

    const newUsuario = await this.prisma.usuario.create({
      data: {
        ...usuario,
        contrasena: hashedPassword, // Guardar la contraseña cifrada
      },
    });

    return {
      message: 'Usuario creado correctamente',
      usuario: newUsuario,
    };
  }

  async loginUsuario(email: string, contrasena: string) {
    try {
      const usuario = await this.prisma.usuario.findUnique({
        where: { email: email },
      });
  
      if (!usuario) {
        return {
          message: 'Error: Usuario no encontrado',
          usuario: null,
        };
      }
  
      const isPasswordValid = await bcrypt.compare(contrasena, usuario.contrasena);
  
      if (!isPasswordValid) {
        return {
          message: 'Error: Contraseña incorrecta',
          usuario: null,
        };
      }
  
      // Generar el payload para el JWT
      const payload = { email: usuario.email, id: usuario.id };
  
      // Generar el token JWT
      const token = this.jwtService.sign(payload);
      console.log('Generated Token (Login):', token); // Mostrar token en consola
  
      return {
        message: 'Usuario logueado correctamente',
        token: token, // Devuelve el token JWT
        usuario: usuario,
      };
    } catch (error) {
      console.error('Error generating token:', error);
      return {
        message: 'Error al generar el token',
        error: error.message,
      };
    }
  }
  

  // Recuperar usuario
  async getUsuario(email: string) {
    const usuario = await this.prisma.usuario.findUnique({
      where: {
        email: email,
      },
    });

    return {
      messagge: 'Usuario recuperado correctamente',
      usuario: usuario,
    };
  }

  // Recuperar usuarios
  async getUsuarios() {
    const usuarios = await this.prisma.usuario.findMany();
    return {
      messagge: 'Usuarios recuperados correctamente',
      usuarios: usuarios,
    };
  }

  // Actualizar usuario
  async updateUsuario(usuario: Usuario) {
    const datosActualizados: any = {
      nombre: usuario.nombre,
      telefono: usuario.telefono,
      
    };

    if (usuario.contrasena && usuario.contrasena.trim() !== '') {
      const hashedPassword = await bcrypt.hash(usuario.contrasena, 10);
      datosActualizados.contrasena = hashedPassword;
    }

    const updatedUsuario = await this.prisma.usuario.update({
      where: { email: usuario.email },
      data: datosActualizados,
    });

    return {
      message: 'Usuario actualizado correctamente',
      usuario: updatedUsuario,
    };
  }


}
