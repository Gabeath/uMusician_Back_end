import EntidadeEvento from '@core/entities/evento';

export interface IServiceEvento {
  create(idContratante: string, servico: EntidadeEvento): Promise<EntidadeEvento>;
  getEventosByIdContratante(idContratante: string): Promise<EntidadeEvento[]>;
  getDetalhesEvento(id: string): Promise<EntidadeEvento>;
}