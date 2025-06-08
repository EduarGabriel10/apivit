import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  Patch,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { DiagnosticoService } from './diagnostico.service';

@Controller('diagnostico')
export class DiagnosticoController {
  constructor(private readonly diagnosticoService: DiagnosticoService) {}

  // Crear diagnóstico
  @Post()
  create(@Body() body: any) {
    return this.diagnosticoService.createDiagnostico(body);
  }

  // Obtener todos los diagnósticos
  @Get()
  findAll() {
    return this.diagnosticoService.getDiagnosticos();
  }

  // Obtener un diagnóstico por ID
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.diagnosticoService.getDiagnosticoById(id);
  }

  // Actualizar un diagnóstico
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() body: any) {
    return this.diagnosticoService.updateDiagnostico(id, body);
  }

  // Eliminar un diagnóstico
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.diagnosticoService.deleteDiagnostico(id);
  }
}
