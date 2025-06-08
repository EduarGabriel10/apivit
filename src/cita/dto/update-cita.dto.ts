import { PartialType } from '@nestjs/mapped-types';
import { CreateCitaDto } from './create-cita.dto';
import { IsDateString, IsEnum, IsInt, IsOptional } from 'class-validator';
import { EstadoCita } from '@prisma/client';

export class UpdateCitaDto extends PartialType(CreateCitaDto) {
  @IsDateString({}, { message: 'La fecha y hora deben ser una fecha válida' })
  @IsOptional()
  fechaHora?: string;

  @IsInt()
  @IsOptional()
  usuarioId?: number;

  @IsInt()
  @IsOptional()
  medicoId?: number;

  @IsInt()
  @IsOptional()
  horarioId?: number;

  @IsEnum(EstadoCita, { message: 'Estado de cita no válido' })
  @IsOptional()
  estado?: EstadoCita;
}
