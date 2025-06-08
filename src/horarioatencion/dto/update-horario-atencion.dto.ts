import { PartialType } from '@nestjs/mapped-types';
import { CreateHorarioAtencionDto } from './create-horario-atencion.dto';
import { IsOptional, IsDateString, IsString, IsInt, Min, Max, IsBoolean } from 'class-validator';

export class UpdateHorarioAtencionDto extends PartialType(CreateHorarioAtencionDto) {
  @IsString()
  @IsOptional()
  diaSemana?: string;

  @IsDateString({}, { message: 'La hora de inicio debe ser una fecha y hora válida' })
  @IsOptional()
  horaInicio?: string;

  @IsDateString({}, { message: 'La hora de fin debe ser una fecha y hora válida' })
  @IsOptional()
  horaFin?: string;
  
  @IsInt()
  @Min(5, { message: 'La duración mínima de la cita es de 5 minutos' })
  @Max(240, { message: 'La duración máxima de la cita es de 240 minutos (4 horas)' })
  @IsOptional()
  duracionCita?: number;
  
  @IsBoolean()
  @IsOptional()
  activo?: boolean;
}
