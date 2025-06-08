import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { RespuestasService } from './respuestas.service';

@Controller('respuestas')
export class RespuestasController {
  constructor(private readonly respuestasService: RespuestasService) {}

  // Crear una nueva respuesta
  @Post()
  async createRespuesta(@Body() respuestaData: any) {
    return await this.respuestasService.createRespuesta(respuestaData);
  }

  // Crear múltiples respuestas
  @Post('bulk')
  async createManyRespuestas(@Body() respuestasData: any[]) {
    return await this.respuestasService.createManyRespuestas(respuestasData);
  }

  // Obtener una respuesta específica por ID
  @Get(':id')
  async getRespuestaById(@Param('id') id: string) {
    return await this.respuestasService.getRespuestaById(parseInt(id));
  }

  // Obtener todas las respuestas
  @Get()
  async getAllRespuestas() {
    return await this.respuestasService.getAllRespuestas();
  }

  // Obtener respuestas por sección
  @Get('seccion/:seccion')
  async getRespuestasBySeccion(@Param('seccion') seccion: string) {
    return await this.respuestasService.getRespuestasBySeccion(seccion);
  }

  // Obtener todas las respuestas de una consulta
  @Get('consulta/:consultaId')
  async getRespuestasByConsultaId(@Param('consultaId') consultaId: string) {
    return await this.respuestasService.getRespuestasByConsultaId(Number(consultaId));
  }

  // Actualizar una respuesta existente
  @Put(':id')
  async updateRespuesta(
    @Param('id') id: string,
    @Body() respuestaData: any
  ) {
    return await this.respuestasService.updateRespuesta(Number(id), respuestaData);
  }

  // Eliminar una respuesta
  @Delete(':id')
  async deleteRespuesta(@Param('id') id: string) {
    return await this.respuestasService.deleteRespuesta(Number(id));
  }

  // Obtener estadísticas de respuestas comunes para una pregunta
  @Get('estadisticas/:preguntaId')
  async getEstadisticas(@Param('preguntaId') preguntaId: string) {
    return this.respuestasService.getCommonResponses(preguntaId);
  }

  // Eliminar todas las respuestas asociadas a una consulta
  @Delete('consulta/:consultaId')
  async deleteRespuestasByConsultaId(@Param('consultaId') consultaId: string) {
    return await this.respuestasService.deleteRespuestasByConsultaId(Number(consultaId));
  }

  // Obtener resumen estadístico agrupado por sección
  @Get('resumen/seccion')
  async getResumenPorSeccion() {
    return await this.respuestasService.getResumenPorSeccion();
  }

  // Obtener resumen estadístico agrupado por sintomas
  @Get('resumen/sintomas')
  async getResumenPorSintomas() {
    return await this.respuestasService.getResumenPorSintomas();
  }

  // Obtener respuestas de tipo 2 con la fecha de la consulta
  @Get('tipo2/fecha')
  async getRespuestasTipo2ConFecha() {
    return await this.respuestasService.getRespuestasTipo2ConFecha();
  }

  // Obtener respuestas de tipo 7 con la fecha de la consulta
  @Get('tipo7/fecha')
  async getRespuestasTipo7ConFecha() {
    return await this.respuestasService.getRespuestasTipo7ConFecha();
  }

  // Obtener respuestas de tipo 4 con la fecha de la consulta
  @Get('tipo4/fecha')
  async getRespuestasTipo4ConFecha() {
    return await this.respuestasService.getRespuestasTipo4ConFecha();
  }

  // Obtener respuestas de tipo 11 con la fecha de la consulta
  @Get('tipo11/fecha')
  async getRespuestasTipo11ConFecha() {
    return await this.respuestasService.getRespuestasTipo11ConFecha();
  }
}