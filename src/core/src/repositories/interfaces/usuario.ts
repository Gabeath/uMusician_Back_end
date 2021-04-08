import EntidadeUsuario from '@core/entities/usuario';

export interface IRepositoryUsuario {
  create(usuario: EntidadeUsuario): Promise<EntidadeUsuario>;
}