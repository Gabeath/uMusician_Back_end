import EntidadeMidia from '@core/entities/midia';

export interface IRepositoryMidia{
  create(midia: EntidadeMidia): Promise<EntidadeMidia>; 
}