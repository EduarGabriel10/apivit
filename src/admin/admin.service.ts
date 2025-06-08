import { Injectable } from '@nestjs/common';
import { ConsultasService } from '../consultas/consultas.service';
import { RespuestasService } from '../respuestas/respuestas.service';
import { DiagnosticoService } from '../diagnostico/diagnostico.service';
import { MedicoService } from '../medico/medico.service';
import { ResenaService } from '../resena/resena.service';
import { UsuarioService } from '../usuario/usuario.service';
import { EstadoConsulta } from '@prisma/client';

@Injectable()
export class AdminService {
  constructor(
    private consultasService: ConsultasService,
    private respuestasService: RespuestasService,
    private diagnosticoService: DiagnosticoService,
    private medicoService: MedicoService,
    private resenaService: ResenaService,
    private usuarioService: UsuarioService,
  ) {}

  // Consultas operations
  async getConsultasByUserId(userId: number) {
    try {
      return this.consultasService.getConsultasByUserId(userId);
    } catch (error) {
      throw new Error(`Error fetching consultas by user: ${error.message}`);
    }
  }

  async getAllConsultas() {
    try {
      return this.consultasService.getAllConsultas();
    } catch (error) {
      throw new Error(`Error fetching all consultas: ${error.message}`);
    }
  }

  async getConsultasByEstado(estado: EstadoConsulta) {
    try {
      return this.consultasService.getConsultasByEstado(estado);
    } catch (error) {
      throw new Error(`Error fetching consultas by estado: ${error.message}`);
    }
  }

  // Respuestas operations
  async getAllRespuestas() {
    try {
      return this.respuestasService.getAllRespuestas();
    } catch (error) {
      throw new Error(`Error fetching all respuestas: ${error.message}`);
    }
  }

  async getRespuestasByConsultaId(consultaId: number) {
    try {
      return this.respuestasService.getRespuestasByConsultaId(consultaId);
    } catch (error) {
      throw new Error(`Error fetching respuestas by consulta: ${error.message}`);
    }
  }

  // Diagnostico operations
  async getDiagnosticos() {
    try {
      return this.diagnosticoService.getDiagnosticos();
    } catch (error) {
      throw new Error(`Error fetching diagnosticos: ${error.message}`);
    }
  }

  // Medico operations
  async getMedicos() {
    try {
      return this.medicoService.getMedicos();
    } catch (error) {
      throw new Error(`Error fetching medicos: ${error.message}`);
    }
  }

  // Resenas operations
  async getResenas() {
    try {
      return this.resenaService.getResenas();
    } catch (error) {
      throw new Error(`Error fetching resenas: ${error.message}`);
    }
  }

  // Usuarios operations
  async getUsuarios() {
    try {
      return this.usuarioService.getUsuarios();
    } catch (error) {
      throw new Error(`Error fetching usuarios: ${error.message}`);
    }
  }
}
