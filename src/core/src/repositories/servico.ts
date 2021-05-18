import { Repository, getRepository } from 'typeorm';
import EntidadeServico from '@core/entities/servico';
import { IRepositoryServico } from './interfaces/servico';
import { injectable } from 'inversify';

@injectable()
export class RepositoryServico implements IRepositoryServico {
  private repositoryServico: Repository<EntidadeServico> = getRepository(EntidadeServico);

  async create(servico: EntidadeServico): Promise<EntidadeServico> {
    return this.repositoryServico.save(servico);
  }
}