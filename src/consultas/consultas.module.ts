import { Module } from '@nestjs/common';
import { ConsultasService } from './consultas.service';
import { ConsultasController } from './consultas.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { RespuestasModule } from 'src/respuestas/respuestas.module';

@Module({
  controllers: [ConsultasController],
  providers: [ConsultasService],
  imports: [
    PrismaModule, // Importa el módulo de Prisma
    RespuestasModule, // Importa el módulo de Respuestas
    JwtModule.register({
      secret: 'bXljb3BsdWRlX3NlY3JldF9rZXkzMjAxMw==', // Define tu clave secreta
      signOptions: { expiresIn: '1h' }, // Opcional, define el tiempo de expiración del token
    }),
  ],
  exports: [ConsultasService], // Exporta ConsultasService para usarlo en otros módulos
})
export class ConsultasModule {}
