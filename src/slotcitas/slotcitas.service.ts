import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BookSlotDto } from './dto/book-slot.dto';

@Injectable()
export class SlotcitasService {
  constructor(private prisma: PrismaService) {}

  async findAvailableSlots(medicoId?: number, fechaInicio?: Date, fechaFin?: Date) {
    const where: any = {
      disponible: true,
    };

    // Filtrar por médico si se proporciona
    if (medicoId) {
      where.horario = {
        medicoId: Number(medicoId)
      };
    }

    // Filtrar por rango de fechas si se proporciona
    if (fechaInicio && fechaFin) {
      where.horaInicio = {
        gte: new Date(fechaInicio),
        lte: new Date(fechaFin)
      };
    } else if (fechaInicio) {
      // Si solo se proporciona fecha de inicio, buscar slots del día
      const startOfDay = new Date(fechaInicio);
      startOfDay.setHours(0, 0, 0, 0);
      
      const endOfDay = new Date(fechaInicio);
      endOfDay.setHours(23, 59, 59, 999);
      
      where.horaInicio = {
        gte: startOfDay,
        lte: endOfDay
      };
    }

    return this.prisma.slot.findMany({
      where,
      include: {
        horario: {
          include: {
            medico: {
              select: {
                id: true,
                nombre: true,
                especialidad: true
              }
            }
          }
        }
      },
      orderBy: {
        horaInicio: 'asc',
      },
    });
  }


  async bookAppointment(bookSlotDto: BookSlotDto) {
    const { usuarioId, slotId } = bookSlotDto;

    // Verificar si el usuario ya tiene una cita activa
    const existingAppointment = await this.prisma.cita.findFirst({
      where: {
        usuarioId: Number(usuarioId),
        estado: {
          in: ['PENDIENTE', 'ACEPTADA']
        }
      }
    });

    if (existingAppointment) {
      throw new ConflictException('Ya tienes una cita activa o pendiente');
    }

    // Verificar si el slot está disponible
    const slot = await this.prisma.slot.findUnique({
      where: { id: Number(slotId) },
      include: {
        horario: {
          include: {
            medico: true
          }
        }
      }
    });

    if (!slot) {
      throw new NotFoundException('El slot de cita no existe');
    }

    if (!slot.disponible) {
      throw new ConflictException('El slot de cita no está disponible');
    }

    // Iniciar transacción para asegurar consistencia
    return this.prisma.$transaction(async (prisma) => {
      // Crear la cita
      const cita = await prisma.cita.create({
        data: {
          fechaHora: slot.horaInicio,
          estado: 'PENDIENTE',
          usuarioId: Number(usuarioId),
          medicoId: slot.horario.medicoId,
          slotId: slot.id
        },
        include: {
          usuario: {
            select: {
              id: true,
              nombre: true,
              email: true
            }
          },
          medico: {
            select: {
              id: true,
              nombre: true,
              especialidad: true
            }
          },
          slot: true
        }
      });

      // Marcar el slot como no disponible
      await prisma.slot.update({
        where: { id: slot.id },
        data: { disponible: false }
      });

      return cita;
    });
  }


  async getAppointmentsByUser(usuarioId: number) {
    return this.prisma.cita.findMany({
      where: {
        usuarioId: Number(usuarioId),
      },
      include: {
        medico: {
          select: {
            id: true,
            nombre: true,
            especialidad: true
          }
        },
        slot: {
          select: {
            horaInicio: true,
            horaFin: true
          }
        }
      },
      orderBy: {
        fechaHora: 'desc',
      },
    });
  }
}
