import { Repository, getRepository } from 'typeorm';
import EntidadeApresentacaoEspecialidade from '@core/entities/apresentacao-especialidade';
import { IRepositoryApresentacao } from '@core/repositories/interfaces/apresentacao';
import { injectable } from 'inversify';

@injectable()
export class RepositoryApresentacao implements IRepositoryApresentacao {
  private repositoryApresentacao: Repository<EntidadeApresentacaoEspecialidade> =
  getRepository(EntidadeApresentacaoEspecialidade);

  async create(apresentacao: EntidadeApresentacaoEspecialidade[]):
  Promise<EntidadeApresentacaoEspecialidade[]> {
    return this.repositoryApresentacao.save(apresentacao);
  }

  async selectById(id: string): Promise<EntidadeApresentacaoEspecialidade | null> {
    return this.repositoryApresentacao.findOne({ where: { id } });
  }
}