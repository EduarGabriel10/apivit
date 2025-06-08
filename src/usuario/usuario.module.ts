import { Module } from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { UsuarioController } from './usuario.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  controllers: [UsuarioController],
  providers: [UsuarioService],
  imports: [
    PrismaModule, // Importa el módulo de Prisma
    JwtModule.register({
      secret: 'bXljb3BsdWRlX3NlY3JldF9rZXkzMjAxMw==', // Define tu clave secreta
      signOptions: { expiresIn: '1h' }, // Opcional, define el tiempo de expiración del token
    }),
  ],
  exports: [UsuarioService], // Exporta UsuarioService para usarlo en otros módulos
})
export class UsuarioModule {}
