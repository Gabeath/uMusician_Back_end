import { Pagination, SearchParameterBase } from '@core/models';
import EntidadeAvaliacao from '@core/entities/avaliacao';

export interface IServiceAvaliacao {
  getAvaliacoesPaginated(idPerfil: string, searchParameter: SearchParameterBase):
  Promise<Pagination<EntidadeAvaliacao>>;
}