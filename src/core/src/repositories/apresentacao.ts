import { Repository, getRepository } from 'typeorm';
import EntidadeApresentacao from '@core/entities/apresentacao';
import { IRepositoryApresentacao } from '@core/repositories/interfaces/apresentacao';
import { injectable } from 'inversify';

@injectable()
export class RepositoryApresentacao implements IRepositoryApresentacao {
  private repositoryApresentacao: Repository<EntidadeApresentacao> =
  getRepository(EntidadeApresentacao);

  async create(apresentacao: EntidadeApresentacao[]): Promise<EntidadeApresentacao[]> {
    return this.repositoryApresentacao.save(apresentacao);
  }
}