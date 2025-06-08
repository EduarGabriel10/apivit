import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UsuarioModule } from './usuario/usuario.module';
import { AuthService } from './servicios/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { ConsultasModule } from './consultas/consultas.module';
import { RecomendacionesModule } from './recomendaciones/recomendaciones.module';
import { MedicamentosModule } from './medicamentos/medicamentos.module';
import { RespuestasModule } from './respuestas/respuestas.module';
import { ResenaModule } from './resena/resena.module';
import { MedicoModule } from './medico/medico.module';
import { DiagnosticoModule } from './diagnostico/diagnostico.module';
import { AdminModule } from './admin/admin.module';
import { HorarioatencionModule } from './horarioatencion/horarioatencion.module';
import { CitaModule } from './cita/cita.module';
import { SlotcitasModule } from './slotcitas/slotcitas.module';

@Module({
  imports: [
    PrismaModule, 
    UsuarioModule, 
    ConsultasModule, 
    RecomendacionesModule, 
    MedicamentosModule,
    RespuestasModule,
    ResenaModule,
    MedicoModule,
    DiagnosticoModule,
    JwtModule.register({
      secret: 'your-secret-key', // You should replace this with a secure secret in production
      signOptions: { expiresIn: '1d' },
    }),
    HorarioatencionModule,
    CitaModule,
    SlotcitasModule,
  ],
  controllers: [AppController],
  providers: [AppService, AuthService],
})
export class AppModule {}
