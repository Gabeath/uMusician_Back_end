import { Repository, getRepository } from 'typeorm';
import EntidadeMidia from '@core/entities/midia';
import { IRepositoryMidia } from './interfaces/midia';
import { injectable } from 'inversify';

@injectable()
export class RepositoryMidia implements IRepositoryMidia {
  private repositoryMidia: Repository<EntidadeMidia> =
  getRepository(EntidadeMidia);

  async create(midia: EntidadeMidia): Promise<EntidadeMidia> {
    return this.repositoryMidia.save(midia);
  }

  async findByID(id: string): Promise<EntidadeMidia> {
    return this.repositoryMidia.findOne(id);
  }

  async delete(midia: EntidadeMidia): Promise<void>{
    await this.repositoryMidia.remove(midia);
  }
}