import { Repository, getRepository } from 'typeorm';
import EntidadeEspecialidadeServico from '@core/entities/especialidade-servico';
import { IRepositoryEspecialidadeServico } from './interfaces/especialidade-servico';
import { injectable } from 'inversify';

@injectable()
export class RepositoryEspecialidadeServico implements IRepositoryEspecialidadeServico {
  private repositoryEspecialidadeServico: Repository<EntidadeEspecialidadeServico> =
  getRepository(EntidadeEspecialidadeServico);

  async create(especialidadesServico: EntidadeEspecialidadeServico[]): Promise<EntidadeEspecialidadeServico[]> {
    return this.repositoryEspecialidadeServico.save(especialidadesServico);
  }
}