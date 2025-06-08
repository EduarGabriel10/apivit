import { Module } from '@nestjs/common';
import { SlotcitasService } from './slotcitas.service';
import { SlotcitasController } from './slotcitas.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [SlotcitasController],
  providers: [SlotcitasService],
  exports: [SlotcitasService],
})
export class SlotcitasModule {}
