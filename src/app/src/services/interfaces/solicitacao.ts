import EntidadeSolicitacao from '@core/entities/solicitacao';

export interface IServiceSolicitacao {
  criarSolicitacao(solicitacao: EntidadeSolicitacao, idSolicitante: string): Promise<EntidadeSolicitacao>;
}