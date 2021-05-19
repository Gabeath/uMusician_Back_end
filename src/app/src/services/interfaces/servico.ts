import EntidadeServico from '@core/entities/servico';

export interface IServiceServico {
  create(idContratante: string, servico: EntidadeServico): Promise<EntidadeServico>;
}