import { IsDateString, IsInt, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';
import { EstadoCita } from '@prisma/client';

export class CreateCitaDto {
  @IsDateString({}, { message: 'La fecha y hora deben ser una fecha válida' })
  @IsNotEmpty({ message: 'La fecha y hora son requeridas' })
  fechaHora: string;

  @IsInt()
  @IsNotEmpty({ message: 'El ID del usuario es requerido' })
  usuarioId: number;

  @IsInt()
  @IsNotEmpty({ message: 'El ID del médico es requerido' })
  medicoId: number;

  @IsInt()
  @IsOptional()
  horarioId?: number;

  @IsEnum(EstadoCita, { message: 'Estado de cita no válido' })
  @IsOptional()
  estado?: EstadoCita;

  @IsInt()
  @IsOptional()
  slotId?: number;
}
