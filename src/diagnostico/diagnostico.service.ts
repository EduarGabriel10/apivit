import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

interface DiagnosticoInput {
  diagnostico: string;
  recomendaciones: string;
  comentarios?: string;
  gravedad?: 'BAJA' | 'MEDIA' | 'ALTA' | 'CRITICA';
  medicoId: number;
  consultaId: number;
}

@Injectable()
export class DiagnosticoService {
  constructor(private prisma: PrismaService) {}

  // Crear un nuevo diagnóstico (uno por consulta)
  async createDiagnostico(data: DiagnosticoInput) {
    // Validar que la consulta exista y no tenga diagnóstico previo
    const consulta = await this.prisma.consulta.findUnique({
      where: { id: data.consultaId },
    });

    if (!consulta) {
      throw new NotFoundException('Consulta no encontrada');
    }

    const existeDiagnostico = await this.prisma.diagnosticoMedico.findUnique({
      where: { consultaId: data.consultaId },
    });

    if (existeDiagnostico) {
      throw new BadRequestException('La consulta ya tiene un diagnóstico asignado');
    }

    const diagnostico = await this.prisma.diagnosticoMedico.create({
      data: {
        diagnostico: data.diagnostico,
        recomendaciones: data.recomendaciones,
        comentarios: data.comentarios,
        gravedad: data.gravedad || 'MEDIA',
        medicoId: data.medicoId,
        consultaId: data.consultaId,
      },
    });

    // Cambiar estado de la consulta
    await this.prisma.consulta.update({
      where: { id: data.consultaId },
      data: { estado: 'DIAGNOSTICADA' },
    });

    return {
      message: 'Diagnóstico creado correctamente',
      diagnostico,
    };
  }

  // Obtener todos los diagnósticos
  async getDiagnosticos() {
    const diagnosticos = await this.prisma.diagnosticoMedico.findMany({
      include: {
        medico: true,
        consulta: true,
      },
      orderBy: {
        fechaDiagnostico: 'desc',
      },
    });

    return {
      message: 'Diagnósticos obtenidos correctamente',
      diagnosticos,
    };
  }

  // Obtener diagnóstico por ID
  async getDiagnosticoById(id: number) {
    const diagnostico = await this.prisma.diagnosticoMedico.findUnique({
      where: { id },
      include: {
        medico: true,
        consulta: true,
      },
    });

    if (!diagnostico) {
      throw new NotFoundException('Diagnóstico no encontrado');
    }

    return {
      message: 'Diagnóstico encontrado',
      diagnostico,
    };
  }

  // Actualizar diagnóstico (opcional)
  async updateDiagnostico(id: number, data: Partial<DiagnosticoInput>) {
    const existe = await this.prisma.diagnosticoMedico.findUnique({ where: { id } });
    if (!existe) {
      throw new NotFoundException('Diagnóstico no encontrado');
    }

    const actualizado = await this.prisma.diagnosticoMedico.update({
      where: { id },
      data,
    });

    return {
      message: 'Diagnóstico actualizado correctamente',
      diagnostico: actualizado,
    };
  }

  // Eliminar diagnóstico (rara vez necesario)
  async deleteDiagnostico(id: number) {
    const existe = await this.prisma.diagnosticoMedico.findUnique({ where: { id } });
    if (!existe) {
      throw new NotFoundException('Diagnóstico no encontrado');
    }

    const eliminado = await this.prisma.diagnosticoMedico.delete({ where: { id } });

    // Cambiar estado de la consulta de vuelta a EN_REVISION
    await this.prisma.consulta.update({
      where: { id: eliminado.consultaId },
      data: { estado: 'EN_REVISION' },
    });

    return {
      message: 'Diagnóstico eliminado correctamente',
      diagnostico: eliminado,
    };
  }
}
