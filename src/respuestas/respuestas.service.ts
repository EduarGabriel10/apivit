import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

interface RespuestaInput {
  pregunta: string;
  respuesta: string;
  tipoRespuesta: string;
  detalles?: string | null;
  seccion: string;
  consultaId: number;
}

@Injectable()
export class RespuestasService {
  constructor(private prisma: PrismaService) {}

  // Crear una nueva respuesta
  async createRespuesta(respuestaData: RespuestaInput) {
    return await this.prisma.respuesta.create({
      data: {
        pregunta: respuestaData.pregunta,
        respuesta: respuestaData.respuesta.toString(),
        tipoRespuesta: respuestaData.tipoRespuesta.toString(),
        detalles: respuestaData.detalles ?? null,
        seccion: respuestaData.seccion,
        consulta: {
          connect: { id: respuestaData.consultaId },
        },
      },
    });
  }

  // Crear múltiples respuestas en una sola operación
  async createManyRespuestas(respuestasData: RespuestaInput[]) {
    const createdRespuestas = await Promise.all(
      respuestasData.map((respuesta) => this.createRespuesta(respuesta)),
    );
    return createdRespuestas;
  }

  // Obtener todas las respuestas para una consulta específica
  async getRespuestasByConsultaId(consultaId: number) {
    return await this.prisma.respuesta.findMany({
      where: {
        consultaId: consultaId,
      },
      orderBy: {
        id: 'asc',
      },
    });
  }

  // Actualizar una respuesta existente
  async updateRespuesta(id: number, data: Partial<RespuestaInput>) {
    return await this.prisma.respuesta.update({
      where: { id },
      data,
    });
  }

  // Eliminar una respuesta
  async deleteRespuesta(id: number) {
    return await this.prisma.respuesta.delete({
      where: { id },
    });
  }

  // Obtener respuestas más comunes para una pregunta específica
  async getCommonResponses(pregunta: string) {
    const grouped = await this.prisma.respuesta.groupBy({
      by: ['respuesta'],
      where: { pregunta },
      _count: { respuesta: true },
      orderBy: { _count: { respuesta: 'desc' } },
    });

    return grouped.map((g) => ({
      respuesta: g.respuesta,
      cantidad: g._count.respuesta,
    }));
  }

  // Obtener una respuesta específica por ID
  async getRespuestaById(id: number) {
    return await this.prisma.respuesta.findUnique({
      where: { id },
    });
  }

  // Obtener todas las respuestas
  async getAllRespuestas() {
    return await this.prisma.respuesta.findMany({
      orderBy: {
        id: 'asc',
      },
    });
  }

  // Obtener respuestas por sección
  async getRespuestasBySeccion(seccion: string) {
    return await this.prisma.respuesta.findMany({
      where: {
        seccion,
      },
      orderBy: {
        id: 'asc',
      },
    });
  }

  // Eliminar todas las respuestas asociadas a una consulta específica
  async deleteRespuestasByConsultaId(consultaId: number) {
    return await this.prisma.respuesta.deleteMany({
      where: {
        consultaId: consultaId,
      },
    });
  }


  async getResumenPorSeccion() {
    // Filtrar respuestas por los tipos específicos
    const respuestas = await this.prisma.respuesta.findMany({
      where: {
        tipoRespuesta: {
          in: ['2', '4', '7', '11', '13']
        }
      },
      select: {
        id: true,
        pregunta: true,
        respuesta: true,
        tipoRespuesta: true,
        seccion: true,
        consultaId: true
      }
    });

    // Mapeo de tipoRespuesta a secciones específicas
    const seccionesMap: Record<string, string> = {
      '2': 'Tos y Flema',
      '7': 'Síntomas Generales',
      '4': 'Dificultad Respiratoria',
      '13': 'Factores de Riesgo',
      '11': 'Otros Indicadores'
    };

    // Crear el objeto de resumen con la estructura solicitada
    const resumenRelevante: Record<string, {
      pregunta: string;
      tipoRespuesta: string;
      respuesta: string;
    }> = {};

    // Procesar cada respuesta
    respuestas.forEach(respuesta => {
      const seccion = seccionesMap[respuesta.tipoRespuesta] || 'Otra sección';
      
      resumenRelevante[seccion] = {
        pregunta: respuesta.pregunta,
        tipoRespuesta: respuesta.tipoRespuesta,
        respuesta: respuesta.respuesta
      };
    });

    // Retornar el objeto con la estructura solicitada
    return {
      resumenRelevante
    };
  }

