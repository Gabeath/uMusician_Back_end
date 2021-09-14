import { Repository, getRepository } from 'typeorm';
import EntidadeGeneroMusical from '@core/entities/genero-musical';
import { IRepositoryGeneroMusical } from './interfaces/genero-musical';
import { injectable } from 'inversify';

@injectable()
export class RepositoryGeneroMusical implements IRepositoryGeneroMusical {
  private repositoryGeneroMusical: Repository<EntidadeGeneroMusical> =
  getRepository(EntidadeGeneroMusical);

  async selectAll(): Promise<EntidadeGeneroMusical[]> {
    return this.repositoryGeneroMusical.find({
      order: { nome: 'ASC' },
    });
  }
}