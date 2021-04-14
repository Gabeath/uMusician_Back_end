import EntidadeUsuario from '@core/entities/usuario';

export interface IServiceUsuario {
  criarUsuarioPerfil(usuario: EntidadeUsuario): Promise<EntidadeUsuario>;
  buscarUsuario(email: string, senha: string, tipoPerfil: number): Promise<EntidadeUsuario>;
  validaUsuarioExistente(email: string, cpf: string):
  Promise<{ valido: boolean, mensagem?: string }>;
}