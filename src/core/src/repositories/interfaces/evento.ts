import EntidadeEvento from '@core/entities/evento';

export interface IRepositoryEvento {
  create(evento: EntidadeEvento): Promise<EntidadeEvento>;
}