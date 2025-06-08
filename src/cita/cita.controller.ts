import {Controller,Get,Post,Body,Patch,Param,Delete,ParseIntPipe, Query,} from '@nestjs/common';
import { CitaService } from './cita.service';
import { CreateCitaDto } from './dto/create-cita.dto';
import { UpdateCitaDto } from './dto/update-cita.dto';
import { EstadoCita } from '@prisma/client';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';

@ApiTags('citas')
@Controller('citas')
export class CitaController {
  constructor(private readonly citaService: CitaService) {}

  @Post()
  @ApiOperation({ summary: 'Crear una nueva cita' })
  @ApiResponse({ status: 201, description: 'Cita creada exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos de entrada inválidos' })
  @ApiResponse({ status: 404, description: 'Usuario o médico no encontrado' })
  create(@Body() createCitaDto: CreateCitaDto) {
    return this.citaService.create(createCitaDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las citas' })
  @ApiResponse({ status: 200, description: 'Lista de citas obtenida exitosamente' })
  findAll() {
    return this.citaService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una cita por ID' })
  @ApiParam({ name: 'id', description: 'ID de la cita' })
  @ApiResponse({ status: 200, description: 'Cita encontrada' })
  @ApiResponse({ status: 404, description: 'Cita no encontrada' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.citaService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar una cita existente' })
  @ApiParam({ name: 'id', description: 'ID de la cita a actualizar' })
  @ApiResponse({ status: 200, description: 'Cita actualizada exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos de entrada inválidos' })
  @ApiResponse({ status: 404, description: 'Cita no encontrada' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCitaDto: UpdateCitaDto,
  ) {
    return this.citaService.update(id, updateCitaDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar una cita' })
  @ApiParam({ name: 'id', description: 'ID de la cita a eliminar' })
  @ApiResponse({ status: 200, description: 'Cita eliminada exitosamente' })
  @ApiResponse({ status: 404, description: 'Cita no encontrada' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.citaService.remove(id);
  }

  @Get('usuario/:usuarioId')
  @ApiOperation({ summary: 'Obtener citas por usuario' })
  @ApiParam({ name: 'usuarioId', description: 'ID del usuario' })
  @ApiResponse({ status: 200, description: 'Lista de citas obtenida exitosamente' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  findByUsuario(@Param('usuarioId', ParseIntPipe) usuarioId: number) {
    return this.citaService.findByUsuario(usuarioId);
  }

  @Get('medico/:medicoId')
  @ApiOperation({ summary: 'Obtener citas por médico' })
  @ApiParam({ name: 'medicoId', description: 'ID del médico' })
  @ApiResponse({ status: 200, description: 'Lista de citas obtenida exitosamente' })
  @ApiResponse({ status: 404, description: 'Médico no encontrado' })
  findByMedico(@Param('medicoId', ParseIntPipe) medicoId: number) {
    return this.citaService.findByMedico(medicoId);
  }

  @Patch(':id/estado')
  updateEstado(
    @Param('id', ParseIntPipe) id: number,
    @Body('estado') estado: EstadoCita,
  ) {
    return this.citaService.updateEstado(id, estado);
  }
}
