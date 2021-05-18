import EntidadeServico from '@core/entities/servico';

export interface IRepositoryServico {
  create(servico: EntidadeServico): Promise<EntidadeServico>;
}