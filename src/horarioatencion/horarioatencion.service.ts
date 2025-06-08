import { Injectable, NotFoundException, Logger, Inject, forwardRef } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateHorarioAtencionDto } from 'src/horarioatencion/dto/create-horario-atencion.dto';
import { UpdateHorarioAtencionDto } from 'src/horarioatencion/dto/update-horario-atencion.dto';
import { HorarioAtencionResponseDto } from './dto/horario-atencion-response.dto';
import { SlotDto } from './dto/slot.dto';
import { SlotGenerator } from './helpers/slot-generator.helper';

@Injectable()
export class HorarioatencionService {
  private readonly logger = new Logger(HorarioatencionService.name);
  private slotGenerator: SlotGenerator;

  constructor(
    private prisma: PrismaService,
  ) {
    this.slotGenerator = new SlotGenerator(prisma);
  }

  async create(createHorarioAtencionDto: CreateHorarioAtencionDto) {
    // Validar que no exista un horario con el mismo día y rango de horas para el médico
    const horarioExistente = await this.prisma.horarioAtencion.findFirst({
      where: {
        medicoId: createHorarioAtencionDto.medicoId,
        diaSemana: createHorarioAtencionDto.diaSemana.toUpperCase(),
        activo: true,
        OR: [
          {
            // Caso 1: El nuevo horario empieza dentro de un horario existente
            horaInicio: { lte: new Date(createHorarioAtencionDto.horaInicio) },
            horaFin: { gt: new Date(createHorarioAtencionDto.horaInicio) },
          },
          {
            // Caso 2: El nuevo horario termina dentro de un horario existente
            horaInicio: { lt: new Date(createHorarioAtencionDto.horaFin) },
            horaFin: { gte: new Date(createHorarioAtencionDto.horaFin) },
          },
          {
            // Caso 3: El nuevo horario contiene completamente a un horario existente
            horaInicio: { gte: new Date(createHorarioAtencionDto.horaInicio) },
            horaFin: { lte: new Date(createHorarioAtencionDto.horaFin) },
          },
        ],
      },
    });

    if (horarioExistente) {
      throw new Error('Ya existe un horario de atención que se superpone con el rango de horas especificado');
    }

    // Crear el horario de atención
    const horario = await this.prisma.horarioAtencion.create({
      data: {
        diaSemana: createHorarioAtencionDto.diaSemana.toUpperCase(),
        horaInicio: new Date(createHorarioAtencionDto.horaInicio),
        horaFin: new Date(createHorarioAtencionDto.horaFin),
        duracionCita: createHorarioAtencionDto.duracionCita || 30,
        activo: createHorarioAtencionDto.activo !== undefined ? createHorarioAtencionDto.activo : true,
        medicoId: createHorarioAtencionDto.medicoId,
      },
      include: {
        slots: true,
      },
    });

    // Generar los slots de citas
    await this.slotGenerator.generateSlots(horario);

    // Obtener el horario con los slots generados
    return this.findOne(horario.id);
  }

  async findAll() {
    const horarios = await this.prisma.horarioAtencion.findMany({
      include: {
        medico: {
          select: {
            id: true,
            nombre: true,
            especialidad: true,
          },
        },
        slots: {
          where: { disponible: true },
          orderBy: { horaInicio: 'asc' },
        },
      },
      orderBy: [
        { diaSemana: 'asc' },
        { horaInicio: 'asc' },
      ],
    });

    return horarios.map(horario => this.mapToDto(horario));
  }

  async findOne(id: number) {
    const horario = await this.prisma.horarioAtencion.findUnique({
      where: { id },
      include: {
        medico: {
          select: {
            id: true,
            nombre: true,
            especialidad: true,
          },
        },
        slots: {
          orderBy: { horaInicio: 'asc' },
        },
      },
    });

    if (!horario) {
      throw new NotFoundException(`Horario de atención con ID ${id} no encontrado`);
    }

    return this.mapToDto(horario);
  }

  async update(id: number, updateHorarioAtencionDto: UpdateHorarioAtencionDto) {
    const horario = await this.prisma.horarioAtencion.findUnique({
      where: { id },
      include: { slots: true }
    });

    if (!horario) {
      throw new NotFoundException(`Horario de atención con ID ${id} no encontrado`);
    }

    // Preparar datos para actualización
    const updateData: any = {
      diaSemana: updateHorarioAtencionDto.diaSemana ? 
        updateHorarioAtencionDto.diaSemana.toUpperCase() : undefined,
      horaInicio: updateHorarioAtencionDto.horaInicio ? 
        new Date(updateHorarioAtencionDto.horaInicio) : undefined,
      horaFin: updateHorarioAtencionDto.horaFin ? 
        new Date(updateHorarioAtencionDto.horaFin) : undefined,
      duracionCita: updateHorarioAtencionDto.duracionCita,
      activo: updateHorarioAtencionDto.activo,
    };

    // Actualizar el horario
    const updatedHorario = await this.prisma.horarioAtencion.update({
      where: { id },
      data: updateData,
      include: { slots: true }
    });

    // Si se modificó el horario o la duración, regenerar los slots
    if (updateHorarioAtencionDto.horaInicio || 
        updateHorarioAtencionDto.horaFin || 
        updateHorarioAtencionDto.duracionCita) {
      await this.slotGenerator.generateSlots(updatedHorario);
    }

    return this.findOne(id);
  }

