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
      order: { nome: 'ASC' },
    });
  }

  async selectById(id: string): Promise<EntidadeEspecialidade> {
    return this.repositoryEspecialidade.findOne({ where: { id } });
  }

  async addEspecialidade(especialidade: EntidadeEspecialidade): Promise<EntidadeEspecialidade> {
    return this.repositoryEspecialidade.save(especialidade);
  }

  async existsByName(name: string): Promise<boolean>{
    const exists = await this.repositoryEspecialidade.findOne({
      where: {
        nome: name
      }
    });

    return !!exists;
  }
}