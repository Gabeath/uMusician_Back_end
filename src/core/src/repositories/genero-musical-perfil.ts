import { Repository, getRepository } from 'typeorm';
import EntidadeApresentacaoGenero from '@core/entities/apresentacao-genero';
import {
  IRepositoryGeneroMusicalPerfil
} from '@core/repositories/interfaces/genero-musical-perfil';
import { injectable } from 'inversify';

@injectable()
export class RepositoryGeneroMusicalPerfil implements IRepositoryGeneroMusicalPerfil {
  private repositoryGeneroMusicalPerfil: Repository<EntidadeApresentacaoGenero> =
  getRepository(EntidadeApresentacaoGenero);

  async create(generoMusicalPerfil: EntidadeApresentacaoGenero[]):
  Promise<EntidadeApresentacaoGenero[]> {
    return this.repositoryGeneroMusicalPerfil.save(generoMusicalPerfil);
  }

  async selectById(id: string): Promise<EntidadeApresentacaoGenero> {
    return this.repositoryGeneroMusicalPerfil.findOne({ where: { id } });
  }
}