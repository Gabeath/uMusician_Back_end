import { Pagination, SearchParameterBase } from '@core/models';
import EntidadeAvaliacao from '@core/entities/avaliacao';

export interface IServiceAvaliacao {
  getAvaliacoesPaginated(idMusico: string, searchParameter: SearchParameterBase):
  Promise<Pagination<EntidadeAvaliacao>>;
  getAvaliacaoMedia(idMusico: string): Promise<number>;
}