import { Repository, getRepository } from 'typeorm';
import EntidadeEvento from '@core/entities/evento';
import { IRepositoryEvento } from './interfaces/evento';
import { injectable } from 'inversify';

@injectable()
export class RepositoryEvento implements IRepositoryEvento {
  private repositoryEvento: Repository<EntidadeEvento> = getRepository(EntidadeEvento);

  async create(evento: EntidadeEvento): Promise<EntidadeEvento> {
    return this.repositoryEvento.save(evento);
  }
}