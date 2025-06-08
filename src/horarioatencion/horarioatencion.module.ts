import { Module } from '@nestjs/common';
import { HorarioatencionService } from './horarioatencion.service';
import { HorarioatencionController } from './horarioatencion.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [HorarioatencionController],
  providers: [HorarioatencionService, PrismaService],
  exports: [HorarioatencionService],
})
export class HorarioatencionModule {}
