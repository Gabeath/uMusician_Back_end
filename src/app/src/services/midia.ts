import { inject, injectable } from 'inversify';
import EntidadeMidia from '@core/entities/midia';
import { IRepositoryMidia } from '@core/repositories/interfaces/midia';
import { IServiceMidia } from './interfaces/midia';
import TYPES from '@core/types';

@injectable()
export class ServiceMidia implements IServiceMidia {
  private repositoryMidia: IRepositoryMidia;

  constructor(
  @inject(TYPES.RepositoryMidia) repositoryMidia: IRepositoryMidia,
  ) {
    this.repositoryMidia = repositoryMidia;
  }

  async createMidia(midia: EntidadeMidia): Promise<EntidadeMidia> {
    return this.repositoryMidia.create(midia);
  }

  
}