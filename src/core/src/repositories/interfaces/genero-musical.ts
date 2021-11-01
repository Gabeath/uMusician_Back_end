import { Pagination, SearchParameterBase } from '@core/models';
import EntidadeGeneroMusical from '@core/entities/genero-musical';

export interface IRepositoryGeneroMusical {
  selectAll(): Promise<EntidadeGeneroMusical[]>;
  selectAllWithPagination(searchParameter: SearchParameterBase): Promise<Pagination<EntidadeGeneroMusical>>
  selectById(id: string): Promise<EntidadeGeneroMusical>;
  addGeneroMusical(genero: EntidadeGeneroMusical) : Promise<EntidadeGeneroMusical>;
  existsByName(name: string): Promise<boolean>;
}