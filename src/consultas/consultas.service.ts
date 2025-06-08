import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RespuestasService } from 'src/respuestas/respuestas.service';
import { EstadoConsulta, Gravedad } from '@prisma/client';

interface ConsultaInput {
  edad: number;
  resultadoIA: string;
  recomendaciones: string[];
  porcentaje: string;
  gravedad: string;
  usuarioId: number;
  respuestas: {
    pregunta: string;
    respuesta: string;
    tipoRespuesta: string;
    detalles?: string | null;
    seccion: string;
  }[];
}

@Injectable()
export class ConsultasService {
  constructor(
    private prisma: PrismaService,
    private respuestasService: RespuestasService
  ) {}

  async getConsultasPorFecha() {
    // Obtener todas las consultas agrupadas por fecha
    const consultas = await this.prisma.consulta.findMany({
      select: {
        fecha: true,
        id: true
      },
      orderBy: {
        fecha: 'asc'
      }
    });

    // Agrupar por fecha
    const consultasPorFecha = consultas.reduce((acc, consulta) => {
      const fecha = consulta.fecha.toISOString().split('T')[0]; // Formato YYYY-MM-DD
      if (!acc[fecha]) {
        acc[fecha] = 0;
      }
      acc[fecha]++;
      return acc;
    }, {} as Record<string, number>);

    // Convertir a array de objetos
    return Object.entries(consultasPorFecha).map(([fecha, total]) => ({
      fecha,
      total
    }));
  }

  async deleteConsulta(id: number) {
    // Primero eliminamos las respuestas asociadas a la consulta
    await this.prisma.respuesta.deleteMany({
      where: {
        consultaId: id
      }
    });

    // Luego eliminamos la consulta
    await this.prisma.consulta.delete({
      where: {
        id: id
      }
    });

    return { message: 'Consulta y sus respuestas eliminadas exitosamente' };
  }

  async saveConsulta(consultaInput: ConsultaInput) {
    // Primero crear la consulta
    const newConsulta = await this.prisma.consulta.create({
      data: {
        edad: consultaInput.edad,
        resultadoIA: consultaInput.resultadoIA,
        recomendaciones: consultaInput.recomendaciones,
        porcentaje: consultaInput.porcentaje?.toString() ?? '0',
        gravedad: consultaInput.gravedad?.toString() ?? '0',
        fecha: new Date(),
        estado: EstadoConsulta.PENDIENTE,
        usuario: {
          connect: { id: consultaInput.usuarioId },
        },
      },
    });

    // Luego crear las respuestas usando RespuestasService
    const respuestasData = consultaInput.respuestas.map(respuesta => ({
      ...respuesta,
      consultaId: newConsulta.id
    }));

    await this.respuestasService.createManyRespuestas(respuestasData);

    // Devolver la consulta con sus respuestas
    return this.prisma.consulta.findUnique({
      where: { id: newConsulta.id },
      include: { respuestas: true }
    });
  }

  // Obtener consultas de un usuario por id
  async getConsultasByUserId(usuarioId: number) {
    return await this.prisma.consulta.findMany({
      where: {
        usuarioId: usuarioId,
      },
      include: {
        respuestas: true,
        diagnosticoMedico: true
      }
    });
  }
  
  // Obtener todas las consultas (para el dashboard del médico)
  async getAllConsultas() {
    const [consultas, estadisticas] = await Promise.all([
      this.prisma.consulta.findMany({
        include: {
          respuestas: true,
          usuario: true,
          diagnosticoMedico: true
        },
        orderBy: {
          fecha: 'desc'
        }
      }),
      this.prisma.consulta.aggregate({
        _count: {
          id: true
        },
        where: {
          estado: EstadoConsulta.PENDIENTE
        }
      }),
      this.prisma.consulta.count()
    ]);

    const totalPendientes = estadisticas._count.id;
    const totalDiagnosticadas = consultas.length - totalPendientes;
    const totalConsultas = consultas.length;

    return {
      consultas,
      estadisticas: {
        totalPendientes,
        totalDiagnosticadas,
        totalConsultas
      }
    };
  }
  
  // Obtener consultas por estado (para filtrado en el dashboard)
  async getConsultasByEstado(estado: EstadoConsulta) {
    return await this.prisma.consulta.findMany({
      where: {
        estado: estado
      },
      include: {
        respuestas: true,
        usuario: true,
        diagnosticoMedico: true
      },
      orderBy: {
        fecha: 'desc'
      }
    });
  }
  
  // Actualizar el estado de una consulta
  async updateConsultaEstado(id: number, estado: EstadoConsulta) {
    return await this.prisma.consulta.update({
      where: { id },
      data: { estado }
    });
  }
  
  // Obtener una consulta específica con todos sus detalles
  async getConsultaById(id: number) {
    return await this.prisma.consulta.findUnique({
      where: { id },
      include: {
        respuestas: true,
        usuario: true,
        diagnosticoMedico: true
      }
    });
  }
}