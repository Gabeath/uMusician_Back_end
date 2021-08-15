import { IMusicoSearchParameter, Pagination } from '@core/models/pagination';
import EntidadePerfil from '@core/entities/perfil';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

export interface IRepositoryPerfil {
  create(perfil: EntidadePerfil): Promise<EntidadePerfil>;
  selectMusicosWithSearchParameters(searchParameter: IMusicoSearchParameter): 
  Promise<Pagination<EntidadePerfil>>;
  selectById(id: string): Promise<EntidadePerfil>;
  selectCompleteById(id: string): Promise<EntidadePerfil>;
  selectByIdWithUsuario(id: string): Promise<EntidadePerfil>;
  updateById(id: string, perfil: QueryDeepPartialEntity<EntidadePerfil>): Promise<void>;
  selectAllByListaIdWithUsuario(listaId: string[]): Promise<EntidadePerfil[]>;
}