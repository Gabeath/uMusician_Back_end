import EntidadeApresentacaoEspecialidade from '@core/entities/apresentacao-especialidade';
import { FindConditions } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

export interface IRepositoryApresentacaoEspecialidade {
  create(apresentacaoEspecialidade: EntidadeApresentacaoEspecialidade[]):
  Promise<EntidadeApresentacaoEspecialidade[]>;
  selectById(id: string): Promise<EntidadeApresentacaoEspecialidade | null>;
  selectByWhere(where: FindConditions<EntidadeApresentacaoEspecialidade>):
  Promise<EntidadeApresentacaoEspecialidade>;
  selectByIdMusicoWithEspecialidadeServico(idMusico: string): Promise<EntidadeApresentacaoEspecialidade[]>;
  selectAllByWhere(where: FindConditions<EntidadeApresentacaoEspecialidade>):
  Promise<EntidadeApresentacaoEspecialidade[]>;
  updateById(id: string, apresentacaoEspecialidade: QueryDeepPartialEntity<EntidadeApresentacaoEspecialidade>):
  Promise<void>;
}