import { ApiProperty } from '@nestjs/swagger';

export class SlotDto {
  @ApiProperty({ description: 'ID del slot', example: 1 })
  id: number;

  @ApiProperty({ description: 'Hora de inicio del slot', example: '2023-01-01T08:00:00.000Z' })
  horaInicio: Date;

  @ApiProperty({ description: 'Hora de fin del slot', example: '2023-01-01T08:30:00.000Z' })
  horaFin: Date;

  @ApiProperty({ description: 'Indica si el slot está disponible para reservar', example: true })
  disponible: boolean;

  @ApiProperty({ description: 'ID del horario de atención al que pertenece el slot', example: 1 })
  horarioId: number;
}
