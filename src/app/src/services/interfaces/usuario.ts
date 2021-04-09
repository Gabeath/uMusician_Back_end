import EntidadeUsuario from '@core/entities/usuario';

export interface IServiceUsuario {
  criarUsuarioPerfil(usuario: EntidadeUsuario): Promise<EntidadeUsuario>;
}