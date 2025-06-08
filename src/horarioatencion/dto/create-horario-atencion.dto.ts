import { IsString, IsDateString, IsInt, Min, Max, IsNotEmpty, IsOptional, IsBoolean } from 'class-validator';

export class CreateHorarioAtencionDto {
  @IsString()
  @IsNotEmpty({ message: 'El día de la semana es requerido' })
  diaSemana: string;

  @IsDateString({}, { message: 'La hora de inicio debe ser una fecha y hora válida' })
  @IsNotEmpty({ message: 'La hora de inicio es requerida' })
  horaInicio: string;

  @IsDateString({}, { message: 'La hora de fin debe ser una fecha y hora válida' })
  @IsNotEmpty({ message: 'La hora de fin es requerida' })
  horaFin: string;

  @IsInt()
  @Min(5, { message: 'La duración mínima de la cita es de 5 minutos' })
  @Max(240, { message: 'La duración máxima de la cita es de 240 minutos (4 horas)' })
  @IsOptional()
  duracionCita?: number;

  @IsBoolean()
  @IsOptional()
  activo?: boolean;

  @IsInt()
  @Min(1, { message: 'El ID del médico debe ser un número positivo' })
  @IsNotEmpty({ message: 'El ID del médico es requerido' })
  medicoId: number;
}
