import { IPerfilSearchParameter, Pagination } from '@core/models/pagination';
import EntidadePerfil from '@core/entities/perfil';

export interface IServicePerfil {
  getMusicosWithSearchParameters(searchParameter: IPerfilSearchParameter): 
  Promise<Pagination<EntidadePerfil>>;
  getById(id: string): Promise<EntidadePerfil>;
  updateBiografiaById(id: string, biografia: string): Promise<void>;
}