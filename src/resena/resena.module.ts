import { Module } from '@nestjs/common';
import { ResenaService } from './resena.service';
import { ResenaController } from './resena.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [ResenaController],
  providers: [ResenaService],
  imports: [PrismaModule],
})
export class ResenaModule {}
