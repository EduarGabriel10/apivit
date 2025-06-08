import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, Query } from '@nestjs/common';
import { HorarioatencionService } from './horarioatencion.service';
import { CreateHorarioAtencionDto } from './dto/create-horario-atencion.dto';
import { UpdateHorarioAtencionDto } from './dto/update-horario-atencion.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';

@ApiTags('horarios-atencion')
@Controller('horarios-atencion')
export class HorarioatencionController {
  constructor(private readonly horarioAtencionService: HorarioatencionService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo horario de atención' })
  @ApiResponse({ status: 201, description: 'Horario creado exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos de entrada inválidos' })
  create(@Body() createHorarioAtencionDto: CreateHorarioAtencionDto) {
    return this.horarioAtencionService.create(createHorarioAtencionDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los horarios de atención' })
  @ApiResponse({ status: 200, description: 'Lista de horarios obtenida exitosamente' })
  findAll() {
    return this.horarioAtencionService.findAll();
  }

  @Get('medico/:medicoId')
  @ApiOperation({ summary: 'Obtener horarios por médico' })
  @ApiParam({ name: 'medicoId', description: 'ID del médico' })
  @ApiResponse({ status: 200, description: 'Lista de horarios del médico' })
  @ApiResponse({ status: 404, description: 'Médico no encontrado' })
  findByMedico(@Param('medicoId', ParseIntPipe) medicoId: number) {
    return this.horarioAtencionService.findByMedico(medicoId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un horario por ID' })
  @ApiParam({ name: 'id', description: 'ID del horario' })
  @ApiResponse({ status: 200, description: 'Horario encontrado' })
  @ApiResponse({ status: 404, description: 'Horario no encontrado' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.horarioAtencionService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un horario existente' })
  @ApiParam({ name: 'id', description: 'ID del horario a actualizar' })
  @ApiResponse({ status: 200, description: 'Horario actualizado exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos de entrada inválidos' })
  @ApiResponse({ status: 404, description: 'Horario no encontrado' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateHorarioAtencionDto: UpdateHorarioAtencionDto,
  ) {
    return this.horarioAtencionService.update(id, updateHorarioAtencionDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un horario' })
  @ApiParam({ name: 'id', description: 'ID del horario a eliminar' })
  @ApiResponse({ status: 200, description: 'Horario eliminado exitosamente' })
  @ApiResponse({ status: 404, description: 'Horario no encontrado' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.horarioAtencionService.remove(id);
  }
}
