import perfil from '@core/entities/perfil';
import { IPerfilSearchParameter, Pagination } from '@core/models';
import { inject, injectable } from 'inversify';
import { IServicePerfil } from './interfaces/perfil';
import { IRepositoryPerfil } from '../../../core/src/repositories/interfaces/perfil';
import TYPES from '@core/types';


@injectable()
export class ServicePerfil implements IServicePerfil {
  private repositoryPerfil: IRepositoryPerfil;

  constructor(
    @inject(TYPES.RepositoryPerfil) repositoryPerfil: IRepositoryPerfil,
  ){
    this.repositoryPerfil = repositoryPerfil;
  }

  async getMusicosWithSearchParameters(searchParameter: IPerfilSearchParameter): Promise<Pagination<perfil>> {
    return this.repositoryPerfil.getMusicosWithSearchParameters(searchParameter);
  }


}