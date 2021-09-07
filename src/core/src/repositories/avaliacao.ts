import { Pagination, SearchParameterBase } from '@core/models';
import { Repository, getRepository } from 'typeorm';
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

  async selectAvaliacoesPaginated(idMusico: string, searchParameter: SearchParameterBase):
  Promise<Pagination<EntidadeAvaliacao>> {
    const [rows, count] = await this.repositoryAvaliacao.findAndCount({
      where: { idMusico },
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

  async selectMediasAvaliacoesMusico(pontuacao: number): Promise<{ media: number, idMusico: string }[]> {
    const resposta: { media: string, idMusico: string }[] = await this.repositoryAvaliacao
      .createQueryBuilder('avaliacao')
      .select('AVG(avaliacao.pontuacao)', 'media')
      .addSelect('avaliacao.idMusico', 'idMusico')
      .groupBy('avaliacao.idMusico')
      .having('AVG(avaliacao.pontuacao) >= :pontuacao', { pontuacao })
      .getRawMany();

    return resposta.map(o => ({ media: parseFloat(o.media), idMusico: o.idMusico }));
  }
}