import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

interface Resena {
  comentario?: string;
  calificacion: number;
  usuarioId: number;
  fecha?: Date;
}

@Injectable()
export class ResenaService {
  constructor(private prisma: PrismaService) {}

  // Crear una nueva reseña
  async createResena(resena: Resena) {
    const nuevaResena = await this.prisma.resena.create({
      data: {
        comentario: resena.comentario,
        calificacion: resena.calificacion,
        usuarioId: resena.usuarioId,
        fecha: resena.fecha || new Date(),
      },
    });

    return {
      message: 'Reseña creada correctamente',
      resena: nuevaResena,
    };
  }

  // Obtener todas las reseñas
  async getResenas() {
    const resenas = await this.prisma.resena.findMany({
      include: {
        usuario: true,
      },
      orderBy: {
        fecha: 'desc',
      },
    });

    return {
      message: 'Reseñas obtenidas correctamente',
      resenas,
    };
  }

  // Obtener reseñas por ID de usuario
  async getResenasByUsuario(usuarioId: number) {
    const resenas = await this.prisma.resena.findMany({
      where: { usuarioId },
      orderBy: {
        fecha: 'desc',
      },
    });

    return {
      message: 'Reseñas del usuario obtenidas correctamente',
      resenas,
    };
  }

  // Actualizar reseña
  async updateResena(id: number, data: Partial<Resena>) {
    const resenaActualizada = await this.prisma.resena.update({
      where: { id },
      data,
    });

    return {
      message: 'Reseña actualizada correctamente',
      resena: resenaActualizada,
    };
  }

  // Eliminar reseña
  async deleteResena(id: number) {
    const resenaEliminada = await this.prisma.resena.delete({
      where: { id },
    });

    return {
      message: 'Reseña eliminada correctamente',
      resena: resenaEliminada,
    };
  }
}
