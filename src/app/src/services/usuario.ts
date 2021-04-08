import { inject, injectable } from 'inversify';
import EntidadeUsuario from '@core/entities/usuario';
import { IRepositoryUsuario } from '@core/repositories/interfaces/usuario';
import { IServiceUsuario } from '@app/services/interfaces/usuario';
import TYPES from '@core/types';

@injectable()
export class ServiceUsuario implements IServiceUsuario {
  private repositoryUsuario: IRepositoryUsuario;

  constructor(
  @inject(TYPES.RepositoryUsuario) repositoryUsuario: IRepositoryUsuario,
  ) {
    this.repositoryUsuario = repositoryUsuario;
  }

  async create(usuario: EntidadeUsuario): Promise<EntidadeUsuario> {
    console.log('hello world');
  }
}