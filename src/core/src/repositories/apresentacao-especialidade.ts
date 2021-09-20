import { FindConditions, Repository, getRepository } from 'typeorm';
import { DateTime } from 'luxon';
import EntidadeApresentacaoEspecialidade from '@core/entities/apresentacao-especialidade';
import { IRepositoryApresentacaoEspecialidade } from '@core/repositories/interfaces/apresentacao-especialidade';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { injectable } from 'inversify';

@injectable()
export class RepositoryApresentacaoEspecialidade implements IRepositoryApresentacaoEspecialidade {
  private repositoryApresentacaoEspecialidade: Repository<EntidadeApresentacaoEspecialidade> =
  getRepository(EntidadeApresentacaoEspecialidade);

  async create(apresentacaoEspecialidade: EntidadeApresentacaoEspecialidade[]):
  Promise<EntidadeApresentacaoEspecialidade[]> {
    return this.repositoryApresentacaoEspecialidade.save(apresentacaoEspecialidade);
  }

  async selectById(id: string): Promise<EntidadeApresentacaoEspecialidade | null> {
    return this.repositoryApresentacaoEspecialidade.findOne({ where: { id } });
  }

  async selectByWhere(where: FindConditions<EntidadeApresentacaoEspecialidade>):
  Promise<EntidadeApresentacaoEspecialidade> {
    return this.repositoryApresentacaoEspecialidade.findOne({ where });
  }

  async selectByIdMusicoWithEspecialidadeServico(idMusico: string): Promise<EntidadeApresentacaoEspecialidade[]> {
    return this.repositoryApresentacaoEspecialidade.find({
      where: { idMusico },
      relations: ['especialidadesServico'],
    });
  }

  async selectAllByWhere(where: FindConditions<EntidadeApresentacaoEspecialidade>):
  Promise<EntidadeApresentacaoEspecialidade[]> {
    return this.repositoryApresentacaoEspecialidade.find({ where });
  }

  async updateById(id: string, apresentacaoEspecialidade: QueryDeepPartialEntity<EntidadeApresentacaoEspecialidade>):
  Promise<void> {
    apresentacaoEspecialidade.updatedAt = DateTime.local().toISO();

    await this.repositoryApresentacaoEspecialidade.update(id, apresentacaoEspecialidade);
  }
}