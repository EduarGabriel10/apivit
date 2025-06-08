import { Module } from '@nestjs/common';
import { MedicoService } from './medico.service';
import { MedicoController } from './medico.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';


@Module({
  controllers: [MedicoController],
  providers: [MedicoService],
  imports: [PrismaModule,
    JwtModule.register({
      secret: 'bXljb3BsdWRlX3NlY3JldF9rZXkzMjAxMw==', // Define tu clave secreta
      signOptions: { expiresIn: '1h' }, // Opcional, define el tiempo de expiración del token
    }),
  ],
  exports: [MedicoService], // Exporta MedicoService para usarlo en otros módulos

})
export class MedicoModule {}
