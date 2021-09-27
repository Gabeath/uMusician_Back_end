import { Repository, getRepository } from 'typeorm';
import EntidadeAdmin from '@core/entities/administrador';
import { IRepositoryAdmin } from './interfaces/administrador';
import { injectable } from 'inversify';

@injectable()
export class RepositoryAdmin implements IRepositoryAdmin {
  private repositoryAdmin: Repository<EntidadeAdmin> = getRepository(EntidadeAdmin);

  async create(admin: EntidadeAdmin): Promise<EntidadeAdmin> {
    return this.repositoryAdmin.save(admin);
  }

  async selectById(id: string): Promise<EntidadeAdmin | null> {
    return this.repositoryAdmin.findOne({ where: { id } });
  }

  async selectByEmail(email: string): Promise<EntidadeAdmin | null> {
    return this.repositoryAdmin.findOne({ where: { email } });
  }
}