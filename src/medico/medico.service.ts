import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt'; // <-- Importa JwtService

  interface UpdateMedicoDto {
  id: number;
  nombre?: string;
  telefono?: string;
  contrasena?: string;
  especialidad?: string;
}
interface Medico {
  email: string;
  contrasena: string;
  nombre: string;
  telefono?: string;
  especialidad: string;
}

@Injectable()
export class MedicoService {
  constructor(private prisma: PrismaService, private jwtService: JwtService) {} // <-- Inyecta JwtService

  // Crear un nuevo médico con contraseña encriptada
  async createMedico(medico: Medico) {
    const hashedPassword = await bcrypt.hash(medico.contrasena, 10);

    const nuevoMedico = await this.prisma.medico.create({
      data: {
        ...medico,
        contrasena: hashedPassword,
      },
    });

    return {
      message: 'Médico creado correctamente',
      medico: {
        ...nuevoMedico,
        contrasena: undefined,
      },
    };
  }

  // LOGIN del médico
  async loginMedico(email: string, contrasena: string) {
    const medico = await this.prisma.medico.findUnique({
      where: { email },
    });

    if (!medico) {
      throw new NotFoundException('Médico no encontrado');
    }

    const passwordValida = await bcrypt.compare(contrasena, medico.contrasena);
    if (!passwordValida) {
      throw new UnauthorizedException('Contraseña incorrecta');
    }

    const payload = { email: medico.email, id: medico.id };
    const token = this.jwtService.sign(payload);

    return {
      message: 'Médico autenticado correctamente',
      token: token,
      medico: {
        ...medico,
        contrasena: undefined,
      },
    };
  }

  // Obtener todos los médicos
  async getMedicos() {
    const medicos = await this.prisma.medico.findMany({
      orderBy: { nombre: 'asc' },
    });

    return {
      message: 'Lista de médicos obtenida correctamente',
      medicos: medicos.map((m) => ({
        ...m,
        contrasena: undefined,
      })),
    };
  }

  // Obtener un médico por ID
  async getMedicoById(id: number) {
    const medico = await this.prisma.medico.findUnique({
      where: { id },
      include: {
        diagnosticos: true,
      },
    });

    if (!medico) {
      throw new NotFoundException('Médico no encontrado');
    }

    const { contrasena, ...resto } = medico;
    return {
      message: 'Médico encontrado',
      medico: resto,
    };
  }

  // Actualizar un médico
  async updateMedico(medico: Medico) {
    const datosActualizados: any = {
      nombre: medico.nombre,
      telefono: medico.telefono,
      especialidad: medico.especialidad,
    };

    if (medico.contrasena && medico.contrasena.trim() !== '') {
      const hashedPassword = await bcrypt.hash(medico.contrasena, 10);
      datosActualizados.contrasena = hashedPassword;
    }

    const updateMedico = await this.prisma.medico.update({
      where: { email: medico.email },
      data: datosActualizados,
    });


    return {
      message: 'Usuario actualizado correctamente',
      usuario: updateMedico,
    };
  }

  // Eliminar un médico
  async deleteMedico(id: number) {
    const existe = await this.prisma.medico.findUnique({ where: { id } });
    if (!existe) {
      throw new NotFoundException('Médico no encontrado');
    }

    const medicoEliminado = await this.prisma.medico.delete({
      where: { id },
    });

    return {
      message: 'Médico eliminado correctamente',
      medico: {
        ...medicoEliminado,
        contrasena: undefined,
      },
    };
  }


async updateMedicoPorId(data: UpdateMedicoDto) {
  // Verificar si el médico existe
  const medicoExistente = await this.prisma.medico.findUnique({
    where: { id: data.id },
  });

  if (!medicoExistente) {
    throw new NotFoundException('Médico no encontrado');
  }

  const datosActualizados: any = {};

  if (data.nombre) datosActualizados.nombre = data.nombre;
  if (data.telefono) datosActualizados.telefono = data.telefono;
  if (data.especialidad) datosActualizados.especialidad = data.especialidad;

  if (data.contrasena && data.contrasena.trim() !== '') {
    const hashedPassword = await bcrypt.hash(data.contrasena, 10);
    datosActualizados.contrasena = hashedPassword;
  }

  const medicoActualizado = await this.prisma.medico.update({
    where: { id: data.id },
    data: datosActualizados,
  });

  const { contrasena, ...medicoSinPassword } = medicoActualizado;

  return {
    message: 'Médico actualizado correctamente',
    medico: medicoSinPassword,
  };
}

}
