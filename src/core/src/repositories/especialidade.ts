import { Repository, getRepository } from 'typeorm';
import EntidadeEspecialidade from '@core/entities/especialidade';
import { IRepositoryEspecialidade } from './interfaces/especialidade';
import { injectable } from 'inversify';

@injectable()
export class RepositoryEspecialidade implements IRepositoryEspecialidade {
  private repositoryEspecialidade: Repository<EntidadeEspecialidade> =
  getRepository(EntidadeEspecialidade);

  async selectAll(): Promise<EntidadeEspecialidade[]> {
    return this.repositoryEspecialidade.find({
      order: {
        popularidade: 'ASC',
        nome: 'ASC',
      },
    });
  }
}