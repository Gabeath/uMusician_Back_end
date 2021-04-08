import EntidadeUsuario from '@core/entities/usuario';

export interface IServiceUsuario {
  create(usuario: EntidadeUsuario): Promise<EntidadeUsuario>;
}