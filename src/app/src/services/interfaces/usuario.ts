import EntidadeUsuario from '@core/entities/usuario';

export interface IServiceUsuario {
  criarUsuarioPerfil(usuario: EntidadeUsuario): Promise<EntidadeUsuario>;
  buscarUsuario(email: string, senha: string, tipoPerfil: Number): Promise<EntidadeUsuario>;
}