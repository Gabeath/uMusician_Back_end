import EntidadeServico from '@core/entities/servico';

export interface IServiceServico {
  create(idContratante: string, servico: EntidadeServico): Promise<EntidadeServico>;
  getServicosContratante(idContratante: string): Promise<EntidadeServico[]>;
  getDetalhesServico(id: string): Promise<EntidadeServico | null>;
}