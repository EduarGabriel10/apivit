import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Patch,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';

interface UpdateMedicoDto {
  nombre?: string;
  telefono?: string;
  contrasena?: string;
  especialidad?: string;
}


import { MedicoService } from './medico.service';

@Controller('medico')
export class MedicoController {
  constructor(private readonly medicoService: MedicoService) {}

  // Crear médico
  @Post()
  create(@Body() body: any) {
    return this.medicoService.createMedico(body);
  }

  // Obtener todos los médicos
  @Get()
  findAll() {
    return this.medicoService.getMedicos();
  }

  // Obtener un médico por ID
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.medicoService.getMedicoById(id);
  }

  // Actualizar un médico
  @Post('update')
  async updateMedico(@Body() medico: any) {
    return await this.medicoService.updateMedico(medico);
  }

  // Eliminar un médico
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.medicoService.deleteMedico(id);
  }

  // Login del médico
  @Post('login')
  login(@Body() body: any) {
    return this.medicoService.loginMedico(body.email, body.contrasena);
  }

  @Put('actualizar/:id')
  async actualizarMedico(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateMedicoDto,
  ) {
    return this.medicoService.updateMedicoPorId({ id, ...body });
  }

}
