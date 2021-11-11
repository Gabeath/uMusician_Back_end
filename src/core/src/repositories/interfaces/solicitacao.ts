import { ISolicitacaoSearchParameter, Pagination } from '@core/models';
import EntidadeSolicitacao from '@core/entities/solicitacao';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

export interface IRepositorySolicitacao {
  save(solicitacao: EntidadeSolicitacao): Promise<EntidadeSolicitacao>;
  selectById(id: string): Promise<EntidadeSolicitacao>;
  selectBySearchParameter(searchParameter: ISolicitacaoSearchParameter):
  Promise<Pagination<EntidadeSolicitacao>>;
  updateById(id: string, solicitacao: QueryDeepPartialEntity<EntidadeSolicitacao>): Promise<void>
}