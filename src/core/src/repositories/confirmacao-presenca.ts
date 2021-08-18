import { Repository, getRepository } from 'typeorm';
import { DateTime } from 'luxon';
import EntidadeConfirmacaoPresenca from '@core/entities/confirmacao-presenca';
import { IRepositoryConfirmacaoPresenca } from '@core/repositories/interfaces/confirmacao-presenca';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { injectable } from 'inversify';

@injectable()
export class RepositoryConfirmacaoPresenca implements IRepositoryConfirmacaoPresenca {
  private repositoryConfirmacaoPresenca: Repository<EntidadeConfirmacaoPresenca> =
  getRepository(EntidadeConfirmacaoPresenca);

  async create(confirmacaoPresenca: EntidadeConfirmacaoPresenca): Promise<EntidadeConfirmacaoPresenca> {
    return this.repositoryConfirmacaoPresenca.save(confirmacaoPresenca);
  }

  async selectById(id: string): Promise<EntidadeConfirmacaoPresenca> {
    return this.repositoryConfirmacaoPresenca.findOne({ where: { id } });
  }

  async updateById(id: string, confirmacaoPresenca: QueryDeepPartialEntity<EntidadeConfirmacaoPresenca>):
  Promise<void> {
    confirmacaoPresenca.updatedAt = DateTime.local().toISO();

    await this.repositoryConfirmacaoPresenca.update(id, confirmacaoPresenca);
  }
}