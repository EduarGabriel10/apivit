import { HorarioAtencion, PrismaClient } from '@prisma/client';

export class SlotGenerator {
  constructor(private prisma: PrismaClient) {}

  /**
   * Genera los slots de citas para un horario de atención
   * @param horario Horario de atención para el cual generar los slots
   * @returns Promesa que resuelve cuando se han creado los slots
   */
  async generateSlots(horario: HorarioAtencion): Promise<void> {
    const { id: horarioId, horaInicio, horaFin, duracionCita = 30 } = horario;
    
    // Eliminar slots existentes para este horario
    await this.prisma.slot.deleteMany({
      where: { horarioId }
    });

    // Generar los nuevos slots
    const slots = this.calculateSlots(horaInicio, horaFin, duracionCita);
    
    // Crear los slots en la base de datos
    if (slots.length > 0) {
      await this.prisma.slot.createMany({
        data: slots.map(slot => ({
          ...slot,
          horarioId,
          disponible: true
        }))
      });
    }
  }

  /**
   * Calcula los slots de tiempo basados en un rango y duración
   * @param startTime Hora de inicio
   * @param endTime Hora de fin
   * @param durationMinutes Duración de cada slot en minutos
   * @returns Array de objetos con horaInicio y horaFin para cada slot
   */
  private calculateSlots(startTime: Date, endTime: Date, durationMinutes: number): Array<{ horaInicio: Date; horaFin: Date }> {
    const slots: Array<{ horaInicio: Date; horaFin: Date }> = [];
    const durationMs = durationMinutes * 60 * 1000; // Convertir a milisegundos
    
    let currentSlotStart = new Date(startTime);
    
    // Mientras el inicio del slot actual + duración sea menor o igual al final
    while (currentSlotStart.getTime() + durationMs <= endTime.getTime()) {
      const currentSlotEnd = new Date(currentSlotStart.getTime() + durationMs);
      
      slots.push({
        horaInicio: new Date(currentSlotStart),
        horaFin: currentSlotEnd
      });
      
      // Mover al inicio del siguiente slot
      currentSlotStart = currentSlotEnd;
    }
    
    return slots;
  }

  /**
   * Actualiza la disponibilidad de un slot específico
   * @param slotId ID del slot a actualizar
   * @param disponible Nuevo estado de disponibilidad
   */
  async updateSlotAvailability(slotId: number, disponible: boolean): Promise<void> {
    await this.prisma.slot.update({
      where: { id: slotId },
      data: { disponible }
    });
  }

  /**
   * Obtiene los slots disponibles para un horario específico
   * @param horarioId ID del horario de atención
   * @returns Promesa con los slots disponibles
   */
  async getAvailableSlots(horarioId: number) {
    return this.prisma.slot.findMany({
      where: {
        horarioId,
        disponible: true,
        citas: {
          none: {}
        }
      },
      orderBy: {
        horaInicio: 'asc'
      }
    });
  }
}
