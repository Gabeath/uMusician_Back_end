import EntidadeMidia from '@core/entities/midia';

export interface IServiceMidia {
  createMidia(midia: EntidadeMidia): Promise<EntidadeMidia>;
}