import { FindConditions, FindOneOptions } from 'typeorm';
import EntidadeEvento from '@core/entities/evento';
import { IEventoSearchParameter } from '@core/models';

export interface IRepositoryEvento {
  create(evento: EntidadeEvento): Promise<EntidadeEvento>;
  selectOneByOptions(options: FindOneOptions<EntidadeEvento>): Promise<EntidadeEvento>;
  selectAllByWhere(where: FindConditions<EntidadeEvento>): Promise<EntidadeEvento[]>;
  selectCompleteById(id: string): Promise<EntidadeEvento>;
  selectEventosContratante(idContratante: string, searchParameter: IEventoSearchParameter): Promise<EntidadeEvento[]>;
}