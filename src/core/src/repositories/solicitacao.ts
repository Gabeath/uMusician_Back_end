import { ISolicitacaoSearchParameter, Pagination } from '@core/models';
import { In, Repository, getRepository } from 'typeorm';
import { DateTime } from 'luxon';
import EntidadeSolicitacao from '@core/entities/solicitacao';
import { IRepositorySolicitacao } from './interfaces/solicitacao';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { injectable } from 'inversify';

@injectable()
export class RepositorySolicitacao implements IRepositorySolicitacao {
  private repositorySolicitacao: Repository<EntidadeSolicitacao> = getRepository(EntidadeSolicitacao);

  async save(solicitacao: EntidadeSolicitacao): Promise<EntidadeSolicitacao> {
    return this.repositorySolicitacao.save(solicitacao);
  }

  async selectById(id: string): Promise<EntidadeSolicitacao> {
    return this.repositorySolicitacao.findOne({ where: { id } });
  }

  async selectBySearchParameter(searchParameter: ISolicitacaoSearchParameter):
  Promise<Pagination<EntidadeSolicitacao>> {
    const [ rows, count ] = await this.repositorySolicitacao.findAndCount({
      where: {
        situacao: In(searchParameter.situacoesDasSolicitacoes),
        deletedAt: null,
      },
      ...(searchParameter.limit && { take: searchParameter.limit }),
      ...(searchParameter.orderBy && { order: {
        [searchParameter.orderBy]: searchParameter.isDESC ? 'DESC' : 'ASC',
      }, }),
      skip: searchParameter.offset,
    });

    return {
      rows,
      count
    };
  }

  async updateById(id: string, solicitacao: QueryDeepPartialEntity<EntidadeSolicitacao>): Promise<void> {
    solicitacao.updatedAt = DateTime.local().toISO();

    await this.repositorySolicitacao.update(id, solicitacao);
  }
}