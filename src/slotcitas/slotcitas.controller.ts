import { Controller, Get, Post, Body, Param, Query, ParseIntPipe, UsePipes, ValidationPipe } from '@nestjs/common';
import { SlotcitasService } from './slotcitas.service';
import { BookSlotDto } from './dto/book-slot.dto';

@Controller('slotcitas')
@UsePipes(new ValidationPipe({
  whitelist: true,
  forbidNonWhitelisted: true,
  transform: true,
}))
export class SlotcitasController {
  constructor(private readonly slotcitasService: SlotcitasService) {}

  @Get('disponibles')
  async findAvailableSlots(
    @Query('medicoId') medicoId?: number,
    @Query('fechaInicio') fechaInicio?: Date,
    @Query('fechaFin') fechaFin?: Date,
  ) {
    return this.slotcitasService.findAvailableSlots(medicoId, fechaInicio, fechaFin);
  }

  @Post('reservar')
  async bookAppointment(@Body() bookSlotDto: BookSlotDto) {
    return this.slotcitasService.bookAppointment(bookSlotDto);
  }

  @Get('usuario/:usuarioId')
  async getAppointmentsByUser(@Param('usuarioId', ParseIntPipe) usuarioId: number) {
    return this.slotcitasService.getAppointmentsByUser(usuarioId);
  }
}
