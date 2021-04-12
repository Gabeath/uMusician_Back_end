import EntidadeUsuario from '@core/entities/usuario';

export interface IRepositoryUsuario {
  create(usuario: EntidadeUsuario): Promise<EntidadeUsuario>;
  getByEmail(email: string): Promise<EntidadeUsuario>;
  existsByEmail(email: string): Promise<boolean>;
  existsByCPF(cpf: string): Promise<boolean>;
}