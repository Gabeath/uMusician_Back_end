import { FindManyOptions, Repository, getRepository } from 'typeorm';
import EntidadeServico from '@core/entities/servico';
import { IRepositoryServico } from '@core/repositories/interfaces/servico';
import { injectable } from 'inversify';

@injectable()
export class RepositoryServico implements IRepositoryServico {
  private repositoryServico: Repository<EntidadeServico> = getRepository(EntidadeServico);

  async create(servico: EntidadeServico): Promise<EntidadeServico> {
    return this.repositoryServico.save(servico);
  }

  async selectServicosByWhere(where: FindManyOptions<EntidadeServico>):
  Promise<EntidadeServico[]> {
    return this.repositoryServico.find(where);
  }
}