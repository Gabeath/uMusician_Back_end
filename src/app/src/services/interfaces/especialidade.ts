import EntidadeEspecialidade from '@core/entities/especialidade';

export interface IServiceEspecialidade {
  getAll(): Promise<EntidadeEspecialidade[]>;
  addEspecialidade(nome: string, popularidade: number, classificacao: number, idSolicitacao: string, filename: string) :
  Promise<EntidadeEspecialidade>;
}