import EntidadePerfil from '@core/entities/perfil';
import EntidadeUsuario from '@core/entities/usuario';

export interface IRepositoryUsuario {
  criarUsuarioPerfil(usuario: EntidadeUsuario, perfil: EntidadePerfil):
  Promise<EntidadeUsuario>;
  selectByEmailOrCpf(email: string, cpf: string): Promise<EntidadeUsuario | null>;
  selectByEmail(email: string): Promise<EntidadeUsuario | null>;
  selectByCpf(cpf: string): Promise<EntidadeUsuario | null>;
}