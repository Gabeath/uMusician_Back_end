import { inject, injectable } from 'inversify';
import EntidadeMidia from '@core/entities/midia';
import { IRepositoryMidia } from '@core/repositories/interfaces/midia';
import { IServiceMidia } from './interfaces/midia';
import TYPES from '@core/types';
import {excluirArquivoDaNuvem} from '@app/utils/uploads';

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

  async findByID(id: string): Promise<EntidadeMidia>{
    return this.repositoryMidia.findByID(id);
  }

  async deleteMidia(midia: EntidadeMidia): Promise<void>{
    await excluirArquivoDaNuvem(midia.url);

    //Descomentar quando tiver a feature de thumbnail
    // if(midia.thumbnailUrl)
    //   await excluirArquivoDaNuvem(midia.thumbnailUrl);
    
    return this.repositoryMidia.delete(midia);
  }

  
}