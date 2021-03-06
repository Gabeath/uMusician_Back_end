import { FindConditions, Repository, getRepository } from 'typeorm';
import { DateTime } from 'luxon';
import EntidadeApresentacaoGenero from '@core/entities/apresentacao-genero';
import { IRepositoryApresentacaoGenero } from '@core/repositories/interfaces/apresentacao-genero';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { injectable } from 'inversify';

@injectable()
export class RepositoryApresentacaoGenero implements IRepositoryApresentacaoGenero {
  private repositoryApresentacaoGenero: Repository<EntidadeApresentacaoGenero> =
  getRepository(EntidadeApresentacaoGenero);

  async create(apresentacaoGenero: EntidadeApresentacaoGenero[]):
  Promise<EntidadeApresentacaoGenero[]> {
    return this.repositoryApresentacaoGenero.save(apresentacaoGenero);
  }

  async selectById(id: string): Promise<EntidadeApresentacaoGenero> {
    return this.repositoryApresentacaoGenero.findOne({ where: { id } });
  }

  async selectByWhere(where: FindConditions<EntidadeApresentacaoGenero>): Promise<EntidadeApresentacaoGenero> {
    return this.repositoryApresentacaoGenero.findOne({ where });
  }

  async selectAllByIdGenero(idGeneroMusical: string): Promise<EntidadeApresentacaoGenero[]> {
    return this.repositoryApresentacaoGenero.find({
      where: {
        idGeneroMusical,
        deletedAt: null,
      }
    });
  }

  async updateById(id: string, apresentacaoGenero: QueryDeepPartialEntity<EntidadeApresentacaoGenero>): Promise<void> {
    apresentacaoGenero.updatedAt = DateTime.local().toISO();

    await this.repositoryApresentacaoGenero.update(id, apresentacaoGenero);
  }
}