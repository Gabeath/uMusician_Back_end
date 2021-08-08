import EntidadeEvento from '@core/entities/evento';
import { FindConditions } from 'typeorm';

export interface IRepositoryEvento {
  create(evento: EntidadeEvento): Promise<EntidadeEvento>;
  selectAllByWhere(where: FindConditions<EntidadeEvento>): Promise<EntidadeEvento[]>;
  selectCompleteById(id: string): Promise<EntidadeEvento>;
}