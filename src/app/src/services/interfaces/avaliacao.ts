import { Pagination, SearchParameterBase } from '@core/models';
import EntidadeAvaliacao from '@core/entities/avaliacao';

export interface IServiceAvaliacao {
  create(avaliacao: EntidadeAvaliacao, idContratante: string): Promise<EntidadeAvaliacao>;
  getAvaliacoesPaginated(idMusico: string, searchParameter: SearchParameterBase):
  Promise<Pagination<EntidadeAvaliacao>>;
  getAvaliacaoMedia(idMusico: string): Promise<number>;
}