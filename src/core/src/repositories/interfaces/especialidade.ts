import EntidadeEspecialidade from '@core/entities/especialidade';

export interface IRepositoryEspecialidade {
  selectAll(): Promise<EntidadeEspecialidade[]>;
  selectById(id: string): Promise<EntidadeEspecialidade>;
}