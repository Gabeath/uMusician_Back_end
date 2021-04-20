import { IPerfilSearchParameter, Pagination } from '@core/models';
import { inject, injectable } from 'inversify';
import EntidadePerfil from '@core/entities/perfil';
import { IRepositoryPerfil } from '../../../core/src/repositories/interfaces/perfil';
import { IServicePerfil } from './interfaces/perfil';
import TYPES from '@core/types';


@injectable()
export class ServicePerfil implements IServicePerfil {
  private repositoryPerfil: IRepositoryPerfil;

  constructor(
  @inject(TYPES.RepositoryPerfil) repositoryPerfil: IRepositoryPerfil,
  ){
    this.repositoryPerfil = repositoryPerfil;
  }

  async getMusicosWithSearchParameters(searchParameter: IPerfilSearchParameter):
  Promise<Pagination<EntidadePerfil>> {
    return this.repositoryPerfil.getMusicosWithSearchParameters(searchParameter);
  }


}