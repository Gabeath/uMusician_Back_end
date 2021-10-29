import { Pagination, SearchParameterBase } from '@core/models';
import EntidadeEspecialidade from '@core/entities/especialidade';

export interface IRepositoryEspecialidade {
  selectAll(): Promise<EntidadeEspecialidade[]>;
  selectAllWithPagination(searchParameter: SearchParameterBase): Promise<Pagination<EntidadeEspecialidade>>;
  selectById(id: string): Promise<EntidadeEspecialidade>;
  addEspecialidade(especialidade: EntidadeEspecialidade) : Promise<EntidadeEspecialidade>;
}