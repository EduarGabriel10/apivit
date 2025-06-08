import { Injectable, NotFoundException, BadRequestException, Inject, forwardRef } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCitaDto } from './dto/create-cita.dto';
import { UpdateCitaDto } from './dto/update-cita.dto';
import { EstadoCita } from '@prisma/client';
import { HorarioatencionService } from '../horarioatencion/horarioatencion.service';

@Injectable()
export class CitaService {
  constructor(
    private prisma: PrismaService,
    @Inject(forwardRef(() => HorarioatencionService))
    private horarioAtencionService: HorarioatencionService
  ) {}

  async create(createCitaDto: CreateCitaDto) {
    // Verificar si el usuario existe
    const usuario = await this.prisma.usuario.findUnique({
      where: { id: createCitaDto.usuarioId },
    });

    if (!usuario) {
      throw new NotFoundException(`Usuario con ID ${createCitaDto.usuarioId} no encontrado`);
    }

    // Verificar si el médico existe
    const medico = await this.prisma.medico.findUnique({
      where: { id: createCitaDto.medicoId },
    });

    if (!medico) {
      throw new NotFoundException(`Médico con ID ${createCitaDto.medicoId} no encontrado`);
    }

    // Verificar que el slot existe y está disponible
    if (!createCitaDto.slotId) {
      throw new BadRequestException('Se requiere un slotId para agendar la cita');
    }

    const slot = await this.prisma.slot.findUnique({
      where: { id: createCitaDto.slotId },
      include: {
        horario: true,
        citas: {
          where: {
            estado: {
              in: [EstadoCita.PENDIENTE, EstadoCita.ACEPTADA]
            }
          }
        }
      }
    });

    if (!slot) {
      throw new NotFoundException(`Slot con ID ${createCitaDto.slotId} no encontrado`);
    }

    if (!slot.disponible || slot.citas.length > 0) {
      throw new BadRequestException('El slot seleccionado no está disponible');
    }

    // Verificar que el slot pertenece al médico
    if (slot.horario.medicoId !== createCitaDto.medicoId) {
      throw new BadRequestException('El slot no pertenece al médico especificado');
    }

    // Verificar que la fecha de la cita coincida con el slot
    const fechaCita = new Date(createCitaDto.fechaHora);
    if (fechaCita < slot.horaInicio || fechaCita >= slot.horaFin) {
      throw new BadRequestException('La fecha de la cita no coincide con el horario del slot');
    }

    // Crear la cita en una transacción para asegurar consistencia
    const [citaCreada] = await this.prisma.$transaction([
      this.prisma.cita.create({
        data: {
          fechaHora: new Date(createCitaDto.fechaHora),
          estado: createCitaDto.estado || EstadoCita.PENDIENTE,
          usuario: { connect: { id: createCitaDto.usuarioId } },
          medico: { connect: { id: createCitaDto.medicoId } },
          slot: { connect: { id: createCitaDto.slotId } },
        },
        include: {
          usuario: {
            select: {
              id: true,
              nombre: true,
              email: true,
            },
          },
          medico: {
            select: {
              id: true,
              nombre: true,
              especialidad: true,
            },
          },
          slot: {
            include: {
              horario: true
            }
          },
        },
      }),
      // Marcar el slot como ocupado
      this.prisma.slot.update({
        where: { id: createCitaDto.slotId },
        data: { disponible: false }
      })
    ]);

    return citaCreada;
  }

  async findAll() {
    return this.prisma.cita.findMany({
      include: {
        usuario: {
          select: {
            id: true,
            nombre: true,
            email: true,
          },
        },
        medico: {
          select: {
            id: true,
            nombre: true,
            especialidad: true,
          },
        },
        slot: {
          include: {
            horario: true
          }
        },
      },
      orderBy: {
        fechaHora: 'asc',
      },
    });
  }

  async findOne(id: number) {
    const cita = await this.prisma.cita.findUnique({
      where: { id },
      include: {
        usuario: {
          select: {
            id: true,
            nombre: true,
            email: true,
          },
        },
        medico: {
          select: {
            id: true,
            nombre: true,
            especialidad: true,
          },
        },
        slot: {
          include: {
            horario: true
          }
        },
      },
    });

    if (!cita) {
      throw new NotFoundException(`Cita con ID ${id} no encontrada`);
    }

    return cita;
  }

