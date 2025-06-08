import { Module } from '@nestjs/common';
import { CitaService } from './cita.service';
import { CitaController } from './cita.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { HorarioatencionModule } from '../horarioatencion/horarioatencion.module';

@Module({
  imports: [PrismaModule, HorarioatencionModule],
  controllers: [CitaController],
  providers: [CitaService],
  exports: [CitaService],
})
export class CitaModule {}
