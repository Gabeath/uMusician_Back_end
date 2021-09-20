import { IMusicoSearchParameter, Pagination } from '@core/models/pagination';
import EntidadeApresentacaoGenero from '@core/entities/apresentacao-genero';
import EntidadePerfil from '@core/entities/perfil';

export interface IServicePerfil {
  getMusicosWithSearchParameters(searchParameter: IMusicoSearchParameter): 
  Promise<Pagination<EntidadePerfil>>;
  getById(id: string): Promise<EntidadePerfil>;
  updateBiografiaById(id: string, biografia: string): Promise<void>;
  addApresentacaoGenero(apresentacaoGenero: EntidadeApresentacaoGenero, idMusico: string):
  Promise<EntidadeApresentacaoGenero>;
}