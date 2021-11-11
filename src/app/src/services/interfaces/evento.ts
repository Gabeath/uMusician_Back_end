import EntidadeEvento from '@core/entities/evento';
import { IEventoSearchParameter } from '@core/models';

export interface IServiceEvento {
  create(idContratante: string, servico: EntidadeEvento): Promise<EntidadeEvento>;
  getEventosByIdContratante(idContratante: string, searchParameter: IEventoSearchParameter): Promise<EntidadeEvento[]>;
  getDetalhesEvento(id: string): Promise<EntidadeEvento>;
}