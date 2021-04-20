import EntidadePerfil from '@core/entities/perfil';
import { IPerfilSearchParameter, Pagination } from '@core/models/pagination';

export interface IServicePerfil {
  getMusicosWithSearchParameters(searchParameter: IPerfilSearchParameter): 
  Promise<Pagination<EntidadePerfil>>;
  
}