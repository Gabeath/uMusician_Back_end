import EntidadeApresentacaoGenero from '@core/entities/apresentacao-genero';
import { FindConditions } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

export interface IRepositoryApresentacaoGenero {
  create(apresentacaoGenero: EntidadeApresentacaoGenero[]):
  Promise<EntidadeApresentacaoGenero[]>;
  selectById(id: string): Promise<EntidadeApresentacaoGenero>;
  selectByWhere(where: FindConditions<EntidadeApresentacaoGenero>): Promise<EntidadeApresentacaoGenero>;
  selectAllByIdGenero(idGeneroMusical: string): Promise<EntidadeApresentacaoGenero[]>;
  updateById(id: string, apresentacaoGenero: QueryDeepPartialEntity<EntidadeApresentacaoGenero>): Promise<void>;
}