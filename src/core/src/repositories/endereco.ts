import { Repository, getRepository } from 'typeorm';
import EntidadeEndereco from '@core/entities/endereco';
import { IRepositoryEndereco } from '@core/repositories/interfaces/endereco';
import { injectable } from 'inversify';

@injectable()
export class RepositoryEndereco implements IRepositoryEndereco {
  private repositoryEndereco: Repository<EntidadeEndereco> = getRepository(EntidadeEndereco);

  async create(endereco: EntidadeEndereco): Promise<EntidadeEndereco> {
    return this.repositoryEndereco.save(endereco);
  }
}