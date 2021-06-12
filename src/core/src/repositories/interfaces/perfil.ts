import { IPerfilSearchParameter, Pagination } from '@core/models/pagination';
import EntidadePerfil from '@core/entities/perfil';

export interface IRepositoryPerfil {
  selectMusicosWithSearchParameters(searchParameter: IPerfilSearchParameter): 
  Promise<Pagination<EntidadePerfil>>;
  selectById(id: string): Promise<EntidadePerfil>;
  updateById(id: string, perfil: EntidadePerfil): Promise<void>;
}