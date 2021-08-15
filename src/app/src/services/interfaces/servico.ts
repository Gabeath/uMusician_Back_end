import EntidadeServico from '@core/entities/servico';
import { SituaçãoServiço } from '@core/models';

export interface IServiceServico {
  getDetalhesServico(id: string): Promise<EntidadeServico>;
  countServicosConcluidos(idMusico: string): Promise<number>;
  getServicosPendentesMusico(idMusico: string): Promise<EntidadeServico[]>;
  responderSolicitacaoServico(idServico: string, resposta: SituaçãoServiço, idMusico: string): Promise<void>;
}