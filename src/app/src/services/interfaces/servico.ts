import EntidadeServico from '@core/entities/servico';
import { SituaçãoServiço } from '@core/models';

export interface IServiceServico {
  getDetalhesServico(id: string): Promise<EntidadeServico>;
  countServicosConcluidos(idMusico: string): Promise<number>;
  getServicosMusico(idMusico: string, situacoesDosServicos: SituaçãoServiço[]): Promise<EntidadeServico[]>;
  responderSolicitacaoServico(idServico: string, resposta: SituaçãoServiço, idMusico: string): Promise<void>;
  musicoCancelarServico(idServico: string, idMusico: string): Promise<void>;
  contratanteCancelarServico(idServico: string, idContratante: string): Promise<void>;
}