  // Obtener respuestas de tipo 2 con la fecha de la consulta
  async getRespuestasTipo2ConFecha() {
    return await this.prisma.respuesta.findMany({
      where: {
        tipoRespuesta: '2',
      },
      select: {
        id: true,
        pregunta: true,
        respuesta: true,
        detalles: true,
        tipoRespuesta: true,
        seccion: true,
        consultaId: true,
        consulta: {
          select: {
            fecha: true
          }
        }
      },
      orderBy: {
        consulta: {
          fecha: 'desc'
        }
      }
    });
  }

  // Obtener respuestas de tipo 7 con la fecha de la consulta
  async getRespuestasTipo7ConFecha() {
    return await this.prisma.respuesta.findMany({
      where: {
        tipoRespuesta: '7',
      },
      select: {
        id: true,
        pregunta: true,
        respuesta: true,
        detalles: true,
        tipoRespuesta: true,
        seccion: true,
        consultaId: true,
        consulta: {
          select: {
            fecha: true
          }
        }
      },
      orderBy: {
        consulta: {
          fecha: 'desc'
        }
      }
    });
  }

  // Obtener respuestas de tipo 4 con la fecha de la consulta
  async getRespuestasTipo4ConFecha() {
    return await this.prisma.respuesta.findMany({
      where: {
        tipoRespuesta: '4',
      },
      select: {
        id: true,
        pregunta: true,
        respuesta: true,
        detalles: true,
        tipoRespuesta: true,
        seccion: true,
        consultaId: true,
        consulta: {
          select: {
            fecha: true
          }
        }
      },
      orderBy: {
        consulta: {
          fecha: 'desc'
        }
      }
    });
  }

  // Obtener respuestas de tipo 11 con la fecha de la consulta
  async getRespuestasTipo11ConFecha() {
    return await this.prisma.respuesta.findMany({
      where: {
        tipoRespuesta: '11',
      },
      select: {
        id: true,
        pregunta: true,
        respuesta: true,
        detalles: true,
        tipoRespuesta: true,
        seccion: true,
        consultaId: true,
        consulta: {
          select: {
            fecha: true
          }
        }
      },
      orderBy: {
        consulta: {
          fecha: 'desc'
        }
      }
    });
  }

  async getResumenPorSintomas() {
    const respuestas = await this.prisma.respuesta.findMany({
      where: {
        detalles: {
          not: null,
        },
      },
      select: {
        pregunta: true,
        detalles: true,
        consultaId: true,
        seccion: true,
        tipoRespuesta: true, // <--- añadimos este campo
      },
    });
  
    type ResumenDetalle = {
      tipoRespuesta: string;
      seccion: string;
      conteos: Record<string, number>;
    };
  
    const resumen: Record<string, ResumenDetalle> = {};
    const consultaIds = new Set<number>();
  
    for (const r of respuestas) {
      const pregunta = r.pregunta;
      const detalle = r.detalles?.toLowerCase().trim();
      const consultaId = r.consultaId;
      const tipoRespuesta = r.tipoRespuesta;
      const seccion = r.seccion ?? 'Sin sección';
  
      if (!detalle) continue;
  
      // Si la pregunta no existe en el resumen, inicialízala
      if (!resumen[pregunta]) {
        resumen[pregunta] = {
          tipoRespuesta,
          seccion,
          conteos: {},
        };
      }
  
      // Aumenta el contador del detalle
      resumen[pregunta].conteos[detalle] = (resumen[pregunta].conteos[detalle] || 0) + 1;
  
      // Guarda los IDs únicos de consulta
      consultaIds.add(consultaId);
    }
  
    return {
      totalPersonas: consultaIds.size,
      resumenPorSintoma: resumen,
    };
  
  
  }



}
