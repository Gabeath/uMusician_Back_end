import { In, Repository, getRepository } from 'typeorm';
import { Pagination, SearchParameterBase } from '@core/models';
import EntidadeAvaliacao from '@core/entities/avaliacao';
import { IRepositoryAvaliacao } from '@core/repositories/interfaces/avaliacao';
import { injectable } from 'inversify';

@injectable()
export class RepositoryAvaliacao implements IRepositoryAvaliacao {
  private repositoryAvaliacao: Repository<EntidadeAvaliacao> = getRepository(EntidadeAvaliacao);

  async selectAvaliacoesPaginated(listaIdServico: string[], searchParameter: SearchParameterBase):
  Promise<Pagination<EntidadeAvaliacao>> {
    const [rows, count] = await this.repositoryAvaliacao.findAndCount({
      where: { idServico: In(listaIdServico) },
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

  async selectMediaAvaliacoesMusico(idPerfil: string): Promise<{ media: number }> {
    const media: { media: string } = await this.repositoryAvaliacao
      .createQueryBuilder('avaliacao')
      .select('AVG(avaliacao.pontuacao)', 'media')
      .where('avaliacao.idPerfil = :idPerfil', { idPerfil })
      .getRawOne();

    return { media: parseFloat(media.media) || 0 };
  }
}