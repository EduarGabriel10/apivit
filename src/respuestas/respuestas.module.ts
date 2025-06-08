import { Module } from '@nestjs/common';
import { RespuestasService } from './respuestas.service';
import { RespuestasController } from './respuestas.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [RespuestasController],
  providers: [RespuestasService],
  imports: [PrismaModule],
  exports: [RespuestasService], // Export RespuestasService for use in other modules
})
export class RespuestasModule {}
