import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  ParseIntPipe,
} from '@nestjs/common';
import { ResenaService } from './resena.service';

interface CrearResenaDto {
  usuarioId: number;
  comentario?: string;
  calificacion: number; // de 1 a 5
}

@Controller('resena')
export class ResenaController {
  constructor(private readonly resenaService: ResenaService) {}

  @Post()
  async crearResena(@Body() data: CrearResenaDto) {
    return await this.resenaService.createResena(data);
  }

  @Get()
  async obtenerResenas() {
    return await this.resenaService.getResenas();
  }

  @Get('usuario/:usuarioId')
  async obtenerPorUsuario(@Param('usuarioId', ParseIntPipe) usuarioId: number) {
    return await this.resenaService.getResenasByUsuario(usuarioId);
  }

  //eliminar
  @Post('eliminar/:id')
  async eliminarResena(@Param('id', ParseIntPipe) id: number) {
    return await this.resenaService.deleteResena(id);
  }


}
