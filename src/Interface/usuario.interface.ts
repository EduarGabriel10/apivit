export interface Usuario {
    id?: number; // Opcional, porque se genera automáticamente en la DB
    email: string;
    contrasena: string;
    nombre: string;
    telefono: string;
  }
  