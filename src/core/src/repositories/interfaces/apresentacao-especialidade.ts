import EntidadeApresentacaoEspecialidade from '@core/entities/apresentacao-especialidade';
import { FindConditions } from 'typeorm';

export interface IRepositoryApresentacaoEspecialidade {
  create(apresentacao: EntidadeApresentacaoEspecialidade[]):
  Promise<EntidadeApresentacaoEspecialidade[]>;
  selectById(id: string): Promise<EntidadeApresentacaoEspecialidade | null>;
  selectByIdMusicoWithEspecialidadeServico(idMusico: string): Promise<EntidadeApresentacaoEspecialidade[]>;
  selectAllByWhere(where: FindConditions<EntidadeApresentacaoEspecialidade>):
  Promise<EntidadeApresentacaoEspecialidade[]>;
}