import EntidadeServico from '@core/entities/servico';
import { FindConditions } from 'typeorm';

export interface IRepositoryServico {
  create(servico: EntidadeServico): Promise<EntidadeServico>;
  selectAllByWhere(where: FindConditions<EntidadeServico>): Promise<EntidadeServico[]>;
  selectById(id: string): Promise<EntidadeServico>;
  selectCompleteById(id: string): Promise<EntidadeServico>;
}