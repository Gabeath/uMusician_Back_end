import { Repository, getRepository } from 'typeorm';
import EntidadeGeneroMusicalPerfil from '@core/entities/genero-musical-perfil';
import {
  IRepositoryGeneroMusicalPerfil
} from '@core/repositories/interfaces/genero-musical-perfil';
import { injectable } from 'inversify';

@injectable()
export class RepositoryGeneroMusicalPerfil implements IRepositoryGeneroMusicalPerfil {
  private repositoryGeneroMusicalPerfil: Repository<EntidadeGeneroMusicalPerfil> =
  getRepository(EntidadeGeneroMusicalPerfil);

  async create(generoMusicalPerfil: EntidadeGeneroMusicalPerfil[]):
  Promise<EntidadeGeneroMusicalPerfil[]> {
    return this.repositoryGeneroMusicalPerfil.save(generoMusicalPerfil);
  }

  async selectById(id: string): Promise<EntidadeGeneroMusicalPerfil> {
    return this.repositoryGeneroMusicalPerfil.findOne({ where: { id } });
  }
}