import EntidadeServico from '@core/entities/servico';
import { FindManyOptions } from 'typeorm';

export interface IRepositoryServico {
  create(servico: EntidadeServico): Promise<EntidadeServico>;
  selectServicosByWhere(where: FindManyOptions<EntidadeServico>): Promise<EntidadeServico[]>;
  countServicosMusico(idApresentacoes: string[]): Promise<{ count: number }>;
  selectById(id: string): Promise<EntidadeServico | null>;
}