import EntidadeServico from '@core/entities/servico';
import { FindConditions } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

export interface IRepositoryServico {
  create(servico: EntidadeServico): Promise<EntidadeServico>;
  selectAllByWhere(where: FindConditions<EntidadeServico>): Promise<EntidadeServico[]>;
  selectById(id: string): Promise<EntidadeServico>;
  selectByIdWithEvento(id: string): Promise<EntidadeServico>;
  selectCompleteById(id: string): Promise<EntidadeServico>;
  selectServicosPendentesMusico(listaIdServico: string[]): Promise<EntidadeServico[]>;
  updateById(id: string, servico: QueryDeepPartialEntity<EntidadeServico>): Promise<void>;
}