import { ISolicitacaoSearchParameter, Pagination } from '@core/models';
import EntidadeSolicitacao from '@core/entities/solicitacao';

export interface IRepositorySolicitacao {
  create(solicitacao: EntidadeSolicitacao): Promise<EntidadeSolicitacao>;
  selectById(id: string): Promise<EntidadeSolicitacao>;
  selectBySearchParameter(searchParameter: ISolicitacaoSearchParameter):
  Promise<Pagination<EntidadeSolicitacao>>;
}