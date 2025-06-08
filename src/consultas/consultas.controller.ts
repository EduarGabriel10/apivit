import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ConsultasService } from './consultas.service';
import { EstadoConsulta } from '@prisma/client';

@Controller('consultas')
export class ConsultasController {
  constructor(private readonly consultasService: ConsultasService) {}

  //eliminar consulta
  @Delete(':id')
  async deleteConsulta(@Param('id') id: string) {
    return await this.consultasService.deleteConsulta(Number(id));
  }

  // Crear consulta
  @Post('create')
  async createConsulta(@Body() consulta: any) {
    return await this.consultasService.saveConsulta(consulta);
  }

  // Obtener todas las consultas por id de usuario
  @Get('usuario/:usuarioId')
  async getConsultasByUserId(@Param('usuarioId') usuarioId: string) {
    return await this.consultasService.getConsultasByUserId(Number(usuarioId));
  }

  // Obtener todas las consultas (para el dashboard del médico)
  @Get()
  async getAllConsultas() {
    return await this.consultasService.getAllConsultas();
  }

  // Obtener consultas por estado
  @Get('estado/:estado')
  async getConsultasByEstado(@Param('estado') estado: string) {
    // Convertir string a enum
    const estadoEnum = EstadoConsulta[estado as keyof typeof EstadoConsulta];
    return await this.consultasService.getConsultasByEstado(estadoEnum);
  }

  // Obtener total de consultas agrupadas por fecha
  @Get('estadisticas/porfecha')
  async getConsultasPorFecha() {
    return await this.consultasService.getConsultasPorFecha();
  }

  // Obtener una consulta específica por ID
  @Get(':id')
  async getConsultaById(@Param('id') id: string) {
    return await this.consultasService.getConsultaById(Number(id));
  }

  // Actualizar el estado de una consulta
  @Put(':id/estado')
  async updateConsultaEstado(
    @Param('id') id: string, 
    @Body('estado') estado: string
  ) {
    const estadoEnum = EstadoConsulta[estado as keyof typeof EstadoConsulta];
    return await this.consultasService.updateConsultaEstado(Number(id), estadoEnum);
  }
}