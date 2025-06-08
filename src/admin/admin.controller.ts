import { Controller, Get, Param, Post, Body, Delete, Put } from '@nestjs/common';
import { AdminService } from './admin.service';
import { EstadoConsulta } from '@prisma/client';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // Consultas endpoints
  @Get('consultas/user/:userId')
  async getConsultasByUserId(@Param('userId') userId: string) {
    try {
      return this.adminService.getConsultasByUserId(Number(userId));
    } catch (error) {
      throw new Error(`Error fetching consultas by user: ${error.message}`);
    }
  }

  @Get('consultas')
  async getAllConsultas() {
    try {
      return this.adminService.getAllConsultas();
    } catch (error) {
      throw new Error(`Error fetching all consultas: ${error.message}`);
    }
  }

  @Get('consultas/estado/:estado')
  async getConsultasByEstado(@Param('estado') estado: EstadoConsulta) {
    try {
      return this.adminService.getConsultasByEstado(estado);
    } catch (error) {
      throw new Error(`Error fetching consultas by estado: ${error.message}`);
    }
  }

  // Respuestas endpoints
  @Get('respuestas')
  async getAllRespuestas() {
    try {
      return this.adminService.getAllRespuestas();
    } catch (error) {
      throw new Error(`Error fetching all respuestas: ${error.message}`);
    }
  }

  @Get('respuestas/consulta/:consultaId')
  async getRespuestasByConsultaId(@Param('consultaId') consultaId: string) {
    try {
      return this.adminService.getRespuestasByConsultaId(Number(consultaId));
    } catch (error) {
      throw new Error(`Error fetching respuestas by consulta: ${error.message}`);
    }
  }

  // Diagnostico endpoints
  @Get('diagnosticos')
  async getDiagnosticos() {
    try {
      return this.adminService.getDiagnosticos();
    } catch (error) {
      throw new Error(`Error fetching diagnosticos: ${error.message}`);
    }
  }

  // Medicos endpoints
  @Get('medicos')
  async getMedicos() {
    try {
      return this.adminService.getMedicos();
    } catch (error) {
      throw new Error(`Error fetching medicos: ${error.message}`);
    }
  }

  // Resenas endpoints
  @Get('resenas')
  async getResenas() {
    try {
      return this.adminService.getResenas();
    } catch (error) {
      throw new Error(`Error fetching resenas: ${error.message}`);
    }
  }

  // Usuarios endpoints
  @Get('usuarios')
  async getUsuarios() {
    try {
      return this.adminService.getUsuarios();
    } catch (error) {
      throw new Error(`Error fetching usuarios: ${error.message}`);
    }
  }
}
