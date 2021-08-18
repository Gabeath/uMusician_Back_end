import EntidadeConfirmacaoPresenca from '@core/entities/confirmacao-presenca';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

export interface IRepositoryConfirmacaoPresenca {
  create(confirmacaoPresenca: EntidadeConfirmacaoPresenca): Promise<EntidadeConfirmacaoPresenca>;
  selectById(id: string): Promise<EntidadeConfirmacaoPresenca>;
  updateById(id: string, confirmacaoPresenca: QueryDeepPartialEntity<EntidadeConfirmacaoPresenca>): Promise<void>;
}