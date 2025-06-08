import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UsuarioService } from './usuario.service';

@Controller('usuario')
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) {}

  //crear usuario
  @Post('create')
  async createUsuario(@Body() usuario: any) {
    return await this.usuarioService.createUsuario(usuario);
  }

  //actualizar usuario
  @Post('update')
  async updateUsuario(@Body() usuario: any) {
    return await this.usuarioService.updateUsuario(usuario);
  }

  //crear usuario desde google
  @Post('createFromGoogle')
  async createUsuarioFromGoogle(@Body() usuario: any) {
    return await this.usuarioService.createUsuarioFromGoogle(usuario);
  }

  //login de usuario
  @Post('login')
  async loginUsuario(@Body() usuario: any) {
    return await this.usuarioService.loginUsuario(usuario.email, usuario.contrasena);
  }

  //recuperar usuario
  @Get('get/:email')
  async getUsuario(@Param('email') email: string) {
    return await this.usuarioService.getUsuario(email);
  }

  //recuperar usuarios
  @Get('getusuario')
  async getUsuarios() {
    return await this.usuarioService.getUsuarios();
  }


}
