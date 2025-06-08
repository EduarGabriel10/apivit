import { IsInt, IsNotEmpty } from 'class-validator';

export class BookSlotDto {
  @IsInt()
  @IsNotEmpty({ message: 'El ID del usuario es requerido' })
  usuarioId: number;

  @IsInt()
  @IsNotEmpty({ message: 'El ID del slot es requerido' })
  slotId: number;
}
