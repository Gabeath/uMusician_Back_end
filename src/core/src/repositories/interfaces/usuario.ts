import EntidadeUsuario from '@core/entities/usuario';
import { FindConditions } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

export interface IRepositoryUsuario {
  create(usuario: EntidadeUsuario): Promise<EntidadeUsuario>;
  selectByEmailOrCpf(email: string, cpf: string): Promise<EntidadeUsuario | null>;
  selectByEmail(email: string): Promise<EntidadeUsuario | null>;
  selectByCpf(cpf: string): Promise<EntidadeUsuario | null>;
  selectById(id: string): Promise<EntidadeUsuario | null>;
  selectByIdWithProfiles(id: string): Promise<EntidadeUsuario | null>;
  updateById(id: string, usuario: QueryDeepPartialEntity<EntidadeUsuario>): Promise<void>
  selectAllByWhere(where: FindConditions<EntidadeUsuario>): Promise<EntidadeUsuario[]>;
}