import { Pagination, SearchParameterBase } from '@core/models/pagination';
import EntidadeAvaliacao from '@core/entities/avaliacao';

export interface IRepositoryAvaliacao {
  create(avaliacao: EntidadeAvaliacao): Promise<EntidadeAvaliacao>;
  selectByIdServico(idServico: string): Promise<EntidadeAvaliacao>;
  selectAvaliacoesPaginated(listaIdServico: string[], searchParameter: SearchParameterBase):
  Promise<Pagination<EntidadeAvaliacao>>;
  selectMediaAvaliacoesMusico(idMusico: string): Promise<number>;
}