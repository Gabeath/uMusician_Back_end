import { inject, injectable } from 'inversify';
import EntidadeGeneroMusical from '@core/entities/genero-musical';
import { IRepositoryGeneroMusical } from '@core/repositories/interfaces/genero-musical';
import { IServiceGeneroMusical } from './interfaces/generoMusical';
import TYPES from '@core/types';

@injectable()
export class ServiceGeneroMusical implements IServiceGeneroMusical {
  private repositoryGeneroMusical: IRepositoryGeneroMusical;

  constructor(
  @inject(TYPES.RepositoryGeneroMusical) repositoryGeneroMusical: IRepositoryGeneroMusical,
  ) {
    this.repositoryGeneroMusical = repositoryGeneroMusical;
  }

  async getAll(): Promise<EntidadeGeneroMusical[]> {
    return this.repositoryGeneroMusical.selectAll();
  }
}