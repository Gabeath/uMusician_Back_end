import EntidadeServico from '@core/entities/servico';

export interface IServiceServico {
  getDetalhesServico(id: string): Promise<EntidadeServico>;
  countServicosConcluidos(idMusico: string): Promise<number>;
  getServicosPendentesMusico(idMusico: string): Promise<EntidadeServico[]>;
}