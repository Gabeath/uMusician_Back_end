import { In, Repository, getRepository } from 'typeorm';
import { Pagination, SearchParameterBase } from '@core/models';
import EntidadeAvaliacao from '@core/entities/avaliacao';
import { IRepositoryAvaliacao } from '@core/repositories/interfaces/avaliacao';
import { injectable } from 'inversify';

@injectable()
export class RepositoryAvaliacao implements IRepositoryAvaliacao {
  private repositoryAvaliacao: Repository<EntidadeAvaliacao> = getRepository(EntidadeAvaliacao);

  async create(avaliacao: EntidadeAvaliacao): Promise<EntidadeAvaliacao> {
    return this.repositoryAvaliacao.save(avaliacao);
  }

  async selectByIdServico(idServico: string): Promise<EntidadeAvaliacao> {
    return this.repositoryAvaliacao.findOne({ where: { idServico } });
  }

  async selectAvaliacoesPaginated(listaIdServico: string[], searchParameter: SearchParameterBase):
  Promise<Pagination<EntidadeAvaliacao>> {
    const [rows, count] = await this.repositoryAvaliacao.findAndCount({
      where: { idServico: In(listaIdServico) },
      ...(searchParameter.limit && { take: searchParameter.limit }),
      ...(searchParameter.orderBy && { order: {
        [searchParameter.orderBy]: searchParameter.isDESC ? 'DESC' : 'ASC',
      }, }),
      skip: searchParameter.offset,
    });

    return {
      rows,
      count,
    };
  }

  async selectMediaAvaliacoesMusico(idMusico: string): Promise<number> {
    const media: { media: string } = await this.repositoryAvaliacao
      .createQueryBuilder('avaliacao')
      .select('AVG(avaliacao.pontuacao)', 'media')
      .where('avaliacao.idMusico = :idMusico', { idMusico })
      .getRawOne();

    return parseFloat(media.media) || 0;
  }
}