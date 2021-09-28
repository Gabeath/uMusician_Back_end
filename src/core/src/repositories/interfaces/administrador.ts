import EntidadeAdmin from '@core/entities/administrador';

export interface IRepositoryAdmin {
  create(admin: EntidadeAdmin): Promise<EntidadeAdmin>;
  selectById(id: string): Promise<EntidadeAdmin | null>;
  selectByEmail(email: string): Promise<EntidadeAdmin | null>;
}