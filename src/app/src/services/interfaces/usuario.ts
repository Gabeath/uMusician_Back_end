import EntidadeUsuario from '@core/entities/usuario';

export interface IServiceUsuario {
  criarUsuarioPerfil(usuario: EntidadeUsuario): Promise<EntidadeUsuario>;
  buscarUsuario(email: string, senha: string, tipoPerfil: number): Promise<EntidadeUsuario>;
  existsByEmail(email: string): Promise<boolean>;
  existsByCPF(cpf: string): Promise<boolean>;
}