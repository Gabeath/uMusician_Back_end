import { Repository, getRepository } from 'typeorm';
import EntidadeGeneroServico from '@core/entities/genero-servico';
import { IRepositoryGeneroServico } from './interfaces/genero-servico';
import { injectable } from 'inversify';

@injectable()
export class RepositoryGeneroServico implements IRepositoryGeneroServico {
  private repositoryGeneroServico: Repository<EntidadeGeneroServico> =
  getRepository(EntidadeGeneroServico);

  async create(generoServico: EntidadeGeneroServico): Promise<EntidadeGeneroServico> {
    return this.repositoryGeneroServico.save(generoServico);
  }
}