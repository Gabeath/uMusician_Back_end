import { Repository, getRepository } from 'typeorm';
import EntidadeUsuario from '@core/entities/usuario';
import { IRepositoryUsuario } from './interfaces/usuario';
import { injectable } from 'inversify';

@injectable()
export class RepositoryUsuario implements IRepositoryUsuario {
  private repositoryUsuario: Repository<EntidadeUsuario> = getRepository(EntidadeUsuario);

  async create(usuario: EntidadeUsuario): Promise<EntidadeUsuario> {
    return this.repositoryUsuario.save(usuario);
  }
}