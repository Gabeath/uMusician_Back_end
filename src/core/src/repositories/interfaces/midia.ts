import EntidadeMidia from '@core/entities/midia';

export interface IRepositoryMidia{
  create(midia: EntidadeMidia): Promise<EntidadeMidia>;
  findByID(id: string): Promise<EntidadeMidia>;
  delete(midia: EntidadeMidia): Promise<void>;
}