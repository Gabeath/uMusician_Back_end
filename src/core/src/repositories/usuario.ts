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

  async getByEmail(email: string): Promise<EntidadeUsuario>{
    return this.repositoryUsuario.findOne({
      where: {
        email
      },
      relations: ['perfis']
    });
  }

  async existsByEmail(email: string): Promise<boolean> {
    const usuario = await this.repositoryUsuario.findOne({
      where: {
        email
      },
      select: ['email']
    });

    if(!usuario)
      return false;
    
    return true;
  }
  async existsByCPF(cpf: string): Promise<boolean> {
    const usuario = await this.repositoryUsuario.findOne({
      where: {
        cpf
      },
      select: ['email']
    });

    if(!usuario)
      return false;
    
    return true;
  }
}