import { Pagination, SearchParameterBase } from '@core/models';
import { Repository, getRepository } from 'typeorm';
import EntidadeAvaliacao from '@core/entities/avaliacao';
import { IRepositoryAvaliacao } from '@core/repositories/interfaces/avaliacao';
import { injectable } from 'inversify';

@injectable()
export class RepositoryAvaliacao implements IRepositoryAvaliacao {
  private repositoryAvaliacao: Repository<EntidadeAvaliacao> = getRepository(EntidadeAvaliacao);

  async selectAvaliacoesPaginated(idPerfil: string, searchParameter: SearchParameterBase):
  Promise<Pagination<EntidadeAvaliacao>> {
    const [rows, count] = await this.repositoryAvaliacao.findAndCount({
      where: { idPerfil },
      skip: searchParameter.offset,
      take: searchParameter.limit,
      order: {
        [searchParameter.orderBy]: searchParameter.isDESC ? 'DESC' : 'ASC',
      },
    });

    return {
      rows,
      count,
    };
  }
}