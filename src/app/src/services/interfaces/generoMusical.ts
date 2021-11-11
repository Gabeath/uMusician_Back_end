import { Pagination, SearchParameterBase } from '@core/models';
import EntidadeGeneroMusical from '@core/entities/genero-musical';

export interface IServiceGeneroMusical {
  getSelectable(): Promise<EntidadeGeneroMusical[]>;
  getAll(searchParameter: SearchParameterBase): Promise<Pagination<EntidadeGeneroMusical>>;
  addGeneroMusical(nome: string, popularidade: number, idSolicitacao: string, filename: string) :
  Promise<EntidadeGeneroMusical>;
}