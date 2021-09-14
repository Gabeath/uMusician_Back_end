import EntidadeMidia from '@core/entities/midia';

export interface IServiceMidia {
  createMidia(midia: EntidadeMidia): Promise<EntidadeMidia>;
  findByID(id: string): Promise<EntidadeMidia>;
  deleteMidia(midia: EntidadeMidia): Promise<void>;
}