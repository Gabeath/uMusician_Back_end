import EntidadePerfil from '@core/entities/perfil';
import EntidadeUsuario from '@core/entities/usuario';
import { FindConditions } from 'typeorm';

export interface IRepositoryUsuario {
  criarUsuarioPerfil(usuario: EntidadeUsuario, perfil: EntidadePerfil):
  Promise<EntidadeUsuario>;
  selectByEmailOrCpf(email: string, cpf: string): Promise<EntidadeUsuario | null>;
  selectByEmail(email: string): Promise<EntidadeUsuario | null>;
  selectByCpf(cpf: string): Promise<EntidadeUsuario | null>;
  updatePassword(id: string, senha: string): Promise<void>;
  selectById(id: string): Promise<EntidadeUsuario | null>;
  selectByIdWithProfiles(id: string): Promise<EntidadeUsuario | null>;
  updateById(id: string, usuario: EntidadeUsuario): Promise<void>;
  selectAllByWhere(where: FindConditions<EntidadeUsuario>): Promise<EntidadeUsuario[]>;
}