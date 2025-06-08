import { ApiProperty } from '@nestjs/swagger';
import { SlotDto } from './slot.dto';

export class HorarioAtencionResponseDto {
  @ApiProperty({ description: 'ID del horario de atención', example: 1 })
  id: number;

  @ApiProperty({ description: 'Día de la semana', example: 'LUNES' })
  diaSemana: string;

  @ApiProperty({ description: 'Hora de inicio del horario', example: '2023-01-01T08:00:00.000Z' })
  horaInicio: Date;

  @ApiProperty({ description: 'Hora de fin del horario', example: '2023-01-01T10:00:00.000Z' })
  horaFin: Date;

  @ApiProperty({ description: 'Duración de cada cita en minutos', example: 30 })
  duracionCita: number;

  @ApiProperty({ description: 'Indica si el horario está activo', example: true })
  activo: boolean;

  @ApiProperty({ description: 'ID del médico', example: 1 })
  medicoId: number;

  @ApiProperty({ type: [SlotDto], description: 'Slots de citas generados' })
  slots: SlotDto[];
}
