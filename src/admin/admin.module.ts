import { Module } from '@nestjs/common';
import { AdminController } from '../admin/admin.controller';
import { AdminService } from '../admin/admin.service';
import { ConsultasModule } from '../consultas/consultas.module';
import { RespuestasModule } from '../respuestas/respuestas.module';
import { DiagnosticoModule } from '../diagnostico/diagnostico.module';
import { MedicoModule } from '../medico/medico.module';
import { ResenaModule } from '../resena/resena.module';
import { UsuarioModule } from '../usuario/usuario.module';

@Module({
  imports: [
    ConsultasModule,
    RespuestasModule,
    DiagnosticoModule,
    MedicoModule,
    ResenaModule,
    UsuarioModule,
  ],
  controllers: [AdminController],
  providers: [AdminService]
})
export class AdminModule {}
