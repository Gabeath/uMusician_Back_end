import { Pagination, SearchParameterBase } from '@core/models/pagination';
import EntidadeAvaliacao from '@core/entities/avaliacao';

export interface IRepositoryAvaliacao {
  selectAvaliacoesPaginated(listaIdServico: string[], searchParameter: SearchParameterBase):
  Promise<Pagination<EntidadeAvaliacao>>;
  selectMediaAvaliacoesMusico(idPerfil: string): Promise<{ media: number }>;
}