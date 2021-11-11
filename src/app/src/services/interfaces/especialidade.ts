import { Pagination, SearchParameterBase } from '@core/models';
import EntidadeEspecialidade from '@core/entities/especialidade';

export interface IServiceEspecialidade {
  getSelectable(): Promise<EntidadeEspecialidade[]>;
  getAll(searchParameter: SearchParameterBase): Promise<Pagination<EntidadeEspecialidade>>
  addEspecialidade(nome: string, popularidade: number, classificacao: number, idSolicitacao: string, filename: string) :
  Promise<EntidadeEspecialidade>;
}