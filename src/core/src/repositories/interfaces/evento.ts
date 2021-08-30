import { FindConditions, FindOneOptions } from 'typeorm';
import EntidadeEvento from '@core/entities/evento';

export interface IRepositoryEvento {
  create(evento: EntidadeEvento): Promise<EntidadeEvento>;
  selectOneByOptions(options: FindOneOptions<EntidadeEvento>): Promise<EntidadeEvento>;
  selectAllByWhere(where: FindConditions<EntidadeEvento>): Promise<EntidadeEvento[]>;
  selectCompleteById(id: string): Promise<EntidadeEvento>;
  selectEventosPendentesContratante(idContratante: string): Promise<EntidadeEvento[]>;
}