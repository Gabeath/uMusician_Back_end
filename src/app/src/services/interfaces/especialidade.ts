import EntidadeEspecialidade from '@core/entities/especialidade';

export interface IServiceEspecialidade {
  getAll(): Promise<EntidadeEspecialidade[]>;
}