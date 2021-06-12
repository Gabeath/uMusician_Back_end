import { inject, injectable } from 'inversify';
import EntidadeEspecialidade from '@core/entities/especialidade';
import { IRepositoryEspecialidade } from '@core/repositories/interfaces/especialidade';
import { IServiceEspecialidade } from './interfaces/especialidade';
import TYPES from '@core/types';

@injectable()
export class ServiceEspecialidade implements IServiceEspecialidade {
  private repositoryEspecialidade: IRepositoryEspecialidade;

  constructor(
  @inject(TYPES.RepositoryEspecialidade) repositoryEspecialidade: IRepositoryEspecialidade,
  ) {
    this.repositoryEspecialidade = repositoryEspecialidade;
  }

  async getAll(): Promise<EntidadeEspecialidade[]> {
    return this.repositoryEspecialidade.selectAll();
  }
}