import { IServicoSearchParameter, SituaçãoServiço } from '@core/models';
import EntidadeServico from '@core/entities/servico';

export interface IServiceServico {
  getDetalhesServico(id: string): Promise<EntidadeServico>;
  countServicosConcluidos(idMusico: string): Promise<number>;
  getServicosMusico(idMusico: string, searchParameter: IServicoSearchParameter): Promise<EntidadeServico[]>;
  responderSolicitacaoServico(idServico: string, resposta: SituaçãoServiço, idMusico: string): Promise<void>;
  musicoCancelarServico(idServico: string, idMusico: string): Promise<void>;
  contratanteCancelarServico(idServico: string, idContratante: string): Promise<void>;
}