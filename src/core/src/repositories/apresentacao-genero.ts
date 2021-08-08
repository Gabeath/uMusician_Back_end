import { Repository, getRepository } from 'typeorm';
import EntidadeApresentacaoGenero from '@core/entities/apresentacao-genero';
import { IRepositoryApresentacaoGenero } from '@core/repositories/interfaces/apresentacao-genero';
import { injectable } from 'inversify';

@injectable()
export class RepositoryApresentacaoGenero implements IRepositoryApresentacaoGenero {
  private repositoryApresentacaoGenero: Repository<EntidadeApresentacaoGenero> =
  getRepository(EntidadeApresentacaoGenero);

  async create(generoMusicalPerfil: EntidadeApresentacaoGenero[]):
  Promise<EntidadeApresentacaoGenero[]> {
    return this.repositoryApresentacaoGenero.save(generoMusicalPerfil);
  }

  async selectById(id: string): Promise<EntidadeApresentacaoGenero> {
    return this.repositoryApresentacaoGenero.findOne({ where: { id } });
  }

  async selectAllByIdGenero(idGeneroMusical: string): Promise<EntidadeApresentacaoGenero[]> {
    return this.repositoryApresentacaoGenero.find({
      where: {
        idGeneroMusical,
        deletedAt: null,
      }
    });
  }
}