  async update(id: number, updateCitaDto: UpdateCitaDto) {
    // Verificar si la cita existe
    const cita = await this.prisma.cita.findUnique({ 
      where: { id },
      include: { 
        slot: true,
        medico: true 
      } 
    });

    if (!cita) {
      throw new NotFoundException(`Cita con ID ${id} no encontrada`);
    }

    // Verificar si el usuario existe si se está actualizando
    if (updateCitaDto.usuarioId) {
      const usuario = await this.prisma.usuario.findUnique({
        where: { id: updateCitaDto.usuarioId },
      });
      
      if (!usuario) {
        throw new NotFoundException(`Usuario con ID ${updateCitaDto.usuarioId} no encontrado`);
      }
    }

    // Si se está actualizando el slot, verificar que existe y está disponible
    if (updateCitaDto.slotId) {
      const newSlot = await this.prisma.slot.findUnique({
        where: { id: updateCitaDto.slotId },
        include: {
          horario: true,
          citas: {
            where: {
              estado: {
                in: [EstadoCita.PENDIENTE, EstadoCita.ACEPTADA]
              },
              id: { not: id } // Excluir la cita actual
            }
          }
        }
      });

      if (!newSlot) {
        throw new NotFoundException(`Slot con ID ${updateCitaDto.slotId} no encontrado`);
      }

      if (!newSlot.disponible || newSlot.citas.length > 0) {
        throw new BadRequestException('El slot seleccionado no está disponible');
      }
    }

    // Verificar que el slot pertenece al mismo médico si se está cambiando
    if (updateCitaDto.slotId && cita.slot?.horarioId) {
      const newSlot = await this.prisma.slot.findUnique({
        where: { id: updateCitaDto.slotId },
        include: { horario: true }
      });

      if (newSlot?.horario.medicoId !== cita.medicoId) {
        throw new BadRequestException('El nuevo slot debe pertenecer al mismo médico');
      }
    }

    // Guardar el ID del slot anterior para actualizar su disponibilidad
    const oldSlotId = cita.slotId;

    // Iniciar transacción para actualizar la cita y los slots
    const [citaActualizada] = await this.prisma.$transaction([
      // Actualizar la cita
      this.prisma.cita.update({
        where: { id },
        data: {
          ...(updateCitaDto.fechaHora && { fechaHora: new Date(updateCitaDto.fechaHora) }),
          ...(updateCitaDto.estado && { estado: updateCitaDto.estado }),
          ...(updateCitaDto.slotId && { 
            slot: { connect: { id: updateCitaDto.slotId } } 
          }),
        },
        include: {
          usuario: {
            select: {
              id: true,
              nombre: true,
              email: true,
            },
          },
          medico: {
            select: {
              id: true,
              nombre: true,
              especialidad: true,
            },
          },
          slot: {
            include: {
              horario: true
            }
          },
        },
      }),
      // Actualizar el slot anterior a disponible si existe
      ...(oldSlotId ? [this.prisma.slot.update({
        where: { id: oldSlotId },
        data: { disponible: true }
      })] : []),
      // Actualizar el nuevo slot a no disponible si se está cambiando
      ...(updateCitaDto.slotId ? [this.prisma.slot.update({
        where: { id: updateCitaDto.slotId },
        data: { disponible: false }
      })] : [])
    ]);

    return citaActualizada;
  }

  async remove(id: number) {
    const cita = await this.prisma.cita.findUnique({
      where: { id },
      include: { slot: true },
    });

    if (!cita) {
      throw new NotFoundException(`Cita con ID ${id} no encontrada`);
    }

    const slotId = cita.slotId;

    // Usar transacción para asegurar la consistencia
    await this.prisma.$transaction([
      // Eliminar la cita
      this.prisma.cita.delete({
        where: { id },
      }),
      // Marcar el slot como disponible si existe
      ...(slotId ? [this.prisma.slot.update({
        where: { id: slotId },
        data: { disponible: true }
      })] : [])
    ]);

    return { message: 'Cita eliminada correctamente' };
  }

  async findByUsuario(usuarioId: number) {
    // Verificar si el usuario existe
    const usuario = await this.prisma.usuario.findUnique({
      where: { id: usuarioId },
    });

    if (!usuario) {
      throw new NotFoundException(`Usuario con ID ${usuarioId} no encontrado`);
    }

    return this.prisma.cita.findMany({
      where: { usuarioId },
      include: {
        usuario: {
          select: {
            id: true,
            nombre: true,
            email: true,
          },
        },
        medico: {
          select: {
            id: true,
            nombre: true,
            especialidad: true,
          },
        },
        slot: {
          include: {
            horario: true
          }
        },
      },
      orderBy: {
        fechaHora: 'asc',
      },
    });
  }

  async findByMedico(medicoId: number) {
    // Verificar si el médico existe
    const medico = await this.prisma.medico.findUnique({
      where: { id: medicoId },
    });

    if (!medico) {
      throw new NotFoundException(`Médico con ID ${medicoId} no encontrado`);
    }

    return this.prisma.cita.findMany({
      where: { medicoId },
      include: {
        usuario: {
          select: {
            id: true,
            nombre: true,
            email: true,
          },
        },
        medico: {
          select: {
            id: true,
            nombre: true,
            especialidad: true,
          },
        },
        slot: {
          include: {
            horario: true
          }
        },
      },
      orderBy: {
        fechaHora: 'asc',
      },
    });
  }



  async updateEstado(id: number, estado: EstadoCita) {
    // Obtener la cita con el slot relacionado
    const cita = await this.prisma.cita.findUnique({ 
      where: { id },
      include: { slot: true }
    });
    
    if (!cita) {
      throw new NotFoundException('Cita no encontrada');
    }

    // Si la cita tiene un slot, manejamos la disponibilidad
    if (cita.slotId) {
      // Si el estado nuevo es CANCELADA o RECHAZADA, liberar el slot
      const cancelationStatuses: EstadoCita[] = [EstadoCita.CANCELADA, EstadoCita.RECHAZADA];
      const activeStatuses: EstadoCita[] = [EstadoCita.PENDIENTE, EstadoCita.ACEPTADA];
      
      if (cancelationStatuses.includes(estado)) {
        await this.prisma.slot.update({
          where: { id: cita.slotId },
          data: { disponible: true }
        });
      } 
      // Si el estado anterior era CANCELADA/RECHAZADA y el nuevo es PENDIENTE/ACEPTADA, ocupar el slot
      else if (activeStatuses.includes(estado) && 
              cancelationStatuses.includes(cita.estado)) {
        await this.prisma.slot.update({
          where: { id: cita.slotId },
          data: { disponible: false }
        });
      }
    }

    return this.prisma.cita.update({
      where: { id },
      data: { estado },
      include: {
        usuario: {
          select: {
            id: true,
            nombre: true,
            email: true,
          },
        },
        medico: {
          select: {
            id: true,
            nombre: true,
            especialidad: true,
          },
        },
        slot: {
          include: {
            horario: true
          }
        },
      },
    });
  }
  
}
