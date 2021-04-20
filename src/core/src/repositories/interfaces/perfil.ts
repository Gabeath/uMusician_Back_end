import { IPerfilSearchParameter, Pagination } from '@core/models/pagination';
import EntidadeAvaliacao from '@core/entities/avaliacao';
import EntidadePerfil from '@core/entities/perfil';

export interface IRepositoryPerfil {
  getMusicosWithSearchParameters(searchParameter: IPerfilSearchParameter): 
  Promise<Pagination<EntidadePerfil>>;

}