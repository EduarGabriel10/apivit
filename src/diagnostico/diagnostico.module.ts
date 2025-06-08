import { Module } from '@nestjs/common';
import { DiagnosticoService } from './diagnostico.service';
import { DiagnosticoController } from './diagnostico.controller';
import { PrismaModule } from 'src/prisma/prisma.module';


@Module({
  controllers: [DiagnosticoController],
  providers: [DiagnosticoService],
  imports: [PrismaModule],
})
export class DiagnosticoModule {}
