import { Pagination, SearchParameterBase } from '@core/models';
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

  async selectAllWithPagination(searchParameter: SearchParameterBase): Promise<Pagination<EntidadeEspecialidade>> {
    const [ rows, count ] = await this.repositoryEspecialidade.findAndCount({
      ...(searchParameter.limit && { take: searchParameter.limit }),
      skip: searchParameter.offset,
      order: {
        [searchParameter.orderBy]: searchParameter.isDESC,
      },
    });

    return {
      rows,
      count,
    };
  }

  async selectById(id: string): Promise<EntidadeEspecialidade> {
    return this.repositoryEspecialidade.findOne({ where: { id } });
  }

  async addEspecialidade(especialidade: EntidadeEspecialidade): Promise<EntidadeEspecialidade> {
    return this.repositoryEspecialidade.save(especialidade);
  }
}