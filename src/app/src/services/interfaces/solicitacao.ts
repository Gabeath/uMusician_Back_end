import { Pagination, SearchParameterBase } from '@core/models';
import EntidadeSolicitacao from '@core/entities/solicitacao';

export interface IServiceSolicitacao {
  criarSolicitacao(solicitacao: EntidadeSolicitacao, idSolicitante: string): Promise<EntidadeSolicitacao>;
  getSolicitacoesPendentes(searchParameter: SearchParameterBase): Promise<Pagination<EntidadeSolicitacao>>;
  getSolicitacoesConcluidas(searchParameter: SearchParameterBase): Promise<Pagination<EntidadeSolicitacao>>
  rejeitarSolicitacao(idSolicitacao: string, idAdmin: string): Promise<void>;
}