  async remove(id: number) {
    const horario = await this.prisma.horarioAtencion.findUnique({
      where: { id },
      include: { slots: true }
    });

    if (!horario) {
      throw new NotFoundException(`Horario de atención con ID ${id} no encontrado`);
    }

    // Verificar si hay citas programadas en este horario
    const citas = await this.prisma.cita.findMany({
      where: { 
        slotId: { in: horario.slots.map(s => s.id) },
        estado: { in: ['PENDIENTE', 'ACEPTADA'] }
      }
    });

    if (citas.length > 0) {
      throw new Error('No se puede eliminar el horario porque tiene citas programadas');
    }

    // Eliminar los slots primero (por la relación de clave foránea)
    await this.prisma.slot.deleteMany({
      where: { horarioId: id }
    });

    // Luego eliminar el horario
    return this.prisma.horarioAtencion.delete({
      where: { id },
    });
  }

  async findByMedico(medicoId: number) {
    const horarios = await this.prisma.horarioAtencion.findMany({
      where: { 
        medicoId,
        activo: true 
      },
      include: {
        slots: {
          where: { disponible: true },
          orderBy: { horaInicio: 'asc' },
        },
      },
      orderBy: [
        { diaSemana: 'asc' },
        { horaInicio: 'asc' },
      ],
    });

    return horarios.map(horario => this.mapToDto(horario));
  }

  async getAvailableSlots(medicoId: number, fecha: Date) {
    // Obtener el día de la semana (0 = Domingo, 1 = Lunes, ..., 6 = Sábado)
    const diasSemana = ['DOMINGO', 'LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO'];
    const diaSemana = diasSemana[fecha.getDay()];

    // Obtener horarios disponibles para el médico en ese día
    const horarios = await this.prisma.horarioAtencion.findMany({
      where: { 
        medicoId,
        diaSemana,
        activo: true,
        horaInicio: { 
          lte: new Date(fecha.setHours(23, 59, 59, 999)) 
        },
        horaFin: { 
          gte: new Date(fecha.setHours(0, 0, 0, 0)) 
        },
      },
      include: {
        slots: {
          where: { 
            disponible: true,
            horaInicio: { 
              gte: new Date(fecha.setHours(0, 0, 0, 0)),
              lte: new Date(fecha.setHours(23, 59, 59, 999))
            },
            citas: {
              none: {}
            }
          },
          orderBy: { horaInicio: 'asc' },
        },
      },
    });

    // Aplanar la lista de slots
    const slotsDisponibles = horarios.flatMap(horario => 
      horario.slots.map(slot => ({
        id: slot.id,
        horaInicio: slot.horaInicio,
        horaFin: slot.horaFin,
        horarioId: horario.id,
        medicoId: horario.medicoId,
      }))
    );

    return slotsDisponibles;
  }

  /**
   * Marca un slot como no disponible (cuando se agenda una cita)
   * @param slotId ID del slot a marcar como ocupado
   */
  async ocuparSlot(slotId: number): Promise<void> {
    await this.prisma.slot.update({
      where: { id: slotId },
      data: { disponible: false }
    });
  }

  /**
   * Marca un slot como disponible (cuando se cancela una cita)
   * @param slotId ID del slot a marcar como disponible
   */
  async liberarSlot(slotId: number): Promise<void> {
    await this.prisma.slot.update({
      where: { id: slotId },
      data: { disponible: true }
    });
  }

  /**
   * Mapea un horario de atención a su DTO de respuesta
   * @param horario Horario de atención
   * @returns DTO de respuesta del horario de atención
   */
  private mapToDto(horario: any): HorarioAtencionResponseDto {
    return {
      id: horario.id,
      diaSemana: horario.diaSemana,
      horaInicio: horario.horaInicio,
      horaFin: horario.horaFin,
      duracionCita: horario.duracionCita || 30,
      activo: horario.activo,
      medicoId: horario.medicoId,
      slots: (horario.slots || []).map(slot => ({
        id: slot.id,
        horaInicio: slot.horaInicio,
        horaFin: slot.horaFin,
        disponible: slot.disponible,
        horarioId: slot.horarioId,
      })),
    };
  }
}
